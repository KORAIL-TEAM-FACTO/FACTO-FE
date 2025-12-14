export interface RecentView {
  id: number;
  welfare_service_id: string;
  viewed_at: string;
}

export interface TrendingService {
  welfare_service_id: string;
  view_count: number;
}

export interface TrendingParams {
  days?: number;
  limit?: number;
}

export interface RecentViewsParams {
  limit?: number;
}
