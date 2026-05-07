import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Users, BookOpen, GraduationCap, ChevronRight, Zap, Lock } from "lucide-react";
import { DEMO_PERSONAS } from "@/data/mockDatabase";
import { setAuthToken } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { getGetMeQueryKey } from "@workspace/api-client-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const ROLE_CONFIG = {
  student: {
    icon: GraduationCap,
    color: "#60A5FA",
    glow: "rgba(59,130,246,0.4)",
    border: "rgba(59,130,246,0.35)",
    bg: "rgba(59,130,246,0.08)",
    route: "/student",
    badge: "Scholar Portal",
  },
  coordinator: {
    icon: Users,
    color: "#34D399",
    glow: "rgba(52,211,153,0.4)",
    border: "rgba(52,211,153,0.35)",
    bg: "rgba(52,211,153,0.08)",
    route: "/coordinator",
    badge: "Coordinator Hub",
  },
  lecturer: {
    icon: BookOpen,
    color: "#A78BFA",
    glow: "rgba(167,139,250,0.4)",
    border: "rgba(167,139,250,0.35)",
    bg: "rgba(167,139,250,0.08)",
    route: "/lecturer",
    badge: "Lecturer Portal",
  },
  founder: {
    icon: Shield,
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.4)",
    border: "rgba(245,158,11,0.35)",
    bg: "rgba(245,158,11,0.08)",
    route: "/founder",
    badge: "Founder's War Room",
  },
};

interface DemoPersonaSelectorProps {
  onSkip: () => void;
}

export function DemoPersonaSelector({ onSkip }: DemoPersonaSelectorProps) {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const qc = useQueryClient();

  const handleSelect = async (persona: typeof DEMO_PERSONAS[0]) => {
    setLoading(persona.email);
    setError(null);
    try {
      const res = await fetch(`${BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: persona.email, password: persona.password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login failed — please run the seed first.");
        setLoading(null);
        return;
      }
      const data = await res.json();
      setAuthToken(data.token);
      await qc.invalidateQueries({ queryKey: getGetMeQueryKey() });
      const cfg = ROLE_CONFIG[persona.role as keyof typeof ROLE_CONFIG];
      setLocation(cfg.route);
    } catch {
      setError("Network error — is the API server running?");
    }
    setLoading(null);
  };

  const displayPersonas = DEMO_PERSONAS.filter(p => p.role !== "founder");
  const founderPersona = DEMO_PERSONAS.find(p => p.role === "founder")!;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[9998] flex items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(ellipse 90% 75% at 50% 55%, #0D1F4E 0%, #060E26 50%, #020814 100%)",
      }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 overflow-hidden opacity-8 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="dp-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#1D4ED8" strokeWidth="0.5" opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dp-grid)" />
        </svg>
      </div>

      {/* Ambient glow */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.07, 0.16, 0.07] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(29,78,216,0.3), transparent 70%)" }}
      />

      <div className="relative z-10 w-full max-w-5xl px-6 py-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-10"
        >
          <div className="flex justify-center mb-5">
            <img src={import.meta.env.BASE_URL + "uou-logo.png"} alt="UOU" className="w-16 h-16 object-contain"
              style={{ filter: "drop-shadow(0 0 16px rgba(59,130,246,0.55))" }} />
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.3em] uppercase mb-3 px-4 py-1.5 rounded-full border"
            style={{ background: "rgba(59,130,246,0.1)", borderColor: "rgba(59,130,246,0.25)", color: "#60A5FA" }}>
            <Zap size={12} /> Demo Mode — Select Your Persona
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-3">
            Enter as Who?
          </h1>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Each persona gives you a bespoke view of UOU Infinite. Select a role to begin your session instantly.
          </p>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-3 rounded-xl border text-sm text-center"
              style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.3)", color: "#FCA5A5" }}>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3 main persona cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {displayPersonas.map((persona, i) => {
            const cfg = ROLE_CONFIG[persona.role as keyof typeof ROLE_CONFIG];
            const Icon = cfg.icon;
            const isLoading = loading === persona.email;
            return (
              <motion.button
                key={persona.email}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(persona)}
                disabled={!!loading}
                className="relative text-left rounded-2xl p-6 border overflow-hidden group transition-all"
                style={{
                  background: cfg.bg,
                  borderColor: cfg.border,
                  backdropFilter: "blur(20px)",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading && !isLoading ? 0.5 : 1,
                }}
              >
                {/* Hover glow */}
                <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${cfg.glow.replace("0.4", "0.12")}, transparent 70%)` }} />

                {/* Top bar */}
                <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-60"
                  style={{ background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)` }} />

                {/* Avatar */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 border font-black text-xl"
                  style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.color }}>
                  {isLoading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                      <Zap size={22} style={{ color: cfg.color }} />
                    </motion.div>
                  ) : persona.avatar}
                </div>

                <div className="mb-3">
                  <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: cfg.color }}>
                    {cfg.badge}
                  </div>
                  <div className="text-xl font-black text-white leading-tight">{persona.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">{persona.tagline}</div>
                </div>

                {persona.role === "student" && "meritScore" in persona && (
                  <div className="grid grid-cols-2 gap-2 mt-4 mb-2">
                    {[
                      { label: "Merit Score", value: (persona as typeof DEMO_PERSONAS[0] & { meritScore: number }).meritScore },
                      { label: "Gold Cards", value: (persona as typeof DEMO_PERSONAS[0] & { goldCards: number }).goldCards },
                    ].map(stat => (
                      <div key={stat.label} className="rounded-lg px-3 py-2 text-center"
                        style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${cfg.border}` }}>
                        <div className="text-lg font-black" style={{ color: cfg.color }}>{stat.value}</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-muted-foreground font-mono">{persona.campus}</span>
                  <ChevronRight size={16} style={{ color: cfg.color }} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Founder card — full width, more dramatic */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          whileHover={{ scale: 1.01, y: -3 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => handleSelect(founderPersona)}
          disabled={!!loading}
          className="w-full relative text-left rounded-2xl p-5 border overflow-hidden group transition-all"
          style={{
            background: "rgba(245,158,11,0.06)",
            borderColor: "rgba(245,158,11,0.3)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-60"
            style={{ background: "linear-gradient(90deg, transparent, #F59E0B, transparent)" }} />
          <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.08), transparent 60%)" }} />

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border font-black text-lg shrink-0"
              style={{ background: "rgba(245,158,11,0.1)", borderColor: "rgba(245,158,11,0.3)", color: "#F59E0B" }}>
              {loading === founderPersona.email ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                  <Zap size={20} style={{ color: "#F59E0B" }} />
                </motion.div>
              ) : <Shield size={20} style={{ color: "#F59E0B" }} />}
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold tracking-widest uppercase mb-0.5" style={{ color: "#F59E0B" }}>
                Founder's War Room
              </div>
              <div className="text-lg font-black text-white">{founderPersona.name}</div>
              <div className="text-sm text-muted-foreground">{founderPersona.tagline}</div>
            </div>
            <Lock size={14} className="opacity-40 mr-1 shrink-0" style={{ color: "#F59E0B" }} />
            <ChevronRight size={18} style={{ color: "#F59E0B" }} className="opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
        </motion.button>

        {/* Skip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-6"
        >
          <button onClick={onSkip}
            className="text-xs tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors">
            Skip — enter manually →
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
