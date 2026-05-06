import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Award, Star } from "lucide-react";

interface GoldCardProps {
  studentName: string;
  courseName: string;
  grade: string;
  score: number;
  privateKey: string;
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

const SPARKLE_COLORS = [
  "#FDE68A", "#FCD34D", "#FBBF24", "#F59E0B",
  "#3B82F6", "#60A5FA", "#93C5FD", "#ffffff",
];

export function GoldCard({ studentName, courseName, grade, score, privateKey, onDismiss }: GoldCardProps) {
  const [copied, setCopied] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [copyCount, setCopyCount] = useState(0);

  const triggerSparkles = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    const newSparkles: Sparkle[] = Array.from({ length: 18 }, (_, i) => ({
      id: Date.now() + i,
      x: cx,
      y: cy,
      size: 6 + Math.random() * 10,
      color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
      angle: (i / 18) * 360 + Math.random() * 20,
    }));

    setSparkles(prev => [...prev, ...newSparkles]);
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => !newSparkles.some(n => n.id === s.id)));
    }, 800);
  }, []);

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
    setCopyCount(c => c + 1);
    setTimeout(() => setCopied(false), 2000);
  }, [privateKey, triggerSparkles]);

  const gradeColor =
    score >= 90 ? "#FCD34D" :
    score >= 75 ? "#86EFAC" :
    score >= 60 ? "#93C5FD" :
    "#FCA5A5";

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
            "0 0 60px rgba(245,158,11,0.3), 0 0 0 rgba(59,130,246,0)",
            "0 0 120px rgba(245,158,11,0.6), 0 0 200px rgba(59,130,246,0.2)",
            "0 0 60px rgba(245,158,11,0.3), 0 0 0 rgba(59,130,246,0)",
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
        style={{ width: "min(420px, 100%)" }}
      >
        {/* THE GOLD CARD */}
        <div
          className="relative rounded-3xl overflow-hidden cursor-pointer select-none"
          onClick={handleCopy}
          style={{
            background:
              "linear-gradient(135deg, #1c0a00 0%, #2d1200 15%, #3d1c00 28%, #7c3a00 40%, #b45309 50%, #d97706 60%, #f59e0b 68%, #fbbf24 74%, #fde68a 80%, #fbbf24 86%, #f59e0b 92%, #7c3a00 100%)",
            backgroundSize: "300% 300%",
            animation: "gold-shimmer-card 4s linear infinite",
            border: "1px solid rgba(253,230,138,0.4)",
          }}
        >
          {/* Animated shimmer overlay */}
          <motion.div
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)",
              backgroundSize: "200% 200%",
            }}
          />

          {/* Blue aura overlay — University Seal */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 110%, rgba(59,130,246,0.18) 0%, transparent 60%)",
            }}
          />

          <div className="relative z-20 p-7">
            {/* Header row */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div
                  className="text-xs font-bold tracking-[0.3em] uppercase mb-1"
                  style={{ color: "rgba(28,15,0,0.7)" }}
                >
                  Unique Open University
                </div>
                <div
                  className="text-[10px] tracking-[0.2em] uppercase"
                  style={{ color: "rgba(28,15,0,0.5)" }}
                >
                  Academic Achievement Certificate
                </div>
              </div>
              {/* UOU Seal SVG */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center border-2 shrink-0"
                style={{
                  background:
                    "radial-gradient(circle at 35% 35%, #60A5FA, #1D4ED8 60%, #0B1E4A)",
                  borderColor: "rgba(253,230,138,0.6)",
                  boxShadow: "0 0 12px rgba(59,130,246,0.5)",
                }}
              >
                <span
                  className="font-black text-white"
                  style={{ fontSize: 10, letterSpacing: 1 }}
                >
                  UOU
                </span>
              </div>
            </div>

            {/* Student Name */}
            <div className="mb-5">
              <div
                className="text-[11px] font-semibold tracking-[0.25em] uppercase mb-1"
                style={{ color: "rgba(28,15,0,0.55)" }}
              >
                Scholar
              </div>
              <div
                className="text-2xl font-black tracking-tight"
                style={{ color: "#1c0a00", textShadow: "0 1px 2px rgba(255,255,255,0.4)" }}
              >
                {studentName}
              </div>
            </div>

            {/* Course + Grade row */}
            <div className="flex items-end gap-4 mb-6">
              <div className="flex-1">
                <div
                  className="text-[10px] font-semibold tracking-[0.25em] uppercase mb-1"
                  style={{ color: "rgba(28,15,0,0.55)" }}
                >
                  Course
                </div>
                <div
                  className="text-lg font-bold"
                  style={{ color: "#1c0a00" }}
                >
                  {courseName}
                </div>
              </div>
              <div className="text-right">
                <div
                  className="text-[10px] font-semibold tracking-[0.25em] uppercase mb-1"
                  style={{ color: "rgba(28,15,0,0.55)" }}
                >
                  Score
                </div>
                <div
                  className="text-3xl font-black"
                  style={{ color: gradeColor, textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
                >
                  {score}%
                </div>
              </div>
              <div className="text-right">
                <div
                  className="text-[10px] font-semibold tracking-[0.25em] uppercase mb-1"
                  style={{ color: "rgba(28,15,0,0.55)" }}
                >
                  Grade
                </div>
                <div
                  className="text-3xl font-black"
                  style={{ color: "#1c0a00" }}
                >
                  {grade}
                </div>
              </div>
            </div>

            {/* Private Key area */}
            <div
              className="rounded-xl p-3 border"
              style={{
                background: "rgba(28,15,0,0.18)",
                borderColor: "rgba(28,15,0,0.25)",
              }}
            >
              <div
                className="text-[9px] font-bold tracking-[0.3em] uppercase mb-1.5 flex items-center gap-1.5"
                style={{ color: "rgba(28,15,0,0.6)" }}
              >
                <Award size={9} /> Cryptographic Attendance Key
              </div>
              <div
                className="font-mono text-xs tracking-widest break-all"
                style={{ color: "#1c0a00", fontWeight: 700 }}
              >
                {privateKey}
              </div>
            </div>

            {/* Click to copy hint */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="copied"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 text-sm font-bold"
                    style={{ color: "#1c0a00" }}
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
                    style={{ color: "rgba(28,15,0,0.65)" }}
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
                className="absolute sparkle-particle"
                initial={{ x: sp.x, y: sp.y, scale: 0, opacity: 1 }}
                animate={{
                  x: sp.x + Math.cos((sp.angle * Math.PI) / 180) * (50 + Math.random() * 60),
                  y: sp.y + Math.sin((sp.angle * Math.PI) / 180) * (50 + Math.random() * 60),
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                }}
                transition={{ duration: 0.75, ease: "easeOut" }}
                style={{
                  width: sp.size,
                  height: sp.size,
                  background: sp.color,
                  borderRadius: "50%",
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
            style={{
              top: `${10 + i * 18}%`,
              left: i % 2 === 0 ? "-8%" : "108%",
            }}
            animate={{
              rotate: [0, 360],
              scale: [0.8, 1.1, 0.8],
              opacity: [0.4, 0.9, 0.4],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            <Star size={12 + i * 3} fill="#FBBF24" color="#FBBF24" />
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
        @keyframes gold-shimmer-card {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </motion.div>
  );
}
