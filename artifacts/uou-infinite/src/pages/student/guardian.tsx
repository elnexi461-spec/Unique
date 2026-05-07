import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import {
  Brain, Shield, Bell, MessageSquare, AlertTriangle, TrendingUp,
  TrendingDown, Zap, CheckCircle, Clock, Star, ChevronRight,
  Send, X, Activity, Target, BarChart3, Sparkles,
} from "lucide-react";

interface ChatMessage {
  role: "guardian" | "user";
  text: string;
  ts: number;
}

interface DiagnosticMetric {
  label: string;
  value: number;
  max: number;
  unit: string;
  status: "excellent" | "good" | "warning" | "critical";
  trend: "up" | "down" | "stable";
  insight: string;
}

const MORNING_MESSAGES = [
  "Good morning, Scholar. Sentinel has reviewed your academic trajectory overnight. Your momentum is building — today is a high-priority study window.",
  "Rise and engage. Based on your performance data, your strongest concentration window is before noon. One lecture today compounds your advantage significantly.",
  "The Sentinel has prepared your personalised academic brief. Your GPA trajectory puts you in the top 20% of your campus cohort. Maintain the standard.",
  "Good morning. Three of your peers completed lectures overnight. The gap between you and the Vanguard top 10 is 47 merit points — one Gold Card closes it.",
  "Sentinel morning report active. Your attendance streak is intact. Today's recommended focus: consolidate your weakest subject area before new content drops.",
];

const GUARDIAN_RESPONSES: Record<string, string> = {
  default: "I'm monitoring your academic progress across all dimensions. Your current trajectory suggests steady advancement. What specific area would you like to interrogate?",
  gpa: "Your GPA sits at 3.85 — placing you in the 92nd percentile of the Zaria cohort. The delta between your current standing and a 4.0 requires consistent Gold Card performance across 2 more courses. The path is clear.",
  merit: "Your Merit Score of 924 is composed of Gold Cards (×100), GPA (×50), and Punctuality (×2). The highest-leverage action is earning your next Gold Card — it adds 100 points instantly and compounds your Vanguard ranking.",
  attendance: "Attendance data shows 94% punctuality over the current semester — well above the 85% institutional threshold. One absence in the next 3 weeks would not materially affect your standing. Maintain the pattern.",
  exam: "Your assessment pass rate stands at 71%. The Sentinel identifies a pattern: you tend to underperform on the first attempt of quantitative modules. The Remedial Bridge is available as a preparation tool — use it proactively, not reactively.",
  help: "I can provide diagnostics on your GPA trajectory, merit score composition, attendance analysis, exam performance patterns, and personalised study recommendations. What would you like to examine?",
  stress: "The Sentinel does not measure stress directly, but correlated indicators — late-night session frequency, retry rates — suggest elevated cognitive load. Recommendation: space your sessions across the week rather than compressing into single days.",
  schedule: "Based on your timetable and historical performance, Tuesday and Thursday mornings are your highest-output study windows. Your next scheduled lecture is BAM-111. Completing it this week keeps you ahead of the cohort average.",
};

function getGuardianResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("gpa") || lower.includes("grade")) return GUARDIAN_RESPONSES.gpa!;
  if (lower.includes("merit") || lower.includes("score") || lower.includes("point")) return GUARDIAN_RESPONSES.merit!;
  if (lower.includes("attend") || lower.includes("punctual")) return GUARDIAN_RESPONSES.attendance!;
  if (lower.includes("exam") || lower.includes("quiz") || lower.includes("test") || lower.includes("assessment")) return GUARDIAN_RESPONSES.exam!;
  if (lower.includes("stress") || lower.includes("tired") || lower.includes("overwhelm")) return GUARDIAN_RESPONSES.stress!;
  if (lower.includes("schedule") || lower.includes("timetable") || lower.includes("when")) return GUARDIAN_RESPONSES.schedule!;
  if (lower.includes("help") || lower.includes("what") || lower.includes("how")) return GUARDIAN_RESPONSES.help!;
  return GUARDIAN_RESPONSES.default!;
}

const DIAGNOSTICS: DiagnosticMetric[] = [
  { label: "GPA",            value: 3.85, max: 4.0,  unit: "",   status: "excellent", trend: "up",     insight: "Top 8% of cohort — Gold Card velocity is key" },
  { label: "Merit Score",    value: 924,  max: 1000, unit: "pts",status: "excellent", trend: "up",     insight: "1 Gold Card = +100 pts — 76 pts to reach #3 Vanguard" },
  { label: "Punctuality",    value: 94,   max: 100,  unit: "%",  status: "excellent", trend: "stable", insight: "Above 85% threshold — Sentinel awards punctuality bonus" },
  { label: "Pass Rate",      value: 71,   max: 100,  unit: "%",  status: "warning",   trend: "up",     insight: "Improving — use Remedial Bridge before first attempts" },
  { label: "Course Progress",value: 60,   max: 100,  unit: "%",  status: "good",      trend: "up",     insight: "3 of 5 core courses accessed — BAM-111 next" },
  { label: "Engagement",     value: 87,   max: 100,  unit: "%",  status: "good",      trend: "stable", insight: "Strong session depth — above campus median" },
];

