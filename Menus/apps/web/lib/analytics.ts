"use client";

import { supabase } from "./supabase/client";

export interface DeviceInfo {
  type: "mobile" | "tablet" | "desktop";
  os: "ios" | "android" | "other";
  browser: "chrome" | "safari" | "other";
  userAgent: string;
}

export function getDeviceInfo(): DeviceInfo {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";

  return {
    type: /mobile/i.test(ua)
      ? "mobile"
      : /tablet/i.test(ua)
        ? "tablet"
        : "desktop",
    os: /iPhone|iPad/.test(ua)
      ? "ios"
      : /Android/.test(ua)
        ? "android"
        : "other",
    browser: /Chrome/.test(ua)
      ? "chrome"
      : /Safari/.test(ua)
        ? "safari"
        : "other",
    userAgent: ua,
  };
}

export async function trackEvent(
  eventType: "view" | "ar_open" | "ar_error" | "order_click",
  data: {
    menuItemId: string;
    sessionId: string;
    loadTimeMs?: number;
    modelLoadTimeMs?: number;
  }
) {
  const deviceInfo = getDeviceInfo();

  try {
    await supabase.from("analytics_events").insert({
      menu_item_id: data.menuItemId,
      event_type: eventType,
      session_id: data.sessionId,
      user_agent: deviceInfo.userAgent,
      device_type: deviceInfo.type,
      os: deviceInfo.os,
      browser: deviceInfo.browser,
      load_time_ms: data.loadTimeMs,
      model_load_time_ms: data.modelLoadTimeMs,
    });
  } catch (error) {
    console.error("Failed to track analytics event:", error);
  }
}

export function generateSessionId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}
