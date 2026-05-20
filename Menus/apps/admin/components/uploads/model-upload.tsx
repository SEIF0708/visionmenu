"use client";

import { useState } from "react";
import { FileUpload } from "./file-upload";
import { MODEL_MAX_BYTES } from "@/lib/uploads";

interface ModelUploadProps {
  value: string;
  onChange: (url: string, sizeMb?: number) => void;
  required?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
}

export function ModelUpload({
  value,
  onChange,
  required,
  onUploadingChange,
}: ModelUploadProps) {
  const [fileLabel, setFileLabel] = useState<string | null>(
    value ? "model.glb" : null
  );

  return (
    <FileUpload
      label="3D model (GLB)"
      hint="GLB file for AR on the customer's table. Required for View in AR."
      accept={{
        "model/gltf-binary": [".glb"],
        "application/octet-stream": [".glb"],
      }}
      maxSize={MODEL_MAX_BYTES}
      uploadEndpoint="/api/uploads/model"
      previewUrl={value || null}
      previewType="file"
      fileName={fileLabel}
      required={required}
      onUploadingChange={onUploadingChange}
      onUploadComplete={(data) => {
        if (typeof data.url === "string") {
          const sizeMb =
            typeof data.sizeMb === "number" ? data.sizeMb : undefined;
          onChange(data.url, sizeMb);
          setFileLabel("model.glb");
        }
      }}
    />
  );
}