const STATUS_COLOR: Record<string, string> = {
  excellent: "#10B981",
  good:      "#0070FF",
  warning:   "#F59E0B",
  critical:  "#EF4444",
};

function DiagnosticBar({ metric, index }: { metric: DiagnosticMetric; index: number }) {
  const pct = (metric.value / metric.max) * 100;
  const color = STATUS_COLOR[metric.status]!;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="rounded-xl border p-4 space-y-3"
      style={{ background: "rgba(4,10,36,0.7)", borderColor: "rgba(0,112,255,0.15)" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">{metric.label}</span>
        <div className="flex items-center gap-1.5">
          {metric.trend === "up" && <TrendingUp size={12} style={{ color: "#10B981" }} />}
          {metric.trend === "down" && <TrendingDown size={12} style={{ color: "#EF4444" }} />}
          {metric.trend === "stable" && <Activity size={12} style={{ color: "#60A5FA" }} />}
          <span className="text-sm font-black tabular-nums" style={{ color }}>
            {metric.value}{metric.unit}
          </span>
        </div>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}80, ${color})`, boxShadow: `0 0 8px ${color}60` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: index * 0.07 + 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{metric.insight}</p>
    </motion.div>
  );
}

export default function VanguardGuardian() {
  const { user } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [notifications, setNotifications] = useState<{ id: number; msg: string; read: boolean }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const studentName = user?.name || "Scholar";
  const morningMsg = MORNING_MESSAGES[Math.floor(Date.now() / 86400000) % MORNING_MESSAGES.length]!;

  useEffect(() => {
    const stored = localStorage.getItem("uou_guardian_notifs");
    if (stored) {
      setNotifications(JSON.parse(stored));
    } else {
      const initial = [
        { id: 1, msg: "Sentinel detected: BAM-111 is your next recommended course based on your department curriculum.", read: false },
        { id: 2, msg: "Your Merit Score increased by 8 points since last week. Vanguard rank #4 is within reach.", read: false },
        { id: 3, msg: "Reminder: Week 19 timetable releases Friday. Two of your courses have scheduled assessments.", read: false },
        { id: 4, msg: "Gold Card milestone approaching — your next completion awards bonus Vanguard standing.", read: false },
      ];
      setNotifications(initial);
      localStorage.setItem("uou_guardian_notifs", JSON.stringify(initial));
    }
  }, []);

  useEffect(() => {
    if (chatOpen && chatMessages.length === 0) {
      setChatMessages([{
        role: "guardian",
        text: `${studentName}, I am your Vanguard Guardian — a dedicated AI module monitoring your academic trajectory. I have analysed your performance across all active dimensions. How can I assist you today?`,
        ts: Date.now(),
      }]);
    }
  }, [chatOpen, chatMessages.length, studentName]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  const sendMessage = () => {
    const text = inputVal.trim();
    if (!text) return;
    const userMsg: ChatMessage = { role: "user", text, ts: Date.now() };
    setChatMessages(prev => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);
    setTimeout(() => {
      const response = getGuardianResponse(text);
      setChatMessages(prev => [...prev, { role: "guardian", text: response, ts: Date.now() }]);
      setIsTyping(false);
    }, 1200 + Math.random() * 600);
  };

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem("uou_guardian_notifs", JSON.stringify(updated));
  };

  const triggerSOS = () => {
    setSosActive(true);
    setTimeout(() => setSosActive(false), 4000);
  };

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 pb-10">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0"
            style={{ background: "rgba(0,112,255,0.12)", borderColor: "rgba(0,112,255,0.3)" }}>
            <Brain size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Vanguard Guardian</h1>
            <p className="text-muted-foreground text-sm">AI-powered academic intelligence · Personal sentinel for {studentName}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-mono"
              style={{ background: "rgba(0,112,255,0.08)", borderColor: "rgba(0,112,255,0.2)", color: "#60A5FA" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
              GUARDIAN ACTIVE
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Morning Notification Banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border overflow-hidden relative"
        style={{ background: "rgba(0,16,64,0.85)", borderColor: "rgba(0,112,255,0.3)" }}
      >
        <div className="h-0.5 w-full"
          style={{ background: "linear-gradient(90deg, rgba(0,112,255,0), #0070FF 50%, rgba(0,112,255,0))" }} />
        <motion.div
          animate={{ opacity: [0.04, 0.12, 0.04] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(0,112,255,0.2), transparent 60%)" }}
        />
        <div className="px-6 py-4 relative z-10 flex items-start gap-4">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          >
            <Sparkles size={20} style={{ color: "#0070FF" }} />
          </motion.div>
          <div>
            <div className="text-[10px] font-bold tracking-[0.3em] uppercase mb-1" style={{ color: "rgba(0,112,255,0.8)" }}>
              Sentinel Morning Brief
            </div>
            <p className="text-sm text-foreground leading-relaxed">{morningMsg}</p>
          </div>
        </div>
      </motion.div>

      {/* 3-column action row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Chat button */}
        <motion.button
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => setChatOpen(true)}
          className="rounded-2xl border p-5 text-left relative overflow-hidden group"
          style={{ background: "rgba(0,16,64,0.8)", borderColor: "rgba(0,112,255,0.25)" }}
        >
          <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,112,255,0.12), transparent 70%)" }} />
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border mb-3 shrink-0"
            style={{ background: "rgba(0,112,255,0.12)", borderColor: "rgba(0,112,255,0.3)" }}>
            <MessageSquare size={18} className="text-primary" />
          </div>
          <div className="font-bold text-foreground text-sm mb-1">Private AI Chat</div>
          <div className="text-xs text-muted-foreground leading-relaxed">Discuss your performance with the Guardian in a confidential session</div>
          <ChevronRight size={14} className="absolute top-5 right-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </motion.button>

        {/* Notifications */}
        <motion.button
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={markAllRead}
          className="rounded-2xl border p-5 text-left relative overflow-hidden group"
          style={{ background: "rgba(0,16,64,0.8)", borderColor: unread > 0 ? "rgba(245,158,11,0.35)" : "rgba(0,112,255,0.25)" }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border mb-3 relative shrink-0"
            style={{ background: "rgba(245,158,11,0.1)", borderColor: "rgba(245,158,11,0.3)" }}>
            <Bell size={18} style={{ color: "#F59E0B" }} />
            {unread > 0 && (
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black"
                style={{ background: "#F59E0B", color: "#040B1A" }}
              >{unread}</motion.span>
            )}
          </div>
          <div className="font-bold text-foreground text-sm mb-1">Smart Notifications</div>
          <div className="text-xs text-muted-foreground leading-relaxed">
            {unread > 0 ? `${unread} unread Sentinel alerts — tap to clear` : "All notifications read"}
          </div>
          <ChevronRight size={14} className="absolute top-5 right-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </motion.button>

        {/* SOS Button */}
        <motion.button
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}
          onClick={triggerSOS}
          disabled={sosActive}
          className="rounded-2xl border p-5 text-left relative overflow-hidden"
          style={{
            background: sosActive ? "rgba(239,68,68,0.12)" : "rgba(0,16,64,0.8)",
            borderColor: sosActive ? "rgba(239,68,68,0.5)" : "rgba(239,68,68,0.25)",
          }}
        >
          <AnimatePresence>
            {sosActive && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(239,68,68,0.12), transparent 70%)" }}
              />
            )}
          </AnimatePresence>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border mb-3 shrink-0"
            style={{ background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.3)" }}>
            <motion.div animate={sosActive ? { scale: [1, 1.3, 1], opacity: [1, 0.5, 1] } : {}} transition={{ duration: 0.6, repeat: sosActive ? Infinity : 0 }}>
              <AlertTriangle size={18} style={{ color: "#EF4444" }} />
            </motion.div>
          </div>
          <div className="font-bold text-foreground text-sm mb-1">
            {sosActive ? "SOS Signal Sent" : "Academic SOS"}
          </div>
          <div className="text-xs text-muted-foreground leading-relaxed">
            {sosActive ? "Guardian has alerted your coordinator — you will be contacted shortly" : "Flag an academic emergency to escalate to your coordinator instantly"}
          </div>
        </motion.button>
      </div>

      {/* Notification list */}
      <AnimatePresence>
        {notifications.some(n => !n.read) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="rounded-2xl border overflow-hidden"
            style={{ background: "rgba(4,10,36,0.8)", borderColor: "rgba(245,158,11,0.2)" }}
          >
            <div className="px-5 py-3 border-b flex items-center justify-between"
              style={{ borderColor: "rgba(245,158,11,0.15)" }}>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: "#F59E0B" }}>
                <Bell size={12} /> Active Alerts
              </div>
              <button onClick={markAllRead} className="text-[10px] text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider">
                Mark all read
              </button>
            </div>
            <div className="p-4 space-y-2">
              {notifications.filter(n => !n.read).map((n, i) => (
                <motion.div key={n.id}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-3 p-3 rounded-xl border"
                  style={{ background: "rgba(245,158,11,0.05)", borderColor: "rgba(245,158,11,0.12)" }}
                >
                  <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: "#F59E0B" }} />
                  <p className="text-xs text-foreground leading-relaxed flex-1">{n.msg}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Performance Diagnostics */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={16} className="text-primary" />
          <h2 className="text-base font-bold text-foreground">Performance Diagnostics</h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border ml-auto"
            style={{ background: "rgba(0,112,255,0.08)", borderColor: "rgba(0,112,255,0.2)", color: "#60A5FA" }}>
            LIVE · WEEK 19
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DIAGNOSTICS.map((m, i) => (
            <DiagnosticBar key={m.label} metric={m} index={i} />
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border overflow-hidden"
        style={{ background: "rgba(4,10,36,0.8)", borderColor: "rgba(0,112,255,0.2)" }}
      >
        <div className="px-5 py-3 border-b flex items-center gap-2"
          style={{ borderColor: "rgba(0,112,255,0.12)" }}>
          <Target size={14} className="text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Guardian Priority Actions</span>
        </div>
        <div className="p-5 space-y-3">
          {[
            { icon: Star, color: "#F59E0B", label: "Complete BAM-111 this week", desc: "Next in your Business & Entrepreneurship curriculum — highest current ROI for Vanguard ranking" },
            { icon: TrendingUp, color: "#10B981", label: "Raise assessment pass rate to 80%", desc: "Use Remedial Bridge before next quiz attempt — 3 prep sessions closes the gap" },
            { icon: Zap, color: "#0070FF", label: "Maintain attendance streak", desc: "You are 3 sessions from a Sentinel Punctuality Bonus (+15 merit points)" },
            { icon: CheckCircle, color: "#A78BFA", label: "Review Credential Passport", desc: "Your cryptographic proofs are current — share with prospective employers via QR scan" },
          ].map((action, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 + i * 0.07 }}
              className="flex items-start gap-3 p-3 rounded-xl border group"
              style={{ background: "rgba(0,112,255,0.04)", borderColor: "rgba(0,112,255,0.1)" }}
              whileHover={{ borderColor: "rgba(0,112,255,0.25)", background: "rgba(0,112,255,0.07)" }}
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border mt-0.5"
                style={{ background: `${action.color}18`, borderColor: `${action.color}30` }}>
                <action.icon size={13} style={{ color: action.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-foreground mb-0.5">{action.label}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{action.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Private Chat Panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 bottom-4 md:inset-x-auto md:right-6 md:bottom-6 md:w-[420px] z-50 rounded-2xl border overflow-hidden flex flex-col"
            style={{
              background: "rgba(4,10,36,0.97)",
              borderColor: "rgba(0,112,255,0.3)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,112,255,0.1)",
              maxHeight: "72vh",
            }}
          >
            {/* Chat header */}
            <div className="px-5 py-3 border-b flex items-center gap-3 shrink-0"
              style={{ borderColor: "rgba(0,112,255,0.15)" }}>
              <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full shrink-0" style={{ background: "#0070FF" }} />
              <Brain size={14} className="text-primary shrink-0" />
              <span className="text-sm font-bold text-foreground flex-1">Vanguard Guardian · Private Session</span>
              <button onClick={() => setChatOpen(false)} className="p-1 text-muted-foreground hover:text-white transition-colors">
                <X size={15} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0" style={{ maxHeight: "calc(72vh - 120px)" }}>
              {chatMessages.map((msg, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed"
                    style={msg.role === "guardian" ? {
                      background: "rgba(0,112,255,0.1)",
                      borderColor: "rgba(0,112,255,0.2)",
                      border: "1px solid",
                      color: "#E0F0FF",
                      borderRadius: "4px 16px 16px 16px",
                    } : {
                      background: "linear-gradient(135deg, #0040C0, #0070FF)",
                      color: "white",
                      borderRadius: "16px 4px 16px 16px",
                    }}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="px-4 py-2.5 rounded-2xl border flex items-center gap-1.5"
                    style={{ background: "rgba(0,112,255,0.08)", borderColor: "rgba(0,112,255,0.2)" }}>
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "#60A5FA" }}
                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t shrink-0" style={{ borderColor: "rgba(0,112,255,0.15)" }}>
              <div className="flex items-center gap-2">
                <input
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                  placeholder="Ask the Guardian anything…"
                  className="flex-1 px-4 py-2 rounded-xl text-xs outline-none"
                  style={{
                    background: "rgba(0,112,255,0.06)",
                    border: "1px solid rgba(0,112,255,0.2)",
                    color: "white",
                  }}
                />
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={sendMessage}
                  disabled={!inputVal.trim() || isTyping}
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-40"
                  style={{ background: "linear-gradient(135deg, #0040C0, #0070FF)" }}
                >
                  <Send size={14} className="text-white" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
