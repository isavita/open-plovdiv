import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import sharp from "sharp";

const publicUrl = new URL("../../public/", import.meta.url);

const expectedPngs = new Map([
  ["favicon-16x16.png", 16],
  ["favicon-32x32.png", 32],
  ["favicon-48x48.png", 48],
  ["mstile-150x150.png", 150],
  ["apple-touch-icon.png", 180],
  ["android-chrome-192x192.png", 192],
  ["android-chrome-maskable-192x192.png", 192],
  ["android-chrome-512x512.png", 512],
  ["android-chrome-maskable-512x512.png", 512],
]);

describe("Open Plovdiv icon family", () => {
  it.each([...expectedPngs])("ships %s at %i px", async (filename, size) => {
    const metadata = await sharp(fileURLToPath(new URL(filename, publicUrl))).metadata();
    expect(metadata.format).toBe("png");
    expect(metadata.width).toBe(size);
    expect(metadata.height).toBe(size);
  });

  it("ships a multi-resolution Windows favicon", async () => {
    const ico = await readFile(new URL("favicon.ico", publicUrl));
    expect(ico.readUInt16LE(0)).toBe(0);
    expect(ico.readUInt16LE(2)).toBe(1);
    expect(ico.readUInt16LE(4)).toBe(3);
  });

  it("declares regular and maskable PWA icons", async () => {
    const manifest = JSON.parse(await readFile(new URL("site.webmanifest", publicUrl), "utf8"));
    expect(manifest.theme_color).toBe("#173f62");
    expect(manifest.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ sizes: "192x192", purpose: "any" }),
        expect.objectContaining({ sizes: "512x512", purpose: "any" }),
        expect.objectContaining({ sizes: "192x192", purpose: "maskable" }),
        expect.objectContaining({ sizes: "512x512", purpose: "maskable" }),
      ]),
    );
  });

  it("wires browser, Apple, PWA, Safari, and Windows metadata", async () => {
    const layout = await readFile(new URL("../layouts/Layout.astro", import.meta.url), "utf8");
    for (const asset of [
      "/favicon.ico",
      "/favicon.svg",
      "/favicon-32x32.png",
      "/apple-touch-icon.png",
      "/safari-pinned-tab.svg",
      "/site.webmanifest",
      "/browserconfig.xml",
    ]) {
      expect(layout).toContain(asset);
    }
  });
});
