import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Zap } from "lucide-react";

interface VideoGenerationProgressProps {
  onComplete: () => void;
  demoMode?: boolean;
  courseCode?: string;
}

const HEYGEN_STAGES = [
  { label: "Connecting HeyGen Neural Bridge",     detail: "Authenticating API key · Establishing encrypted WebSocket channel…",  from: 0,  to: 18 },
  { label: "Synthesizing Lecture Avatars",         detail: "Generating lip-sync motion vectors for Prof. Aminu's digital twin…",    from: 18, to: 40 },
  { label: "Syncing Audio in Zaria Hub",           detail: "Aligning prosody model with course content · Calibrating accent engine…",from: 40, to: 62 },
  { label: "Calibrating HeyGen Neural Renderer",  detail: "Tuning facial expression matrices · Applying UOU institutional filters…",from: 62, to: 80 },
  { label: "Encoding Cinematic Output",            detail: "Compositing avatar over course slide sequence · Rendering H.264 stream…", from: 80, to: 100 },
];

const DEMO_STAGES = [
  { label: "Loading Institutional Demo Cache",    detail: "Fetching BAM111 pre-rendered lecture from Zaria Hub cache…",           from: 0,  to: 25 },
  { label: "Verifying Demo Asset Integrity",      detail: "Checking cryptographic hash of BAM111_Demo.mp4…",                      from: 25, to: 55 },
  { label: "Preparing Lecture Preview Engine",    detail: "Initialising slide-sync overlay · Mounting subtitle track…",            from: 55, to: 80 },
  { label: "Launching Demo Video Bridge",         detail: "Connecting media stream to Sentinel Player · Finalising buffers…",      from: 80, to: 100 },
];

const MATRIX_CHARS = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function MatrixRain() {
  const [cols] = useState(() => Array.from({ length: 14 }, (_, i) => ({
    id: i,
    delay: i * 0.18,
    chars: Array.from({ length: 6 }, () => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]),
  })));

  return (
    <div className="flex items-end gap-1.5 opacity-20 select-none pointer-events-none h-8">
      {cols.map(col => (
        <div key={col.id} className="flex flex-col items-center gap-0" style={{ width: 10 }}>
          {col.chars.map((c, ci) => (
            <motion.span key={ci}
              animate={{ opacity: [0.1, 0.8, 0.1], color: ["#1D4ED8", "#60A5FA", "#34D399", "#60A5FA", "#1D4ED8"] }}
              transition={{ duration: 1.4 + ci * 0.2, repeat: Infinity, delay: col.delay + ci * 0.12 }}
              className="text-[7px] font-mono leading-tight"
            >{c}</motion.span>
          ))}
        </div>
      ))}
    </div>
  );
}

