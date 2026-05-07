import { AnimatePresence, motion } from "framer-motion";

export interface SubtitleCue {
  start: number;
  end: number;
  text: string;
}

interface SubtitleOverlayProps {
  cues: SubtitleCue[];
  currentTime: number;
}

export function SubtitleOverlay({ cues, currentTime }: SubtitleOverlayProps) {
  const active = cues.find((c) => currentTime >= c.start && currentTime < c.end) ?? null;

  return (
    <div
      className="w-full flex items-center justify-center px-5"
      style={{
        background: "rgba(0,8,28,0.97)",
        borderTop: "1px solid rgba(96,165,250,0.18)",
        borderBottom: "1px solid rgba(96,165,250,0.1)",
        minHeight: 46,
      }}
    >
      <AnimatePresence mode="wait">
        {active ? (
          <motion.p
            key={active.text}
            initial={{ opacity: 0, y: 6, filter: "blur(3px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -4, filter: "blur(2px)" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-center leading-snug max-w-2xl py-2"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#60A5FA",
              textShadow: "0 0 14px rgba(96,165,250,0.5), 0 0 28px rgba(96,165,250,0.2)",
              letterSpacing: "0.015em",
            }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full mr-2 mb-0.5 align-middle shrink-0"
              style={{ background: "#60A5FA", boxShadow: "0 0 8px #60A5FA" }}
            />
            {active.text}
          </motion.p>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 py-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.15, 0.45, 0.15] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3 }}
                className="w-1 h-1 rounded-full"
                style={{ background: "rgba(96,165,250,0.4)" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
