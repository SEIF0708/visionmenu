"use client";

import { createElement, forwardRef } from "react";

interface ModelViewerProps {
  src?: string;
  alt?: string;
  ar?: boolean;
  "ar-modes"?: string;
  "camera-controls"?: boolean;
  "auto-rotate"?: boolean;
  "shadow-intensity"?: string;
  loading?: string;
  reveal?: string;
  "ios-src"?: string;
  "min-camera-orbit"?: string;
  "max-camera-orbit"?: string;
  onLoad?: () => void;
  onError?: (e: Event) => void;
  class?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  slot?: string;
}

export const ModelViewer = forwardRef<HTMLElement, ModelViewerProps>(
  (props, ref) => {
    return createElement("model-viewer", {
      ...props,
      ref,
      suppressHydrationWarning: true,
    });
  }
);
ModelViewer.displayName = "ModelViewer";
