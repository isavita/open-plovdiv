import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const publicDir = path.join(root, "apps/web/public");
const markSvg = await readFile(path.join(publicDir, "brand/open-plovdiv-mark.svg"));
const maskableSvg = await readFile(path.join(publicDir, "brand/open-plovdiv-maskable.svg"));

await mkdir(publicDir, { recursive: true });

async function renderPng(source, size, filename) {
  const output = await sharp(source, { density: 1024 })
    .resize(size, size, { fit: "fill" })
    .png({ compressionLevel: 9, palette: false })
    .toBuffer();
  await writeFile(path.join(publicDir, filename), output);
  return output;
}

const faviconSizes = [16, 32, 48];
const faviconPngs = [];
for (const size of faviconSizes) {
  faviconPngs.push(await renderPng(markSvg, size, `favicon-${size}x${size}.png`));
}

await renderPng(maskableSvg, 180, "apple-touch-icon.png");
await renderPng(markSvg, 192, "android-chrome-192x192.png");
await renderPng(markSvg, 512, "android-chrome-512x512.png");
await renderPng(maskableSvg, 192, "android-chrome-maskable-192x192.png");
await renderPng(maskableSvg, 512, "android-chrome-maskable-512x512.png");
await renderPng(maskableSvg, 150, "mstile-150x150.png");

function createIco(images, sizes) {
  const headerSize = 6;
  const directorySize = images.length * 16;
  const header = Buffer.alloc(headerSize + directorySize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let offset = header.length;
  images.forEach((image, index) => {
    const entry = headerSize + index * 16;
    const size = sizes[index];
    header.writeUInt8(size === 256 ? 0 : size, entry);
    header.writeUInt8(size === 256 ? 0 : size, entry + 1);
    header.writeUInt8(0, entry + 2);
    header.writeUInt8(0, entry + 3);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(image.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += image.length;
  });

  return Buffer.concat([header, ...images]);
}

await writeFile(path.join(publicDir, "favicon.ico"), createIco(faviconPngs, faviconSizes));

console.log(`Generated Open Plovdiv icons at ${faviconSizes.join(", ")}, 150, 180, 192, and 512 px.`);
