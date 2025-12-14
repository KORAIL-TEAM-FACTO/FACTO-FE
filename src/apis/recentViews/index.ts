import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instance2 } from "../client";
import type {
  RecentView,
  TrendingService,
  TrendingParams,
  RecentViewsParams,
} from "./types";

// API Functions
const addRecentView = async (welfareServiceId: string): Promise<void> => {
  await instance2.post(`/recent-views/${welfareServiceId}`);
};

const getRecentViews = async (
  params?: RecentViewsParams
): Promise<RecentView[]> => {
  const response = await instance2.get<RecentView[]>("/recent-views", {
    params,
  });
  return response.data;
};

const getTrendingServices = async (
  params?: TrendingParams
): Promise<TrendingService[]> => {
  const response = await instance2.get<TrendingService[]>(
    "/recent-views/trending",
    { params }
  );
  return response.data;
};

// React Query Hooks
export const useAddRecentView = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addRecentView,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recentViews"] });
    },
  });
};

export const useRecentViews = (params?: RecentViewsParams) => {
  return useQuery({
    queryKey: ["recentViews", params],
    queryFn: () => getRecentViews(params),
  });
};

export const useTrendingServices = (params?: TrendingParams) => {
  return useQuery({
    queryKey: ["recentViews", "trending", params],
    queryFn: () => getTrendingServices(params),
  });
};
