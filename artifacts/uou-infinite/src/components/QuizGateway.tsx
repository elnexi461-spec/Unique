import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Timer, AlertTriangle, CheckCircle, XCircle, ArrowRight,
  Brain, Lock, Loader2, ShieldAlert, Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { pushAuditEntry } from "@/data/mockDatabase";

interface Question {
  id: number;
  scenario: string;
  options: string[];
  correctIndex: number;
}

interface QuizGatewayProps {
  courseTitle: string;
  courseId: number;
  studentId: string;
  studentName: string;
  onPass: (score: number, grade: string, privateKey: string) => void;
  onFail: (attempt: number) => void;
  attempt: number;
}

/* Academic Gauntlet — 5 questions, 75s timer */
const TIMER_SECONDS = 75;
/* Any correct answer (≥1/5) earns a tier card */
const PASS_THRESHOLD = 20;

const CONFETTI = Array.from({ length: 48 }, (_, i) => ({
  x: ((i * 7.3) % 97) + 1.5,
  size: 5 + (i % 7),
  color: ["#3B82F6", "#60A5FA", "#F59E0B", "#FBBF24", "#10B981", "#A78BFA", "#F43F5E", "#FCD34D"][i % 8]!,
  duration: 1.3 + ((i * 3) % 8) * 0.12,
  delay: (i % 14) * 0.06,
  rotate: ((i * 53) % 360),
}));

type Tier = "GOLD" | "SILVER" | "BRONZE" | "FAIL";

function getTier(correct: number): Tier {
  if (correct === 5) return "GOLD";
  if (correct >= 3) return "SILVER";
  if (correct >= 1) return "BRONZE";
  return "FAIL";
}

async function generatePerformanceKey(studentId: string, courseId: number, tier: string): Promise<string> {
  const timestamp = Date.now();
  const raw = `${studentId}::${courseId}::${tier}::${timestamp}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(raw);
  try {
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    return `UOU-${tier}-${hex.slice(0, 6).toUpperCase()}-${hex.slice(6, 12).toUpperCase()}-${hex.slice(12, 18).toUpperCase()}`;
  } catch {
    const fallback = Math.random().toString(36).slice(2).toUpperCase();
    return `UOU-${tier}-${fallback.slice(0, 6)}-${fallback.slice(6, 12)}-${fallback.slice(12, 18)}`;
  }
}

/* 5 scenario-based questions — take the first 5 of 10 generated */
function generateQuestions(courseTitle: string): Question[] {
  const all: Question[] = [
    {
      id: 1,
      scenario: `A student in ${courseTitle} notices a contradiction between two frameworks discussed in the lecture. Which approach would best resolve this tension in a real-world context?`,
      options: [
        "Apply the first framework exclusively and ignore the second",
        "Synthesize both frameworks based on the specific context and constraints",
        "Use whichever framework was mentioned last in the lecture",
        "Discard both and rely only on intuition",
      ],
      correctIndex: 1,
    },
    {
      id: 2,
      scenario: `If the core concept from today's ${courseTitle} session were applied in a high-pressure, resource-scarce environment, what would be the PRIMARY risk?`,
      options: [
        "Complete failure due to lack of resources",
        "Unintended consequences from oversimplification of context",
        "The concept becomes irrelevant under pressure",
        "There would be no risk — the concept is universally applicable",
      ],
      correctIndex: 1,
    },
    {
      id: 3,
      scenario: `A practitioner misapplies the principle taught in today's ${courseTitle} lecture. What is the most likely downstream consequence?`,
      options: [
        "Immediate and obvious system failure",
        "The error self-corrects over time without intervention",
        "Compounded errors that become harder to trace back to the original mistake",
        "No consequences — principles are flexible",
      ],
      correctIndex: 2,
    },
    {
      id: 4,
      scenario: `What would happen if the methodology from today's ${courseTitle} session were scaled 10× beyond its designed scope?`,
      options: [
        "It would perform 10× better due to economies of scale",
        "It would break down at critical stress points, revealing hidden assumptions",
        "Nothing changes — good methodology is infinitely scalable",
        "It would automatically adapt without any modification",
      ],
      correctIndex: 1,
    },
    {
      id: 5,
      scenario: `In today's ${courseTitle} material, which factor is MOST critical when transitioning theory into practice?`,
      options: [
        "Strict adherence to the theoretical model regardless of context",
        "Speed of implementation to reduce costs",
        "Understanding the gap between ideal conditions and real-world constraints",
        "Having the maximum number of resources available",
      ],
      correctIndex: 2,
    },
  ];
  return all;
}

