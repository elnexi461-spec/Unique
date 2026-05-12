import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, Loader2 } from "lucide-react";
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

/* ── UOU Institutional Knowledge Base ── */
const UOU_NEWS = [
  "UOU announces 50 full-tuition scholarships for top Vanguard scholars — applications open now (May 2026)",
  "Merit-based Excellence Awards: ₦2.5M pool for highest Gold Card earners this semester (May 2026)",
  "Vanguard Guardian AI module launched — personal performance diagnostics for every scholar (May 2026)",
  "Week 18 Friday Brief: Zaria Center achieves 15% punctuality surge under Sentinel optimisation (May 2026)",
  "Cryptographic Proof of Attendance live — 217 Gold Cards minted across 6 centers (Apr 2026)",
  "Federal Government endorses UOU scholarship framework — 200 additional slots announced (Apr 2026)",
  "Port Harcourt Center expansion: 120 new scholar slots open for 2026/2027 academic year",
  "Enugu Center achieves 98% course completion rate — highest across all UOU centers (Apr 2026)",
];

const UOU_ACADEMIC_CALENDAR = [
  { period: "First Semester Registration",   dates: "September 1 – September 14" },
  { period: "First Semester Lectures",       dates: "September 15 – January 10" },
  { period: "First Semester Examinations",   dates: "January 13 – January 31" },
  { period: "Semester Break",               dates: "February 1 – February 14" },
  { period: "Second Semester Registration",  dates: "February 15 – February 28" },
  { period: "Second Semester Lectures",      dates: "March 1 – June 20" },
  { period: "Second Semester Examinations",  dates: "June 23 – July 11" },
  { period: "Long Vacation",               dates: "July 12 – August 31" },
];

const UOU_CENTERS = [
  { name: "Zaria Center",          region: "North West (Kaduna State)",  role: "North West flagship & Head Quarters",        scholars: 18 },
  { name: "Lagos Center",          region: "South West (Lagos State)",   role: "South West flagship",     scholars: 19 },
  { name: "Kano Center",           region: "North West (Kano State)",    role: "North hub",               scholars: 14 },
  { name: "Abuja Center",          region: "Federal Capital Territory",  role: "FCT hub & Policy liaison", scholars: 22 },
  { name: "Port Harcourt Center",  region: "South South (Rivers State)", role: "South South hub",         scholars: 16 },
  { name: "Enugu Center",          region: "South East (Enugu State)",   role: "South East hub",          scholars: 15 },
];

const UOU_TIMETABLE = [
  { day: "Monday",    time: "09:00–11:00", course: "BAM-111: Business Administration & Management",  venue: "Virtual Studio A", lecturer: "Dr. Adebayo" },
  { day: "Tuesday",   time: "10:00–12:00", course: "ENT-101: Principles of Entrepreneurship",         venue: "Virtual Studio B", lecturer: "Prof. Imumolen" },
  { day: "Wednesday", time: "11:00–13:00", course: "AI-201: AI Safety & Ethics",                      venue: "Virtual Studio A", lecturer: "Dr. Okonkwo" },
  { day: "Thursday",  time: "09:00–11:00", course: "DIG-301: Digital Innovation Lab",                 venue: "Virtual Studio C", lecturer: "Ms. Eze" },
  { day: "Friday",    time: "10:00–12:00", course: "LAW-201: Constitutional Law & Governance",        venue: "Virtual Studio B", lecturer: "Prof. Bello" },
];

function getActivityLog(): Array<{ action: string; detail: string; time: string }> {
  try {
    return JSON.parse(localStorage.getItem("UOU_Activity_Log") || "[]");
  } catch { return []; }
}

function getPerformanceLedger(): Array<{ key: string; tier: string; submittedAt: string }> {
  try {
    return JSON.parse(localStorage.getItem("UOU_Performance_Ledger") || "[]");
  } catch { return []; }
}

