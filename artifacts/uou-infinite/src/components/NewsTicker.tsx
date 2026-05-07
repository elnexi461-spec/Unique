import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Radio } from "lucide-react";

const HEADLINES = [
  "🎓  ₦50M SCHOLARSHIP FUND OPEN — Top scholars across Zaria, Lagos & Kano campuses invited to apply · Deadline: Week 20",
  "🏆  AKETI BOWL 2 LAUNCHED — Inter-campus academic championship opens at UOU Zaria Center · All disciplines competing",
  "🤝  NAFA PARTNERSHIP SIGNED — Exclusive industry placements secured for the entire graduating cohort · 2026 priority intake",
  "📡  SENTINEL AI UPGRADED — UOU institutional intelligence now processes 12,000 academic events per second",
  "🌍  UOU RANKED #1 — Nigeria's most innovative open university for the third consecutive quarter · EduTech Africa 2026",
  "🏅  GRADUATION CONFIRMED — 38 scholars cleared for convocation ceremony at Abuja National Convention Centre",
];

const TICKER_TEXT = HEADLINES.join("    ·    ◆    ·    ");

export function NewsTicker() {
  const [location] = useLocation();

  const hidden =
    location.startsWith("/student/lecture") ||
    location === "/" ||
    location === "/login" ||
    location === "/register" ||
    location === "/demo-persona";

  if (hidden) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[200] overflow-hidden select-none"
      style={{
        background: "#020617",
        borderTop: "1px solid rgba(59,130,246,0.18)",
        height: 30,
      }}
    >
      <div className="flex items-center h-full">
        {/* Label badge */}
        <div
          className="shrink-0 flex items-center gap-1.5 px-3 h-full border-r"
          style={{
            background: "linear-gradient(90deg, rgba(29,78,216,0.25), rgba(59,130,246,0.1))",
            borderColor: "rgba(59,130,246,0.28)",
          }}
        >
          <motion.div
            animate={{ opacity: [1, 0.25, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: "#3B82F6" }}
          />
          <Radio size={10} style={{ color: "#60A5FA" }} />
          <span
            className="text-[9px] font-bold uppercase tracking-[0.22em] hidden sm:block"
            style={{ color: "#60A5FA" }}
          >
            Live
          </span>
        </div>

        {/* Marquee */}
        <div className="overflow-hidden flex-1 h-full flex items-center">
          <motion.div
            className="flex whitespace-nowrap text-[11px] font-medium"
            style={{ color: "rgba(147,197,253,0.82)" }}
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 55,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            <span className="pr-16">{TICKER_TEXT}&nbsp;&nbsp;&nbsp;&nbsp;{TICKER_TEXT}</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
