import { motion, AnimatePresence } from "framer-motion";

interface SentinelPulseProps {
  active?: boolean;
  label?: string;
}

export function SentinelPulse({ active = false, label = "UOU Sentinel Active" }: SentinelPulseProps) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="pulse"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-0 left-0 right-0 z-[9990] pointer-events-none"
        >
          {/* Blue Pulse Bar */}
          <div
            className="sentinel-pulse mx-auto"
            style={{
              height: 3,
              background: "linear-gradient(90deg, transparent 0%, #1D4ED8 15%, #3B82F6 40%, #60A5FA 50%, #3B82F6 60%, #1D4ED8 85%, transparent 100%)",
              boxShadow: "0 0 16px rgba(59,130,246,0.8), 0 0 40px rgba(59,130,246,0.4)",
            }}
          />
          {/* Label */}
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center justify-center gap-2 py-1"
            style={{
              background:
                "linear-gradient(0deg, rgba(4,11,26,0.95) 0%, rgba(13,30,80,0.6) 100%)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "#3B82F6", boxShadow: "0 0 6px #3B82F6" }}
            />
            <span
              className="text-[10px] font-mono tracking-[0.25em] uppercase"
              style={{ color: "rgba(96,165,250,0.8)" }}
            >
              {label}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
