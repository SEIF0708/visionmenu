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

import { optimizeGlb } from "@/lib/glb-optimizer";

export async function uploadModelFile(file: File) {
  const error = validateModelFile(file);
  if (error) throw new Error(error);

  const ctx = await requireUploadContext();
  const originalPath = buildStoragePath(ctx.organizationId, "glb");
  const originalBuffer = Buffer.from(await file.arrayBuffer());

  const supabase = await createClient();
  // Upload original file
  const { error: uploadErrorOriginal } = await supabase.storage
    .from("models")
    .upload(originalPath, originalBuffer, {
      contentType: "model/gltf-binary",
      upsert: false,
    });
  if (uploadErrorOriginal) throw new Error(uploadErrorOriginal.message);

  // Optimize GLB
  let optimizedBuffer: Buffer;
  try {
    optimizedBuffer = await optimizeGlb(originalBuffer);
  } catch (optErr) {
    console.error("GLB optimization failed", optErr);
    // Fallback: no optimized version
    optimizedBuffer = originalBuffer;
  }

  const optimizedPath = buildStoragePath(ctx.organizationId, "opt.glb");
  const { error: uploadErrorOptimized } = await supabase.storage
    .from("models")
    .upload(optimizedPath, optimizedBuffer, {
      contentType: "model/gltf-binary",
      upsert: false,
    });
  if (uploadErrorOptimized) throw new Error(uploadErrorOptimized.message);

  const originalSizeMb = Math.round((originalBuffer.length / (1024 * 1024)) * 100) / 100;
  const optimizedSizeMb = Math.round((optimizedBuffer.length / (1024 * 1024)) * 100) / 100;

  return {
    originalUrl: getPublicStorageUrl("models", originalPath),
    optimizedUrl: getPublicStorageUrl("models", optimizedPath),
    originalSizeMb,
    optimizedSizeMb,
    originalPath,
    optimizedPath,
  };
}

export function uploadErrorResponse(err: unknown) {
  const message = err instanceof Error ? err.message : "Upload failed";
  const status = message === "NO_ORG" ? 403 : 400;
  return { message, status };
}
