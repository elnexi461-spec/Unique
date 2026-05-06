import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, AlertTriangle, CheckCircle, XCircle, ArrowRight, Brain, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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

/* Generate a cryptographic attendance key via Web Crypto API */
async function generateAttendanceKey(
  studentId: string,
  courseId: number,
  score: number
): Promise<string> {
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
    /* Fallback */
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

/* Application-based "What if" questions that cannot be Googled */
function generateQuestions(courseTitle: string): Question[] {
  const templates: Question[] = [
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
      scenario: `What would happen if the methodology from today's ${courseTitle} session were scaled 10x beyond its designed scope?`,
      options: [
        "It would perform 10x better due to economies of scale",
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
  return templates;
}

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
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro");

  /* Countdown timer */
  useEffect(() => {
    if (phase !== "quiz" || submitted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, phase, submitted]);

  const handleAnswer = (optionIdx: number) => {
    const updated = [...answers];
    updated[currentQ] = optionIdx;
    setAnswers(updated);
    if (currentQ < questions.length - 1) {
      setTimeout(() => setCurrentQ(q => q + 1), 350);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (submitted) return;
    setSubmitted(true);
    setPhase("result");

    const correct = answers.filter((a, i) => a === questions[i].correctIndex).length;
    const pct = Math.round((correct / questions.length) * 100);
    setScore(pct);

    if (pct >= 60) {
      setGenerating(true);
      const key = await generateAttendanceKey(studentId, courseId, pct);
      setGenerating(false);
      setTimeout(() => onPass(pct, getGrade(pct), key), 800);
    } else {
      setTimeout(() => onFail(attempt), 1200);
    }
  }, [submitted, answers, questions, studentId, courseId, attempt, onPass, onFail]);

  const timerPct = (timeLeft / TIMER_SECONDS) * 100;
  const timerColor =
    timeLeft > 60 ? "#3B82F6" :
    timeLeft > 30 ? "#F59E0B" :
    "#EF4444";

  return (
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
              {courseTitle} · Attempt {attempt}/3 · Application-based scenarios
            </div>
          </div>
        </div>
        {phase === "quiz" && (
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

        {/* INTRO */}
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 space-y-5"
          >
            <div className="text-center space-y-3">
              <div
                className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center border"
                style={{
                  background: "rgba(59,130,246,0.1)",
                  borderColor: "rgba(59,130,246,0.3)",
                }}
              >
                <Brain size={28} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Knowledge Integrity Assessment
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                The UOU Sentinel has generated <strong className="text-foreground">10 application-based scenarios</strong>.
                There are no definitions — only real-world "What if" thinking.
                You have <strong style={{ color: "#3B82F6" }}>120 seconds</strong> for the entire quiz.
              </p>
            </div>

            <div
              className="rounded-xl p-4 border text-sm space-y-2"
              style={{
                background: "rgba(59,130,246,0.06)",
                borderColor: "rgba(59,130,246,0.2)",
              }}
            >
              <div className="flex items-center gap-2 font-semibold text-primary">
                <AlertTriangle size={14} /> Rules of Engagement
              </div>
              <ul className="text-muted-foreground space-y-1 text-xs">
                <li>• Score ≥ 60% to earn your Gold Card and Attendance Key</li>
                <li>• You have 3 attempts. After 3 failures, a Remedial Bridge is triggered</li>
                <li>• The timer starts the moment you click "Begin Assessment"</li>
                <li>• Answers cannot be changed after the next question loads</li>
              </ul>
            </div>

            {attempt > 1 && (
              <div
                className="rounded-xl p-3 border text-xs text-center"
                style={{
                  background: "rgba(245,158,11,0.08)",
                  borderColor: "rgba(245,158,11,0.3)",
                  color: "#FCD34D",
                }}
              >
                ⚠ Attempt {attempt} of 3 — The Sentinel is watching. Stay focused, Scholar.
              </div>
            )}

            <Button
              onClick={() => setPhase("quiz")}
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

        {/* QUIZ */}
        {phase === "quiz" && !submitted && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-5 space-y-4"
          >
            {/* Timer bar */}
            <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${timerPct}%` }}
                transition={{ duration: 0.5 }}
                className="h-full rounded-full transition-all"
                style={{ background: timerColor }}
              />
            </div>

            {/* Progress dots */}
            <div className="flex gap-1.5 justify-center">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{
                    background:
                      i < currentQ ? "#3B82F6" :
                      i === currentQ ? "#60A5FA" :
                      "rgba(255,255,255,0.15)",
                    transform: i === currentQ ? "scale(1.3)" : "scale(1)",
                  }}
                />
              ))}
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div>
                  <div className="text-xs text-muted-foreground font-mono mb-2">
                    Q{currentQ + 1} of {questions.length}
                  </div>
                  <p className="text-foreground text-sm leading-relaxed font-medium">
                    {questions[currentQ].scenario}
                  </p>
                </div>

                <div className="space-y-2">
                  {questions[currentQ].options.map((opt, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.01, x: 4 }}
                      whileTap={{ scale: 0.99 }}
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
                        cursor: answers[currentQ] !== null ? "not-allowed" : "pointer",
                      }}
                    >
                      <span className="font-mono text-xs opacity-60 mr-2">
                        {String.fromCharCode(65 + i)}.
                      </span>
                      {opt}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Submit if all answered */}
            {answers.every(a => a !== null) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Button
                  onClick={handleSubmit}
                  className="w-full font-semibold"
                  style={{
                    background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
                    color: "white",
                    boxShadow: "0 0 20px rgba(59,130,246,0.35)",
                  }}
                >
                  Submit Assessment
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* RESULT */}
        {phase === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 text-center space-y-4"
          >
            {generating ? (
              <div className="py-8 flex flex-col items-center gap-4">
                <Loader2 size={32} className="animate-spin text-primary" />
                <p className="text-muted-foreground text-sm">
                  Minting your Gold Card…
                </p>
              </div>
            ) : score >= 60 ? (
              <>
                <CheckCircle size={48} className="mx-auto text-green-400" />
                <div>
                  <div className="text-2xl font-black text-foreground">{score}% — {getGrade(score)}</div>
                  <p className="text-muted-foreground text-sm mt-1">
                    Your value is increasing, Scholar. Gold Card incoming…
                  </p>
                </div>
              </>
            ) : (
              <>
                <XCircle size={48} className="mx-auto text-destructive" />
                <div>
                  <div className="text-2xl font-black text-foreground">{score}%</div>
                  <p className="text-muted-foreground text-sm mt-1">
                    {attempt >= 3
                      ? "Three strikes triggered. Remedial Bridge activating…"
                      : `Integrity check: Knowledge cannot be rushed. Attempt ${attempt}/3.`}
                  </p>
                </div>
                {attempt < 3 && (
                  <div
                    className="rounded-xl p-3 border text-xs"
                    style={{
                      background: "rgba(239,68,68,0.08)",
                      borderColor: "rgba(239,68,68,0.2)",
                      color: "#FCA5A5",
                    }}
                  >
                    <Lock size={12} className="inline mr-1.5" />
                    Review the material carefully before your next attempt.
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}
