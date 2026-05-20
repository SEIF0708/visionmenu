export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan_tier: "free" | "basic" | "premium" | "enterprise";
  logo_url: string | null;
  primary_color: string;
  created_at: string;
  updated_at: string;
  max_menu_items: number;
  max_monthly_scans: number;
}

export interface Location {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  address: Record<string, unknown> | null;
  timezone: string;
  is_active: boolean;
  created_at: string;
}

export interface MenuItem {
  id: string;
  location_id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  price: number | null;
  currency: string;
  calories: number | null;
  allergens: string[] | null;
  dietary_tags: string[] | null;
  image_url: string | null;
  model_url: string;
  model_format: string;
  model_size_mb: number | null;
  is_available: boolean;
  sort_order: number;
  view_count: number;
  ar_open_count: number;
  version: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsEvent {
  id: string;
  menu_item_id: string;
  event_type: "view" | "ar_open" | "ar_error" | "order_click";
  session_id: string;
  user_agent: string | null;
  device_type: string | null;
  os: string | null;
  browser: string | null;
  load_time_ms: number | null;
  model_load_time_ms: number | null;
  country_code: string | null;
  city: string | null;
  created_at: string;
}

export interface QRCode {
  id: string;
  menu_item_id: string;
  code: string;
  full_url: string;
  placement_location: string | null;
  generated_at: string;
  last_scanned_at: string | null;
  scan_count: number;
  is_active: boolean;
}

export interface UserRole {
  user_id: string;
  organization_id: string;
  role: "owner" | "admin" | "editor" | "viewer";
  created_at: string;
}

export interface ModelUpload {
  id: string;
  organization_id: string;
  original_filename: string;
  file_size_mb: number;
  upload_url: string;
  status: "pending" | "processing" | "optimized" | "failed";
  optimized_url: string | null;
  error_message: string | null;
  processed_at: string | null;
  created_at: string;
}