/* Keyword-based local answers */
function getLocalAnswer(query: string): string | null {
  const q = query.toLowerCase();

  /* ── Identity ── */
  if (/who are you|what are you|your name|introduce yourself|what is sentinel/i.test(q)) {
    return `I am the **UOU Infinite Sentinel**, your AI guide to the University.\n\nI carry the full institutional knowledge of Unique Open University — from academic programmes and center locations to the Founder's vision and your personal performance data. Ask me anything.\n\n_— Sentinel_`;
  }

  /* ── Founder / Leadership ── */
  if (/founder|professor imumolen|christopher|president|vice chancellor|vc|chancellor|who.*start|who.*establish|who.*found|leadership|head.*university/i.test(q)) {
    return `👨‍🎓 **Professor Christopher Imumolen — Founder & Chancellor**\n\nProfessor Christopher Imumolen is the visionary Founder and Chancellor of Unique Open University (UOU). A distinguished academic, entrepreneur, and thought leader, he established UOU with a singular mission: to make world-class, NUC-accredited higher education accessible to every Nigerian — regardless of geography or economic background.\n\nUnder his leadership, UOU has grown to **6 active centers** across Nigeria, pioneered cryptographic proof-of-learning technology, and launched the Vanguard Scholar programme.\n\n_His conviction: "Education is the final equaliser." — Sentinel_`;
  }

  /* ── Centers / Campuses / Locations ── */
  if (/campus|location|centre|center|zaria|lagos|kano|abuja|port harcourt|ph|enugu|where.*university|university.*where|branch/i.test(q)) {
    const centerList = UOU_CENTERS.map(c =>
      `• **${c.name}** — ${c.region}\n  ${c.role} · ${c.scholars} scholars enrolled`
    ).join("\n\n");
    return `🗺️ **UOU Active Centers (6 Nationwide):**\n\n${centerList}\n\nAll academic delivery is via Virtual Studios, ensuring seamless learning across all centers.\n\n_— Sentinel_`;
  }

  /* ── Academic Calendar ── */
  if (/calendar|semester|exam|examination|period|vacation|break|registration|academic.*year|when.*exam|when.*lecture/i.test(q)) {
    const cal = UOU_ACADEMIC_CALENDAR.map(e => `• **${e.period}:** ${e.dates}`).join("\n");
    return `📆 **UOU Academic Calendar:**\n\n${cal}\n\n_The calendar follows a two-semester structure aligned with NUC guidelines. Specific dates may be adjusted by the Registrar for each academic year. — Sentinel_`;
  }

  /* ── Announcements ── */
  if (/announc|news|latest|update|happen|event|what.*new/i.test(q)) {
    return `📢 **UOU Latest Announcements (Week 18, 2026):**\n\n${UOU_NEWS.map((n, i) => `${i + 1}. ${n}`).join("\n\n")}\n\n_— Sentinel_`;
  }

  /* ── Timetable ── */
  if (/timetable|schedule|class|lecture|when.*course|course.*when|today.*class|what.*time|my.*class/i.test(q)) {
    const today = new Date().toLocaleDateString("en-NG", { weekday: "long" });
    const todaySlots = UOU_TIMETABLE.filter(t => t.day === today);
    const schedule = UOU_TIMETABLE.map(t =>
      `**${t.day}** ${t.time} — ${t.course}\n   📍 ${t.venue} · ${t.lecturer}`
    ).join("\n\n");
    const todayNote = todaySlots.length
      ? `\n\n🔴 **Today (${today}):** ${todaySlots.map(t => `${t.time} — ${t.course}`).join(", ")}`
      : `\n\n📅 No classes scheduled today (${today}).`;
    return `📅 **Your Weekly Timetable:**\n\n${schedule}${todayNote}\n\n_— Sentinel_`;
  }

  /* ── Attendance ── */
  if (/attendance|present|absent|activity|log|history|session/i.test(q)) {
    const log = getActivityLog();
    if (!log.length) {
      return `📋 **Attendance Record:** No activity recorded yet. Begin a lecture to build your institutional log.\n\n_— Sentinel_`;
    }
    const recent = log.slice(-5).reverse();
    return `📋 **Recent Activity (${log.length} total events):**\n\n${recent.map((a) => `• **${a.action}**: ${a.detail}`).join("\n")}\n\n_Your institutional ledger is continuously updated. — Sentinel_`;
  }

  /* ── Performance Cards ── */
  if (/gold card|silver card|bronze card|achievement|reward|performance key|gauntlet|tier/i.test(q)) {
    const ledger = getPerformanceLedger();
    const gold   = ledger.filter(e => e.tier === "GOLD").length;
    const silver = ledger.filter(e => e.tier === "SILVER").length;
    const bronze = ledger.filter(e => e.tier === "BRONZE").length;
    return `🏆 **Your Achievement Record:**\n\n🥇 Gold Cards: **${gold}**\n🥈 Silver Cards: **${silver}**\n🥉 Bronze Cards: **${bronze}**\n\nTotal earned: **${ledger.length}** Performance Keys\n\n_Submit keys via the Scholar Hub on your portal. — Sentinel_`;
  }

  /* ── Grades ── */
  if (/gpa|grade|result|score|academic record|transcript/i.test(q)) {
    return `📊 **Academic Records:** Your GPA and grades are available under **Grades & GPA** in your portal sidebar. The AI Registrar provides detailed semester breakdowns and trend analysis.\n\n_— Sentinel_`;
  }

  /* ── Credentials ── */
  if (/credential|certificate|proof|qr|passport/i.test(q)) {
    return `🎓 **Credential Passport:** Your cryptographic proof of achievement is available under **Credential Passport** in your portal. Each credential carries a QR code for institutional verification.\n\n_— Sentinel_`;
  }

  /* ── Fees ── */
  if (/fee|payment|tuition|finance/i.test(q)) {
    return `💳 **Fee Status:** Visit **Fee Status** in your portal sidebar for your current payment position. Scholarship recipients have fees managed by the institution directly.\n\n_— Sentinel_`;
  }

  /* ── Greetings ── */
  if (/hello|hi|hey|good|morning|afternoon|evening|greet/i.test(q)) {
    return `Greetings, Scholar. I am the **UOU Infinite Sentinel** — your AI guide to the University. I can assist with:\n\n• 📅 **Timetable & schedules**\n• 📢 **Announcements & news**\n• 📋 **Attendance & activity logs**\n• 🏆 **Achievement cards & performance keys**\n• 🗺️ **Center locations**\n• 📆 **Academic calendar**\n• 👨‍🎓 **Founder & leadership**\n\nHow may I assist your journey today?\n\n_— Sentinel_`;
  }

  return null;
}

