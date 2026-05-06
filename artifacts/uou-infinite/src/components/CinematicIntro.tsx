import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";

interface CinematicIntroProps {
  onComplete: () => void;
}

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [phase, setPhase] = useState<"ball" | "text" | "zoom" | "done">("ball");
  const ballY = useSpring(0, { stiffness: 300, damping: 12, mass: 0.8 });
  const ballScale = useSpring(1, { stiffness: 400, damping: 10 });

  useEffect(() => {
    // Phase 1: Bouncing ball for 2.5s
    let bounceCount = 0;
    const bounce = () => {
      if (bounceCount >= 4) {
        setPhase("text");
        return;
      }
      ballY.set(120);
      setTimeout(() => {
        ballScale.set(0.85);
        ballY.set(0);
        setTimeout(() => {
          ballScale.set(1);
          bounceCount++;
          bounce();
        }, 350);
      }, 280);
    };
    const t1 = setTimeout(bounce, 400);

    // Phase 2: Text morph at 2.8s
    const t2 = setTimeout(() => setPhase("text"), 2800);

    // Phase 3: Zoom into O at 4.2s
    const t3 = setTimeout(() => setPhase("zoom"), 4200);

    // Phase 4: Done at 5.5s
    const t4 = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 5500);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ background: "#050D1A" }}
        >
          {/* Geometric grid background */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#64FFDA" strokeWidth="0.5" opacity="0.4"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            <motion.div
              animate={{ x: [0, -60], y: [0, -60] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
              style={{ backgroundImage: "radial-gradient(circle at 50% 50%, rgba(100,255,218,0.05) 0%, transparent 60%)" }}
            />
          </div>

          {/* Phase: Bouncing Ball */}
          <AnimatePresence mode="wait">
            {phase === "ball" && (
              <motion.div
                key="ball"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 2 }}
                transition={{ duration: 0.4, exit: { duration: 0.5 } }}
                className="flex flex-col items-center"
                style={{ y: ballY, scaleY: ballScale }}
              >
                <div
                  className="w-32 h-32 rounded-full flex items-center justify-center relative"
                  style={{
                    background: "radial-gradient(circle at 35% 35%, #64FFDA, #0A4A3A)",
                    boxShadow: "0 0 60px rgba(100,255,218,0.6), 0 0 120px rgba(100,255,218,0.3), inset 0 -10px 20px rgba(0,0,0,0.4)",
                  }}
                >
                  <span className="text-3xl font-black text-[#050D1A] tracking-tight select-none">UOU</span>
                  {/* 3D shine */}
                  <div className="absolute top-3 left-5 w-8 h-4 bg-white/30 rounded-full blur-sm" />
                </div>
                {/* Shadow */}
                <div
                  className="w-24 h-4 rounded-full mt-2"
                  style={{ background: "radial-gradient(ellipse, rgba(100,255,218,0.3), transparent)" }}
                />
              </motion.div>
            )}

            {/* Phase: Morphing to Text */}
            {phase === "text" && (
              <motion.div
                key="text"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 8 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 200, exit: { duration: 0.8, ease: "easeIn" } }}
                className="text-center px-8 select-none"
              >
                <motion.h1
                  className="font-black tracking-tight leading-none"
                  style={{ fontSize: "clamp(3rem, 10vw, 8rem)", color: "#fff" }}
                >
                  {"Unique ".split("").map((c, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, type: "spring", stiffness: 300, damping: 20 }}
                      style={{ display: "inline-block" }}
                    >
                      {c === " " ? "\u00A0" : c}
                    </motion.span>
                  ))}
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    style={{ color: "#64FFDA", display: "inline-block" }}
                  >
                    {"Open".split("").map((c, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.05, type: "spring", stiffness: 300 }}
                        style={{ display: "inline-block" }}
                      >
                        {c}
                      </motion.span>
                    ))}
                  </motion.span>
                  {" University".split("").map((c, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55 + i * 0.04, type: "spring", stiffness: 300, damping: 20 }}
                      style={{ display: "inline-block" }}
                    >
                      {c === " " ? "\u00A0" : c}
                    </motion.span>
                  ))}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="text-lg mt-4"
                  style={{ color: "rgba(100,255,218,0.7)" }}
                >
                  Institutional Operating System
                </motion.p>
              </motion.div>
            )}

            {/* Phase: Zoom */}
            {phase === "zoom" && (
              <motion.div
                key="zoom"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 20, opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
                className="w-40 h-40 rounded-full"
                style={{
                  background: "#64FFDA",
                  boxShadow: "0 0 200px rgba(100,255,218,0.8)",
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
