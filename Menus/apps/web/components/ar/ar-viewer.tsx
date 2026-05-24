"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { ModelViewerElement } from "@google/model-viewer";
import { cn } from "@/lib/utils";
import { trackEvent, generateSessionId } from "@/lib/analytics";
import { ModelViewer } from "./model-viewer-wrapper";
import { AlertTriangle, Loader2, Smartphone } from "lucide-react";

interface ARViewerProps {
  modelUrl: string;
  itemName: string;
  menuItemId: string;
  fallbackImageUrl?: string;
  iosSrc?: string;
  ctaLabel?: string;
  className?: string;
}

type LoadingState = "loading" | "ready" | "error";
type ARAvailability = "checking" | "supported" | "unsupported";
type ARPresentationState = "idle" | "launching" | "presenting" | "placed" | "failed";

type ModelViewerProgressEvent = CustomEvent<{
  totalProgress?: number;
}>;

type ModelViewerAREvent = CustomEvent<{
  status?: string;
}>;

const NATIVE_AR_MODES = "webxr scene-viewer quick-look";
const UNSUPPORTED_AR_MESSAGE =
  "AR opens on iPhone Safari or Android Chrome. The 3D preview still works here.";

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function isNativeARCandidate() {
  if (typeof navigator === "undefined" || typeof document === "undefined") {
    return false;
  }

  const userAgent = navigator.userAgent;
  const androidSceneViewer =
    /Android/i.test(userAgent) &&
    !/Firefox/i.test(userAgent) &&
    !/OculusBrowser/i.test(userAgent);

  if (androidSceneViewer) {
    return true;
  }

  if (!isIOS()) {
    return false;
  }

  const anchor = document.createElement("a");
  const supportsQuickLook = Boolean(
    anchor.relList?.supports && anchor.relList.supports("ar")
  );
  const maybeWindow = window as Window & {
    webkit?: { messageHandlers?: unknown };
  };
  const supportedIOSWebView =
    Boolean(maybeWindow.webkit?.messageHandlers) &&
    /CriOS\/|EdgiOS\/|FxiOS\/|GSA\/|DuckDuckGo\//.test(userAgent);

  return supportsQuickLook || supportedIOSWebView;
}

async function isWebXRARSupported() {
  if (typeof navigator === "undefined" || !("xr" in navigator)) {
    return false;
  }

  try {
    return Boolean(
      await (navigator as Navigator & {
        xr?: { isSessionSupported?: (mode: string) => Promise<boolean> };
      }).xr?.isSessionSupported?.("immersive-ar")
    );
  } catch {
    return false;
  }
}

