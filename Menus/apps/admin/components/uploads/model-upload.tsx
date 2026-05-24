"use client";

import { useState } from "react";
import { FileUpload } from "./file-upload";
import { MODEL_MAX_BYTES, AR_RECOMMENDED_MAX_BYTES } from "@/lib/uploads";
import { AlertTriangle } from "lucide-react";

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
  const [fileSize, setFileSize] = useState<number | null>(null);

  return (
    <div className="space-y-3">
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
            setFileSize(sizeMb ?? null);
            setFileLabel("model.glb");
          }
        }}
        onFileSelect={(file: File) => setFileSize(file.size / (1024 * 1024))}
      />

      {fileSize !== null && fileSize > AR_RECOMMENDED_MAX_BYTES / (1024 * 1024) && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-400">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <div>
            <strong>Large file ({fileSize.toFixed(1)}MB)</strong>
            <p className="mt-0.5 text-amber-400/80">
              Files over {(AR_RECOMMENDED_MAX_BYTES / (1024 * 1024)).toFixed(0)}MB
              may fail on mobile AR. Use{" "}
              <code className="rounded bg-amber-500/10 px-1">npx gltf-transform optimize</code>{" "}
              with Draco compression to reduce size.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
