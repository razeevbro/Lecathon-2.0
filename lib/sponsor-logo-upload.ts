import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
]);

const EXT_BY_TYPE: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export function validateSponsorLogoFile(
  file: File
): { ok: true } | { ok: false; message: string } {
  if (!ALLOWED_TYPES.has(file.type)) {
    return {
      ok: false,
      message: "Logo must be PNG, JPG, WebP, or SVG.",
    };
  }
  if (file.size > MAX_BYTES) {
    return {
      ok: false,
      message: "Logo must be 2 MB or smaller.",
    };
  }
  return { ok: true };
}

function canUseVercelBlob(): boolean {
  return !!(
    process.env.BLOB_READ_WRITE_TOKEN ||
    process.env.BLOB_STORE_ID ||
    process.env.VERCEL
  );
}

export async function saveSponsorLogo(file: File): Promise<string> {
  const validation = validateSponsorLogoFile(file);
  if (!validation.ok) {
    throw new Error(validation.message);
  }

  const ext = EXT_BY_TYPE[file.type] ?? "png";
  const base = sanitizeFilename(file.name.replace(/\.[^.]+$/, "")) || "sponsor";
  const filename = `${Date.now()}-${base}.${ext}`;

  if (canUseVercelBlob()) {
    try {
      const blob = await put(`sponsors/${filename}`, file, {
        access: "public",
        addRandomSuffix: false,
      });
      return blob.url;
    } catch (error) {
      if (process.env.VERCEL) {
        throw new Error(
          "Logo upload failed. In Vercel: Storage → your Blob store → Projects → ensure this app is connected, then redeploy."
        );
      }
      throw error instanceof Error ? error : new Error("Blob upload failed.");
    }
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads", "sponsors");
  await mkdir(uploadsDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), buffer);
  return `/uploads/sponsors/${filename}`;
}