function buildSystemContext(user: ReturnType<typeof useAuth>["user"]): string {
  const log = getActivityLog();
  const ledger = getPerformanceLedger();
  return `You are the UOU Infinite Sentinel — the official institutional AI guide for Unique Open University (UOU) Nigeria. You are authoritative, concise, warm, and motivating. Always sign off as "— Sentinel".

IDENTITY: If asked "Who are you?", reply: "I am the UOU Infinite Sentinel, your AI guide to the University."

FALLBACK RULE: If you genuinely do not have enough information to answer a question accurately, reply: "I am still learning the latest institutional updates. Please contact the Zaria Center Coordinator for specific details." — never fabricate facts.

CURRENT USER: ${user?.name ?? "Scholar"} | Role: ${(user as any)?.role ?? "student"} | Campus: ${(user as any)?.campus ?? "Unknown"}

FOUNDER & LEADERSHIP:
- Founder & Chancellor: Professor Christopher Imumolen
- Vision: Make world-class, NUC-accredited education accessible to every Nigerian
- Quote: "Education is the final equaliser."

UOU CENTERS (6 Nationwide):
${UOU_CENTERS.map(c => `- ${c.name} (${c.region}): ${c.role}, ${c.scholars} scholars`).join("\n")}

ACADEMIC CALENDAR (Two-Semester System):
${UOU_ACADEMIC_CALENDAR.map(e => `- ${e.period}: ${e.dates}`).join("\n")}

UOU ANNOUNCEMENTS (May 2026):
${UOU_NEWS.map((n, i) => `${i + 1}. ${n}`).join("\n")}

STUDENT WEEKLY TIMETABLE:
${UOU_TIMETABLE.map(t => `${t.day} ${t.time}: ${t.course} | ${t.venue} | ${t.lecturer}`).join("\n")}

STUDENT PERFORMANCE DATA:
- Activity log: ${log.length} events recorded
- Recent activity: ${log.slice(-5).map(a => `${a.action}: ${a.detail}`).join("; ") || "None yet"}
- Performance Ledger: ${ledger.length} keys | Gold: ${ledger.filter(e => e.tier === "GOLD").length} | Silver: ${ledger.filter(e => e.tier === "SILVER").length} | Bronze: ${ledger.filter(e => e.tier === "BRONZE").length}

INSTITUTION STATS: 104 scholars across 6 centers | 217 Gold Cards minted | 84% pass rate | NUC-accredited

PROGRAMMES OFFERED: Business Administration & Management, Entrepreneurship, AI Safety & Ethics, Digital Innovation, Constitutional Law & Governance.

Answer with precision and authority. Use markdown formatting (bold, bullets) when listing data. Keep responses concise unless enumerating structured data.`;
}

