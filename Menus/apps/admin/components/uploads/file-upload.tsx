"use client";

import { useCallback, useState } from "react";
import { useDropzone, type Accept, type FileRejection } from "react-dropzone";
import { cn } from "@/lib/utils";

type UploadState = "idle" | "uploading" | "success" | "error";

interface FileUploadProps {
  label: string;
  hint?: string;
  accept: Accept;
  maxSize: number;
  uploadEndpoint: string;
  onUploadComplete: (data: Record<string, unknown>) => void;
  previewUrl?: string | null;
  previewType?: "image" | "file";
  fileName?: string | null;
  required?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
}

export function FileUpload({
  label,
  hint,
  accept,
  maxSize,
  uploadEndpoint,
  onUploadComplete,
  previewUrl,
  previewType = "file",
  fileName,
  required,
  onUploadingChange,
}: FileUploadProps) {
  const [state, setState] = useState<UploadState>("idle");
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setState("uploading");
      setError(null);
      onUploadingChange?.(true);

      const body = new FormData();
      body.append("file", file);

      try {
        const res = await fetch(uploadEndpoint, {
          method: "POST",
          body,
        });
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.error ?? "Upload failed");
        }

        setState("success");
        onUploadComplete(json.data);
      } catch (err) {
        setState("error");
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        onUploadingChange?.(false);
      }
    },
    [uploadEndpoint, onUploadComplete, onUploadingChange]
  );

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      if (rejected.length > 0) {
        setError(rejected[0].errors[0]?.message ?? "File rejected");
        setState("error");
        return;
      }
      const file = accepted[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles: 1,
    disabled: state === "uploading",
  });

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {hint && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}

      {previewUrl && previewType === "image" && (
        <div className="relative w-full max-w-xs aspect-video rounded-md overflow-hidden border bg-muted/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Preview"
            className="object-cover w-full h-full"
          />
        </div>
      )}

      {previewUrl && previewType === "file" && (
        <p className="text-xs text-muted-foreground break-all">
          {fileName ?? "3D model uploaded"}
        </p>
      )}

      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragActive && "border-primary bg-primary/5",
          state === "uploading" && "opacity-60 cursor-wait",
          state === "error" && "border-destructive/50",
          state !== "error" && "border-input hover:border-primary/50 hover:bg-muted/30"
        )}
      >
        <input {...getInputProps()} />
        {state === "uploading" && (
          <p className="text-sm text-muted-foreground">Uploading…</p>
        )}
        {state === "idle" && (
          <>
            <p className="text-sm font-medium">
              {isDragActive ? "Drop file here" : "Drag & drop or tap to browse"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Max {(maxSize / (1024 * 1024)).toFixed(0)}MB
            </p>
          </>
        )}
        {state === "success" && (
          <p className="text-sm text-green-600">Uploaded — drop another to replace</p>
        )}
        {state === "error" && !isDragActive && (
          <p className="text-sm text-muted-foreground">
            Try again — drag & drop or tap to browse
          </p>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
