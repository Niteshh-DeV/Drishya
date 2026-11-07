/**
 * Signed parameters for uploading a photo straight from the browser to
 * Cloudinary. Server-only: it reads the API secret. Each feature signs for
 * its own folder (`drishya/blog/<userId>`, `drishya/guides/<userId>`), and
 * saves reject photos from anywhere else.
 */
import cloudinary from "@/lib/cloudinary";
import type { BlogImage } from "@/lib/types";

/** Upload parameters the browser sends to Cloudinary unchanged; all of them are signed. */
export interface UploadSignature {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  allowedFormats: string;
  /** Resizes the stored original so phone photos don't eat the free-tier storage. */
  transformation: string;
}

export function signUpload(folder: string): UploadSignature {
  const params = {
    timestamp: Math.round(Date.now() / 1000),
    folder,
    allowed_formats: "jpg,jpeg,png,webp,heic",
    transformation: "c_limit,w_2400,h_2400",
  };
  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET!,
  );
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    timestamp: params.timestamp,
    signature,
    folder: params.folder,
    allowedFormats: params.allowed_formats,
    transformation: params.transformation,
  };
}

/** Whether every photo is a Cloudinary upload from `folder`. */
export function inFolder(images: (BlogImage | undefined)[], folder: string): boolean {
  const base = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/`;
  return images
    .filter((img): img is BlogImage => Boolean(img))
    .every(
      (img) =>
        img.publicId.startsWith(`${folder}/`) &&
        img.url.startsWith(base) &&
        img.url.includes(img.publicId),
    );
}
