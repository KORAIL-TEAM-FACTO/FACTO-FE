import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instance2 } from "../client";
import type { Bookmark } from "./types";

// API Functions
const addBookmark = async (welfareServiceId: string): Promise<void> => {
  await instance2.post(`/bookmarks/${welfareServiceId}`);
};

const deleteBookmark = async (welfareServiceId: string): Promise<void> => {
  await instance2.delete(`/bookmarks/${welfareServiceId}`);
};

const getBookmarks = async (): Promise<Bookmark[]> => {
  const response = await instance2.get<Bookmark[]>("/bookmarks");
  return response.data;
};

const checkBookmark = async (welfareServiceId: string): Promise<boolean> => {
  const response = await instance2.get<boolean>(
    `/bookmarks/${welfareServiceId}/check`
  );
  return response.data;
};

// React Query Hooks
export const useAddBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
};

export const useDeleteBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
};

export const useBookmarks = () => {
  return useQuery({
    queryKey: ["bookmarks"],
    queryFn: getBookmarks,
  });
};

export const useCheckBookmark = (welfareServiceId: string) => {
  return useQuery({
    queryKey: ["bookmarks", "check", welfareServiceId],
    queryFn: () => checkBookmark(welfareServiceId),
    enabled: !!welfareServiceId,
  });
};
