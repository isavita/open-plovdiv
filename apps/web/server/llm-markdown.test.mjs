import http from "node:http";
import { mkdtemp, mkdir, rm, symlink, writeFile } from "node:fs/promises";
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

  it("rejects traversal and encoded path separators", () => {
    expect(markdownPagePath("/en/history/index.md?q=1")).toBe("/en/history/index.html");
    expect(markdownPagePath("/index.md")).toBe("/index.html");
    for (const path of ["/../index.md", "/%2e%2e/index.md", "/a%2fb/index.md", "/a%5cb/index.md", "//evil/index.md", "/a%00/index.md"]) {
      expect(markdownPagePath(path)).toBeNull();
    }
    expect(isMarkdownRequest("/en/history/index.md?x=1")).toBe(true);
    expect(isMarkdownRequest("/en/history")).toBe(false);
  });
});

describe("LLM Markdown HTTP responses", () => {
  let root, outsideRoot, server, origin;
  beforeAll(async () => {
    root = await mkdtemp(join(tmpdir(), "open-plovdiv-markdown-"));
    outsideRoot = await mkdtemp(join(tmpdir(), "open-plovdiv-markdown-outside-"));
    await mkdir(join(root, "en/history"), { recursive: true });
    await writeFile(join(root, "en/history/index.html"), html);
    await writeFile(join(root, "index.html"), html.replace('lang="en"', 'lang="bg"').replace("History</h1>", "История</h1>"));
    await writeFile(join(outsideRoot, "index.html"), html);
    await symlink(outsideRoot, join(root, "outside"));
    server = http.createServer((request, response) => {
      serveMarkdownPage(request, response, { root }).catch(() => { response.statusCode = 500; response.end(); });
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
    expect(await response.text()).toContain("# History");
    const head = await fetch(`${origin}/en/history/index.md`, { method: "HEAD" });
    expect(head.status).toBe(200);
    expect(await head.text()).toBe("");
    const home = await fetch(`${origin}/index.md`);
    const homeText = await home.text();
    expect(homeText).toContain("Language: bg");
    expect(homeText).toContain("# История");
  });

  it("returns 404 for missing pages and symlinks, and 405 for writes", async () => {
    expect((await fetch(`${origin}/missing/index.md`)).status).toBe(404);
    expect((await fetch(`${origin}/outside/index.md`)).status).toBe(404);
    const response = await fetch(`${origin}/en/history/index.md`, { method: "POST" });
    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("GET, HEAD");
  });
});
