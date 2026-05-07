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

const TIMER_SECONDS = 120;
const PASS_THRESHOLD = 70;

const CONFETTI = Array.from({ length: 48 }, (_, i) => ({
  x: ((i * 7.3) % 97) + 1.5,
  size: 5 + (i % 7),
  color: ["#3B82F6", "#60A5FA", "#F59E0B", "#FBBF24", "#10B981", "#A78BFA", "#F43F5E", "#FCD34D"][i % 8]!,
  duration: 1.3 + ((i * 3) % 8) * 0.12,
  delay: (i % 14) * 0.06,
  rotate: ((i * 53) % 360),
}));

async function generateAttendanceKey(studentId: string, courseId: number, score: number): Promise<string> {
  const timestamp = Date.now();
  const raw = `${studentId}::${courseId}::${score}::${timestamp}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(raw);
  try {
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    return `UOU-${hex.slice(0, 6).toUpperCase()}-${hex.slice(6, 12).toUpperCase()}-${hex.slice(12, 18).toUpperCase()}-${score}`.toUpperCase();
  } catch {
    const fallback = Math.random().toString(36).slice(2).toUpperCase();
    return `UOU-${fallback.slice(0, 6)}-${fallback.slice(6, 12)}-${score}`;
  }
}

function getGrade(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  return "F";
}

function generateQuestions(courseTitle: string): Question[] {
  return [
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
    {
      id: 6,
      scenario: `A colleague argues that the framework from today's ${courseTitle} is outdated. What is the most academically rigorous response?`,
      options: [
        "Agree — newer is always better in academic fields",
        "Disagree — classic frameworks are always superior",
        "Evaluate the claim by comparing the framework's assumptions against current evidence",
        "The question is irrelevant to real-world application",
      ],
      correctIndex: 2,
    },
    {
      id: 7,
      scenario: `If the variables discussed in today's ${courseTitle} session were reversed in a real case study, what outcome would you predict?`,
      options: [
        "The same outcome — results are independent of variable order",
        "A mirrored but proportionally equal outcome",
        "An entirely different outcome, likely revealing the causal relationships between variables",
        "The system would become unstable and unpredictable",
      ],
      correctIndex: 2,
    },
    {
      id: 8,
      scenario: `Today's ${courseTitle} lecture emphasized a step-by-step process. What is the risk of skipping Step 2 and jumping directly to Step 3?`,
      options: [
        "No risk — the steps are interchangeable",
        "Minor efficiency loss only",
        "The foundation for Step 3 is incomplete, creating fragile outcomes",
        "Step 3 will automatically compensate for the missing step",
      ],
      correctIndex: 2,
    },
    {
      id: 9,
      scenario: `Imagine you need to explain the central concept of today's ${courseTitle} lecture to a non-expert in under 60 seconds. What should you prioritize?`,
      options: [
        "Technical terminology to establish credibility",
        "The problem it solves and a concrete real-world example",
        "A complete history of how the concept was developed",
        "Mathematical proofs that validate the concept",
      ],
      correctIndex: 1,
    },
    {
      id: 10,
      scenario: `A decision-maker ignores the warning signs identified in today's ${courseTitle} material. According to the principles discussed, what is the most probable systemic outcome?`,
      options: [
        "The warning signs were likely overstated — no major effect",
        "A delayed but compounding failure that validates the original warning",
        "An immediate and catastrophic total collapse",
        "The system self-heals and the warning becomes irrelevant",
      ],
      correctIndex: 1,
    },
  ];
}

type UIPhase = "intro" | "quiz" | "verifying" | "mastered" | "audit" | "generating";

