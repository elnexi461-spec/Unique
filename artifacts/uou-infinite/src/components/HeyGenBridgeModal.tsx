import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Lock, Shield, Video, AlertTriangle } from "lucide-react";
import { VideoEngineService } from "@/lib/VideoEngineService";

interface HeyGenBridgeModalProps {
  onConfirm: (key: string) => void;
  onDemoMode: () => void;
  onClose: () => void;
}

export function HeyGenBridgeModal({ onConfirm, onDemoMode, onClose }: HeyGenBridgeModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleEstablish = () => {
    if (!apiKey.trim()) {
      setError("API key cannot be empty.");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      VideoEngineService.setApiKey(apiKey.trim());
      setSaving(false);
      onConfirm(apiKey.trim());
    }, 600);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="heygen-overlay"
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ background: "rgba(0,4,20,0.88)", backdropFilter: "blur(18px)" }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          key="heygen-modal"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md rounded-2xl overflow-hidden relative"
          style={{
            background: "linear-gradient(160deg, rgba(4,10,40,0.99) 0%, rgba(2,6,28,0.99) 100%)",
            border: "1px solid rgba(96,165,250,0.35)",
            boxShadow: "0 0 0 1px rgba(96,165,250,0.08), 0 0 60px rgba(59,130,246,0.18), 0 32px 80px rgba(0,0,0,0.6)",
          }}
        >
          {/* Scanline overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{ backgroundImage: "repeating-linear-gradient(0deg, #60A5FA, #60A5FA 1px, transparent 1px, transparent 4px)" }} />

          {/* Top glow strip */}
          <div className="h-0.5 w-full"
            style={{ background: "linear-gradient(90deg, transparent, #3B82F6, #60A5FA, #3B82F6, transparent)" }} />

          {/* Header */}
          <div className="px-6 pt-5 pb-4 flex items-start justify-between border-b"
            style={{ borderColor: "rgba(96,165,250,0.12)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center relative"
                style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)" }}>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="absolute inset-0 rounded-xl"
                  style={{ background: "radial-gradient(circle, rgba(239,68,68,0.15), transparent)" }}
                />
                <Lock size={18} style={{ color: "#F87171" }} />
              </div>
              <div>
                <div className="text-[9px] font-bold tracking-[0.35em] uppercase mb-0.5"
                  style={{ color: "rgba(248,113,113,0.8)" }}>
                  ⚡ Security Protocol Active
                </div>
                <h2 className="text-base font-black text-white leading-tight">
                  Institutional AI Bridge Restricted
                </h2>
              </div>
            </div>
            <button onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
              style={{ color: "rgba(148,163,184,0.5)" }}>
              <X size={14} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-5">
            {/* Warning callout */}
            <div className="flex items-start gap-3 rounded-xl p-4"
              style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)" }}>
              <AlertTriangle size={15} className="shrink-0 mt-0.5" style={{ color: "#F59E0B" }} />
              <p className="text-xs leading-relaxed" style={{ color: "rgba(251,191,36,0.85)" }}>
                Please enter the <span className="font-bold">Video Engine API Key</span> to establish
                a secure link with the HeyGen synthesis bridge. Your key is stored locally and never transmitted.
              </p>
            </div>

            {/* Key input */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.25em] flex items-center gap-1.5"
                style={{ color: "rgba(96,165,250,0.7)" }}>
                <Zap size={10} /> HeyGen API Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="hg_••••••••••••••••••••••••••••••••"
                  value={apiKey}
                  onChange={e => { setApiKey(e.target.value); setError(""); }}
                  onKeyDown={e => { if (e.key === "Enter") handleEstablish(); }}
                  className="w-full px-4 py-3 rounded-xl text-sm font-mono outline-none transition-all"
                  style={{
                    background: "rgba(8,18,58,0.8)",
                    border: `1px solid ${error ? "rgba(248,113,113,0.5)" : apiKey ? "rgba(96,165,250,0.4)" : "rgba(59,130,246,0.2)"}`,
                    color: "#F0F9FF",
                    boxShadow: apiKey ? "0 0 0 3px rgba(59,130,246,0.08)" : "none",
                  }}
                  autoFocus
                />
                {apiKey && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#34D399", boxShadow: "0 0 6px #34D399" }} />
                  </div>
                )}
              </div>
              {error && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  className="text-xs flex items-center gap-1" style={{ color: "#F87171" }}>
                  <AlertTriangle size={10} /> {error}
                </motion.p>
              )}
            </div>

            {/* Current saved key notice */}
            {VideoEngineService.hasKey() && (
              <div className="flex items-center gap-2 rounded-lg px-3 py-2"
                style={{ background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.2)" }}>
                <Shield size={11} style={{ color: "#34D399" }} />
                <span className="text-[11px]" style={{ color: "rgba(52,211,153,0.85)" }}>
                  A key is currently saved. Entering a new key will replace it.
                </span>
              </div>
            )}

            {/* CTA buttons */}
            <div className="space-y-2.5 pt-1">
              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                onClick={handleEstablish}
                disabled={saving}
                className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                style={{
                  background: "linear-gradient(135deg, #1D4ED8, #3B82F6, #60A5FA)",
                  color: "white",
                  boxShadow: "0 0 24px rgba(59,130,246,0.35)",
                  opacity: saving ? 0.8 : 1,
                }}
              >
                {saving ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white" />
                    Establishing Bridge...
                  </>
                ) : (
                  <>
                    <Zap size={15} /> Establish Bridge
                  </>
                )}
              </motion.button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: "rgba(96,165,250,0.1)" }} />
                <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "rgba(96,165,250,0.3)" }}>or</span>
                <div className="flex-1 h-px" style={{ background: "rgba(96,165,250,0.1)" }} />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                onClick={onDemoMode}
                className="w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                style={{
                  background: "rgba(245,158,11,0.08)",
                  color: "#FBBF24",
                  border: "1px solid rgba(245,158,11,0.25)",
                }}
              >
                <Video size={14} /> Run in Demo Mode
              </motion.button>

              <p className="text-center text-[10px] leading-relaxed" style={{ color: "rgba(96,165,250,0.3)" }}>
                Demo mode plays the pre-loaded BAM111 lecture video · No API key required
              </p>
            </div>
          </div>

          {/* Footer strip */}
          <div className="px-6 py-3 border-t flex items-center gap-2"
            style={{ borderColor: "rgba(96,165,250,0.08)", background: "rgba(4,10,36,0.6)" }}>
            <Shield size={10} className="text-primary/40" />
            <span className="text-[9px] font-mono tracking-[0.15em] uppercase" style={{ color: "rgba(96,165,250,0.35)" }}>
              HeyGen · UOU Synthesis Bridge v2 · End-to-End Encrypted
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
