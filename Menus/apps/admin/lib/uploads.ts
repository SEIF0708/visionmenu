import { randomUUID } from "crypto";

export const IMAGE_MAX_BYTES = 5 * 1024 * 1024; // 5MB
export const MODEL_MAX_BYTES = 20 * 1024 * 1024; // 20MB

export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MODEL_MIME_TYPES = [
  "model/gltf-binary",
  "application/octet-stream",
] as const;

export type UploadBucket = "images" | "models";

export function buildStoragePath(
  organizationId: string,
  extension: string
): string {
  return `${organizationId}/${randomUUID()}.${extension}`;
}

export function getPublicStorageUrl(bucket: UploadBucket, path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}

export function validateImageFile(file: File): string | null {
  if (!IMAGE_MIME_TYPES.includes(file.type as (typeof IMAGE_MIME_TYPES)[number])) {
    return "Use JPEG, PNG, or WebP.";
  }
  if (file.size > IMAGE_MAX_BYTES) {
    return "Image must be 5MB or smaller.";
  }
  return null;
}

export function validateModelFile(file: File): string | null {
  const name = file.name.toLowerCase();
  if (!name.endsWith(".glb")) {
    return "Only .glb files are supported.";
  }
  if (
    file.type &&
    !MODEL_MIME_TYPES.includes(file.type as (typeof MODEL_MIME_TYPES)[number])
  ) {
    return "Invalid model file type.";
  }
  if (file.size > MODEL_MAX_BYTES) {
    return "Model must be 20MB or smaller.";
  }
  return null;
}

export function extensionFromImageMime(mime: string): string {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}
