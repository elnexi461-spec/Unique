import { motion, AnimatePresence } from "framer-motion";
import { MOCK_STUDENTS } from "@/data/mockDatabase";
import { Trophy, MapPin } from "lucide-react";

const BRAND = {
  gold:     "#F59E0B",
  gold2:    "#FBBF24",
  electric: "#60A5FA",
  primary:  "#3B82F6",
};

const CAMPUS_COLOR: Record<string, string> = {
  Zaria: "#A78BFA",
  Lagos: "#34D399",
  Kano:  "#F59E0B",
};
const CAMPUS_BG: Record<string, string> = {
  Zaria: "rgba(167,139,250,0.12)",
  Lagos: "rgba(52,211,153,0.12)",
  Kano:  "rgba(245,158,11,0.12)",
};

function getPunctuality(gpa: number, idx: number): number {
  return Math.min(100, Math.round(62 + gpa * 8.5 + (idx % 6)));
}

function vanguardScore(gc: number, gpa: number, pct: number): number {
  return gc * 100 + gpa * 50 + pct * 2;
}

export function VanguardLeaderboard() {
  const ranked = MOCK_STUDENTS
    .map((s, i) => {
      const pct = getPunctuality(s.gpa, i);
      return { ...s, punctuality: pct, score: vanguardScore(s.goldCards, s.gpa, pct) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const topCampus = ranked[0]?.campus;

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ background: "rgba(4,11,36,0.88)", borderColor: "rgba(59,130,246,0.2)" }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 border-b flex items-center gap-3"
        style={{ borderColor: "rgba(59,130,246,0.15)", background: "rgba(8,18,50,0.6)" }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)" }}
        >
          <Trophy size={16} style={{ color: BRAND.gold }} />
        </div>
        <div>
          <div className="text-[10px] font-bold tracking-[0.25em] uppercase mb-0.5"
            style={{ color: "rgba(251,191,36,0.7)" }}>
            Live Rankings
          </div>
          <h3 className="font-black text-white text-base">Vanguard Leaderboard</h3>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs" style={{ color: "rgba(96,165,250,0.8)" }}>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: BRAND.electric }}
          />
          Top 10 Scholars
        </div>
      </div>

      {/* List */}
      <div className="p-3 space-y-1.5">
        <AnimatePresence>
          {ranked.map((s, i) => {
            const isFirst    = i === 0;
            const campColor  = CAMPUS_COLOR[s.campus] ?? BRAND.electric;
            const campBg     = CAMPUS_BG[s.campus]    ?? "rgba(59,130,246,0.08)";
            const hasTrophy  = isFirst && s.campus === topCampus;

            return (
              <motion.div
                key={s.id}
                layout
                layoutId={s.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  layout: { type: "spring", stiffness: 380, damping: 32 },
                  delay: i * 0.045,
                }}
                className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl border overflow-hidden"
                style={{
                  background:    isFirst ? "rgba(245,158,11,0.07)" : "rgba(8,18,50,0.5)",
                  borderColor:   isFirst ? "rgba(245,158,11,0.45)" : "rgba(59,130,246,0.1)",
                  boxShadow:     isFirst
                    ? "0 0 24px rgba(245,158,11,0.14), inset 0 0 24px rgba(245,158,11,0.04)"
                    : "none",
                }}
              >
                {/* Golden aura pulse */}
                {isFirst && (
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    animate={{ opacity: [0.25, 0.55, 0.25] }}
                    transition={{ duration: 2.6, repeat: Infinity }}
                    style={{ border: "1.5px solid rgba(245,158,11,0.55)" }}
                  />
                )}

                {/* Rank badge */}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                  style={{
                    background: isFirst
                      ? "rgba(245,158,11,0.22)"
                      : i === 1 ? "rgba(148,163,184,0.15)"
                      : i === 2 ? "rgba(205,127,50,0.15)"
                      : "rgba(59,130,246,0.1)",
                    color: isFirst ? BRAND.gold
                      : i === 1 ? "#CBD5E1"
                      : i === 2 ? "#CD7F32"
                      : BRAND.electric,
                    border: `1px solid ${isFirst ? "rgba(245,158,11,0.35)" : "rgba(59,130,246,0.15)"}`,
                  }}
                >
                  {isFirst ? <Trophy size={13} /> : i + 1}
                </div>

                {/* Name & campus */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{s.name}</div>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <span
                      className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{
                        background: campBg,
                        color: campColor,
                        border: `1px solid ${campColor}55`,
                      }}
                    >
                      <MapPin size={8} />
                      {s.campus}
                      {hasTrophy && <span className="ml-0.5">🏆</span>}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono hidden sm:inline">{s.id}</span>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right shrink-0">
                  <div
                    className="text-sm font-black"
                    style={{ color: isFirst ? BRAND.gold : BRAND.electric }}
                  >
                    {Math.round(s.score).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {s.goldCards} cards · {s.gpa.toFixed(2)} GPA
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Formula legend */}
      <div
        className="px-4 py-2.5 border-t text-[10px] text-muted-foreground font-mono"
        style={{ borderColor: "rgba(59,130,246,0.1)" }}
      >
        Vanguard Score = (Gold Cards × 100) + (GPA × 50) + (Punctuality % × 2)
      </div>
    </div>
  );
}
