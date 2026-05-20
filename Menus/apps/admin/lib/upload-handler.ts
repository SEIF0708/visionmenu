import { createClient } from "@/lib/supabase/server";
import { getOrganizationContext } from "@/lib/auth";
import {
  buildStoragePath,
  extensionFromImageMime,
  getPublicStorageUrl,
  type UploadBucket,
  validateImageFile,
  validateModelFile,
} from "@/lib/uploads";

export async function requireUploadContext() {
  const ctx = await getOrganizationContext();
  if (!ctx) {
    throw new Error("NO_ORG");
  }
  return ctx;
}

export async function uploadImageFile(file: File) {
  const error = validateImageFile(file);
  if (error) throw new Error(error);

  const ctx = await requireUploadContext();
  const ext = extensionFromImageMime(file.type);
  const path = buildStoragePath(ctx.organizationId, ext);
  const buffer = Buffer.from(await file.arrayBuffer());

  const supabase = await createClient();
  const { error: uploadError } = await supabase.storage
    .from("images")
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) throw new Error(uploadError.message);

  return {
    url: getPublicStorageUrl("images", path),
    path,
  };
}

export async function uploadModelFile(file: File) {
  const error = validateModelFile(file);
  if (error) throw new Error(error);

  const ctx = await requireUploadContext();
  const path = buildStoragePath(ctx.organizationId, "glb");
  const buffer = Buffer.from(await file.arrayBuffer());

  const supabase = await createClient();
  const { error: uploadError } = await supabase.storage
    .from("models")
    .upload(path, buffer, {
      contentType: "model/gltf-binary",
      upsert: false,
    });

  if (uploadError) throw new Error(uploadError.message);

  const sizeMb = Math.round((file.size / (1024 * 1024)) * 100) / 100;

  return {
    url: getPublicStorageUrl("models", path),
    path,
    sizeMb,
  };
}

export function uploadErrorResponse(err: unknown) {
  const message = err instanceof Error ? err.message : "Upload failed";
  const status = message === "NO_ORG" ? 403 : 400;
  return { message, status };
}
