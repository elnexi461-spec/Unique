import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useCreateOpenaiConversation } from "@workspace/api-client-react";
import { getAuthToken } from "@/lib/auth";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface SentinelChatProps {
  onActiveChange?: (active: boolean) => void;
}

export function SentinelChat({ onActiveChange }: SentinelChatProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "assistant",
      content:
        "I am UOU Sentinel — your academic mentor and integrity auditor. Your value is increasing. How can I assist your journey today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const createConversation = useCreateOpenaiConversation();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  /* Notify parent when streaming (Sentinel "pulse") */
  useEffect(() => {
    onActiveChange?.(isStreaming);
  }, [isStreaming, onActiveChange]);

  if (!user || user.role !== "student") return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMessage = input.trim();
    setInput("");

    const tempUserId = Date.now().toString();
    setMessages(prev => [...prev, { id: tempUserId, role: "user", content: userMessage }]);

    setIsStreaming(true);

    try {
      let currentConvId = conversationId;

      if (!currentConvId) {
        const conv = await createConversation.mutateAsync({ data: { title: "Student Inquiry" } });
        currentConvId = conv.id;
        setConversationId(conv.id);
      }

      const tempAsstId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: tempAsstId, role: "assistant", content: "" }]);

      const token = getAuthToken();

      const response = await fetch(`/api/openai/conversations/${currentConvId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ content: userMessage }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let content = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n\n").filter(Boolean);
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.done) break;
                if (data.content) {
                  content += data.content;
                  setMessages(prev =>
                    prev.map(msg => (msg.id === tempAsstId ? { ...msg, content } : msg))
                  );
                }
              } catch {}
            }
          }
        }
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "System anomaly detected. Integrity check: please try your request again.",
        },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 rounded-full shadow-lg text-white flex items-center justify-center border-2 relative group"
              style={{
                background: "radial-gradient(circle at 35% 35%, #60A5FA, #1D4ED8 70%)",
                borderColor: "rgba(96,165,250,0.5)",
                boxShadow: "0 0 24px rgba(59,130,246,0.5)",
              }}
            >
              <div className="absolute inset-0 rounded-full animate-ping opacity-30"
                style={{ background: "rgba(59,130,246,0.4)" }} />
              <Bot size={24} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 right-6 w-[360px] h-[520px] rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
            style={{
              background: "rgba(6,14,44,0.97)",
              border: "1px solid rgba(59,130,246,0.3)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 0 40px rgba(59,130,246,0.2), 0 24px 64px rgba(0,0,0,0.6)",
            }}
          >
            {/* Header */}
            <div
              className="p-4 border-b flex items-center justify-between"
              style={{ borderColor: "rgba(59,130,246,0.2)", background: "rgba(8,20,60,0.6)" }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center border"
                  style={{
                    background: "radial-gradient(circle at 35% 35%, #60A5FA, #1D4ED8 70%)",
                    borderColor: "rgba(96,165,250,0.4)",
                  }}
                >
                  <Bot size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm" style={{ color: "#60A5FA" }}>
                    UOU Sentinel
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "#3B82F6" }}
                    />
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                      {isStreaming ? "Processing…" : "Online"}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-primary/20 hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                <X size={15} />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background:
                        msg.role === "user"
                          ? "rgba(59,130,246,0.2)"
                          : "radial-gradient(circle, #60A5FA, #1D4ED8)",
                    }}
                  >
                    {msg.role === "user" ? (
                      <User size={11} style={{ color: "#60A5FA" }} />
                    ) : (
                      <Bot size={11} className="text-white" />
                    )}
                  </div>
                  <div
                    className="px-3 py-2 rounded-xl max-w-[82%] text-sm leading-relaxed"
                    style={{
                      background:
                        msg.role === "user"
                          ? "rgba(59,130,246,0.12)"
                          : "rgba(255,255,255,0.04)",
                      border:
                        msg.role === "user"
                          ? "1px solid rgba(59,130,246,0.25)"
                          : "1px solid rgba(255,255,255,0.08)",
                      color: msg.role === "user" ? "#93C5FD" : "hsl(var(--foreground))",
                    }}
                  >
                    {msg.content}
                    {msg.role === "assistant" && !msg.content && isStreaming && (
                      <div className="flex items-center gap-1 h-4">
                        {[0, 75, 150].map(d => (
                          <div
                            key={d}
                            className="w-1 h-1 rounded-full animate-bounce"
                            style={{ background: "#3B82F6", animationDelay: `${d}ms` }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              className="p-3 border-t"
              style={{ borderColor: "rgba(59,130,246,0.15)", background: "rgba(8,20,60,0.4)" }}
            >
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Query Sentinel…"
                  className="w-full rounded-full pl-4 pr-10 py-2.5 text-sm focus:outline-none transition-all text-foreground placeholder:text-muted-foreground"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(59,130,246,0.2)",
                  }}
                  disabled={isStreaming}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isStreaming}
                  className="absolute right-1.5 p-1.5 rounded-full text-white disabled:opacity-40 transition-colors"
                  style={{ background: "linear-gradient(135deg, #1D4ED8, #3B82F6)" }}
                >
                  {isStreaming ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
