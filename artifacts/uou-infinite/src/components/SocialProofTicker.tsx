import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Award, MapPin } from "lucide-react";
import { MOCK_STUDENTS } from "@/data/mockDatabase";

const COURSE_NAMES = ["ENT-101", "AI-201", "DIG-301", "LAW-201", "HSM-301"];

function buildEventPool(): string[] {
  const pool: string[] = [];
  const top20 = MOCK_STUDENTS.slice(0, 20);
  for (let i = 0; i < top20.length; i++) {
    const s    = top20[i]!;
    const fn   = s.name.split(" ")[0]!;
    const course = COURSE_NAMES[i % COURSE_NAMES.length]!;
    pool.push(`Scholar ${fn} just minted a ${course} Gold Card in ${s.campus} Center!`);
  }
  pool.push("Zaria Center has reached 96% Punctuality today!");
  pool.push("Lagos Center is leading with 18 Gold Cards this week!");
  pool.push("Kano Center scholars are showing 94% engagement rate!");
  pool.push("ENT-101 had the highest pass rate across all campuses this week!");
  pool.push("3 new scholars achieved Perfect Vanguard Score today!");
  return pool;
}

const EVENT_POOL = buildEventPool();

export function SocialProofTicker() {
  const [visible, setVisible] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);

  const showMsg = (idx: number) => {
    setMsgIdx(idx);
    setVisible(true);
    setTimeout(() => setVisible(false), 5500);
  };

  useEffect(() => {
    const firstTimer = setTimeout(() => showMsg(0), 8000);
    const interval   = setInterval(() => {
      setMsgIdx(prev => {
        const next = (prev + 1) % EVENT_POOL.length;
        showMsg(next);
        return next;
      });
    }, 60000);
    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, []);

  const msg        = EVENT_POOL[msgIdx] ?? "";
  const isGoldCard = msg.includes("Gold Card");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={msgIdx}
          initial={{ opacity: 0, y: 18, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 360, damping: 28 }}
          className="fixed bottom-20 left-4 z-50 max-w-[280px] pointer-events-none"
        >
          <div
            className="flex items-start gap-2.5 p-3 rounded-xl backdrop-blur-xl border"
            style={{
              background: "rgba(4,11,36,0.93)",
              borderColor: isGoldCard ? "rgba(245,158,11,0.42)" : "rgba(59,130,246,0.38)",
              boxShadow: isGoldCard
                ? "0 6px 28px rgba(245,158,11,0.18)"
                : "0 6px 28px rgba(59,130,246,0.18)",
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.18, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: isGoldCard ? "rgba(245,158,11,0.15)" : "rgba(59,130,246,0.12)",
                border: `1px solid ${isGoldCard ? "rgba(245,158,11,0.3)" : "rgba(59,130,246,0.25)"}`,
              }}
            >
              {isGoldCard
                ? <Award size={14} style={{ color: "#F59E0B" }} />
                : <MapPin size={14} style={{ color: "#60A5FA" }} />
              }
            </motion.div>

            <div>
              <div
                className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
                style={{ color: isGoldCard ? "rgba(251,191,36,0.75)" : "rgba(96,165,250,0.75)" }}
              >
                {isGoldCard ? "Gold Card Minted" : "Campus Update"}
              </div>
              <p className="text-xs text-white leading-relaxed">{msg}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