export function SentinelChat({ onActiveChange }: SentinelChatProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "assistant",
      content:
        "I am UOU Sentinel — your academic mentor and institutional intelligence. I can answer questions about your timetable, announcements, attendance, achievements, and more. Your value is increasing. How can I assist today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isFirstMessage = useRef(true);

  const createConversation = useCreateOpenaiConversation();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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

    /* Try local knowledge first */
    const localAnswer = getLocalAnswer(userMessage);
    if (localAnswer) {
      setIsStreaming(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: localAnswer,
        }]);
        setIsStreaming(false);
      }, 600);
      return;
    }

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

      /* Prepend system context to the first AI message */
      const contextualMessage = isFirstMessage.current
        ? `${buildSystemContext(user)}\n\n---\nUser question: ${userMessage}`
        : userMessage;
      isFirstMessage.current = false;

      const response = await fetch(`/api/openai/conversations/${currentConvId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ content: contextualMessage }),
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
          content: "I am still learning the latest institutional updates. Please contact the Zaria Center Coordinator for specific details.\n\n_— Sentinel_",
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
            className="fixed bottom-5 right-5 z-50"
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
            className="fixed bottom-5 right-5 w-[360px] h-[520px] rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
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
                      {isStreaming ? "Processing…" : "Online · Institutional AI"}
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
                    className="px-3 py-2 rounded-xl max-w-[82%] text-sm leading-relaxed whitespace-pre-line"
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
                    {msg.content || (
                      msg.role === "assistant" && isStreaming && (
                        <div className="flex items-center gap-1 h-4">
                          {[0, 75, 150].map(d => (
                            <div
                              key={d}
                              className="w-1 h-1 rounded-full animate-bounce"
                              style={{ background: "#3B82F6", animationDelay: `${d}ms` }}
                            />
                          ))}
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator — shown while Sentinel is composing a reply */}
              <AnimatePresence>
                {isStreaming && (
                  <motion.div
                    key="typing-indicator"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2 pl-1"
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "radial-gradient(circle, #60A5FA, #1D4ED8)" }}>
                      <Bot size={11} className="text-white" />
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
                      style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}>
                      {[0, 140, 280].map(d => (
                        <motion.div key={d}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: "#60A5FA" }}
                          animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 0.9, repeat: Infinity, delay: d / 1000, ease: "easeInOut" }}
                        />
                      ))}
                      <span className="text-[10px] ml-1 font-mono tracking-wider" style={{ color:"rgba(96,165,250,0.6)" }}>
                        Sentinel is typing…
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Quick prompts */}
            {messages.length === 1 && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                {["Timetable", "Announcements", "My attendance", "My cards"].map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => {
                      setInput(prompt);
                      setTimeout(() => {
                        const form = document.querySelector("#sentinel-form") as HTMLFormElement;
                        form?.requestSubmit();
                      }, 50);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-full transition-all hover:opacity-80"
                    style={{
                      background: "rgba(29,78,216,0.12)",
                      border: "1px solid rgba(59,130,246,0.2)",
                      color: "#93C5FD",
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div
              className="p-3 border-t"
              style={{ borderColor: "rgba(59,130,246,0.15)", background: "rgba(8,20,60,0.4)" }}
            >
              <form id="sentinel-form" onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask about timetable, news, grades…"
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
