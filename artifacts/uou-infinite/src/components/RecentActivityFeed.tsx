import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, BookOpen, Award, Upload, MousePointerClick, LogIn, Zap } from "lucide-react";
import { UserActivityService, type ActivityEntry } from "@/lib/UserActivityService";

const TYPE_META: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  lecture_view:   { icon: BookOpen,         color: "#60A5FA", label: "Lecture Viewed" },
  slide_view:     { icon: BookOpen,         color: "#60A5FA", label: "Slides Completed" },
  video_progress: { icon: Zap,              color: "#A78BFA", label: "Video Progress" },
  pdf_upload:     { icon: Upload,           color: "#34D399", label: "PDF Upload" },
  quiz_complete:  { icon: Activity,         color: "#F59E0B", label: "Quiz Completed" },
  gold_card_mint: { icon: Award,            color: "#F59E0B", label: "Gold Card Minted" },
  button_click:   { icon: MousePointerClick,color: "#60A5FA", label: "Action" },
  page_visit:     { icon: Activity,         color: "#6B7280", label: "Page Visit" },
  login:          { icon: LogIn,            color: "#34D399", label: "Login" },
  logout:         { icon: LogIn,            color: "#F87171", label: "Logout" },
};

interface RecentActivityFeedProps {
  email?: string;
  maxItems?: number;
  title?: string;
  showRole?: boolean;
}

export function RecentActivityFeed({
  email,
  maxItems = 8,
  title = "Recent Activity",
  showRole = false,
}: RecentActivityFeedProps) {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);

  useEffect(() => {
    const refresh = () => {
      const all = email
        ? UserActivityService.getForEmail(email)
        : UserActivityService.getAll();
      setEntries(all.slice(0, maxItems));
    };
    refresh();
    const interval = setInterval(refresh, 3000);
    return () => clearInterval(interval);
  }, [email, maxItems]);

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ background: "rgba(4,11,36,0.88)", borderColor: "rgba(59,130,246,0.22)" }}
    >
      <div
        className="px-5 py-3.5 border-b flex items-center gap-3"
        style={{ borderColor: "rgba(59,130,246,0.15)", background: "rgba(8,18,50,0.5)" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.3)" }}
        >
          <Activity size={14} className="text-primary" />
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-bold tracking-[0.25em] uppercase mb-0.5"
            style={{ color: "rgba(96,165,250,0.7)" }}>
            Institutional Ledger
          </div>
          <div className="font-black text-white text-sm">{title}</div>
        </div>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "#3B82F6", boxShadow: "0 0 6px #3B82F6" }}
        />
      </div>

      <div className="divide-y" style={{ borderColor: "rgba(59,130,246,0.08)" }}>
        {entries.length === 0 ? (
          <div className="py-10 text-center">
            <Activity size={28} className="mx-auto text-muted-foreground/20 mb-3" />
            <p className="text-xs text-muted-foreground">No activity recorded yet.</p>
            <p className="text-[10px] text-muted-foreground/50 mt-1">
              Actions you take will appear here in real time.
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {entries.map((entry, i) => {
              const meta = TYPE_META[entry.type] ?? TYPE_META.button_click;
              const Icon = meta.icon;
              const time = new Date(entry.timestamp).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-start gap-3 px-5 py-3 hover:bg-white/[0.015] transition-colors"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}30` }}
                  >
                    <Icon size={13} style={{ color: meta.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-relaxed line-clamp-2">
                      {entry.label}
                    </p>
                    {showRole && (
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded mt-0.5 inline-block"
                        style={{
                          background: "rgba(59,130,246,0.1)",
                          color: "#60A5FA",
                          border: "1px solid rgba(59,130,246,0.2)",
                        }}
                      >
                        {entry.role}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground shrink-0 mt-0.5">
                    {time}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {entries.length > 0 && (
        <div
          className="px-5 py-2.5 border-t text-center"
          style={{ borderColor: "rgba(59,130,246,0.1)", background: "rgba(4,11,36,0.5)" }}
        >
          <span className="text-[10px] font-mono text-muted-foreground">
            {entries.length} events · synced to ledger
          </span>
        </div>
      )}
    </div>
  );
}
