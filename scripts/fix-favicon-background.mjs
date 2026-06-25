import sharp from "sharp";
import { unlink, writeFile } from "fs/promises";
import path from "path";

const iconPath = path.join(process.cwd(), "app", "icon.png");
const applePath = path.join(process.cwd(), "app", "apple-icon.png");
const dark = { r: 10, g: 10, b: 10, alpha: 1 };

const iconBuffer = await sharp(iconPath)
  .trim({ threshold: 12 })
  .resize(480, 480, {
    fit: "contain",
    background: dark,
  })
  .extend({
    top: 16,
    bottom: 16,
    left: 16,
    right: 16,
    background: dark,
  })
  .png()
  .toBuffer();

const appleBuffer = await sharp(iconBuffer).resize(180, 180).png().toBuffer();

for (const file of [iconPath, applePath]) {
  try {
    await unlink(file);
  } catch {
    // ignore
  }
}

await writeFile(iconPath, iconBuffer);
await writeFile(applePath, appleBuffer);

console.log("Updated favicon with dark background");
