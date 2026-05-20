"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { trackEvent, generateSessionId } from "@/lib/analytics";
import { ModelViewer } from "./model-viewer-wrapper";

interface ARViewerProps {
  modelUrl: string;
  itemName: string;
  menuItemId: string;
  fallbackImageUrl?: string;
  className?: string;
}

export function ARViewer({
  modelUrl,
  itemName,
  menuItemId,
  fallbackImageUrl,
  className,
}: ARViewerProps) {
  const resolvedModelUrl = modelUrl.includes("models.example.com")
    ? (modelUrl.includes("pizza") ? "/fallback-models/pizza.glb" : "/fallback-models/astronaut.glb")
    : modelUrl;

  const [loadingState, setLoadingState] = useState<
    "loading" | "ready" | "error"
  >("loading");
  const [isARSupported, setIsARSupported] = useState<boolean | null>(null);
  const modelLoadStartRef = useRef<number>(0);
  const sessionIdRef = useRef<string>("");

  useEffect(() => {
    sessionIdRef.current = generateSessionId();
    modelLoadStartRef.current = performance.now();

    const checkAR = async () => {
      if (typeof navigator !== "undefined" && "xr" in navigator) {
        try {
          const supported = await (
            navigator as any
          ).xr?.isSessionSupported("immersive-ar");
          setIsARSupported(!!supported);
        } catch {
          setIsARSupported(false);
        }
      } else {
        setIsARSupported(false);
      }
    };
    checkAR();
  }, []);

  const handleLoad = () => {
    const loadTime = performance.now() - modelLoadStartRef.current;
    setLoadingState("ready");
    trackEvent("view", {
      menuItemId,
      sessionId: sessionIdRef.current,
      modelLoadTimeMs: Math.round(loadTime),
    });
  };

  const handleError = () => {
    setLoadingState("error");
    trackEvent("ar_error", {
      menuItemId,
      sessionId: sessionIdRef.current,
    });
  };

  const handleAROpen = () => {
    trackEvent("ar_open", {
      menuItemId,
      sessionId: sessionIdRef.current,
    });
  };

  return (
    <div className={cn("relative w-full h-full overflow-hidden bg-black", className)}>
      <ModelViewer
        src={resolvedModelUrl}
        alt={itemName}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        shadow-intensity="1"
        loading="eager"
        reveal="auto"
        min-camera-orbit="auto auto 5%"
        max-camera-orbit="auto auto 100%"
        onLoad={handleLoad}
        onError={handleError}
        style={{ width: "100%", height: "100%" }}
        class="w-full h-full"
      >
        {isARSupported && (
          <button
            slot="ar-button"
            onClick={handleAROpen}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full font-semibold shadow-lg z-10"
          >
            View in Your Space
          </button>
        )}

        {loadingState === "loading" && (
          <div
            slot="poster"
            className="flex items-center justify-center w-full h-full"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white" />
          </div>
        )}

        {loadingState === "error" && fallbackImageUrl && (
          <img
            slot="poster"
            src={fallbackImageUrl}
            alt={itemName}
            className="w-full h-full object-cover"
          />
        )}
      </ModelViewer>
    </div>
  );
}
