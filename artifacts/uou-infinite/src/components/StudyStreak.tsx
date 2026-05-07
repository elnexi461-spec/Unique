import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Zap } from "lucide-react";

const STREAK_KEY = "uou_login_dates";
const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

interface StreakData {
  streak: number;
  weekDays: boolean[];
  longestEver: number;
}

function computeStreak(): StreakData {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    const dates: string[] = raw ? JSON.parse(raw) : [];
    const today = new Date().toISOString().slice(0, 10);

    if (!dates.includes(today)) {
      dates.unshift(today);
      localStorage.setItem(STREAK_KEY, JSON.stringify(dates.slice(0, 365)));
    }

    let streak = 0;
    const cursor = new Date();
    while (true) {
      const ds = cursor.toISOString().slice(0, 10);
      if (dates.includes(ds)) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }

    const monday = new Date();
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      return dates.includes(d.toISOString().slice(0, 10));
    });

    const longestKey = "uou_longest_streak";
    const prev = parseInt(localStorage.getItem(longestKey) || "0", 10);
    const longest = Math.max(prev, streak);
    localStorage.setItem(longestKey, String(longest));

    return { streak, weekDays, longestEver: longest };
  } catch {
    return { streak: 1, weekDays: [true, false, false, false, false, false, false], longestEver: 1 };
  }
}

function flameSize(streak: number) {
  if (streak >= 21) return { scale: 1.35, color: "#F59E0B", glow: "#F59E0B" };
  if (streak >= 14) return { scale: 1.2,  color: "#FB923C", glow: "#FB923C" };
  if (streak >= 7)  return { scale: 1.08, color: "#F97316", glow: "#F97316" };
  return { scale: 1,    color: "#0070FF", glow: "#0070FF" };
}

function message(streak: number) {
  if (streak >= 30) return "Unstoppable. You are Vanguard.";
  if (streak >= 21) return "21-day mastery arc activated.";
  if (streak >= 14) return "Two weeks of excellence.";
  if (streak >= 7)  return "Consistency unlocked. Keep climbing.";
  if (streak >= 3)  return "Building momentum, Scholar.";
  return "Day 1. The journey starts here.";
}

interface StudyStreakProps {
  compact?: boolean;
}

export function StudyStreak({ compact = false }: StudyStreakProps) {
  const [data, setData] = useState<StreakData>({ streak: 0, weekDays: Array(7).fill(false), longestEver: 0 });

  useEffect(() => {
    setData(computeStreak());
  }, []);

  const flame = flameSize(data.streak);

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
        style={{ background: "rgba(0,112,255,0.06)" }}>
        <motion.div
          animate={{ scale: [1, flame.scale * 1.08, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Flame size={13} style={{ color: flame.color }} />
        </motion.div>
        <span className="text-[10px] font-bold font-mono" style={{ color: flame.color }}>
          {data.streak}d
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border p-4"
      style={{ background: "rgba(4,11,26,0.65)", borderColor: "rgba(0,112,255,0.18)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, flame.scale * 1.12, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ filter: `drop-shadow(0 0 6px ${flame.glow})` }}
          >
            <Flame size={20} style={{ color: flame.color }} />
          </motion.div>
          <div>
            <div className="text-sm font-bold text-white">Study Streak</div>
            <div className="text-[10px]" style={{ color: "rgba(148,163,184,0.6)" }}>
              Best: {data.longestEver} days
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black" style={{ color: flame.color }}>
            {data.streak}
          </div>
          <div className="text-[9px] font-mono uppercase tracking-wider" style={{ color: "rgba(148,163,184,0.5)" }}>
            days
          </div>
        </div>
      </div>

      {/* Week indicator */}
      <div className="flex items-center gap-1 mb-3">
        {data.weekDays.map((active, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
            <motion.div
              animate={active ? { boxShadow: [`0 0 4px ${flame.color}60`, `0 0 8px ${flame.color}90`, `0 0 4px ${flame.color}60`] } : {}}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="w-full h-1.5 rounded-full"
              style={{
                background: active
                  ? `linear-gradient(90deg, ${flame.color}cc, ${flame.color})`
                  : "rgba(255,255,255,0.07)",
              }}
            />
            <span className="text-[8px] font-mono" style={{ color: "rgba(148,163,184,0.4)" }}>
              {DAY_LABELS[i]}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1.5">
        <Zap size={10} style={{ color: flame.color }} />
        <span className="text-[10px] italic" style={{ color: "rgba(148,163,184,0.7)" }}>
          {message(data.streak)}
        </span>
      </div>
    </motion.div>
  );
}
