export interface AnalyticsTrackRequest {
  eventType: "view" | "ar_open" | "ar_error" | "order_click";
  menuItemId: string;
  sessionId: string;
  deviceInfo?: DeviceInfo;
  performance?: PerformanceMetrics;
}

export interface DeviceInfo {
  type: "mobile" | "tablet" | "desktop";
  os: "ios" | "android" | "other";
  browser: "chrome" | "safari" | "other";
  userAgent?: string;
}

export interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  timeToFirstByte: number;
  modelLoadTime?: number;
}

export interface AnalyticsEventSchema {
  eventType: string;
  menuItemId: string;
  sessionId: string;
  deviceType: string;
  os: string;
  browser: string;
  userAgent?: string;
  loadTimeMs?: number;
  modelLoadTimeMs?: number;
  countryCode?: string;
  city?: string;
}
