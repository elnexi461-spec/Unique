import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Award, Star } from "lucide-react";

type Tier = "GOLD" | "SILVER" | "BRONZE";

interface GoldCardProps {
  studentName: string;
  courseName: string;
  grade: string;
  score: number;
  privateKey: string;
  tier?: Tier;
  onDismiss?: () => void;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  angle: number;
}

const TIER_CONFIG: Record<Tier, {
  cardBg: string;
  shimmer: string;
  glowColor: string;
  labelText: string;
  labelBg: string;
  textColor: string;
  keyBorder: string;
  sparkleColors: string[];
  starColor: string;
  headerTextColor: string;
}> = {
  GOLD: {
    cardBg: "linear-gradient(135deg, #1c0a00 0%, #2d1200 15%, #3d1c00 28%, #7c3a00 40%, #b45309 50%, #d97706 60%, #f59e0b 68%, #fbbf24 74%, #fde68a 80%, #fbbf24 86%, #f59e0b 92%, #7c3a00 100%)",
    shimmer: "rgba(255,255,255,0.35)",
    glowColor: "rgba(245,158,11,0.6)",
    labelText: "GOLD ACHIEVEMENT CARD",
    labelBg: "rgba(28,15,0,0.18)",
    textColor: "#1c0a00",
    keyBorder: "rgba(28,15,0,0.25)",
    sparkleColors: ["#FDE68A", "#FCD34D", "#FBBF24", "#F59E0B", "#3B82F6", "#60A5FA", "#93C5FD", "#ffffff"],
    starColor: "#FBBF24",
    headerTextColor: "rgba(28,15,0,0.7)",
  },
  SILVER: {
    cardBg: "linear-gradient(135deg, #0f172a 0%, #1e293b 20%, #334155 40%, #64748b 55%, #94a3b8 68%, #cbd5e1 76%, #e2e8f0 82%, #cbd5e1 88%, #94a3b8 94%, #475569 100%)",
    shimmer: "rgba(255,255,255,0.45)",
    glowColor: "rgba(148,163,184,0.7)",
    labelText: "SILVER ACHIEVEMENT CARD",
    labelBg: "rgba(15,23,42,0.25)",
    textColor: "#0f172a",
    keyBorder: "rgba(15,23,42,0.3)",
    sparkleColors: ["#CBD5E1", "#94A3B8", "#E2E8F0", "#F1F5F9", "#60A5FA", "#93C5FD", "#ffffff", "#BFDBFE"],
    starColor: "#94A3B8",
    headerTextColor: "rgba(15,23,42,0.7)",
  },
  BRONZE: {
    cardBg: "linear-gradient(135deg, #1c0800 0%, #3b1500 20%, #6b2a00 38%, #9a3a00 52%, #b45309 62%, #c2621a 72%, #d4762a 80%, #b45309 88%, #6b2a00 100%)",
    shimmer: "rgba(255,255,255,0.22)",
    glowColor: "rgba(180,83,9,0.55)",
    labelText: "BRONZE ACHIEVEMENT CARD",
    labelBg: "rgba(28,8,0,0.18)",
    textColor: "#1c0800",
    keyBorder: "rgba(28,8,0,0.25)",
    sparkleColors: ["#D97706", "#B45309", "#92400E", "#F59E0B", "#FBBF24", "#FDE68A", "#FCA5A5", "#ffffff"],
    starColor: "#B45309",
    headerTextColor: "rgba(28,8,0,0.7)",
  },
};

