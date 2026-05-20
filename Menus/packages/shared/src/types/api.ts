export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiMeta {
  timestamp: string;
  version: string;
  request_id?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MenuItemCreateRequest {
  name: string;
  slug: string;
  description?: string;
  category?: string;
  price?: number;
  calories?: number;
  allergens?: string[];
  dietary_tags?: string[];
  image_url?: string;
  model_url: string;
  model_format?: string;
  model_size_mb?: number;
}

export interface MenuItemUpdateRequest extends Partial<MenuItemCreateRequest> {
  is_available?: boolean;
  sort_order?: number;
}

export interface AnalyticsOverviewResponse {
  total_scans_today: number;
  total_scans_week: number;
  total_scans_month: number;
  most_viewed_items: Array<{
    id: string;
    name: string;
    view_count: number;
  }>;
  ar_conversion_rate: number;
  device_breakdown: Array<{
    device_type: string;
    os: string;
    count: number;
  }>;
  performance_metrics: {
    p95_load_time: number;
    p95_model_load_time: number;
  };
}
