import { useEffect, useState } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";

interface CinematicIntroProps {
  onComplete: () => void;
}

/* UOU Logo SVG — official institutional blue orb with embossed letters */
function UOULogoOrb({ size = 160 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="orb-grad" cx="38%" cy="32%" r="70%">
          <stop offset="0%"   stopColor="#60A5FA" />
          <stop offset="40%"  stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#0B1E4A" />
        </radialGradient>
        <radialGradient id="orb-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#3B82F6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0" />
        </radialGradient>
        <filter id="orb-shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <clipPath id="orb-clip">
          <circle cx="80" cy="80" r="74" />
        </clipPath>
      </defs>
      {/* Outer glow ring */}
      <circle cx="80" cy="80" r="78" fill="url(#orb-glow)" opacity="0.5" />
      {/* Main sphere */}
      <circle cx="80" cy="80" r="74" fill="url(#orb-grad)" filter="url(#orb-shadow)" />
      {/* Inner shine highlight */}
      <ellipse cx="60" cy="52" rx="22" ry="12" fill="white" opacity="0.18" />
      {/* Ring band */}
      <ellipse cx="80" cy="80" rx="74" ry="22" fill="none" stroke="rgba(96,165,250,0.25)" strokeWidth="1.5" />
      {/* UOU Text */}
      <text
        x="80" y="72"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="'Inter', system-ui, sans-serif"
        fontWeight="900"
        fontSize="22"
        letterSpacing="2"
        fill="white"
      >
        UOU
      </text>
      {/* Subtitle */}
      <text
        x="80" y="96"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="'Inter', system-ui, sans-serif"
        fontWeight="500"
        fontSize="7.5"
        letterSpacing="3"
        fill="rgba(147,197,253,0.9)"
      >
        INFINITE
      </text>
      {/* Bottom arc text */}
      <path id="arc-bottom" d="M 20,80 A 60,60 0 0,0 140,80" fill="none" />
      {/* Glint dot top right */}
      <circle cx="118" cy="44" r="3" fill="white" opacity="0.55" />
    </svg>
  );
}

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [phase, setPhase] = useState<"ball" | "text" | "zoom" | "done">("ball");

  /* Graceful, heavy physics — low stiffness/damping for slow intentional bounces */
  const ballY = useSpring(0, { stiffness: 90, damping: 14, mass: 1.4 });
  const ballSquish = useSpring(1, { stiffness: 140, damping: 14, mass: 0.8 });

  useEffect(() => {
    let bounceCount = 0;
    const FALL_MS = 480;
    const RISE_MS = 520;
    const PAUSE_MS = 180;

    const bounce = () => {
      if (bounceCount >= 3) {
        setTimeout(() => setPhase("text"), 300);
        return;
      }
      /* Fall */
      ballY.set(160);
      setTimeout(() => {
        /* Squish on land */
        ballSquish.set(0.75);
        ballY.set(0);
        setTimeout(() => {
          ballSquish.set(1);
          bounceCount++;
          setTimeout(bounce, PAUSE_MS);
        }, RISE_MS);
      }, FALL_MS);
    };

    const t1 = setTimeout(bounce, 600);

    /* Text morph phase — starts at ~3 s */
    const t2 = setTimeout(() => setPhase("text"), 3000);

    /* "Open" portal zoom — at ~6 s */
    const t3 = setTimeout(() => setPhase("zoom"), 6200);

    /* Cross-fade complete → hand off to homepage at ~9.5 s */
    const t4 = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 9500);

    return () => {
      clearTimeout(t1); clearTimeout(t2);
      clearTimeout(t3); clearTimeout(t4);
    };
  }, []);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 50%, #0C2259 0%, #040B1A 60%, #020610 100%)",
          }}
        >
          {/* Animated deep-blue grid */}
          <div className="absolute inset-0 overflow-hidden opacity-15 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="ci-grid" width="70" height="70" patternUnits="userSpaceOnUse">
                  <path d="M 70 0 L 0 0 0 70" fill="none" stroke="#3B82F6" strokeWidth="0.5" opacity="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#ci-grid)" />
            </svg>
          </div>

          {/* Central stage glow */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(59,130,246,0.2), transparent 70%)",
            }}
          />

          <AnimatePresence mode="wait">

            {/* PHASE 1 — Graceful Bouncing Logo */}
            {phase === "ball" && (
              <motion.div
                key="ball"
                initial={{ opacity: 0, scale: 0.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 3, filter: "blur(20px)" }}
                transition={{
                  enter: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                  exit:  { duration: 0.6, ease: "easeIn" },
                }}
                className="flex flex-col items-center select-none"
                style={{ y: ballY }}
              >
                <motion.div style={{ scaleY: ballSquish, transformOrigin: "bottom" }}>
                  <UOULogoOrb size={160} />
                </motion.div>
                {/* Dynamic ground shadow */}
                <motion.div
                  style={{
                    scaleX: ballSquish,
                    opacity: 0.4,
                    width: 120,
                    height: 14,
                    borderRadius: "50%",
                    background: "radial-gradient(ellipse, rgba(59,130,246,0.5), transparent)",
                    marginTop: 8,
                  }}
                />
              </motion.div>
            )}

            {/* PHASE 2 — Text Morph: "Unique Open University" */}
            {phase === "text" && (
              <motion.div
                key="text"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-center px-8 select-none"
              >
                {/* Small logo above text */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="flex justify-center mb-6"
                >
                  <UOULogoOrb size={64} />
                </motion.div>

                <motion.h1
                  className="font-black tracking-tight leading-none"
                  style={{ fontSize: "clamp(2.8rem, 9vw, 7rem)", color: "#fff" }}
                >
                  {/* "Unique" — letter by letter, slow ease */}
                  {"Unique ".split("").map((c, i) => (
                    <motion.span
                      key={`u${i}`}
                      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{
                        delay: i * 0.08,
                        duration: 0.65,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{ display: "inline-block" }}
                    >
                      {c === " " ? "\u00A0" : c}
                    </motion.span>
                  ))}

                  {/* "Open" — Electric Brand Blue */}
                  {"Open".split("").map((c, i) => (
                    <motion.span
                      key={`o${i}`}
                      initial={{ opacity: 0, y: -40, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{
                        delay: 0.6 + i * 0.09,
                        duration: 0.7,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{
                        display: "inline-block",
                        color: "#60A5FA",
                        textShadow: "0 0 40px rgba(59,130,246,0.6), 0 0 80px rgba(59,130,246,0.3)",
                      }}
                    >
                      {c}
                    </motion.span>
                  ))}

                  {/* " University" */}
                  {" University".split("").map((c, i) => (
                    <motion.span
                      key={`v${i}`}
                      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{
                        delay: 1.0 + i * 0.07,
                        duration: 0.65,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{ display: "inline-block" }}
                    >
                      {c === " " ? "\u00A0" : c}
                    </motion.span>
                  ))}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.4, duration: 0.8, ease: "easeOut" }}
                  className="text-base md:text-lg mt-5 font-light tracking-[0.25em] uppercase"
                  style={{ color: "rgba(147,197,253,0.75)" }}
                >
                  Institutional Operating System
                </motion.p>

                {/* Horizontal rule */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 2.7, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="mx-auto mt-6 h-[1px] max-w-xs"
                  style={{
                    background: "linear-gradient(90deg, transparent, #3B82F6, transparent)",
                    transformOrigin: "center",
                  }}
                />
              </motion.div>
            )}

            {/* PHASE 3 — Slow Cinematic Portal Zoom */}
            {phase === "zoom" && (
              <motion.div
                key="zoom"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 28, opacity: 0 }}
                transition={{
                  duration: 3.5,
                  ease: [0.12, 0, 0.39, 0],
                }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at 40% 40%, #60A5FA 0%, #1D4ED8 50%, #0B1E4A 100%)",
                  boxShadow:
                    "0 0 80px rgba(59,130,246,0.9), 0 0 160px rgba(59,130,246,0.5)",
                  fontFamily: "serif",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 52,
                  fontWeight: 900,
                  color: "white",
                }}
              >
                O
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
