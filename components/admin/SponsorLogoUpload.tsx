"use client";

import { useRef, useState } from "react";
import { AdminButton } from "@/components/admin/admin-ui";

export function SponsorLogoUpload({
  label,
  currentUrl,
  onChange,
}: {
  label: string;
  currentUrl?: string;
  onChange: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");

  const handleFile = (file: File | null) => {
    onChange(file);
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    if (file) {
      setPreview(URL.createObjectURL(file));
      setFileName(file.name);
    } else {
      setPreview(currentUrl || null);
      setFileName("");
    }
  };

  const displayUrl = preview ?? currentUrl ?? null;

  return (
    <div>
      <span className="text-xs text-[#888] mb-1 block">{label}</span>
      <div className="flex flex-col sm:flex-row gap-3 items-start">
        {displayUrl ? (
          <div className="w-24 h-24 rounded-lg border border-white/10 bg-[#111] flex items-center justify-center overflow-hidden shrink-0">
            <img
              src={displayUrl}
              alt="Sponsor logo preview"
              className="max-w-full max-h-full object-contain p-2"
            />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-lg border border-dashed border-white/15 bg-[#111] flex items-center justify-center text-[10px] text-[#666] text-center px-2 shrink-0">
            No logo
          </div>
        )}
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
          <AdminButton
            type="button"
            variant="ghost"
            className="w-full sm:w-auto"
            onClick={() => inputRef.current?.click()}
          >
            Choose image
          </AdminButton>
          {fileName ? (
            <p className="text-[10px] text-[#888] truncate">{fileName}</p>
          ) : currentUrl ? (
            <p className="text-[10px] text-[#888] truncate">Current logo saved</p>
          ) : (
            <p className="text-[10px] text-[#666]">PNG, JPG, WebP, or SVG · max 2 MB</p>
          )}
          {(fileName || preview?.startsWith("blob:")) && (
            <button
              type="button"
              onClick={() => {
                if (inputRef.current) {
                  inputRef.current.value = "";
                }
                handleFile(null);
              }}
              className="text-[10px] text-red-400 hover:text-red-300 w-fit"
            >
              Remove selected file
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

async function uploadSponsorLogo(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/admin/sponsors/upload", {
    method: "POST",
    body: formData,
    credentials: "same-origin",
  });
  const data = await res.json();
  if (!data.success || !data.url) {
    throw new Error(data.message || "Logo upload failed.");
  }
  return data.url as string;
}

export async function resolveSponsorLogoUrl(options: {
  existingUrl?: string;
  newFile: File | null;
  requireLogo?: boolean;
}): Promise<string | null> {
  if (options.newFile) {
    return uploadSponsorLogo(options.newFile);
  }
  if (options.existingUrl?.trim()) {
    return options.existingUrl.trim();
  }
  if (options.requireLogo) {
    throw new Error("Please upload a sponsor logo image.");
  }
  return null;
}
