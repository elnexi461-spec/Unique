import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface Announcement {
  id: number;
  title: string;
  body: string;
  priority: string;
  authorName: string;
  createdAt: string;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function AnnouncementTicker() {
  const { user, token } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!user || !token) return;

    // Fetch existing announcements
    fetch(`${BASE}/api/announcements`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => Array.isArray(data) && setAnnouncements(data))
      .catch(() => {});

    // SSE stream for real-time
    const es = new EventSource(`${BASE}/api/announcements/stream`, );
    esRef.current = es;

    es.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data);
        if (payload.type === "new_announcement" && payload.announcement) {
          setAnnouncements(prev => [payload.announcement, ...prev]);
          setDismissed(false);
          setCurrentIdx(0);
        }
      } catch {}
    };

    return () => es.close();
  }, [user, token]);

  // Rotate announcements every 6s
  useEffect(() => {
    if (announcements.length <= 1) return;
    const t = setInterval(() => {
      setCurrentIdx(i => (i + 1) % announcements.length);
    }, 6000);
    return () => clearInterval(t);
  }, [announcements.length]);

  if (!user || dismissed || announcements.length === 0) return null;

  const current = announcements[currentIdx];
  if (!current) return null;

  const isBreaking = current.priority === "breaking" || current.priority === "urgent";

  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -60, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="fixed top-0 left-0 right-0 z-[100] flex items-center gap-3 px-4 py-2.5 text-sm font-medium"
      style={{
        background: isBreaking
          ? "linear-gradient(90deg, rgba(220,38,38,0.95), rgba(185,28,28,0.95))"
          : "linear-gradient(90deg, rgba(10,25,47,0.97), rgba(15,35,65,0.97))",
        borderBottom: isBreaking ? "1px solid rgba(248,113,113,0.4)" : "1px solid rgba(100,255,218,0.2)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-center gap-2 shrink-0">
        <Megaphone
          size={14}
          className={isBreaking ? "text-red-300 animate-pulse" : "text-primary"}
        />
        <span
          className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded"
          style={{
            background: isBreaking ? "rgba(248,113,113,0.2)" : "rgba(100,255,218,0.15)",
            color: isBreaking ? "#fca5a5" : "#64FFDA",
          }}
        >
          {isBreaking ? "BREAKING" : "NOTICE"}
        </span>
      </div>

      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <span className="font-semibold text-white truncate">{current.title}:</span>
            <span className="text-white/70 truncate">{current.body}</span>
            {announcements.length > 1 && (
              <span className="text-white/40 text-xs shrink-0">
                {currentIdx + 1}/{announcements.length}
              </span>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 text-white/40 hover:text-white/80 transition-colors p-1"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}
