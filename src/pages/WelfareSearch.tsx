import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { IoSend } from "react-icons/io5";
import NavBar from "../components/NavBar";
import { useChatSend } from "../apis";

type ChatMessage = {
  role: "USER" | "ASSISTANT";
  content: string;
};

type StreamEvent =
  | { sessionId: string; type: "START" }
  | { sessionId: string; type: "STREAMING"; content: string }
  | { sessionId: string; type: "END" }
  | { sessionId: string; type: "ERROR"; content: string };

export default function WelfareSearch() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const streamingRef = useRef("");

  const { mutateAsync: sendChat, isPending } = useChatSend();

  const renderInline = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={idx} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  const renderMessage = (text: string) => {
    const paragraphs = text.trim().split(/\n{2,}/);
    return paragraphs.map((para, pIdx) => {
      const lines = para.split("\n");
      const isBullets = lines.every(
        (l) => l.trim().startsWith("-") || l.trim().startsWith("•")
      );
      if (isBullets) {
        return (
          <ul
            key={pIdx}
            className="list-disc pl-4 space-y-1 text-base text-gray-900"
          >
            {lines.map((line, liIdx) => {
              const clean = line.replace(/^[-•]\s*/, "");
              return <li key={liIdx}>{renderInline(clean)}</li>;
            })}
          </ul>
        );
      }
      return (
        <p
          key={pIdx}
          className="text-base text-gray-900 whitespace-pre-wrap leading-relaxed break-words overflow-hidden"
        >
          {renderInline(para)}
        </p>
      );
    });
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Cleanup socket on unmount
    return () => {
      socketRef.current?.close();
    };
  }, []);

  const buildWsUrl = () => {
    const base = import.meta.env.VITE_PARK_URL || window.location.origin;
    try {
      const url = new URL(base);
      url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
      url.pathname =
        (url.pathname.endsWith("/")
          ? url.pathname.slice(0, -1)
          : url.pathname) + "/ws/chat";
      return url.toString();
    } catch (_) {
      return base.replace(/^http/, "ws") + "/ws/chat";
    }
  };

  const startStreaming = (userText: string) => {
    const wsUrl = buildWsUrl();
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;
    setIsStreaming(true);
    setStreamingContent("");
    streamingRef.current = "";

    socket.onopen = () => {
      const payload = {
        sessionId,
        message: userText,
      };
      socket.send(JSON.stringify(payload));
    };

    socket.onmessage = (event) => {
      try {
        const data: StreamEvent = JSON.parse(event.data);
        if (data.type === "START") {
          setSessionId(data.sessionId);
        } else if (data.type === "STREAMING") {
          setStreamingContent((prev) => {
            const next = prev + data.content;
            streamingRef.current = next;
            return next;
          });
        } else if (data.type === "END") {
          const finalText = streamingRef.current;
          if (finalText.trim()) {
            setMessages((prev) => [
              ...prev,
              { role: "ASSISTANT", content: finalText },
            ]);
            setStreamingContent("");
            streamingRef.current = "";
          }
          setIsStreaming(false);
          socket.close();
        } else if (data.type === "ERROR") {
          setError(data.content || "스트리밍 중 오류가 발생했습니다.");
          setIsStreaming(false);
          setStreamingContent("");
          streamingRef.current = "";
          socket.close();
        }
      } catch (err) {
        setError("응답 파싱 중 오류가 발생했습니다.");
        setIsStreaming(false);
        setStreamingContent("");
        streamingRef.current = "";
        socket.close();
      }
    };

    socket.onerror = () => {
      setError("스트리밍 연결에 실패했습니다.");
      setIsStreaming(false);
      setStreamingContent("");
      streamingRef.current = "";
    };

    socket.onclose = () => {
      socketRef.current = null;
    };
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isPending || isStreaming) return;
    setError(null);

    const userMsg: ChatMessage = { role: "USER", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    // Start WebSocket streaming; fallback to REST if WS fails to open
    try {
      startStreaming(trimmed);
    } catch (e) {
      // Fallback: REST 단건 응답
      try {
        const res = await sendChat({ sessionId, message: trimmed });
        setSessionId(res.sessionId);
        setMessages((prev) => [
          ...prev,
          { role: "ASSISTANT", content: res.message },
        ]);
      } catch {
        setError("응답을 가져오지 못했습니다. 잠시 후 다시 시도해주세요.");
      } finally {
        setIsStreaming(false);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-white pb-32 relative">
      <div className="px-4 pt-6 pb-24 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 text-sm">
            궁금한 복지 서비스를 물어보세요. 예) "수원 청년 창업 지원금 알려줘"
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === "USER" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-2xl px-5 py-4 max-w-[85%] text-base leading-relaxed shadow-sm ${
                msg.role === "USER"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              {msg.role === "USER" ? (
                <span className="whitespace-pre-wrap">{msg.content}</span>
              ) : (
                <div className="space-y-2 break-words overflow-hidden">
                  {renderMessage(msg.content)}
                </div>
              )}
            </div>
          </div>
        ))}

        {isStreaming && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-5 py-4 max-w-[85%] text-base leading-relaxed shadow-sm bg-gray-100 text-gray-900 break-words overflow-hidden">
              <div className="space-y-2">
                {streamingContent
                  ? renderMessage(streamingContent)
                  : "답변 작성 중..."}
              </div>
            </div>
          </div>
        )}

        {isPending && !isStreaming && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-4 py-3 bg-gray-100 text-gray-600 text-sm">
              답변 작성 중...
            </div>
          </div>
        )}

        {error && (
          <div className="text-center text-sm text-red-500">{error}</div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Box */}
      <div className="fixed bottom-20 left-0 right-0 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-full px-5 py-3 flex items-center gap-3 shadow-[0_0_20px_rgba(59,130,246,0.5),0_0_40px_rgba(147,51,234,0.3)] border border-gray-100">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="메시지를 입력하세요..."
              className="flex-1 bg-transparent outline-none text-base text-gray-900 placeholder-gray-400"
              disabled={isPending || isStreaming}
            />
            <button
              onClick={handleSend}
              disabled={isPending || isStreaming || !input.trim()}
              className={`p-2 rounded-full flex-shrink-0 transition-all ${
                isPending || isStreaming || !input.trim()
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              }`}
            >
              <IoSend
                className={`w-5 h-5 ${
                  isPending || isStreaming || !input.trim()
                    ? "text-gray-500"
                    : "text-white"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <NavBar />
    </div>
  );
}
