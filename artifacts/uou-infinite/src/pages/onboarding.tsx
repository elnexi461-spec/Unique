import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { Shield, BookOpen, Award, Users, ChevronRight, CheckCircle, Zap, Star, Trophy } from "lucide-react";

const ONBOARDING_KEY = "uou_onboarding_done";

const CAMPUS_COLORS: Record<string, string> = {
  Zaria: "#A78BFA", Lagos: "#34D399", Kano: "#F59E0B",
  default: "#0070FF",
};

const TOP3 = [
  { name: "Ngozi Eze",      id: "UOU-ZR-1003", merit: 967, gold: 9,  campus: "Zaria" },
  { name: "Tunde Adeyemi",  id: "UOU-LA-2001", merit: 980, gold: 10, campus: "Lagos" },
  { name: "Yetunde Akindele",id: "UOU-LA-2005",merit: 930, gold: 9,  campus: "Lagos" },
];

const STEPS = [
  "Arrival", "Identity", "Engine", "Gold Card", "Vanguard", "Cleared",
];

const FLOW_NODES = [
  { label: "Recall", icon: BookOpen, color: "#A78BFA", desc: "Prime your memory" },
  { label: "Lecture", icon: BookOpen, color: "#0070FF", desc: "5 slides, 24s each" },
  { label: "Assessment", icon: Shield, color: "#F59E0B", desc: "10 questions, 120s" },
  { label: "Gold Card", icon: Award, color: "#FCD34D", desc: "Cryptographic proof" },
];

