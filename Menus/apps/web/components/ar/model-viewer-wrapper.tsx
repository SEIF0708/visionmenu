"use client";

import { createElement, forwardRef, useEffect } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { ModelViewerElement } from "@google/model-viewer";

let modelViewerImport: Promise<unknown> | null = null;

function defineModelViewer() {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (customElements.get("model-viewer")) {
    return Promise.resolve();
  }

  modelViewerImport ??= import("@google/model-viewer");
  return modelViewerImport;
}

interface ModelViewerProps {
  src?: string;
  alt?: string;
  ar?: boolean;
  "ar-modes"?: string;
  "ar-placement"?: "floor" | "wall";
  "ar-scale"?: "auto" | "fixed";
  "xr-environment"?: boolean;
  "camera-controls"?: boolean;
  "auto-rotate"?: boolean;
  "shadow-intensity"?: string;
  "shadow-softness"?: string;
  "environment-image"?: string;
  exposure?: string;
  loading?: string;
  reveal?: string;
  "ios-src"?: string;
  "camera-orbit"?: string;
  "camera-target"?: string;
  "field-of-view"?: string;
  "min-camera-orbit"?: string;
  "max-camera-orbit"?: string;
  "min-field-of-view"?: string;
  "max-field-of-view"?: string;
  "interaction-prompt"?: "auto" | "none";
  "touch-action"?: "pan-y" | "pan-x" | "none";
  scale?: string;
  onLoad?: () => void;
  onError?: (e: Event) => void;
  class?: string;
  style?: CSSProperties;
  children?: ReactNode;
  slot?: string;
}

export const ModelViewer = forwardRef<ModelViewerElement, ModelViewerProps>(
  (props, ref) => {
    useEffect(() => {
      defineModelViewer().catch((error) => {
        console.error("Failed to load model-viewer", error);
      });
    }, []);

    return createElement("model-viewer", {
      ...props,
      ref,
      suppressHydrationWarning: true,
    });
  }
);
ModelViewer.displayName = "ModelViewer";
