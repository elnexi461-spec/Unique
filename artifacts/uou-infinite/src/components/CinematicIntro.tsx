import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";

interface CinematicIntroProps {
  onComplete: () => void;
}

function UOULogo({ size = 160, glow = true }: { size?: number; glow?: boolean }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {glow && (
        <div
          style={{
            position: "absolute",
            inset: -size * 0.18,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(30,58,138,0.55) 0%, rgba(59,130,246,0.18) 55%, transparent 75%)",
            filter: `blur(${size * 0.12}px)`,
            pointerEvents: "none",
          }}
        />
      )}
      <img
        src={import.meta.env.BASE_URL + "uou-logo.png"}
        alt="UOU Logo"
        draggable={false}
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          filter: `drop-shadow(0 0 ${size * 0.12}px rgba(59,130,246,0.6)) drop-shadow(0 0 ${size * 0.22}px rgba(29,78,216,0.4))`,
          userSelect: "none",
        }}
      />
    </div>
  );
}

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [phase, setPhase] = useState<"ball" | "text" | "zoom" | "done">("ball");

  /* 1.5× faster physics — higher stiffness, lower mass */
  const ballY     = useSpring(0, { stiffness: 135, damping: 14, mass: 0.93 });
  const ballSquish = useSpring(1, { stiffness: 210, damping: 14, mass: 0.53 });

  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    /* 1.5× speed: 480/1.5=320, 520/1.5=347, 180/1.5=120 */
    const FALL   = 320;
    const RISE   = 347;
    const PAUSE  = 120;
    let bounceCount = 0;
    const ts: ReturnType<typeof setTimeout>[] = [];

    const doBounce = () => {
      ballY.set(160);
      ts.push(setTimeout(() => {
        ballSquish.set(0.74);
        ballY.set(0);
        ts.push(setTimeout(() => {
          ballSquish.set(1);
          bounceCount++;
          if (bounceCount < 4) {
            ts.push(setTimeout(doBounce, PAUSE));
          } else {
            /* 4th bounce complete — logo stops instantly, text fades in */
            setPhase("text");
          }
        }, RISE));
      }, FALL));
    };

    /* Start drop at 400ms (1.5× faster than original 600ms) */
    ts.push(setTimeout(doBounce, 400));

    /* 4 bounces complete at ~3550ms. Text phase for ~1900ms.
       Zoom phase at 5450ms, done at 6900ms. */
    ts.push(setTimeout(() => { if (phaseRef.current !== "done") setPhase("zoom"); }, 5450));
    ts.push(setTimeout(() => { setPhase("done"); onComplete(); }, 6900));

    return () => { ts.forEach(clearTimeout); };
  }, []);

  const bg = "radial-gradient(ellipse 90% 75% at 50% 55%, #0D1F4E 0%, #060E26 50%, #020814 100%)";

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden cursor-pointer select-none"
          style={{ background: bg }}
          onClick={() => { setPhase("done"); onComplete(); }}
        >
          {/* Institutional grid */}
          <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="ci-grid" width="70" height="70" patternUnits="userSpaceOnUse">
                  <path d="M 70 0 L 0 0 0 70" fill="none" stroke="#1D4ED8" strokeWidth="0.5" opacity="0.6" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#ci-grid)" />
            </svg>
          </div>

          {/* Ambient glow */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.18, 0.08] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(29,78,216,0.25), transparent 70%)" }}
          />

          <AnimatePresence mode="wait">

            {/* ── PHASE 1 — Bouncing Logo (4 bounces at 1.5× speed) ── */}
            {phase === "ball" && (
              <motion.div
                key="ball"
                initial={{ opacity: 0, scale: 0.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 2.5, filter: "blur(16px)" }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center"
                style={{ y: ballY }}
              >
                <motion.div style={{ scaleY: ballSquish, transformOrigin: "bottom" }}>
                  <UOULogo size={180} glow />
                </motion.div>

                {/* Ground shadow */}
                <motion.div
                  style={{
                    scaleX: ballSquish,
                    opacity: 0.35,
                    width: 140,
                    height: 16,
                    borderRadius: "50%",
                    background: "radial-gradient(ellipse, rgba(29,78,216,0.55), transparent)",
                    marginTop: 10,
                  }}
                />
              </motion.div>
            )}

            {/* ── PHASE 2 — Text Reveal (logo stops, name fades in) ── */}
            {phase === "text" && (
              <motion.div
                key="text"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-center px-8"
              >
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.05 }}
                  className="flex justify-center mb-7"
                >
                  <UOULogo size={88} glow />
                </motion.div>

                <motion.h1
                  className="font-semibold tracking-[0.12em] leading-snug"
                  style={{
                    fontSize: "24px",
                    color: "#fff",
                    fontFamily: 'Georgia, "Times New Roman", Garamond, serif',
                    letterSpacing: "0.1em",
                  }}
                >
                  {"Unique ".split("").map((c, i) => (
                    <motion.span
                      key={`u${i}`}
                      initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: i * 0.045, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                      style={{ display: "inline-block" }}
                    >
                      {c === " " ? "\u00A0" : c}
                    </motion.span>
                  ))}
                  {"Open".split("").map((c, i) => (
                    <motion.span
                      key={`o${i}`}
                      initial={{ opacity: 0, y: -30, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: 0.32 + i * 0.055, duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        display: "inline-block",
                        color: "#60A5FA",
                        textShadow: "0 0 40px rgba(59,130,246,0.6), 0 0 80px rgba(59,130,246,0.3)",
                      }}
                    >
                      {c}
                    </motion.span>
                  ))}
                  {" University".split("").map((c, i) => (
                    <motion.span
                      key={`v${i}`}
                      initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: 0.58 + i * 0.042, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                      style={{ display: "inline-block" }}
                    >
                      {c === " " ? "\u00A0" : c}
                    </motion.span>
                  ))}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3, duration: 0.55, ease: "easeOut" }}
                  className="text-base mt-5 font-light tracking-[0.25em] uppercase"
                  style={{ color: "rgba(147,197,253,0.75)" }}
                >
                  ...knowledge for global impact
                </motion.p>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="mx-auto mt-5 h-[1px] max-w-xs"
                  style={{
                    background: "linear-gradient(90deg, transparent, #3B82F6, transparent)",
                    transformOrigin: "center",
                  }}
                />
              </motion.div>
            )}

            {/* ── PHASE 3 — Fast Zoom (1.5s, fills screen) ── */}
            {phase === "zoom" && (
              <motion.div
                key="zoom"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 30, opacity: 0 }}
                transition={{ duration: 1.5, ease: [0.12, 0, 0.39, 0] }}
                style={{ width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <UOULogo size={120} glow={false} />
              </motion.div>
            )}

          </AnimatePresence>

          {/* Skip hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs tracking-widest uppercase"
            style={{ color: "rgba(148,163,184,0.6)" }}
          >
            tap to skip
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
