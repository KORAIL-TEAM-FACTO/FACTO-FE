export type QueryType = "DISCOVERY" | "TOPIC" | "SERVICE_FOCUS" | "GENERAL";

export interface ChatSendRequest {
  sessionId: string | null;
  message: string;
}

export interface ChatSendResponse {
  sessionId: string;
  message: string;
  queryType: QueryType;
}

export interface ChatHistoryItem {
  id: number;
  session_id: string;
  role: "USER" | "ASSISTANT";
  message_type: string;
  sender: string;
  content: string;
  created_at: string;
}

export interface ChatSession {
  sessionId: string;
  title: string;
  userId: number | string;
  isActive: boolean;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatSocketPayload {
  sessionId: string;
  message: string;
  userId?: number | string;
}
