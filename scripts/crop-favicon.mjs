import sharp from "sharp";
import { unlink, writeFile } from "fs/promises";
import path from "path";

const source = path.join(
  process.cwd(),
  "app",
  "icon.png"
);
const meta = await sharp(source).metadata();
const width = meta.width ?? 1024;
const height = meta.height ?? 1024;

// The <L> mark sits in the upper-center of the full logo.
const cropSize = Math.round(Math.min(width, height) * 0.52);
const left = Math.round((width - cropSize) / 2);
const top = Math.round(height * 0.06);

const cropped = await sharp(source)
  .extract({
    left: Math.max(0, left),
    top: Math.max(0, top),
    width: Math.min(cropSize, width - left),
    height: Math.min(cropSize, height - top),
  })
  .resize(512, 512, {
    fit: "contain",
    background: { r: 10, g: 10, b: 10, alpha: 1 },
  })
  .png()
  .toBuffer();

const iconPath = path.join(process.cwd(), "app", "icon.png");
const applePath = path.join(process.cwd(), "app", "apple-icon.png");
const iconBuffer = await sharp(cropped).png().toBuffer();
const appleBuffer = await sharp(cropped).resize(180, 180).png().toBuffer();

for (const file of [iconPath, applePath]) {
  try {
    await unlink(file);
  } catch {
    // file may not exist yet
  }
}

await writeFile(iconPath, iconBuffer);
await writeFile(applePath, appleBuffer);

console.log(`Cropped favicon from ${width}x${height} → icon + apple-icon`);
