import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const clientDir = path.join(root, "apps/web/dist/client");

if (!fs.existsSync(clientDir)) {
  throw new Error("static accessibility: apps/web/dist/client is missing; run npm run build first");
}

function walkHtml(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtml(fullPath, files);
    } else if (entry.isFile() && fullPath.endsWith(".html")) {
      files.push(fullPath);
    }
  }
  return files;
}

function stripNonContent(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
}

function parseAttrs(tag) {
  const tagName = /^<\s*([^\s/>]+)/.exec(tag)?.[1]?.toLowerCase();
  const attrs = {};
  const attrPattern = /([^\s"'<>/=]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s"'>=]+))?/g;
  for (const match of tag.matchAll(attrPattern)) {
    const key = match[1].toLowerCase();
    if (key === tagName) continue;
    attrs[key] = (match[2] ?? "").replace(/^["']|["']$/g, "");
  }
  return attrs;
}

function plainText(html) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&[a-z0-9#]+;/gi, "x")
    .replace(/\s+/g, " ")
    .trim();
}

function labelRanges(html) {
  return [...html.matchAll(/<label\b[^>]*>[\s\S]*?<\/label>/gi)].map((match) => ({
    start: match.index ?? 0,
    end: (match.index ?? 0) + match[0].length
  }));
}

function isInsideRange(index, ranges) {
  return ranges.some((range) => index >= range.start && index <= range.end);
}

function locationFor(file, index) {
  const before = file.html.slice(0, index);
  return before.split("\n").length;
}

function assertPage(filePath) {
  const rawHtml = fs.readFileSync(filePath, "utf8");
  const html = stripNonContent(rawHtml);
  const relativePath = path.relative(clientDir, filePath);
  const issues = [];
  const file = { html };
  const add = (message, index = 0) => {
    issues.push(`${relativePath}:${locationFor(file, index)} ${message}`);
  };

  if (!/<html\b[^>]*\blang=("[^"]+"|'[^']+'|[^\s>]+)/i.test(html)) {
    add("html element must declare a non-empty lang attribute");
  }
  if (!/<title>\s*[^<]+\s*<\/title>/i.test(html)) {
    add("page must have a non-empty title");
  }
  if (!/<h1\b/i.test(html)) {
    add("page must expose an h1");
  }

  const mainCount = [...html.matchAll(/<main\b/gi)].length;
  if (mainCount !== 1) {
    add(`page must expose exactly one main landmark, found ${mainCount}`);
  }

  const ids = new Map();
  for (const match of html.matchAll(/\bid=("[^"]+"|'[^']+'|[^\s>]+)/gi)) {
    const id = match[1].replace(/^["']|["']$/g, "");
    if (ids.has(id)) {
      add(`duplicate id "${id}"`, match.index ?? 0);
    }
    ids.set(id, match.index ?? 0);
  }

  const labelsByFor = new Set(
    [...html.matchAll(/<label\b[^>]*\bfor=("[^"]+"|'[^']+'|[^\s>]+)/gi)].map((match) =>
      match[1].replace(/^["']|["']$/g, "")
    )
  );
  const wrappingLabels = labelRanges(html);

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const attrs = parseAttrs(match[0]);
    if (!("alt" in attrs)) {
      add(`image is missing alt text: ${match[0].slice(0, 120)}`, match.index ?? 0);
    }
  }

  for (const match of html.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/gi)) {
    const attrs = parseAttrs(match[0]);
    const hasName = attrs["aria-label"] || attrs["aria-labelledby"] || attrs.title || plainText(match[1]);
    if (!hasName) {
      add(`button is missing an accessible name: ${match[0].slice(0, 120)}`, match.index ?? 0);
    }
  }

  for (const match of html.matchAll(/<(input|select|textarea)\b[^>]*>/gi)) {
    const attrs = parseAttrs(match[0]);
    const type = (attrs.type ?? "").toLowerCase();
    if (type === "hidden") continue;
    const hasExplicitLabel = attrs.id && labelsByFor.has(attrs.id);
    const hasWrappingLabel = isInsideRange(match.index ?? 0, wrappingLabels);
    const hasAriaName = attrs["aria-label"] || attrs["aria-labelledby"];
    if (!hasExplicitLabel && !hasWrappingLabel && !hasAriaName) {
      add(`form control is missing a label: ${match[0].slice(0, 140)}`, match.index ?? 0);
    }
  }

  for (const match of html.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)) {
    const attrs = parseAttrs(match[0]);
    const hasName = attrs["aria-label"] || attrs["aria-labelledby"] || attrs.title || plainText(match[1]);
    if (!hasName) {
      add(`link is missing an accessible name: ${match[0].slice(0, 120)}`, match.index ?? 0);
    }
  }

  for (const match of html.matchAll(/<svg\b[^>]*\brole=["']?img["']?[^>]*>([\s\S]*?)<\/svg>/gi)) {
    const attrs = parseAttrs(match[0]);
    const hasName = attrs["aria-label"] || attrs["aria-labelledby"] || /<title>\s*[^<]+\s*<\/title>/i.test(match[1]);
    if (!hasName) {
      add(`svg with role="img" is missing an accessible name`, match.index ?? 0);
    }
  }

  for (const match of html.matchAll(/\baria-controls=("[^"]+"|'[^']+'|[^\s>]+)/gi)) {
    const id = match[1].replace(/^["']|["']$/g, "");
    if (!ids.has(id)) {
      add(`aria-controls references missing id "${id}"`, match.index ?? 0);
    }
  }

  return issues;
}

const htmlFiles = walkHtml(clientDir).sort();
const issues = htmlFiles.flatMap(assertPage);

if (issues.length > 0) {
  console.error(`static accessibility validation failed: ${issues.length} issue(s)`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log(`static accessibility validation passed: ${htmlFiles.length} HTML page(s) checked`);