export default function OnboardingPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [litNodes, setLitNodes] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_KEY);
    if (completed === "true" && user) {
      const routes: Record<string, string> = {
        founder: "/founder", coordinator: "/coordinator",
        lecturer: "/lecturer", student: "/student",
      };
      setLocation(routes[user.role] ?? "/student");
    }
  }, [user]);

  useEffect(() => {
    if (step === 2) {
      setLitNodes([]);
      let i = 0;
      const t = setInterval(() => {
        setLitNodes(prev => [...prev, i]);
        i++;
        if (i >= FLOW_NODES.length) clearInterval(t);
      }, 600);
      return () => clearInterval(t);
    }
    return undefined;
  }, [step]);

  const campus = (user as any)?.campus?.replace?.(" Center", "")?.replace?.(" Campus", "")?.replace?.(" Main", "")?.replace?.(" Hub", "") ?? "Zaria";
  const campusColor = CAMPUS_COLORS[campus] ?? CAMPUS_COLORS.default;
  const userName = user?.name ?? "Scholar";
  const studentId = `UOU-${campus.slice(0, 2).toUpperCase()}-${String(user?.id ?? "001").padStart(5, "0")}`;

  const roleRoutes: Record<string, string> = {
    founder: "/founder", coordinator: "/coordinator",
    lecturer: "/lecturer", student: "/student",
  };
  const destination = user ? (roleRoutes[user.role] ?? "/student") : "/login";

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setDone(true);
    setTimeout(() => setLocation(destination), 1200);
  };

  const next = () => setStep(s => Math.min(s + 1, 5));
  const back = () => setStep(s => Math.max(s - 1, 0));
  const skip = () => handleComplete();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "hsl(222 72% 6%)" }}>

      {/* Grid bg */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(circle at center, #0070FF 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      {/* Progress dots */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {STEPS.map((_, i) => (
          <motion.div key={i}
            animate={{
              width: i === step ? 24 : 6,
              background: i < step ? "#34D399" : i === step ? "#0070FF" : "rgba(255,255,255,0.15)",
            }}
            transition={{ duration: 0.3 }}
            className="h-1.5 rounded-full"
          />
        ))}
      </div>

      {/* Skip */}
      {step < 5 && (
        <button onClick={skip}
          className="fixed top-5 right-6 text-xs font-mono text-muted-foreground hover:text-white transition-colors z-20 px-3 py-1.5 rounded-lg border"
          style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(4,11,26,0.5)" }}>
          Skip intro
        </button>
      )}

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div key={step}
          initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center px-6 max-w-lg w-full z-10"
        >
          {/* ── STEP 0: ARRIVAL ── */}
          {step === 0 && (
            <div className="flex flex-col items-center gap-8">
              <motion.div
                animate={{ filter: ["drop-shadow(0 0 20px rgba(0,112,255,0.5))", "drop-shadow(0 0 40px rgba(0,112,255,0.8))", "drop-shadow(0 0 20px rgba(0,112,255,0.5))"] }}
                transition={{ duration: 2.8, repeat: Infinity }}
              >
                <img src={import.meta.env.BASE_URL + "uou-logo.png"} alt="UOU"
                  className="w-28 h-28 object-contain" />
              </motion.div>
              <div className="space-y-3">
                <motion.h1
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-black tracking-tight text-white leading-tight">
                  The Vanguard<br />Awaits You
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                  className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Unique Open University — Digital Sovereign Campus.<br />
                  What follows is your initiation.
                </motion.p>
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border"
                style={{ background: "rgba(0,112,255,0.08)", borderColor: "rgba(0,112,255,0.25)", color: "#60A5FA" }}>
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.8, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Sentinel Active
              </motion.div>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={next}
                className="flex items-center gap-2 px-10 py-4 rounded-2xl font-black text-lg text-white"
                style={{ background: "linear-gradient(135deg, #0040C0, #0070FF)", boxShadow: "0 0 40px rgba(0,112,255,0.45)" }}>
                Begin Journey <ChevronRight size={20} />
              </motion.button>
            </div>
          )}

          {/* ── STEP 1: IDENTITY ── */}
          {step === 1 && (
            <div className="flex flex-col items-center gap-6 w-full">
              <div className="text-xs font-mono uppercase tracking-[0.3em] mb-2" style={{ color: "#0070FF" }}>
                Your Digital Identity
              </div>
              <motion.div
                animate={{ boxShadow: [`0 0 20px ${campusColor}50`, `0 0 45px ${campusColor}80`, `0 0 20px ${campusColor}50`] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-black border-4"
                style={{ background: `${campusColor}18`, borderColor: campusColor, color: campusColor }}>
                {userName.charAt(0).toUpperCase()}
              </motion.div>

              <div className="space-y-3 w-full max-w-sm">
                {[
                  { label: "Scholar Name", value: userName },
                  { label: "Student ID", value: studentId, mono: true },
                  { label: "Campus", value: `${campus} Campus`, color: campusColor },
                  { label: "Role", value: user?.role === "student" ? "Scholar" : (user?.role ?? "Scholar"), color: "#0070FF" },
                ].map((row, i) => (
                  <motion.div key={row.label}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-center justify-between rounded-xl border px-4 py-3"
                    style={{ background: "rgba(4,11,26,0.7)", borderColor: "rgba(0,112,255,0.15)" }}>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{row.label}</span>
                    <span className={`text-sm font-bold ${row.mono ? "font-mono" : ""}`}
                      style={{ color: row.color ?? "white" }}>{row.value}</span>
                  </motion.div>
                ))}
              </div>

              <p className="text-xs italic text-muted-foreground mt-1">
                "Your Sentinel profile is now active. The system knows you."
              </p>
            </div>
          )}

          {/* ── STEP 2: THE ACADEMIC ENGINE ── */}
          {step === 2 && (
            <div className="flex flex-col items-center gap-6 w-full">
              <div className="text-xs font-mono uppercase tracking-[0.3em]" style={{ color: "#0070FF" }}>
                The Academic Engine
              </div>
              <h2 className="text-2xl font-black text-white">Knowledge must be earned.</h2>
              <p className="text-sm text-muted-foreground max-w-xs">
                Every lecture at UOU follows a four-stage integrity pipeline.
                Passing each stage is not optional.
              </p>

              <div className="flex items-center gap-2 w-full mt-2">
                {FLOW_NODES.map((node, i) => {
                  const lit = litNodes.includes(i);
                  const Icon = node.icon;
                  return (
                    <div key={node.label} className="flex items-center gap-2 flex-1">
                      <motion.div
                        animate={lit ? { scale: [0.85, 1.08, 1], opacity: [0, 1] } : { opacity: 0.25 }}
                        transition={{ duration: 0.5 }}
                        className="flex-1 flex flex-col items-center gap-1.5 rounded-xl border p-3"
                        style={{
                          background: lit ? `${node.color}12` : "rgba(4,11,26,0.5)",
                          borderColor: lit ? `${node.color}50` : "rgba(255,255,255,0.06)",
                          boxShadow: lit ? `0 0 20px ${node.color}30` : "none",
                        }}>
                        <Icon size={18} style={{ color: lit ? node.color : "rgba(148,163,184,0.3)" }} />
                        <div className="text-[10px] font-bold" style={{ color: lit ? node.color : "rgba(148,163,184,0.4)" }}>
                          {node.label}
                        </div>
                        <div className="text-[8px] text-muted-foreground/50 leading-tight text-center">
                          {node.desc}
                        </div>
                      </motion.div>
                      {i < FLOW_NODES.length - 1 && (
                        <motion.div animate={litNodes.includes(i) && litNodes.includes(i + 1) ? { opacity: 1 } : { opacity: 0.15 }}
                          className="w-3 shrink-0 h-px"
                          style={{ background: "#0070FF" }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 3: GOLD CARD ── */}
          {step === 3 && (
            <div className="flex flex-col items-center gap-6 w-full">
              <div className="text-xs font-mono uppercase tracking-[0.3em]" style={{ color: "#F59E0B" }}>
                Gold Card Ceremony
              </div>
              <h2 className="text-2xl font-black text-white">Every pass is signed<br />by the Sentinel.</h2>

              {/* Mini Gold Card Preview */}
              <motion.div
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="rounded-2xl p-5 w-full max-w-sm relative overflow-hidden border"
                style={{
                  background: "linear-gradient(135deg, #1c0a00, #7c3a00, #f59e0b, #fde68a, #f59e0b, #7c3a00)",
                  backgroundSize: "300% 300%",
                  borderColor: "rgba(253,230,138,0.4)",
                }}>
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)" }} />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-[9px] font-bold tracking-[0.3em] uppercase" style={{ color: "rgba(28,15,0,0.6)" }}>
                        Unique Open University
                      </div>
                      <div className="text-[8px] tracking-[0.2em] uppercase" style={{ color: "rgba(28,15,0,0.45)" }}>
                        Academic Achievement
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center border-2"
                      style={{ background: "radial-gradient(circle, #60A5FA, #1D4ED8)", borderColor: "rgba(253,230,138,0.5)" }}>
                      <span className="text-white font-black text-[8px]">UOU</span>
                    </div>
                  </div>
                  <div className="text-[9px] uppercase tracking-wider mb-0.5" style={{ color: "rgba(28,15,0,0.5)" }}>Scholar</div>
                  <div className="text-lg font-black" style={{ color: "#1c0a00" }}>{userName}</div>
                  <div className="flex items-center gap-3 mt-3">
                    <div>
                      <div className="text-[8px] uppercase tracking-wider" style={{ color: "rgba(28,15,0,0.5)" }}>Course</div>
                      <div className="text-xs font-bold" style={{ color: "#1c0a00" }}>ENT-101</div>
                    </div>
                    <div>
                      <div className="text-[8px] uppercase tracking-wider" style={{ color: "rgba(28,15,0,0.5)" }}>Score</div>
                      <div className="text-lg font-black" style={{ color: "#1c0a00" }}>92%</div>
                    </div>
                    <div>
                      <div className="text-[8px] uppercase tracking-wider" style={{ color: "rgba(28,15,0,0.5)" }}>Grade</div>
                      <div className="text-lg font-black" style={{ color: "#1c0a00" }}>A</div>
                    </div>
                  </div>
                  <div className="mt-3 rounded-lg p-2 border" style={{ background: "rgba(28,15,0,0.15)", borderColor: "rgba(28,15,0,0.2)" }}>
                    <div className="text-[7px] font-bold tracking-wider uppercase mb-0.5" style={{ color: "rgba(28,15,0,0.5)" }}>Cryptographic Key</div>
                    <div className="font-mono text-[9px] font-bold" style={{ color: "#1c0a00" }}>UOU-GOLD-A4F8-B2D3-9E1C</div>
                  </div>
                </div>
              </motion.div>

              <p className="text-xs italic text-muted-foreground">
                "Your Gold Cards are permanent. Immutable. Proof of who you are."
              </p>
            </div>
          )}

          {/* ── STEP 4: VANGUARD ── */}
          {step === 4 && (
            <div className="flex flex-col items-center gap-5 w-full">
              <div className="text-xs font-mono uppercase tracking-[0.3em]" style={{ color: "#A78BFA" }}>
                The Vanguard Leaderboard
              </div>
              <h2 className="text-2xl font-black text-white">Rank is earned.<br />Not assigned.</h2>
              <p className="text-xs text-muted-foreground">
                Merit Score = Gold Cards × 100 + GPA × 50 + Punctuality × 2
              </p>

              <div className="space-y-3 w-full max-w-sm mt-1">
                {[...TOP3].sort((a, b) => b.merit - a.merit).map((s, i) => {
                  const rankColors = ["#FCD34D", "#94A3B8", "#CD7C32"];
                  const icons = [Trophy, Star, Zap];
                  const Icon = icons[i]!;
                  return (
                    <motion.div key={s.id}
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="rounded-xl border p-3 flex items-center gap-3"
                      style={{ background: "rgba(4,11,26,0.7)", borderColor: `${rankColors[i]}25` }}>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${rankColors[i]}18`, border: `1px solid ${rankColors[i]}40` }}>
                        <Icon size={13} style={{ color: rankColors[i] }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white truncate">{s.name}</div>
                        <div className="text-[9px] text-muted-foreground">{s.campus} · {s.gold} Gold Cards</div>
                      </div>
                      <div className="text-sm font-black font-mono" style={{ color: rankColors[i] }}>
                        {s.merit}
                      </div>
                      <div className="w-20">
                        <motion.div className="h-1 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(s.merit / 1000) * 100}%` }}
                          transition={{ delay: 0.5 + i * 0.15, duration: 0.8 }}
                          style={{ background: `linear-gradient(90deg, ${rankColors[i]}70, ${rankColors[i]})` }} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="text-xs text-muted-foreground italic">
                "Will your name be on this board? It's your choice."
              </div>
            </div>
          )}

          {/* ── STEP 5: CLEARED ── */}
          {step === 5 && (
            <div className="flex flex-col items-center gap-6 relative">
              {/* Particle burst */}
              {Array.from({ length: 20 }, (_, i) => (
                <motion.div key={i}
                  className="absolute pointer-events-none rounded-full"
                  initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos((i / 20) * Math.PI * 2) * (80 + Math.random() * 120),
                    y: Math.sin((i / 20) * Math.PI * 2) * (80 + Math.random() * 100),
                    scale: [0, 1, 0],
                    opacity: [1, 0.8, 0],
                  }}
                  transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
                  style={{
                    width: 6 + (i % 4) * 3,
                    height: 6 + (i % 4) * 3,
                    background: ["#FCD34D", "#0070FF", "#A78BFA", "#34D399", "#F59E0B"][i % 5],
                    top: "50%", left: "50%",
                  }}
                />
              ))}

              <motion.div
                animate={{ scale: [0.8, 1.1, 1], rotate: [0, 10, 0] }}
                transition={{ duration: 0.7 }}
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, rgba(0,112,255,0.2), rgba(0,112,255,0.05))", border: "2px solid rgba(0,112,255,0.4)", boxShadow: "0 0 40px rgba(0,112,255,0.35)" }}>
                <CheckCircle size={36} style={{ color: "#0070FF" }} />
              </motion.div>

              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white">You are cleared<br />for entry.</h2>
                <p className="text-sm" style={{ color: "#60A5FA" }}>
                  Welcome to the Vanguard, <strong>{userName}</strong>.
                </p>
                <p className="text-xs text-muted-foreground">
                  The Sentinel is watching. The Gold Cards await.
                </p>
              </div>

              {!done && (
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={handleComplete}
                  className="flex items-center gap-2 px-10 py-4 rounded-2xl font-black text-lg text-white mt-2"
                  style={{ background: "linear-gradient(135deg, #0040C0, #0070FF)", boxShadow: "0 0 50px rgba(0,112,255,0.5)" }}>
                  Enter Digital Campus <ChevronRight size={20} />
                </motion.button>
              )}

              {done && (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }}
                  className="text-sm font-mono text-primary">
                  Loading your portal...
                </motion.div>
              )}
            </div>
          )}

          {/* Nav buttons */}
          {step > 0 && step < 5 && (
            <div className="flex items-center gap-3 mt-8">
              <motion.button whileHover={{ x: -2 }} onClick={back}
                className="px-5 py-2.5 rounded-xl border text-sm font-medium"
                style={{ background: "rgba(4,11,26,0.6)", borderColor: "rgba(0,112,255,0.2)", color: "rgba(148,163,184,0.8)" }}>
                ← Back
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={next}
                className="flex items-center gap-2 px-8 py-2.5 rounded-xl font-semibold text-sm text-white"
                style={{ background: "linear-gradient(135deg, #0040C0, #0070FF)", boxShadow: "0 0 20px rgba(0,112,255,0.3)" }}>
                Continue <ChevronRight size={16} />
              </motion.button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <div className="fixed bottom-4 text-[10px] font-mono text-muted-foreground/40 z-10">
        UOU Infinite · Digital Sovereign Campus · {STEPS[step]}
      </div>
    </div>
  );
}