export function VideoGenerationProgress({ onComplete, demoMode = false, courseCode = "BAM-111" }: VideoGenerationProgressProps) {
  const [progress, setProgress] = useState(0);
  const [stageIdx, setStageIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [ticker, setTicker] = useState(0);

  const STAGES = demoMode ? DEMO_STAGES : HEYGEN_STAGES;

  useEffect(() => {
    let current = 0;
    const speed = demoMode ? 1.1 : 0.65;
    const interval = setInterval(() => {
      current += speed;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setProgress(100);
        setStageIdx(STAGES.length - 1);
        setDone(true);
        setTimeout(() => onComplete(), 1200);
        return;
      }
      setProgress(current);
      const idx = STAGES.findIndex(s => current < s.to);
      setStageIdx(idx >= 0 ? idx : STAGES.length - 1);
    }, 80);
    const tickInterval = setInterval(() => setTicker(t => t + 1), 400);
    return () => { clearInterval(interval); clearInterval(tickInterval); };
  }, []);

  const currentStage = STAGES[stageIdx] ?? STAGES[0]!;
  const progressInStage = stageIdx < STAGES.length
    ? Math.max(0, Math.min(100, ((progress - currentStage.from) / (currentStage.to - currentStage.from)) * 100))
    : 100;

  const hexProgress = Math.round(progress * 2.55).toString(16).padStart(2, "0").toUpperCase();
  const tickerChars = ["◈", "◇", "◆", "◉"];
  const tick = tickerChars[ticker % 4]!;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl overflow-hidden relative"
      style={{
        background: "linear-gradient(160deg, rgba(2,6,22,0.99) 0%, rgba(4,10,36,0.99) 100%)",
        border: "1px solid rgba(96,165,250,0.3)",
        boxShadow: "0 0 0 1px rgba(96,165,250,0.06), 0 0 40px rgba(0,64,192,0.2), 0 0 80px rgba(59,130,246,0.08)",
      }}
    >
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, #60A5FA, #60A5FA 1px, transparent 1px, transparent 3px)" }} />

      {/* Top progress glow bar */}
      <div className="h-0.5 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "rgba(255,255,255,0.04)" }} />
        <motion.div className="h-full relative"
          style={{ width: `${progress}%`, background: "linear-gradient(90deg, #1D4ED8, #3B82F6, #60A5FA)" }}
          transition={{ duration: 0.08 }}>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="absolute right-0 top-0 h-full w-8"
            style={{ background: "linear-gradient(90deg, transparent, rgba(96,165,250,0.8))" }} />
        </motion.div>
      </div>

      {/* Header */}
      <div className="px-5 py-3.5 border-b flex items-center justify-between"
        style={{ borderColor: "rgba(96,165,250,0.1)", background: "rgba(4,10,40,0.4)" }}>
        <div className="flex items-center gap-2.5">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-2 h-2 rounded-full"
            style={{ background: done ? "#34D399" : "#60A5FA", boxShadow: done ? "0 0 8px #34D399" : "0 0 8px #60A5FA" }}
          />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]"
            style={{ color: done ? "#34D399" : "#60A5FA" }}>
            {done ? "Synthesis Complete" : demoMode ? "Demo Mode Active" : "HeyGen Bridge · Live"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-mono" style={{ color: "rgba(96,165,250,0.4)" }}>
            {tick} COURSE/{courseCode}
          </span>
          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded"
            style={{ background: "rgba(96,165,250,0.08)", color: "#60A5FA", border: "1px solid rgba(96,165,250,0.15)" }}>
            0x{hexProgress}
          </span>
        </div>
      </div>

      {/* Main body */}
      <div className="p-6 space-y-6">

        {/* Overall progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em]"
              style={{ color: "rgba(96,165,250,0.5)" }}>Overall Synthesis</span>
            <span className="text-xl font-black tabular-nums"
              style={{ color: done ? "#34D399" : "#60A5FA", textShadow: done ? "0 0 12px #34D399" : "0 0 12px #60A5FA" }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-3 rounded-full relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(96,165,250,0.1)" }}>
            <motion.div className="h-full rounded-full relative overflow-hidden"
              style={{ width: `${progress}%`, background: "linear-gradient(90deg,#1D4ED8,#3B82F6,#60A5FA)" }}
              transition={{ duration: 0.08 }}>
              {/* animated shimmer */}
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 w-1/3"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)" }} />
            </motion.div>
            {/* Tick marks */}
            {[25, 50, 75].map(p => (
              <div key={p} className="absolute top-0 bottom-0 w-px"
                style={{ left: `${p}%`, background: "rgba(96,165,250,0.12)" }} />
            ))}
          </div>
        </div>

        {/* Stage list */}
        <div className="space-y-3">
          {STAGES.map((stage, i) => {
            const isDone = progress >= stage.to;
            const isActive = stageIdx === i && !done;
            return (
              <motion.div key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-3">
                {/* State icon */}
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    background: isDone ? "rgba(52,211,153,0.12)" : isActive ? "rgba(96,165,250,0.12)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isDone ? "rgba(52,211,153,0.4)" : isActive ? "rgba(96,165,250,0.4)" : "rgba(255,255,255,0.06)"}`,
                  }}>
                  {isDone ? (
                    <CheckCircle size={12} style={{ color: "#34D399" }} />
                  ) : isActive ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                      className="w-3 h-3 rounded-full border-t-2 border-r-2"
                      style={{ borderColor: "#60A5FA" }} />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
                  )}
                </div>

                {/* Stage text */}
                <div className="flex-1 space-y-1">
                  <div className="text-xs font-semibold"
                    style={{ color: isDone ? "#34D399" : isActive ? "#F0F9FF" : "rgba(148,163,184,0.35)" }}>
                    {stage.label}
                  </div>
                  {isActive && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="text-[10px] text-muted-foreground mb-1.5 leading-relaxed font-mono">
                        {stage.detail}
                      </div>
                      {/* Sub-progress bar */}
                      <div className="h-1 rounded-full overflow-hidden"
                        style={{ background: "rgba(96,165,250,0.06)" }}>
                        <motion.div className="h-full rounded-full"
                          style={{ width: `${progressInStage}%`, background: "linear-gradient(90deg,#1D4ED8,#60A5FA)" }}
                          transition={{ duration: 0.08 }} />
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Waveform / matrix bottom */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-end gap-0.5">
            {Array.from({ length: 22 }, (_, i) => (
              <motion.div key={i} className="rounded-full"
                style={{ width: 3, background: done ? "rgba(52,211,153,0.5)" : "rgba(96,165,250,0.4)" }}
                animate={{ height: done ? 4 : [4, [6, 12, 18, 22, 14, 24, 8, 16, 20, 10][i % 10]! * 0.85, 4] }}
                transition={{ duration: 0.5 + (i % 4) * 0.08, repeat: done ? 0 : Infinity, delay: i * 0.04, ease: "easeInOut" }} />
            ))}
          </div>
          <MatrixRain />
        </div>

        {/* Done banner */}
        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl p-3 flex items-center gap-3"
              style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.3)" }}>
              <CheckCircle size={16} style={{ color: "#34D399" }} />
              <div>
                <div className="text-xs font-bold" style={{ color: "#34D399" }}>
                  {demoMode ? "Demo Video Ready" : "HeyGen Synthesis Complete"}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {demoMode ? "BAM111_Demo.mp4 loaded · Launching Sentinel Player…" : "Avatar render finalised · Launching video bridge…"}
                </div>
              </div>
              <Zap size={13} className="ml-auto shrink-0" style={{ color: "#34D399" }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
