"use client";

import { FileUpload } from "./file-upload";
import { IMAGE_MAX_BYTES } from "@/lib/uploads";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
}

export function ImageUpload({
  value,
  onChange,
  required,
  onUploadingChange,
}: ImageUploadProps) {
  return (
    <FileUpload
      label="Food photo"
      hint="JPEG, PNG, or WebP. Used on the customer menu page."
      accept={{
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "image/webp": [".webp"],
      }}
      maxSize={IMAGE_MAX_BYTES}
      uploadEndpoint="/api/uploads/image"
      previewUrl={value || null}
      previewType="image"
      required={required}
      onUploadingChange={onUploadingChange}
      onUploadComplete={(data) => {
        if (typeof data.url === "string") onChange(data.url);
      }}
    />
  );
}