type UIPhase = "intro" | "quiz" | "verifying" | "mastered" | "audit" | "generating";

const TIER_META: Record<Exclude<Tier, "FAIL">, {
  emoji: string; label: string; color: string; bg: string; border: string; desc: string;
}> = {
  GOLD:   { emoji: "🥇", label: "GOLD",   color: "#F59E0B", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.35)",  desc: "Perfect mastery. All 5 answered correctly." },
  SILVER: { emoji: "🥈", label: "SILVER", color: "#94A3B8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.35)", desc: "Strong performance. 3–4 of 5 correct." },
  BRONZE: { emoji: "🥉", label: "BRONZE", color: "#D97706", bg: "rgba(180,83,9,0.1)",   border: "rgba(180,83,9,0.35)",   desc: "Partial mastery. 1–2 of 5 correct." },
};

export function QuizGateway({
  courseTitle, courseId, studentId, studentName, onPass, onFail, attempt,
}: QuizGatewayProps) {
  const [questions] = useState<Question[]>(() => generateQuestions(courseTitle));
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(5).fill(null));
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [uiPhase, setUIPhase] = useState<UIPhase>("intro");
  const [score, setScore] = useState(0);
  const [achievedTier, setAchievedTier] = useState<Exclude<Tier, "FAIL">>("BRONZE");
  const [showDoubleCheck, setShowDoubleCheck] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  /* Anti-exit lock */
  useEffect(() => {
    if (uiPhase !== "quiz") return;
    window.history.pushState(null, "", window.location.href);
    const handler = () => {
      window.history.pushState(null, "", window.location.href);
      setShowExitWarning(true);
    };
    const beforeUnload = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("popstate", handler);
    window.addEventListener("beforeunload", beforeUnload);
    return () => {
      window.removeEventListener("popstate", handler);
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, [uiPhase]);

  /* Countdown */
  useEffect(() => {
    if (uiPhase !== "quiz") return;
    if (timeLeft <= 0) { doSubmit(true); return; }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, uiPhase]);

  const allAnswered = answers.every(a => a !== null);
  const answeredCount = answers.filter(a => a !== null).length;

  const handleAnswer = (optionIdx: number) => {
    const updated = [...answers];
    updated[currentQ] = optionIdx;
    setAnswers(updated);
    if (currentQ < questions.length - 1) {
      setTimeout(() => setCurrentQ(q => q + 1), 320);
    }
  };

  const doSubmit = useCallback(async (timerExpired = false) => {
    if (uiPhase !== "quiz") return;
    setShowDoubleCheck(false);
    setUIPhase("verifying");

    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);
    await new Promise(r => setTimeout(r, 2000));

    const correct = answers.filter((a, i) => a === questions[i]!.correctIndex).length;
    const pct = Math.round((correct / questions.length) * 100);
    const tier = getTier(correct);
    setScore(pct);

    pushAuditEntry({
      studentId, studentName, courseTitle,
      timestamp: new Date().toISOString(),
      timeTaken: timerExpired ? TIMER_SECONDS : timeTaken,
      result: tier !== "FAIL" ? "pass" : "fail",
      score: pct,
      attempt,
    });

    if (tier !== "FAIL") {
      setAchievedTier(tier);
      setUIPhase("mastered");
      setTimeout(async () => {
        setUIPhase("generating");
        const key = await generatePerformanceKey(studentId, courseId, tier);
        onPass(pct, tier, key);
      }, 2800);
    } else {
      setUIPhase("audit");
      setTimeout(() => onFail(attempt), 2800);
    }
  }, [uiPhase, answers, questions, studentId, studentName, courseTitle, courseId, attempt, onPass, onFail]);

  const handleSubmitClick = () => {
    if (!allAnswered) {
      setShowDoubleCheck(true);
    } else {
      doSubmit();
    }
  };

  /* ── PHASE: intro ── */
  if (uiPhase === "intro") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl overflow-hidden border"
        style={{ background: "rgba(4,11,26,0.9)", borderColor: "rgba(59,130,246,0.2)" }}
      >
        {/* Animated background glow */}
        <motion.div
          animate={{ opacity: [0.08, 0.16, 0.08] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(29,78,216,0.4), transparent 70%)" }}
        />
        <div className="relative z-10 p-8 text-center space-y-6">
          <motion.div
            animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center"
            style={{ background: "radial-gradient(circle at 35% 35%, #60A5FA, #1D4ED8 70%, #0B1E4A)", boxShadow: "0 0 40px rgba(59,130,246,0.4)" }}
          >
            <Brain size={36} className="text-white" />
          </motion.div>

          <div>
            <h2 className="text-2xl font-black tracking-tight text-white">Academic Gauntlet</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {courseTitle} · {attempt > 1 ? `Retry ${attempt}/3` : "Tier Assessment"}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
            {Object.entries(TIER_META).map(([t, m]) => (
              <div key={t} className="rounded-xl p-3 text-center" style={{ background: m.bg, border: `1px solid ${m.border}` }}>
                <div className="text-2xl mb-1">{m.emoji}</div>
                <div className="text-xs font-bold" style={{ color: m.color }}>{m.label}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {t === "GOLD" ? "5/5" : t === "SILVER" ? "3–4/5" : "1–2/5"}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 max-w-sm mx-auto text-left">
            {[
              { icon: Brain, text: "5 scenario-based questions — advanced critical thinking" },
              { icon: Timer, text: `${TIMER_SECONDS}s countdown — once started, no pausing` },
              { icon: Trophy, text: "Gold · Silver · Bronze — earn a tiered Performance Key" },
              { icon: Lock, text: "Anti-exit lock active during the Gauntlet" },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Icon size={14} className="text-primary mt-0.5 shrink-0" />
                {text}
              </div>
            ))}
          </div>

          <Button
            onClick={() => { startTimeRef.current = Date.now(); setUIPhase("quiz"); }}
            className="w-full font-bold text-white py-3 rounded-xl"
            style={{ background: "linear-gradient(135deg, #0040C0, #0070FF, #60A5FA)", boxShadow: "0 0 24px rgba(0,112,255,0.4)" }}
          >
            Enter the Gauntlet <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </motion.div>
    );
  }

  /* ── PHASE: quiz ── */
  if (uiPhase === "quiz") {
    const q = questions[currentQ]!;
    const timerPct = (timeLeft / TIMER_SECONDS) * 100;
    const timerColor = timeLeft > 30 ? "#3B82F6" : timeLeft > 15 ? "#F59E0B" : "#EF4444";
    const selectedAnswer = answers[currentQ];

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border overflow-hidden"
        style={{ background: "rgba(4,11,26,0.95)", borderColor: "rgba(59,130,246,0.18)" }}
      >
        {/* Timer bar */}
        <div className="h-1 bg-white/5">
          <motion.div
            animate={{ width: `${timerPct}%` }}
            transition={{ duration: 0.3 }}
            style={{ height: "100%", background: timerColor, transition: "background 0.5s" }}
          />
        </div>

        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain size={16} className="text-primary" />
              <span className="text-sm font-semibold text-primary">Question {currentQ + 1} of 5</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-mono" style={{ color: timerColor }}>
              <Timer size={14} />
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {questions.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === currentQ ? 20 : 8,
                  height: 8,
                  background:
                    answers[i] !== null ? "#3B82F6" :
                    i === currentQ ? "#60A5FA" : "rgba(255,255,255,0.1)",
                }}
              />
            ))}
            <span className="ml-auto text-xs text-muted-foreground">{answeredCount}/5 answered</span>
          </div>

          {/* Scenario */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div
                className="rounded-xl p-4 border text-sm leading-relaxed"
                style={{ background: "rgba(29,78,216,0.07)", borderColor: "rgba(59,130,246,0.18)", color: "rgba(226,232,240,0.92)" }}
              >
                <span className="text-primary font-semibold text-xs uppercase tracking-widest block mb-2">Scenario</span>
                {q.scenario}
              </div>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((opt, idx) => {
                  const isSelected = selectedAnswer === idx;
                  return (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleAnswer(idx)}
                      className="w-full text-left rounded-xl px-4 py-3 text-sm transition-all duration-150 border"
                      style={{
                        background: isSelected ? "rgba(29,78,216,0.18)" : "rgba(255,255,255,0.03)",
                        borderColor: isSelected ? "rgba(96,165,250,0.5)" : "rgba(255,255,255,0.08)",
                        color: isSelected ? "#93C5FD" : "rgba(226,232,240,0.8)",
                        boxShadow: isSelected ? "0 0 12px rgba(59,130,246,0.2)" : "none",
                      }}
                    >
                      <span className="font-bold mr-2.5" style={{ color: isSelected ? "#60A5FA" : "rgba(100,116,139,0.7)" }}>
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      {opt}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
              disabled={currentQ === 0}
              className="text-muted-foreground"
            >
              ← Prev
            </Button>

            {currentQ < questions.length - 1 ? (
              <Button
                size="sm"
                onClick={() => setCurrentQ(q => q + 1)}
                style={{ background: "rgba(29,78,216,0.3)", color: "#93C5FD" }}
              >
                Next →
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleSubmitClick}
                className="font-bold text-white"
                style={{ background: "linear-gradient(135deg, #0040C0, #0070FF)" }}
              >
                Submit Gauntlet
              </Button>
            )}
          </div>
        </div>

        {/* Double-check modal */}
        <AnimatePresence>
          {showDoubleCheck && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl"
              style={{ background: "rgba(4,11,26,0.92)", backdropFilter: "blur(8px)" }}
            >
              <div className="rounded-2xl border p-6 max-w-xs w-full text-center space-y-4 mx-4"
                style={{ background: "rgba(8,20,60,0.95)", borderColor: "rgba(245,158,11,0.3)" }}>
                <AlertTriangle size={32} className="mx-auto" style={{ color: "#F59E0B" }} />
                <div>
                  <h3 className="font-bold text-white">Submit with {5 - answeredCount} unanswered?</h3>
                  <p className="text-xs text-muted-foreground mt-1">Unanswered questions count as wrong. You may still earn a Bronze card.</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="flex-1" onClick={() => setShowDoubleCheck(false)}>
                    Keep answering
                  </Button>
                  <Button size="sm" className="flex-1 text-white font-bold"
                    style={{ background: "linear-gradient(135deg, #0040C0, #0070FF)" }}
                    onClick={() => doSubmit()}>
                    Submit anyway
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Exit warning */}
        <AnimatePresence>
          {showExitWarning && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl"
              style={{ background: "rgba(4,11,26,0.92)", backdropFilter: "blur(8px)" }}
            >
              <div className="rounded-2xl border p-6 max-w-xs w-full text-center space-y-4 mx-4"
                style={{ background: "rgba(8,20,60,0.95)", borderColor: "rgba(239,68,68,0.3)" }}>
                <ShieldAlert size={32} className="mx-auto text-red-400" />
                <div>
                  <h3 className="font-bold text-white">Academic Integrity Lock</h3>
                  <p className="text-xs text-muted-foreground mt-1">Leaving mid-Gauntlet is flagged as an integrity violation. Continue to complete your assessment.</p>
                </div>
                <Button size="sm" className="w-full text-white font-bold"
                  style={{ background: "linear-gradient(135deg, #0040C0, #0070FF)" }}
                  onClick={() => setShowExitWarning(false)}>
                  Continue Gauntlet
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  /* ── PHASE: verifying ── */
  if (uiPhase === "verifying") {
    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="rounded-2xl border p-12 text-center space-y-5"
        style={{ background: "rgba(4,11,26,0.95)", borderColor: "rgba(59,130,246,0.2)" }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto rounded-full"
          style={{
            background: "conic-gradient(from 0deg, #0040C0, #0070FF, #60A5FA, transparent 60%)",
            WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 3px))",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 3px))",
          }}
        />
        <div>
          <p className="font-bold text-white">Sentinel Evaluating…</p>
          <p className="text-xs text-muted-foreground mt-1">Calculating your tier and generating Performance Key</p>
        </div>
      </motion.div>
    );
  }

  /* ── PHASE: mastered ── */
  if (uiPhase === "mastered") {
    const meta = TIER_META[achievedTier];
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl border overflow-hidden"
        style={{ background: "rgba(4,11,26,0.95)", borderColor: meta.border }}
      >
        {/* Confetti */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {CONFETTI.map((c, i) => (
            <motion.div
              key={i}
              className="absolute top-0 rounded-sm"
              style={{ left: `${c.x}%`, width: c.size, height: c.size * 0.6, background: c.color, rotate: c.rotate }}
              initial={{ y: -20, opacity: 1 }}
              animate={{ y: "110vh", opacity: [1, 1, 0] }}
              transition={{ duration: c.duration + 1.5, delay: c.delay, ease: "easeIn" }}
            />
          ))}
        </div>

        <div className="relative z-10 p-8 text-center space-y-4">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 0.6, repeat: 3 }}
            className="text-6xl"
          >
            {meta.emoji}
          </motion.div>
          <div>
            <h2 className="text-2xl font-black text-white">Gauntlet Complete!</h2>
            <p className="text-sm mt-1" style={{ color: meta.color }}>
              {meta.label} TIER — {score}% score
            </p>
            <p className="text-xs text-muted-foreground mt-1">{meta.desc}</p>
          </div>
          <CheckCircle size={20} className="mx-auto" style={{ color: meta.color }} />
          <p className="text-xs text-muted-foreground">Generating your tiered Performance Key…</p>
        </div>
      </motion.div>
    );
  }

  /* ── PHASE: generating ── */
  if (uiPhase === "generating") {
    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="rounded-2xl border p-12 text-center space-y-4"
        style={{ background: "rgba(4,11,26,0.95)", borderColor: "rgba(245,158,11,0.25)" }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 mx-auto"
        >
          <Loader2 size={48} style={{ color: "#F59E0B" }} />
        </motion.div>
        <p className="font-bold text-white text-sm">Minting your Achievement Card…</p>
        <p className="text-xs text-muted-foreground">SHA-256 Performance Key being inscribed</p>
      </motion.div>
    );
  }

  /* ── PHASE: audit (fail — 0/5) ── */
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl border p-8 text-center space-y-4"
      style={{ background: "rgba(4,11,26,0.95)", borderColor: "rgba(239,68,68,0.25)" }}
    >
      <XCircle size={48} className="mx-auto text-red-400" />
      <div>
        <h2 className="text-xl font-black text-white">Gauntlet Not Cleared</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Score: {score}% — 0 of 5 correct. Even 1 correct earns a Bronze card.
        </p>
        {attempt < 3 && (
          <p className="text-xs mt-2" style={{ color: "#F59E0B" }}>
            Attempt {attempt}/3 — A remedial bridge awaits. Review the material and try again.
          </p>
        )}
      </div>
    </motion.div>
  );
}
