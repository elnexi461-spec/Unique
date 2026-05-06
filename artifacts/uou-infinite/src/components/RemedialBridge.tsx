import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Clock, Brain, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RemedialBridgeProps {
  courseTitle: string;
  onCooldownComplete: () => void;
}

const COOLDOWN_SECONDS = 2 * 60 * 60; /* 2 hours */

export function RemedialBridge({ courseTitle, onCooldownComplete }: RemedialBridgeProps) {
  const storageKey = `uou_remedial_${courseTitle.replace(/\s/g, "_")}`;

  const [phase, setPhase] = useState<"bridge" | "cooldown" | "ready">("bridge");
  const [bridgeProgress, setBridgeProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const end = parseInt(stored, 10);
      const remaining = Math.round((end - Date.now()) / 1000);
      return remaining > 0 ? remaining : 0;
    }
    return 0;
  });

  /* Bridge video simulation — 5 minutes represented as 30-second demo */
  useEffect(() => {
    if (phase !== "bridge") return;
    const interval = setInterval(() => {
      setBridgeProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          /* Start cooldown */
          const endTime = Date.now() + COOLDOWN_SECONDS * 1000;
          localStorage.setItem(storageKey, String(endTime));
          setTimeLeft(COOLDOWN_SECONDS);
          setPhase("cooldown");
          return 100;
        }
        return p + 1; /* ~100 steps in ~30s */
      });
    }, 300);
    return () => clearInterval(interval);
  }, [phase]);

  /* Cooldown countdown */
  useEffect(() => {
    if (phase !== "cooldown") return;
    if (timeLeft <= 0) {
      localStorage.removeItem(storageKey);
      setPhase("ready");
      return;
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, phase]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}h ${String(m).padStart(2, "0")}m ${String(sec).padStart(2, "0")}s`;
  };

  /* Check if already in cooldown on mount */
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const end = parseInt(stored, 10);
      const remaining = Math.round((end - Date.now()) / 1000);
      if (remaining > 0) {
        setTimeLeft(remaining);
        setPhase("cooldown");
      } else {
        localStorage.removeItem(storageKey);
        setPhase("ready");
      }
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border overflow-hidden"
      style={{
        background: "rgba(40,10,10,0.7)",
        borderColor: "rgba(239,68,68,0.25)",
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Header */}
      <div
        className="p-4 border-b flex items-center gap-3"
        style={{ borderColor: "rgba(239,68,68,0.2)" }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0"
          style={{ background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.3)" }}
        >
          <AlertTriangle size={18} className="text-red-400" />
        </div>
        <div>
          <div className="font-bold text-foreground text-sm">Remedial Bridge Activated</div>
          <div className="text-xs text-muted-foreground">{courseTitle} · Three-Strike Protocol</div>
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* PHASE: Bridge Video */}
        {phase === "bridge" && (
          <motion.div
            key="bridge"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-5 space-y-5"
          >
            {/* Sentinel message */}
            <div
              className="rounded-xl p-4 border text-sm"
              style={{
                background: "rgba(59,130,246,0.06)",
                borderColor: "rgba(59,130,246,0.2)",
              }}
            >
              <div className="flex items-start gap-2">
                <Brain size={16} className="text-primary mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <div className="font-bold text-primary text-xs tracking-wider uppercase">
                    UOU Sentinel
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed italic">
                    "Scholar, three attempts have been spent. Integrity check: knowledge cannot be rushed.
                    A Remedial Bridge has been initiated. Watch this focused summary carefully — it targets
                    the exact concepts where your understanding needs reinforcement."
                  </p>
                </div>
              </div>
            </div>

            {/* Simulated bridge video player */}
            <div
              className="rounded-xl overflow-hidden border aspect-video relative flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #0a0a1a, #111130)",
                borderColor: "rgba(59,130,246,0.2)",
              }}
            >
              {/* Animated content simulation */}
              <div className="text-center space-y-4 p-8">
                <motion.div
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 4, repeat: Infinity, times: [0, 0.1, 0.9, 1] }}
                  className="text-primary text-xs font-mono tracking-widest uppercase"
                >
                  ● Level 1 Remedial Session
                </motion.div>

                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-white text-lg font-bold"
                >
                  {courseTitle}
                </motion.div>

                {/* SVG Sketch animation */}
                <svg width="200" height="80" viewBox="0 0 200 80" className="mx-auto">
                  <motion.path
                    d="M 10,60 Q 50,10 100,40 Q 150,70 190,20"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />
                  <motion.circle
                    cx="100" cy="40" r="6"
                    fill="#60A5FA"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  />
                  {[30, 70, 130, 170].map((x, i) => (
                    <motion.text
                      key={x}
                      x={x} y={72}
                      textAnchor="middle"
                      fontSize="9"
                      fill="rgba(147,197,253,0.7)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                    >
                      Step {i + 1}
                    </motion.text>
                  ))}
                </svg>

                <motion.p
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 5, repeat: Infinity, times: [0, 0.1, 0.9, 1] }}
                  className="text-muted-foreground text-xs"
                >
                  AI Tutor: Breaking down the core concept in simple terms…
                </motion.p>
              </div>

              {/* Rewind only notice */}
              <div
                className="absolute bottom-2 right-2 text-[9px] font-mono px-2 py-1 rounded"
                style={{ background: "rgba(0,0,0,0.6)", color: "rgba(147,197,253,0.6)" }}
              >
                REWIND ONLY
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                <span>Bridge Session Progress</span>
                <span className="font-mono">{bridgeProgress}%</span>
              </div>
              <div className="h-2 rounded-full bg-border overflow-hidden">
                <motion.div
                  animate={{ width: `${bridgeProgress}%` }}
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #1D4ED8, #3B82F6)",
                    boxShadow: "0 0 8px rgba(59,130,246,0.5)",
                  }}
                />
              </div>
              {bridgeProgress < 100 && (
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  Watch the complete Bridge Session to proceed
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* PHASE: Cooldown */}
        {phase === "cooldown" && (
          <motion.div
            key="cooldown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 text-center space-y-5"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center border"
              style={{
                background: "rgba(239,68,68,0.08)",
                borderColor: "rgba(239,68,68,0.25)",
              }}
            >
              <Lock size={28} className="text-red-400" />
            </motion.div>

            <div>
              <h3 className="font-bold text-foreground text-lg mb-2">
                Discipline Lock Active
              </h3>
              <p
                className="text-sm italic leading-relaxed"
                style={{ color: "rgba(147,197,253,0.8)" }}
              >
                "Scholar, the knowledge needs time to settle.
                Return in 2 hours for your final attempt at the Gold Card."
                <span className="block mt-1 text-xs not-italic text-muted-foreground">
                  — UOU Sentinel
                </span>
              </p>
            </div>

            {/* Countdown */}
            <div
              className="rounded-2xl p-5 border"
              style={{
                background: "rgba(59,130,246,0.06)",
                borderColor: "rgba(59,130,246,0.2)",
              }}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock size={14} className="text-primary" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Time to Unlock
                </span>
              </div>
              <div
                className="text-3xl font-black font-mono tabular-nums"
                style={{ color: "#60A5FA" }}
              >
                {formatTime(timeLeft)}
              </div>
            </div>

            {/* Cooldown progress */}
            <div className="h-1.5 rounded-full bg-border overflow-hidden">
              <motion.div
                animate={{ width: `${((COOLDOWN_SECONDS - timeLeft) / COOLDOWN_SECONDS) * 100}%` }}
                transition={{ duration: 1 }}
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #1D4ED8, #60A5FA)",
                }}
              />
            </div>
          </motion.div>
        )}

        {/* PHASE: Ready */}
        {phase === "ready" && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 text-center space-y-4"
          >
            <div className="text-3xl">🎓</div>
            <h3 className="font-bold text-foreground text-lg">
              Final Attempt Unlocked
            </h3>
            <p className="text-muted-foreground text-sm">
              The Sentinel believes in your capacity to succeed.
              Your value is increasing — enter the assessment with full focus.
            </p>
            <Button
              onClick={onCooldownComplete}
              className="w-full font-semibold"
              style={{
                background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
                color: "white",
                boxShadow: "0 0 24px rgba(59,130,246,0.4)",
              }}
            >
              Begin Final Attempt <ArrowRight size={16} className="ml-2" />
            </Button>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}
