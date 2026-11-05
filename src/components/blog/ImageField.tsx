"use client";

import { useId, useState } from "react";
import { signBlogUpload } from "@/app/blog/write/actions";
import { LIMITS } from "@/lib/blog-input";
import { cloudinaryUrl } from "@/lib/images";
import type { BlogImage } from "@/lib/types";

/**
 * Photo picker that uploads straight from the browser to Cloudinary with a
 * signature from our server, so large phone photos never pass through a
 * Vercel function (which caps request bodies at 4.5 MB).
 */
export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: BlogImage;
  onChange: (image: BlogImage | undefined) => void;
}) {
  const inputId = useId();
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>();

  async function upload(file: File) {
    setError(undefined);
    if (!file.type.startsWith("image/")) {
      setError("Please choose a photo.");
      return;
    }
    if (file.size > LIMITS.imageBytes) {
      setError(`That photo is over ${LIMITS.imageBytes / 1024 / 1024} MB. Please pick a smaller one.`);
      return;
    }

    setBusy(true);
    setProgress(0);
    try {
      const signed = await signBlogUpload();
      if (!signed.ok) throw new Error(signed.error);
      const { upload: u } = signed;

      const body = new FormData();
      body.append("file", file);
      body.append("api_key", u.apiKey);
      body.append("timestamp", String(u.timestamp));
      body.append("signature", u.signature);
      body.append("folder", u.folder);
      body.append("allowed_formats", u.allowedFormats);
      body.append("transformation", u.transformation);

      // XHR rather than fetch: only XHR reports upload progress.
      const json = await new Promise<{ public_id: string; secure_url: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${u.cloudName}/image/upload`);
        xhr.responseType = "json";
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) setProgress(Math.round((event.loaded / event.total) * 100));
        };
        xhr.onload = () =>
          xhr.status >= 200 && xhr.status < 300
            ? resolve(xhr.response)
            : reject(new Error(xhr.response?.error?.message ?? "Upload failed."));
        xhr.onerror = () => reject(new Error("Upload failed. Check your connection and try again."));
        xhr.send(body);
      });
      onChange({ publicId: json.public_id, url: json.secure_url });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {value ? (
        <div className="relative overflow-hidden rounded-2xl border border-line">
          <img
            src={cloudinaryUrl(value.url, 1200)}
            alt=""
            className="max-h-80 w-full object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="glass-strong absolute right-3 top-3 rounded-full px-3 py-1.5 text-xs font-medium text-ink hover:text-accent-ink"
          >
            Remove photo
          </button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-line px-4 py-8 text-center text-sm text-muted transition-colors hover:border-accent-ink hover:text-accent-ink ${busy ? "pointer-events-none" : ""}`}
        >
          <span className="font-medium text-ink">{busy ? `Uploading… ${progress}%` : label}</span>
          {busy ? (
            <span
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              className="mt-2 h-1 w-48 overflow-hidden rounded-full bg-line"
            >
              <span
                className="block h-full bg-brass transition-[width] duration-200"
                style={{ width: `${progress}%` }}
              />
            </span>
          ) : (
            <span className="text-xs">JPG, PNG, WebP or HEIC, up to {LIMITS.imageBytes / 1024 / 1024} MB</span>
          )}
          <input
            id={inputId}
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={busy}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) void upload(file);
            }}
          />
        </label>
      )}
      {error && (
        <p role="alert" className="mt-2 text-sm text-accent-ink">
          {error}
        </p>
      )}
    </div>
  );
}
