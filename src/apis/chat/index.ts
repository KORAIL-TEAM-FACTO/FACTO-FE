import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instance2 } from "../client";
import type {
  ChatHistoryItem,
  ChatSendRequest,
  ChatSendResponse,
  ChatSession,
} from "./types";

// API functions
const sendChat = async (
  payload: ChatSendRequest
): Promise<ChatSendResponse> => {
  const { data } = await instance2.post<ChatSendResponse>("/api/chat", payload);
  return data;
};

const fetchChatHistory = async (
  sessionId: string
): Promise<ChatHistoryItem[]> => {
  const { data } = await instance2.get<ChatHistoryItem[]>(
    `/api/chat/history/${sessionId}`
  );
  return data;
};

const fetchChatSessions = async (): Promise<ChatSession[]> => {
  const { data } = await instance2.get<ChatSession[]>("/api/chat/sessions");
  return data;
};

const deleteChatSession = async (sessionId: string): Promise<void> => {
  await instance2.delete(`/api/chat/sessions/${sessionId}`);
};

const initVectorStore = async (): Promise<string> => {
  const { data } = await instance2.post<string>(
    "/api/chat/admin/init-vector-store"
  );
  return data;
};

// React Query hooks
export const useChatSend = () => {
  return useMutation({
    mutationFn: sendChat,
  });
};

export const useChatHistory = (sessionId: string | null) => {
  return useQuery({
    queryKey: ["chat", "history", sessionId],
    queryFn: () => fetchChatHistory(sessionId as string),
    enabled: !!sessionId,
  });
};

export const useChatSessions = () => {
  return useQuery({
    queryKey: ["chat", "sessions"],
    queryFn: fetchChatSessions,
  });
};

export const useDeleteChatSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteChatSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", "sessions"] });
    },
  });
};

export const useInitVectorStore = () => {
  return useMutation({
    mutationFn: initVectorStore,
  });
};