export function QuizGateway({
  courseTitle,
  courseId,
  studentId,
  studentName,
  onPass,
  onFail,
  attempt,
}: QuizGatewayProps) {
  const [questions] = useState<Question[]>(() => generateQuestions(courseTitle));
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(10).fill(null));
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [uiPhase, setUIPhase] = useState<UIPhase>("intro");
  const [score, setScore] = useState(0);
  const [showDoubleCheck, setShowDoubleCheck] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  /* Anti-exit: lock back button during quiz */
  useEffect(() => {
    if (uiPhase !== "quiz") return;
    window.history.pushState(null, "", window.location.href);
    const handler = () => {
      window.history.pushState(null, "", window.location.href);
      setShowExitWarning(true);
    };
    const beforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("popstate", handler);
    window.addEventListener("beforeunload", beforeUnload);
    return () => {
      window.removeEventListener("popstate", handler);
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, [uiPhase]);

  /* Countdown timer */
  useEffect(() => {
    if (uiPhase !== "quiz") return;
    if (timeLeft <= 0) {
      doSubmit(true);
      return;
    }
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
    setScore(pct);

    pushAuditEntry({
      studentId,
      studentName,
      courseTitle,
      timestamp: new Date().toISOString(),
      timeTaken: timerExpired ? TIMER_SECONDS : timeTaken,
      result: pct >= PASS_THRESHOLD ? "pass" : "fail",
      score: pct,
      attempt,
    });

    if (pct >= PASS_THRESHOLD) {
      setUIPhase("mastered");
      setTimeout(async () => {
        setUIPhase("generating");
        const key = await generateAttendanceKey(studentId, courseId, pct);
        onPass(pct, getGrade(pct), key);
      }, 2800);
    } else {
      setUIPhase("audit");
      setTimeout(() => onFail(attempt), 2800);
    }
  }, [uiPhase, answers, questions, studentId, studentName, courseTitle, courseId, attempt, onPass, onFail]);

  const handleSubmitClick = () => {
    if (timeLeft > 30) {
      setShowDoubleCheck(true);
    } else {
      doSubmit(false);
    }
  };

  const timerPct = (timeLeft / TIMER_SECONDS) * 100;
  const timerColor = timeLeft > 60 ? "#3B82F6" : timeLeft > 30 ? "#F59E0B" : "#EF4444";

  return (
    <div className="relative">

      {/* Anti-exit warning modal */}
      <AnimatePresence>
        {showExitWarning && (
          <motion.div
            className="fixed inset-0 z-[9000] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.88, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border p-6 max-w-sm w-full space-y-4 text-center"
              style={{ background: "rgba(8,16,50,0.98)", borderColor: "rgba(239,68,68,0.4)" }}
            >
              <div
                className="w-14 h-14 rounded-xl mx-auto flex items-center justify-center border"
                style={{ background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.3)" }}
              >
                <ShieldAlert size={26} style={{ color: "#EF4444" }} />
              </div>
              <div>
                <div className="font-black text-lg text-foreground">Assessment In Progress</div>
                <p className="text-muted-foreground text-sm mt-1.5 leading-relaxed">
                  Exiting now will count as a <strong className="text-red-400">Failed Attempt</strong>.
                  You have <strong className="text-foreground">{3 - attempt}</strong> attempt{3 - attempt !== 1 ? "s" : ""} remaining after this.
                </p>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowExitWarning(false)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm"
                  style={{ background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", color: "white" }}
                >
                  Stay & Continue
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setShowExitWarning(false); onFail(attempt); }}
                  className="flex-1 py-2.5 rounded-xl font-medium text-sm border"
                  style={{ borderColor: "rgba(239,68,68,0.3)", color: "#FCA5A5", background: "rgba(239,68,68,0.06)" }}
                >
                  Exit (Count as Fail)
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Double-check modal */}
      <AnimatePresence>
        {showDoubleCheck && (
          <motion.div
            className="fixed inset-0 z-[9000] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.88, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border p-6 max-w-sm w-full space-y-4 text-center"
              style={{ background: "rgba(8,16,50,0.98)", borderColor: "rgba(245,158,11,0.4)" }}
            >
              <div
                className="w-14 h-14 rounded-xl mx-auto flex items-center justify-center border"
                style={{ background: "rgba(245,158,11,0.1)", borderColor: "rgba(245,158,11,0.3)" }}
              >
                <AlertTriangle size={26} style={{ color: "#F59E0B" }} />
              </div>
              <div>
                <div className="font-black text-lg text-foreground">Submit Early?</div>
                <p className="text-muted-foreground text-sm mt-1.5 leading-relaxed">
                  You still have <strong style={{ color: "#F59E0B" }}>
                    {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
                  </strong> remaining.
                  The Sentinel recommends using remaining time to review your answers.
                </p>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDoubleCheck(false)}
                  className="flex-1 py-2.5 rounded-xl font-medium text-sm border"
                  style={{ borderColor: "rgba(59,130,246,0.3)", color: "#93C5FD", background: "rgba(59,130,246,0.06)" }}
                >
                  Review Answers
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => doSubmit(false)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm"
                  style={{ background: "linear-gradient(135deg, #D97706, #F59E0B)", color: "white" }}
                >
                  Submit Now
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main quiz card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl overflow-hidden border"
        style={{
          background: "rgba(8,16,40,0.9)",
          borderColor: "rgba(59,130,246,0.25)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Header */}
        <div
          className="p-4 border-b flex items-center justify-between"
          style={{ borderColor: "rgba(59,130,246,0.2)" }}
        >
          <div className="flex items-center gap-2">
            <Brain size={16} className="text-primary" />
            <div>
              <div className="font-bold text-foreground text-sm">
                Google-Proof Assessment Gateway
              </div>
              <div className="text-xs text-muted-foreground">
                {courseTitle} · Attempt {attempt}/3 · Score ≥ 70% to pass
              </div>
            </div>
          </div>
          {uiPhase === "quiz" && (
            <div className="flex items-center gap-2">
              <Timer size={14} style={{ color: timerColor }} />
              <span
                className="font-mono font-bold text-sm tabular-nums"
                style={{ color: timerColor }}
              >
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
              </span>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">

          {/* ── INTRO ── */}
          {uiPhase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="p-6 space-y-5"
            >
              <div className="text-center space-y-3">
                <div
                  className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center border"
                  style={{ background: "rgba(59,130,246,0.1)", borderColor: "rgba(59,130,246,0.3)" }}
                >
                  <Brain size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Knowledge Integrity Assessment</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                  The UOU Sentinel has generated <strong className="text-foreground">10 application-based scenarios</strong>.
                  No definitions — only real-world thinking.
                  You have <strong style={{ color: "#3B82F6" }}>120 seconds</strong> for the entire assessment.
                </p>
              </div>

              <div
                className="rounded-xl p-4 border text-sm space-y-2"
                style={{ background: "rgba(59,130,246,0.06)", borderColor: "rgba(59,130,246,0.2)" }}
              >
                <div className="flex items-center gap-2 font-semibold text-primary">
                  <AlertTriangle size={14} /> Rules of Engagement
                </div>
                <ul className="text-muted-foreground space-y-1 text-xs">
                  <li>• Score ≥ <strong className="text-foreground">70%</strong> (7/10) to earn your Gold Card and Attendance Key</li>
                  <li>• You have 3 attempts — after 3 failures the Remedial Bridge activates</li>
                  <li>• Timer starts the moment you click Begin</li>
                  <li>• Exiting during the assessment counts as a failed attempt</li>
                </ul>
              </div>

              {attempt > 1 && (
                <div
                  className="rounded-xl p-3 border text-xs text-center"
                  style={{ background: "rgba(245,158,11,0.08)", borderColor: "rgba(245,158,11,0.3)", color: "#FCD34D" }}
                >
                  ⚠ Attempt {attempt} of 3 — The Sentinel is watching. Stay focused, Scholar.
                </div>
              )}

              <Button
                onClick={() => { startTimeRef.current = Date.now(); setUIPhase("quiz"); }}
                className="w-full h-11 font-semibold text-base"
                style={{
                  background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
                  color: "white",
                  boxShadow: "0 0 24px rgba(59,130,246,0.4)",
                }}
              >
                Begin Assessment <ArrowRight size={16} className="ml-2" />
              </Button>
            </motion.div>
          )}

          {/* ── QUIZ ── */}
          {uiPhase === "quiz" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="p-5 space-y-4"
            >
              {/* Timer bar */}
              <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${timerPct}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full rounded-full"
                  style={{ background: timerColor }}
                />
              </div>

              {/* Progress dots */}
              <div className="flex gap-1.5 justify-center">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all"
                    style={{
                      width: i === currentQ ? 12 : 7,
                      height: 7,
                      background:
                        answers[i] !== null
                          ? "#3B82F6"
                          : i === currentQ
                          ? "rgba(96,165,250,0.6)"
                          : "rgba(255,255,255,0.12)",
                    }}
                  />
                ))}
              </div>

              {/* Progress text */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono">Q{currentQ + 1} of {questions.length}</span>
                <span className="font-mono">{answeredCount}/10 answered</span>
              </div>

              {/* Question */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQ}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-4"
                >
                  <p className="text-foreground text-sm leading-relaxed font-medium">
                    {questions[currentQ]!.scenario}
                  </p>

                  <div className="space-y-2">
                    {questions[currentQ]!.options.map((opt, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.008, x: 3 }}
                        whileTap={{ scale: 0.995 }}
                        onClick={() => handleAnswer(i)}
                        disabled={answers[currentQ] !== null}
                        className="w-full text-left p-3.5 rounded-xl border text-sm transition-all"
                        style={{
                          background:
                            answers[currentQ] === i
                              ? "rgba(59,130,246,0.18)"
                              : "rgba(255,255,255,0.03)",
                          borderColor:
                            answers[currentQ] === i
                              ? "rgba(59,130,246,0.6)"
                              : "rgba(255,255,255,0.1)",
                          color:
                            answers[currentQ] === i
                              ? "#93C5FD"
                              : "hsl(var(--foreground))",
                          cursor: answers[currentQ] !== null ? "default" : "pointer",
                        }}
                      >
                        <span className="font-mono text-xs opacity-50 mr-2">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Smart Submit — only shows when all answered */}
              <AnimatePresence>
                {allAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <motion.button
                      onClick={handleSubmitClick}
                      className="w-full h-12 rounded-xl font-bold text-base flex items-center justify-center gap-2"
                      style={{
                        background: "linear-gradient(135deg, #B45309, #D97706, #F59E0B)",
                        color: "white",
                      }}
                      animate={{
                        boxShadow: [
                          "0 0 16px rgba(245,158,11,0.3)",
                          "0 0 32px rgba(245,158,11,0.6)",
                          "0 0 16px rgba(245,158,11,0.3)",
                        ],
                      }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                    >
                      <Trophy size={16} />
                      Submit Assessment
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ── VERIFYING INTEGRITY ── */}
          {uiPhase === "verifying" && (
            <motion.div
              key="verifying"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="p-10 flex flex-col items-center gap-6 text-center"
            >
              <div className="relative">
                <motion.div
                  className="w-20 h-20 rounded-full border-2 border-t-transparent"
                  style={{ borderColor: "rgba(59,130,246,0.3)", borderTopColor: "#3B82F6" }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                />
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ color: "#3B82F6" }}
                >
                  <Brain size={22} />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="font-black text-lg text-foreground tracking-tight">
                  Verifying Integrity…
                </div>
                <p className="text-muted-foreground text-sm">
                  The Sentinel is validating your submission against the knowledge ledger
                </p>
              </div>
              <div className="flex gap-1">
                {[0, 1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ background: "#3B82F6" }}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.25 }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── MASTERED — PASS CONFETTI ── */}
          {uiPhase === "mastered" && (
            <motion.div
              key="mastered"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative p-8 flex flex-col items-center gap-5 text-center overflow-hidden"
              style={{ minHeight: 280 }}
            >
              {/* Confetti particles */}
              {CONFETTI.map((c, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${c.x}%`,
                    top: -12,
                    width: c.size,
                    height: c.size,
                    background: c.color,
                    borderRadius: i % 3 === 0 ? "50%" : i % 3 === 1 ? "2px" : "1px",
                  }}
                  initial={{ y: -16, opacity: 1, rotate: 0 }}
                  animate={{
                    y: 380,
                    opacity: [1, 1, 1, 0],
                    rotate: c.rotate,
                  }}
                  transition={{
                    duration: c.duration,
                    delay: c.delay,
                    ease: "easeIn",
                  }}
                />
              ))}

              {/* Glow backdrop */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(245,158,11,0.15), transparent 65%)" }}
              />

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center border"
                style={{ background: "rgba(245,158,11,0.15)", borderColor: "rgba(245,158,11,0.5)" }}
              >
                <Trophy size={28} style={{ color: "#F59E0B" }} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="relative z-10 space-y-1.5"
              >
                <div
                  className="font-black tracking-tight"
                  style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)", color: "#F59E0B" }}
                >
                  LECTURE MASTERED
                </div>
                <div className="text-foreground font-semibold text-lg">
                  {score}% · {getGrade(score)}
                </div>
                <p className="text-muted-foreground text-sm">
                  Your Gold Card is being minted by the Sentinel…
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* ── AUDIT — FAIL STATE ── */}
          {uiPhase === "audit" && (
            <motion.div
              key="audit"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative p-8 flex flex-col items-center gap-5 text-center overflow-hidden"
              style={{ minHeight: 240 }}
            >
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.18, 0.08] }}
                transition={{ duration: 0.8 }}
                style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(239,68,68,0.25), transparent 65%)" }}
              />
              <motion.div
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center border"
                style={{ background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.4)" }}
              >
                <XCircle size={28} style={{ color: "#EF4444" }} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-1.5"
              >
                <div className="font-black text-xl" style={{ color: "#FCA5A5" }}>
                  SENTINEL AUDIT
                </div>
                <div className="font-semibold text-foreground text-sm">
                  Knowledge Gaps Detected — {score}%
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed max-w-xs mx-auto">
                  {attempt >= 3
                    ? "Three strikes triggered. The Remedial Bridge will guide your recovery."
                    : `The Sentinel has logged this attempt. Review the material carefully — ${3 - attempt} attempt${3 - attempt !== 1 ? "s" : ""} remaining.`}
                </p>
              </motion.div>
              {attempt < 3 && (
                <div
                  className="rounded-xl p-3 border text-xs"
                  style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.2)", color: "#FCA5A5" }}
                >
                  <Lock size={11} className="inline mr-1.5" />
                  Your performance has been recorded in the Institutional Audit Log.
                </div>
              )}
            </motion.div>
          )}

          {/* ── GENERATING KEY ── */}
          {uiPhase === "generating" && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-10 flex flex-col items-center gap-4 text-center"
            >
              <Loader2 size={32} className="animate-spin text-primary" />
              <p className="text-muted-foreground text-sm">Minting your Gold Card…</p>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
}
