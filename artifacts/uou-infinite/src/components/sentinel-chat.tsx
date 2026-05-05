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

export function SentinelChat() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "init", role: "assistant", content: "I am UOU Sentinel. How can I assist you with your academic journey today?" }
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

  // Only available for students
  if (!user || user.role !== "student") return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message to UI
    const tempUserId = Date.now().toString();
    setMessages(prev => [...prev, { id: tempUserId, role: "user", content: userMessage }]);
    
    setIsStreaming(true);
    
    try {
      let currentConvId = conversationId;
      
      // Initialize conversation if needed
      if (!currentConvId) {
        const conv = await createConversation.mutateAsync({
          data: { title: "Student Inquiry" }
        });
        currentConvId = conv.id;
        setConversationId(conv.id);
      }

      // Add empty assistant message that will be populated via stream
      const tempAsstId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: tempAsstId, role: "assistant", content: "" }]);

      const token = getAuthToken();
      
      const response = await fetch(`/api/openai/conversations/${currentConvId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ content: userMessage })
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
                    prev.map(msg => 
                      msg.id === tempAsstId ? { ...msg, content } : msg
                    )
                  );
                }
              } catch (e) {
                console.error("Error parsing SSE data", e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: "assistant", 
        content: "System anomaly detected. Please try your request again." 
      }]);
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
              className="w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center border-2 border-primary/50 relative group"
            >
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
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
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[350px] h-[500px] bg-card border border-primary/30 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden backdrop-blur-xl bg-card/95"
          >
            <div className="p-4 border-b border-border bg-sidebar/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-primary">UOU Sentinel</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Online</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/20 hover:text-primary" onClick={() => setIsOpen(false)}>
                <X size={16} />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "user" ? "bg-secondary text-primary" : "bg-primary/20 text-primary"
                  }`}>
                    {msg.role === "user" ? <User size={12} /> : <Bot size={12} />}
                  </div>
                  <div className={`px-3 py-2 rounded-lg max-w-[80%] text-sm ${
                    msg.role === "user" 
                      ? "bg-primary/10 border border-primary/20 text-primary-foreground" 
                      : "bg-secondary border border-border text-foreground"
                  }`}>
                    {msg.content}
                    {msg.role === "assistant" && !msg.content && isStreaming && (
                      <div className="flex items-center gap-1 h-4">
                        <div className="w-1 h-1 rounded-full bg-primary animate-bounce" />
                        <div className="w-1 h-1 rounded-full bg-primary animate-bounce delay-75" />
                        <div className="w-1 h-1 rounded-full bg-primary animate-bounce delay-150" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-border bg-sidebar/30">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Query Sentinel..."
                  className="w-full bg-background border border-border rounded-full pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-foreground placeholder:text-muted-foreground"
                  disabled={isStreaming}
                />
                <button 
                  type="submit" 
                  disabled={!input.trim() || isStreaming}
                  className="absolute right-1.5 p-1.5 bg-primary rounded-full text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                >
                  {isStreaming ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