export function ARViewer({
  modelUrl,
  itemName,
  menuItemId,
  fallbackImageUrl,
  iosSrc,
  ctaLabel = "View in AR",
  className,
}: ARViewerProps) {
  const resolvedModelUrl = useMemo(() => {
    if (!modelUrl.includes("models.example.com")) {
      return modelUrl;
    }

    return modelUrl.includes("pizza") || itemName.toLowerCase().includes("pizza")
      ? "/fallback-models/pizza.glb"
      : "/fallback-models/astronaut.glb";
  }, [itemName, modelUrl]);

  const modelRef = useRef<ModelViewerElement | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>("loading");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [arAvailability, setARAvailability] =
    useState<ARAvailability>("checking");
  const [arState, setARState] = useState<ARPresentationState>("idle");
  const [fallbackMessage, setFallbackMessage] = useState<string | null>(null);
  const modelLoadStartRef = useRef<number>(0);
  const sessionIdRef = useRef<string>("");

  const syncARAvailability = useCallback(async () => {
    const modelViewer = modelRef.current;
    const supported =
      Boolean(modelViewer?.canActivateAR) ||
      isNativeARCandidate() ||
      (await isWebXRARSupported());

    setARAvailability(supported ? "supported" : "unsupported");
    return supported;
  }, []);

  useEffect(() => {
    sessionIdRef.current = generateSessionId();
  }, []);

  useEffect(() => {
    modelLoadStartRef.current = performance.now();
    setLoadingState("loading");
    setLoadingProgress(0);
    setARState("idle");
    setFallbackMessage(null);
  }, [resolvedModelUrl]);

  useEffect(() => {
    const modelViewer = modelRef.current;
    if (!modelViewer) return;

    let cancelled = false;

    const handleLoad = () => {
      if (cancelled) return;

      const loadTime = performance.now() - modelLoadStartRef.current;
      setLoadingState("ready");
      setLoadingProgress(100);
      syncARAvailability();
      trackEvent("view", {
        menuItemId,
        sessionId: sessionIdRef.current,
        modelLoadTimeMs: Math.round(loadTime),
      });
    };

    const handleProgress = (event: Event) => {
      const progress =
        (event as ModelViewerProgressEvent).detail?.totalProgress ?? 0;
      setLoadingProgress(Math.round(progress * 100));
    };

    const handleError = () => {
      setLoadingState("error");
      setARAvailability("unsupported");
      setFallbackMessage("This 3D model could not be loaded for AR.");
      trackEvent("ar_error", {
        menuItemId,
        sessionId: sessionIdRef.current,
      });
    };

    const handleARStatus = (event: Event) => {
      const status = (event as ModelViewerAREvent).detail?.status;

      if (status === "session-started") {
        setARState("presenting");
        setFallbackMessage(null);
      }

      if (status === "object-placed") {
        setARState("placed");
      }

      if (status === "not-presenting") {
        setARState("idle");
      }

      if (status === "failed") {
        setARState("failed");
        setFallbackMessage(UNSUPPORTED_AR_MESSAGE);
        trackEvent("ar_error", {
          menuItemId,
          sessionId: sessionIdRef.current,
        });
      }

      syncARAvailability();
    };

    modelViewer.addEventListener("load", handleLoad);
    modelViewer.addEventListener("progress", handleProgress);
    modelViewer.addEventListener("error", handleError);
    modelViewer.addEventListener("ar-status", handleARStatus);

    customElements
      .whenDefined("model-viewer")
      .then(() => {
        if (!cancelled) syncARAvailability();
      })
      .catch(() => setARAvailability("unsupported"));

    if (modelViewer.loaded) {
      handleLoad();
    }

    return () => {
      cancelled = true;
      modelViewer.removeEventListener("load", handleLoad);
      modelViewer.removeEventListener("progress", handleProgress);
      modelViewer.removeEventListener("error", handleError);
      modelViewer.removeEventListener("ar-status", handleARStatus);
    };
  }, [menuItemId, resolvedModelUrl, syncARAvailability]);

  const handleOpenAR = async () => {
    const modelViewer = modelRef.current;

    if (loadingState === "loading") {
      setFallbackMessage("The 3D model is still preparing.");
      return;
    }

    if (loadingState === "error" || !modelViewer) {
      setFallbackMessage("This 3D model could not be loaded for AR.");
      return;
    }

    const supported = await syncARAvailability();

    const canAttemptAR =
      modelViewer.canActivateAR ||
      isNativeARCandidate() ||
      supported ||
      arAvailability === "supported";

    if (!canAttemptAR) {
      setFallbackMessage(UNSUPPORTED_AR_MESSAGE);
      trackEvent("ar_error", {
        menuItemId,
        sessionId: sessionIdRef.current,
      });
      return;
    }

    try {
      setARState("launching");
      setFallbackMessage(null);
      trackEvent("ar_open", {
        menuItemId,
        sessionId: sessionIdRef.current,
      });

      await modelViewer.activateAR();

      window.setTimeout(() => {
        setARState((current) => (current === "launching" ? "idle" : current));
      }, 2500);
    } catch {
      setARState("failed");
      setFallbackMessage(UNSUPPORTED_AR_MESSAGE);
      trackEvent("ar_error", {
        menuItemId,
        sessionId: sessionIdRef.current,
      });
    }
  };

  const progressLabel =
    loadingProgress > 0 && loadingProgress < 100
      ? `Loading ${loadingProgress}%`
      : "Loading 3D model";
  const isOpening = arState === "launching";
  const isPreparing = loadingState === "loading";
  const buttonLabel = isPreparing
    ? "Preparing AR"
    : isOpening
      ? "Opening Camera"
      : ctaLabel;

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden bg-[#0A0A0F]",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#101016] via-[#09090D] to-black pointer-events-none" />

      <ModelViewer
        ref={modelRef}
        src={resolvedModelUrl}
        alt={`${itemName} 3D model`}
        ar
        ar-modes={NATIVE_AR_MODES}
        ar-placement="floor"
        ar-scale="auto"
        xr-environment
        ios-src={iosSrc}
        camera-controls
        auto-rotate
        shadow-intensity="1.4"
        shadow-softness="0.85"
        environment-image="neutral"
        exposure="0.92"
        loading="eager"
        reveal="auto"
        camera-orbit="0deg 65deg 105%"
        field-of-view="28deg"
        min-camera-orbit="auto auto 45%"
        max-camera-orbit="auto auto 160%"
        min-field-of-view="18deg"
        max-field-of-view="38deg"
        interaction-prompt="auto"
        touch-action="pan-y"
        scale="1 1 1"
        style={
          {
            width: "100%",
            height: "100%",
            "--ar-button-display": "none",
            "--poster-color": "transparent",
          } as CSSProperties
        }
        class="h-full w-full"
      >
        {loadingState === "loading" && (
          <div
            slot="poster"
            className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#08080C]"
          >
            <Loader2 className="h-8 w-8 animate-spin text-[#FF7A1A]" />
            <p className="text-xs font-medium text-neutral-400">
              {progressLabel}
            </p>
          </div>
        )}

        {loadingState === "error" && fallbackImageUrl && (
          <img
            slot="poster"
            src={fallbackImageUrl}
            alt={itemName}
            className="h-full w-full object-cover"
          />
        )}
      </ModelViewer>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-2 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-5 pb-5 pt-24">
        <button
          type="button"
          data-testid="view-in-ar-button"
          aria-label={`View ${itemName} in AR`}
          disabled={isPreparing || isOpening}
          onClick={handleOpenAR}
          className="pointer-events-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8A33] px-6 py-3 text-sm font-semibold text-white shadow-2xl shadow-orange-500/30 transition-transform hover:scale-[1.03] disabled:cursor-wait disabled:opacity-80 disabled:hover:scale-100"
        >
          {isPreparing || isOpening ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Smartphone className="h-4 w-4" />
          )}
          {buttonLabel}
        </button>

        {(fallbackMessage || arAvailability === "unsupported") &&
          loadingState !== "loading" && (
            <div className="pointer-events-auto flex max-w-[20rem] items-center gap-2 rounded-full border border-white/10 bg-black/65 px-3.5 py-2 text-center text-[11px] leading-snug text-neutral-300 shadow-xl backdrop-blur-xl">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-[#FF8A33]" />
              <span>{fallbackMessage || UNSUPPORTED_AR_MESSAGE}</span>
            </div>
          )}
      </div>
    </div>
  );
}
