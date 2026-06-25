import sharp from "sharp";
import { unlink, writeFile } from "fs/promises";
import path from "path";

const source =
  process.argv[2] ||
  path.join(process.cwd(), "assets", "brand", "favicon-source.png");

const meta = await sharp(source).metadata();
const width = meta.width ?? 64;
const height = meta.height ?? 64;

const iconBuffer = await sharp(source)
  .resize(512, 512, {
    fit: "contain",
    background: { r: 255, g: 255, b: 255, alpha: 1 },
    kernel: sharp.kernel.lanczos3,
  })
  .png()
  .toBuffer();

const appleBuffer = await sharp(iconBuffer).resize(180, 180).png().toBuffer();

const iconPath = path.join(process.cwd(), "app", "icon.png");
const applePath = path.join(process.cwd(), "app", "apple-icon.png");

for (const file of [iconPath, applePath]) {
  try {
    await unlink(file);
  } catch {
    // ignore
  }
}

await writeFile(iconPath, iconBuffer);
await writeFile(applePath, appleBuffer);

console.log(`Generated favicon from ${width}x${height} source → icon + apple-icon`);
