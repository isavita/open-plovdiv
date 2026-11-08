import http from "node:http";
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { htmlToMarkdown, isMarkdownRequest, markdownPagePath, serveMarkdownPage } from "./llm-markdown.mjs";

const html = `<!doctype html><html lang="en"><head><title>History · Open Plovdiv</title>
<link rel="canonical" href="https://example.org/en/history"></head><body><header>Site header</header>
<main><nav>Page navigation</nav><h1>History</h1><p>Ancient <strong>Plovdiv</strong> matters.</p>
<p><a href="../places">Places</a> <a href="#era">Era</a> <a href="//source.example/a">Source</a></p>
<figure><img src="/images/picture.jpg" alt="A historic site"><figcaption>Photographer · CC BY</figcaption></figure>
<details><summary><span>Chapter 1</span><span>Early history</span></summary><p>A hidden chapter</p></details>
<button type="button">Person in the atlas</button>
<table><thead><tr><th>Year</th><th>Event</th></tr></thead><tbody><tr><td>1878</td><td>Liberation</td></tr></tbody></table>
<script>secret script</script><svg><text>ornament</text></svg><div hidden>hidden content</div></main><footer>Site footer</footer></body></html>`;

describe("LLM Markdown page conversion", () => {
  it("keeps article content, attribution, collapsed details, table and absolute links", () => {
    const { canonical, markdown } = htmlToMarkdown(html);
    expect(canonical).toBe("https://example.org/en/history");
    expect(markdown).toContain("# History");
    expect(markdown).toContain("Language: en");
    expect(markdown).toContain("[LLM site index](https://example.org/llms.txt)");
    expect(markdown).not.toContain("[Simplified Chinese (简体中文)]");
    expect(markdown).toContain("Interactive or dynamically loaded content may be omitted");
    expect(markdown).toContain("[Places](https://example.org/places)");
    expect(markdown).toContain("[Era](https://example.org/en/history#era)");
    expect(markdown).toContain("[Source](https://source.example/a)");
    expect(markdown).toContain("https://example.org/images/picture.jpg");
    expect(markdown).toContain("Photographer · CC BY");
    expect(markdown).toContain("Chapter 1 Early history");
    expect(markdown).toContain("A hidden chapter");
    expect(markdown).toContain("Person in the atlas");
    expect(markdown).toContain("| Year | Event |");
    expect(markdown).not.toMatch(/Site header|Site footer|Page navigation|secret script|ornament|hidden content/);
  });

  it("links to a same-origin Chinese alternate as Markdown", () => {
    const source = html.replace("</head>", '<link rel="alternate" hreflang="zh" href="https://example.org/zh/history/"></head>');
    expect(htmlToMarkdown(source).markdown).toContain("[Simplified Chinese (简体中文)](https://example.org/zh/history/index.md)");
    const relative = html.replace("</head>", '<link rel="alternate" hreflang="zh" href="/zh/history"></head>');
    expect(htmlToMarkdown(relative).markdown).toContain("[Simplified Chinese (简体中文)](https://example.org/zh/history/index.md)");
    const root = html.replace("</head>", '<link rel="alternate" hreflang="zh" href="/zh"></head>');
    expect(htmlToMarkdown(root).markdown).toContain("[Simplified Chinese (简体中文)](https://example.org/zh/index.md)");
    const detail = html.replace("</head>", '<link rel="alternate" hreflang="zh" href="/zh/places/example"></head>');
    expect(htmlToMarkdown(detail).markdown).toContain("[Simplified Chinese (简体中文)](https://example.org/zh/places/example/index.md)");
  });

  it("does not invent a Chinese alternate or accept external or malformed URLs", () => {
    for (const href of ["", "https://elsewhere.example/zh/history", "https://[broken", "/zh/%2fsecret", "/zh/%zz", "/zh/history?preview=1", "/zh/history#section"]) {
      const source = html.replace("</head>", `<link rel="alternate" hreflang="zh" href="${href}"></head>`);
      expect(htmlToMarkdown(source).markdown, href).not.toContain("[Simplified Chinese (简体中文)]");
    }
  });

  it("rejects traversal and encoded path separators", () => {
    expect(markdownPagePath("/en/history/index.md?q=1")).toBe("/en/history/index.html");
    expect(markdownPagePath("/index.md")).toBe("/index.html");
    expect(markdownPagePath("/en.md")).toBe("/en/index.html");
    expect(markdownPagePath("/en/history.md?x=1")).toBe("/en/history/index.html");
    expect(markdownPagePath("/ja/places/item.md")).toBe("/ja/places/item/index.html");
    for (const path of ["/../index.md", "/%2e%2e/index.md", "/a%2fb/index.md", "/a%5cb/index.md", "//evil/index.md", "/a%00/index.md", "/en/%2e%2e/history.md", "/en%2fhistory.md", "/.md", "/en/.md"]) {
      expect(markdownPagePath(path)).toBeNull();
    }
    expect(isMarkdownRequest("/en/history/index.md?x=1")).toBe(true);
    expect(isMarkdownRequest("/en/history.md?x=1")).toBe(true);
    expect(isMarkdownRequest("/en/history")).toBe(false);
  });
});

