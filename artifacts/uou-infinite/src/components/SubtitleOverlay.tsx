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
    <div className="absolute bottom-3 left-0 right-0 flex justify-center px-4 pointer-events-none z-10">
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.text}
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -4, filter: "blur(2px)" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-lg text-center px-4 py-2 rounded-xl text-xs font-medium leading-relaxed"
            style={{
              background: "rgba(2, 8, 22, 0.9)",
              color: "#cbd5e1",
              border: "1px solid rgba(0, 112, 255, 0.3)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 0 20px rgba(0, 112, 255, 0.12)",
              textShadow: "0 1px 4px rgba(0,0,0,0.8)",
            }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full mr-2 mb-0.5 align-middle"
              style={{ background: "#60A5FA", boxShadow: "0 0 6px #60A5FA" }}
            />
            {active.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
