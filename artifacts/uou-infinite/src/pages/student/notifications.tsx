import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Bell, CheckCheck, Zap, Award, BookOpen, AlertTriangle, Info, X } from "lucide-react";
import { useLocation } from "wouter";
import { PageTransition } from "@/components/PageTransition";

interface Notification {
  id: number;
  type: "achievement" | "urgent" | "info" | "ai" | "course";
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1,  type: "achievement", title: "Gold Card Minted",                   body: "You earned a Gold Card for ENT-101 · Principles of Entrepreneurship. Score: 92%. Cryptographic key saved to your vault.",                        time: "2 hours ago",     read: false },
  { id: 2,  type: "urgent",      title: "Fee Payment Due in 7 Days",          body: "Your semester 2 tuition balance of ₦85,000 is due by May 15, 2026. Late payments attract a 5% surcharge. Visit Fee Status to pay.",          time: "5 hours ago",     read: false },
  { id: 3,  type: "ai",          title: "Sentinel AI: Attendance Alert",       body: "Your punctuality score has dropped to 78%. Maintain at least 80% to remain eligible for the Gold Card ceremony in Week 24.",                   time: "Yesterday",       read: false },
  { id: 4,  type: "course",      title: "New Content Available: AI-201",       body: "Professor Imumolen has uploaded supplementary materials for AI Safety & Ethics. The reading list has been updated for Week 19.",                 time: "Yesterday",       read: true  },
  { id: 5,  type: "info",        title: "Timetable Change — Lecture Hall 3B", body: "DIG-301 Digital Innovation Lab has been moved from Hall 3A to Hall 3B effective Week 19. Please update your schedule accordingly.",            time: "2 days ago",      read: true  },
  { id: 6,  type: "achievement", title: "Vanguard Leaderboard — Rank #4",     body: "Your merit score of 924 places you at Rank #4 on the Vanguard Leaderboard this week. The top 3 positions are within reach.",                  time: "3 days ago",      read: true  },
  { id: 7,  type: "urgent",      title: "Scholarship Application Open",        body: "The ₦50M UOU Scholarship Fund is now accepting applications. Eligibility: GPA ≥ 3.5 and ≥ 5 Gold Cards. Deadline: June 9, 2026.",            time: "4 days ago",      read: true  },
  { id: 8,  type: "info",        title: "Library System Maintenance",          body: "The digital library portal will be unavailable from 2:00 AM – 6:00 AM on May 16 due to scheduled database maintenance.",                       time: "5 days ago",      read: true  },
  { id: 9,  type: "course",      title: "Assignment Graded: ENT-101",          body: "Your Week 16 assignment has been graded. Score: 87/100. Detailed feedback is available in your Grades & GPA section.",                         time: "1 week ago",      read: true  },
  { id: 10, type: "ai",          title: "Sentinel Insight: Study Pattern",     body: "Your peak performance window is Tuesday–Thursday 9AM–12PM. Scheduling assessments in this window increases your pass rate by an estimated 18%.", time: "1 week ago",      read: true  },
];

// All types use Electric Blue palette — no purple/teal
const TYPE_CONFIG = {
  achievement: { icon: Award,         color: "#F59E0B", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.25)"  },
  urgent:      { icon: AlertTriangle, color: "#F87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)" },
  info:        { icon: Info,          color: "#0070FF", bg: "rgba(0,112,255,0.07)",   border: "rgba(0,112,255,0.2)"    },
  ai:          { icon: Zap,           color: "#34D399", bg: "rgba(52,211,153,0.07)",  border: "rgba(52,211,153,0.22)"  },
  course:      { icon: BookOpen,      color: "#0070FF", bg: "rgba(0,112,255,0.07)",   border: "rgba(0,112,255,0.2)"    },
};

export default function Notifications() {
  const [, setLocation] = useLocation();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter(n => !n.read).length;
  const displayed   = filter === "unread" ? notifications.filter(n => !n.read) : notifications;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const dismiss     = (id: number) => setNotifications(prev => prev.filter(n => n.id !== id));
  const markRead    = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <PageTransition>
      <div className="space-y-6 pb-8">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ x: -2, scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => setLocation("/student")}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border"
            style={{ background: "rgba(4,11,26,0.6)", borderColor: "rgba(0,112,255,0.25)", color: "rgba(100,160,255,0.9)", backdropFilter: "blur(12px)" }}
          >
            <ArrowLeft size={14} /> Back to Portal
          </motion.button>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center border relative"
                style={{ background: "rgba(0,112,255,0.1)", borderColor: "rgba(0,112,255,0.3)" }}>
                <Bell size={18} style={{ color: "#0070FF" }} />
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black"
                    style={{ background: "#F87171", color: "white" }}>
                    {unreadCount}
                  </motion.div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Notifications</h1>
                <p className="text-muted-foreground text-sm">{unreadCount} unread · {notifications.length} total</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={markAllRead}
              className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg border"
              style={{ background: "rgba(0,112,255,0.08)", borderColor: "rgba(0,112,255,0.25)", color: "#0070FF" }}
            >
              <CheckCheck size={13} /> Mark all read
            </motion.button>
          </div>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {(["all", "unread"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold border capitalize transition-all"
              style={{
                background:  filter === f ? "rgba(0,112,255,0.15)" : "transparent",
                borderColor: filter === f ? "rgba(0,112,255,0.4)"  : "rgba(255,255,255,0.08)",
                color:       filter === f ? "#0070FF"               : "rgba(148,163,184,0.7)",
              }}>
              {f} {f === "unread" && unreadCount > 0 && `(${unreadCount})`}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div className="space-y-3">
          <AnimatePresence>
            {displayed.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-20 text-muted-foreground">
                <Bell size={32} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm">No unread notifications</p>
              </motion.div>
            ) : (
              displayed.map((n, i) => {
                const cfg  = TYPE_CONFIG[n.type];
                const Icon = cfg.icon;
                return (
                  <motion.div
                    key={n.id}
                    layout
                    initial={{ opacity: 0, y: 12, filter: "blur(3px)" }}
                    animate={{ opacity: 1, y: 0,  filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: 40, height: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    className="rounded-2xl border p-4 relative overflow-hidden cursor-pointer group"
                    style={{
                      background:  n.read ? "rgba(4,11,26,0.55)" : cfg.bg,
                      borderColor: n.read ? "rgba(0,112,255,0.1)"  : cfg.border,
                      opacity:     n.read ? 0.75 : 1,
                    }}
                    onClick={() => markRead(n.id)}
                  >
                    {/* Unread pulse dot */}
                    {!n.read && (
                      <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute top-4 right-10 w-2 h-2 rounded-full"
                        style={{ background: cfg.color, boxShadow: `0 0 8px ${cfg.color}` }}
                      />
                    )}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
                        style={{ background: `${cfg.color}15`, borderColor: `${cfg.color}30` }}>
                        <Icon size={14} style={{ color: cfg.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-foreground mb-0.5">{n.title}</div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{n.body}</p>
                        <div className="text-[10px] font-mono text-muted-foreground/50 mt-2">{n.time}</div>
                      </div>
                      <button onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-white p-1 shrink-0">
                        <X size={12} />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