export function GoldCard({ studentName, courseName, grade, score, privateKey, tier, onDismiss }: GoldCardProps) {
  const resolvedTier: Tier =
    tier ?? (grade === "GOLD" || grade === "SILVER" || grade === "BRONZE" ? grade as Tier : "GOLD");
  const cfg = TIER_CONFIG[resolvedTier];

  const [copied, setCopied] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  const triggerSparkles = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const newSparkles: Sparkle[] = Array.from({ length: 18 }, (_, i) => ({
      id: Date.now() + i,
      x: cx, y: cy,
      size: 6 + Math.random() * 10,
      color: cfg.sparkleColors[Math.floor(Math.random() * cfg.sparkleColors.length)]!,
      angle: (i / 18) * 360 + Math.random() * 20,
    }));
    setSparkles(prev => [...prev, ...newSparkles]);
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => !newSparkles.some(n => n.id === s.id)));
    }, 800);
  }, [cfg.sparkleColors]);

  const handleCopy = useCallback(async (e: React.MouseEvent) => {
    triggerSparkles(e);
    try {
      await navigator.clipboard.writeText(privateKey);
    } catch {
      const el = document.createElement("textarea");
      el.value = privateKey;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [privateKey, triggerSparkles]);

  const tierLabel =
    resolvedTier === "GOLD"   ? "🥇 Gold"   :
    resolvedTier === "SILVER" ? "🥈 Silver" :
                                "🥉 Bronze";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 60 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -40 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      style={{ background: "rgba(4,11,26,0.88)", backdropFilter: "blur(12px)" }}
    >
      {/* Outer glow stage */}
      <motion.div
        animate={{
          boxShadow: [
            `0 0 60px ${cfg.glowColor.replace("0.6", "0.3")}, 0 0 0 rgba(59,130,246,0)`,
            `0 0 120px ${cfg.glowColor}, 0 0 200px rgba(59,130,246,0.15)`,
            `0 0 60px ${cfg.glowColor.replace("0.6", "0.3")}, 0 0 0 rgba(59,130,246,0)`,
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
        style={{ width: "min(420px, 100%)" }}
      >
        {/* THE ACHIEVEMENT CARD */}
        <div
          className="relative rounded-3xl overflow-hidden cursor-pointer select-none"
          onClick={handleCopy}
          style={{
            background: cfg.cardBg,
            backgroundSize: "300% 300%",
            animation: "tier-shimmer-card 4s linear infinite",
            border: `1px solid ${cfg.shimmer.replace("0.35", "0.4")}`,
          }}
        >
          {/* Animated shimmer overlay */}
          <motion.div
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: `linear-gradient(105deg, transparent 30%, ${cfg.shimmer} 50%, transparent 70%)`,
              backgroundSize: "200% 200%",
            }}
          />

          {/* Blue aura overlay */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 110%, rgba(59,130,246,0.12) 0%, transparent 60%)",
            }}
          />

          <div className="relative z-20 p-7">
            {/* Header row */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div
                  className="text-xs font-bold tracking-[0.3em] uppercase mb-1"
                  style={{ color: cfg.headerTextColor }}
                >
                  Unique Open University
                </div>
                <div
                  className="text-[10px] tracking-[0.2em] uppercase"
                  style={{ color: cfg.headerTextColor.replace("0.7", "0.5") }}
                >
                  {cfg.labelText}
                </div>
              </div>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center border-2 shrink-0"
                style={{
                  background: "radial-gradient(circle at 35% 35%, #60A5FA, #1D4ED8 60%, #0B1E4A)",
                  borderColor: cfg.shimmer.replace("0.35", "0.6"),
                  boxShadow: "0 0 12px rgba(59,130,246,0.5)",
                }}
              >
                <span className="font-black text-white" style={{ fontSize: 10, letterSpacing: 1 }}>
                  UOU
                </span>
              </div>
            </div>

            {/* Tier badge */}
            <div className="mb-4">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase"
                style={{
                  background: cfg.labelBg,
                  border: `1px solid ${cfg.keyBorder}`,
                  color: cfg.textColor,
                }}
              >
                {tierLabel} Tier
              </span>
            </div>

            {/* Student Name */}
            <div className="mb-5">
              <div
                className="text-[11px] font-semibold tracking-[0.25em] uppercase mb-1"
                style={{ color: cfg.headerTextColor.replace("0.7", "0.55") }}
              >
                Scholar
              </div>
              <div
                className="text-2xl font-black tracking-tight"
                style={{ color: cfg.textColor, textShadow: "0 1px 2px rgba(255,255,255,0.4)" }}
              >
                {studentName}
              </div>
            </div>

            {/* Course + Score + Grade row */}
            <div className="flex items-end gap-4 mb-6">
              <div className="flex-1">
                <div
                  className="text-[10px] font-semibold tracking-[0.25em] uppercase mb-1"
                  style={{ color: cfg.headerTextColor.replace("0.7", "0.55") }}
                >
                  Course
                </div>
                <div className="text-lg font-bold" style={{ color: cfg.textColor }}>
                  {courseName}
                </div>
              </div>
              <div className="text-right">
                <div
                  className="text-[10px] font-semibold tracking-[0.25em] uppercase mb-1"
                  style={{ color: cfg.headerTextColor.replace("0.7", "0.55") }}
                >
                  Score
                </div>
                <div
                  className="text-3xl font-black"
                  style={{
                    color: resolvedTier === "GOLD" ? "#FCD34D" : resolvedTier === "SILVER" ? "#F1F5F9" : "#FCD34D",
                    textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  }}
                >
                  {score}%
                </div>
              </div>
              <div className="text-right">
                <div
                  className="text-[10px] font-semibold tracking-[0.25em] uppercase mb-1"
                  style={{ color: cfg.headerTextColor.replace("0.7", "0.55") }}
                >
                  Grade
                </div>
                <div className="text-3xl font-black" style={{ color: cfg.textColor }}>
                  {grade}
                </div>
              </div>
            </div>

            {/* Private Key */}
            <div
              className="rounded-xl p-3 border"
              style={{ background: cfg.labelBg, borderColor: cfg.keyBorder }}
            >
              <div
                className="text-[9px] font-bold tracking-[0.3em] uppercase mb-1.5 flex items-center gap-1.5"
                style={{ color: cfg.headerTextColor.replace("0.7", "0.6") }}
              >
                <Award size={9} /> Performance Key
              </div>
              <div
                className="font-mono text-xs tracking-widest break-all"
                style={{ color: cfg.textColor, fontWeight: 700 }}
              >
                {privateKey}
              </div>
            </div>

            {/* Copy hint */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="copied"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 text-sm font-bold"
                    style={{ color: cfg.textColor }}
                  >
                    <Check size={14} /> Key copied to clipboard!
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 text-sm font-semibold"
                    style={{ color: cfg.headerTextColor.replace("0.7", "0.65") }}
                  >
                    <Copy size={12} /> Tap card to copy your key
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sparkle particles */}
          <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
            {sparkles.map(sp => (
              <motion.div
                key={sp.id}
                className="absolute"
                initial={{ x: sp.x, y: sp.y, scale: 0, opacity: 1 }}
                animate={{
                  x: sp.x + Math.cos((sp.angle * Math.PI) / 180) * (50 + Math.random() * 60),
                  y: sp.y + Math.sin((sp.angle * Math.PI) / 180) * (50 + Math.random() * 60),
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                }}
                transition={{ duration: 0.75, ease: "easeOut" }}
                style={{
                  width: sp.size, height: sp.size,
                  background: sp.color, borderRadius: "50%",
                  boxShadow: `0 0 ${sp.size * 2}px ${sp.color}`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Star decorations */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{ top: `${10 + i * 18}%`, left: i % 2 === 0 ? "-8%" : "108%" }}
            animate={{ rotate: [0, 360], scale: [0.8, 1.1, 0.8], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
          >
            <Star size={12 + i * 3} fill={cfg.starColor} color={cfg.starColor} />
          </motion.div>
        ))}
      </motion.div>

      {/* Dismiss button */}
      {onDismiss && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          onClick={onDismiss}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm font-medium px-6 py-2 rounded-full border transition-all"
          style={{
            borderColor: "rgba(59,130,246,0.3)",
            color: "rgba(147,197,253,0.7)",
            background: "rgba(10,20,60,0.5)",
          }}
        >
          Save & Continue
        </motion.button>
      )}

      <style>{`
        @keyframes tier-shimmer-card {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </motion.div>
  );
}