describe("LLM Markdown HTTP responses", () => {
  let root, outsideRoot, server, origin;
  beforeAll(async () => {
    root = await mkdtemp(join(tmpdir(), "open-plovdiv-markdown-"));
    outsideRoot = await mkdtemp(join(tmpdir(), "open-plovdiv-markdown-outside-"));
    await mkdir(join(root, "en/history"), { recursive: true });
    await mkdir(join(root, "en/places/item"), { recursive: true });
    await mkdir(join(root, "en/cache"), { recursive: true });
    await mkdir(join(root, "fonts"), { recursive: true });
    await writeFile(join(root, "en/history/index.html"), html);
    await writeFile(join(root, "en/index.html"), html);
    await writeFile(join(root, "en/places/item/index.html"), html);
    await writeFile(join(root, "en/cache/index.html"), html);
    await writeFile(join(root, "fonts/README.md"), "Static font documentation");
    await writeFile(join(root, "index.html"), html.replace('lang="en"', 'lang="bg"').replace("History</h1>", "История</h1>"));
    await writeFile(join(outsideRoot, "index.html"), html);
    await symlink(outsideRoot, join(root, "outside"));
    server = http.createServer((request, response) => {
      serveMarkdownPage(request, response, { root }).then(async (handled) => {
        if (!handled) response.end(await readFile(join(root, "fonts/README.md")));
      }).catch(() => { response.statusCode = 500; response.end(); });
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    origin = `http://127.0.0.1:${server.address().port}`;
  });
  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
    await rm(root, { recursive: true, force: true });
    await rm(outsideRoot, { recursive: true, force: true });
  });

  it("serves Markdown with canonical, discovery and noindex headers", async () => {
    const response = await fetch(`${origin}/en/history/index.md`);
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
    expect(response.headers.get("x-robots-tag")).toBe("noindex");
    expect(response.headers.get("link")).toBe('<https://example.org/en/history>; rel="canonical", </llms.txt>; rel="describedby"');
    const originalText = await response.text();
    expect(originalText).toContain("# History");
    const alias = await fetch(`${origin}/en/history.md?source=test`);
    expect(alias.status).toBe(200);
    expect(alias.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
    expect(alias.headers.get("link")).toBe(response.headers.get("link"));
    expect(alias.headers.get("x-robots-tag")).toBe("noindex");
    expect(await alias.text()).toBe(originalText);
    expect((await fetch(`${origin}/en.md`)).status).toBe(200);
    expect((await fetch(`${origin}/en/places/item.md`)).status).toBe(200);
    const head = await fetch(`${origin}/en/history/index.md`, { method: "HEAD" });
    expect(head.status).toBe(200);
    expect(await head.text()).toBe("");
    const aliasHead = await fetch(`${origin}/en/history.md`, { method: "HEAD" });
    expect(aliasHead.status).toBe(200);
    expect(await aliasHead.text()).toBe("");
    const home = await fetch(`${origin}/index.md`);
    const homeText = await home.text();
    expect(homeText).toContain("Language: bg");
    expect(homeText).toContain("# История");
  });

  it("returns 404 for missing pages and symlinks, and 405 for writes", async () => {
    expect((await fetch(`${origin}/missing/index.md`)).status).toBe(404);
    expect((await fetch(`${origin}/missing.md`)).status).toBe(404);
    expect((await fetch(`${origin}/outside/index.md`)).status).toBe(404);
    expect((await fetch(`${origin}/outside.md`)).status).toBe(404);
    const response = await fetch(`${origin}/en/history/index.md`, { method: "POST" });
    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("GET, HEAD");
    const aliasPost = await fetch(`${origin}/en/history.md`, { method: "POST" });
    expect(aliasPost.status).toBe(405);
    expect(aliasPost.headers.get("allow")).toBe("GET, HEAD");
  });

  it("revalidates cached Markdown and changes its validator when content changes", async () => {
    const first = await fetch(`${origin}/en/cache.md`);
    const etag = first.headers.get("etag");
    expect(first.headers.get("cache-control")).toBe("public, max-age=600");
    expect(first.headers.get("vary")).toContain("Accept-Encoding");
    expect(etag).toMatch(/^W\/"[A-Za-z0-9_-]+"$/);
    await first.text();
    for (const candidate of [etag, etag.slice(2), `"another-tag", ${etag}`, "*"]) {
      const response = await fetch(`${origin}/en/cache.md`, { headers: { "If-None-Match": candidate } });
      expect(response.status, candidate).toBe(304);
      expect(response.headers.get("etag")).toBe(etag);
      expect(response.headers.get("vary")).toContain("Accept-Encoding");
      expect(await response.text()).toBe("");
    }
    const head = await fetch(`${origin}/en/cache.md`, { method: "HEAD", headers: { "If-None-Match": etag } });
    expect(head.status).toBe(304);
    expect(head.headers.get("cache-control")).toBe("public, max-age=600");
    const mismatch = await fetch(`${origin}/en/cache.md`, { headers: { "If-None-Match": '"different"' } });
    expect(mismatch.status).toBe(200);
    await mismatch.text();
    await writeFile(join(root, "en/cache/index.html"), html.replace("Ancient", "Updated ancient"));
    const updated = await fetch(`${origin}/en/cache.md`, { headers: { "If-None-Match": etag } });
    expect(updated.status).toBe(200);
    expect(updated.headers.get("etag")).not.toBe(etag);
    expect(await updated.text()).toContain("Updated ancient");
  });

  it("passes existing Markdown assets to the static handler", async () => {
    const response = await fetch(`${origin}/fonts/README.md`);
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("Static font documentation");
    expect(response.headers.get("x-robots-tag")).toBeNull();
  });
});
