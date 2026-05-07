import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { SentinelPlayer } from "@/components/SentinelPlayer";
import { QuizGateway } from "@/components/QuizGateway";
import { GoldCard } from "@/components/GoldCard";
import { RemedialBridge } from "@/components/RemedialBridge";
import { ArrowLeft, Shield, Brain, ChevronRight, AlertTriangle, Heart } from "lucide-react";
import { useListCourses } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth-context";

type Phase = "recall" | "lecture" | "portal_zoom" | "quiz" | "remedial" | "gold_card" | "complete";

interface GoldCardData {
  score: number;
  grade: string;
  privateKey: string;
}

function saveToVault(userId: string | number, entry: {
  courseName: string;
  grade: string;
  score: number;
  privateKey: string;
  mintedAt: string;
}) {
  try {
    const key = `uou_vault_${userId}`;
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    existing.unshift(entry);
    localStorage.setItem(key, JSON.stringify(existing.slice(0, 50)));
  } catch {
    // silently ignore storage errors
  }
}

/** Reads the mock fee ledger and returns true if any payment is overdue */
function useFeeClearanceStatus(userId: string): { overdue: boolean; overdueAmount: number } {
  const [status, setStatus] = useState({ overdue: false, overdueAmount: 0 });

  useEffect(() => {
    // Check localStorage for paid fees
    const paidKey = `uou_fees_paid_${userId}`;
    const paid: string[] = JSON.parse(localStorage.getItem(paidKey) || "[]");

    // Pending fees from the mock ledger
    const pendingFees = [
      { ref: "UOU-PAY-2026-0488", amount: 85000, due: "May 15, 2026", overdue: true },
      { ref: "UOU-PAY-2026-0489", amount:  7500, due: "May 20, 2026", overdue: false },
    ];

    const overdueFees = pendingFees.filter(f => f.overdue && !paid.includes(f.ref));
    const total = overdueFees.reduce((s, f) => s + f.amount, 0);
    setStatus({ overdue: overdueFees.length > 0, overdueAmount: total });
  }, [userId]);

  return status;
}

function FeeWarningBanner({ amount }: { amount: number }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -12, scaleY: 0.85 }}
        animate={{ opacity: 1, y: 0, scaleY: 1 }}
        exit={{ opacity: 0, y: -8, scaleY: 0.9 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border overflow-hidden relative"
        style={{ background: "rgba(2,8,20,0.92)", borderColor: "rgba(245,158,11,0.35)" }}
      >
        {/* Subtle gold pulse gradient */}
        <motion.div
          animate={{ opacity: [0.06, 0.16, 0.06] }}
          transition={{ duration: 2.8, repeat: Infinity }}
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.18) 0%, transparent 60%)" }}
        />

        {/* Top stripe */}
        <div className="h-0.5 w-full"
          style={{ background: "linear-gradient(90deg, rgba(245,158,11,0), #F59E0B, rgba(245,158,11,0))" }} />

        <div className="px-5 py-3 relative z-10 flex items-start gap-4">
          {/* Heartbeat icon */}
          <div className="shrink-0 mt-0.5">
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart size={16} style={{ color: "#F59E0B" }} fill="rgba(245,158,11,0.25)" />
            </motion.div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-black uppercase tracking-[0.22em]" style={{ color: "#F59E0B" }}>
                Financial Clearance Pending
              </span>
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded"
                style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.3)" }}>
                ₦{amount.toLocaleString()} OUTSTANDING
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Lecture access granted via{" "}
              <span className="font-semibold" style={{ color: "#F59E0B" }}>Founder's Grace Period</span>
              {" "}— the institution believes no scholar should be denied knowledge due to financial constraints.
              Please clear your balance at your earliest convenience.
            </p>
          </div>

          <button
            onClick={() => setDismissed(true)}
            className="shrink-0 p-1 text-muted-foreground hover:text-white transition-colors mt-0.5"
          >
            <ChevronRight size={14} className="rotate-[-90deg]" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function StudentLecture() {
  const { courseId } = useParams<{ courseId: string }>();
  const [, setLocation] = useLocation();
  const { data: courses } = useListCourses();
  const { user } = useAuth();
  const course = courses?.find(c => String(c.id) === courseId);

  const [phase, setPhase] = useState<Phase>("recall");
  const [attempt, setAttempt] = useState(1);
  const [goldCardData, setGoldCardData] = useState<GoldCardData | null>(null);

  const courseTitle = course?.title || "Principles of Entrepreneurship";
  const studentName = user?.name || "Scholar";
  const studentId   = String(user?.id || "stu-001");

  const { overdue, overdueAmount } = useFeeClearanceStatus(studentId);

  const handleLectureEnd = () => {
    setPhase("portal_zoom");
    setTimeout(() => setPhase("quiz"), 1600);
  };

  const handleQuizPass = (score: number, grade: string, privateKey: string) => {
    saveToVault(studentId, {
      courseName: courseTitle,
      grade,
      score,
      privateKey,
      mintedAt: new Date().toISOString(),
    });
    setGoldCardData({ score, grade, privateKey });
    setPhase("gold_card");
  };

  const handleQuizFail = (failedAttempt: number) => {
    if (failedAttempt >= 3) {
      setPhase("remedial");
    } else {
      setAttempt(failedAttempt + 1);
      setPhase("lecture");
    }
  };

  const handleRemedialComplete = () => {
    setAttempt(3);
    setPhase("quiz");
  };

  const handleGoldCardDismiss = () => setPhase("complete");

  const STEPS  = ["Recall", "Lecture", "Assessment", "Gold Card"];
  const stepIdx =
    phase === "recall" ? 0 :
    phase === "lecture" || phase === "portal_zoom" ? 1 :
    phase === "quiz" || phase === "remedial" ? 2 : 3;

  return (
    <div className="space-y-4">
      {/* Nav */}
      <div className="flex items-center gap-4 flex-wrap">
        <motion.button
          whileHover={{ x: -2, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setLocation("/student/timetable")}
          className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border transition-all"
          style={{
            background:    "rgba(4,11,26,0.6)",
            borderColor:   "rgba(0,112,255,0.25)",
            color:         "rgba(100,160,255,0.9)",
            backdropFilter:"blur(12px)",
            boxShadow:     "0 2px 12px rgba(0,112,255,0.12), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <ArrowLeft size={14} /> Back to Timetable
        </motion.button>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {STEPS.map((step, i) => (
            <span key={step} className="flex items-center gap-1">
              <span style={{
                color:      i === stepIdx ? "#0070FF" : i < stepIdx ? "#60A5FA" : undefined,
                fontWeight: i === stepIdx ? 700 : undefined,
              }}>{step}</span>
              {i < STEPS.length - 1 && <ChevronRight size={10} className="opacity-30" />}
            </span>
          ))}
        </div>
      </div>

      {/* Fee clearance banner — shown only if overdue */}
      {overdue && <FeeWarningBanner amount={overdueAmount} />}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{courseTitle}</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
            <Shield size={14} className="text-primary" />
            Neural Ledger active · Sentinel Lecture Engine · Attempt {attempt}/3
          </p>
        </div>

        <AnimatePresence mode="wait">

          {/* RECALL */}
          {phase === "recall" && (
            <motion.div key="recall"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }}
              className="rounded-2xl border overflow-hidden"
              style={{ background: "rgba(4,11,26,0.8)", borderColor: "rgba(0,112,255,0.25)" }}>
              <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: "rgba(0,112,255,0.15)" }}>
                <Brain size={16} className="text-primary" />
                <div>
                  <div className="font-bold text-foreground text-sm">Previously on {courseTitle}</div>
                  <div className="text-xs text-muted-foreground">Knowledge bridge — pages 1-3</div>
                </div>
                <div className="ml-auto">
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full border"
                    style={{ background: "rgba(0,112,255,0.08)", borderColor: "rgba(0,112,255,0.25)", color: "#0070FF" }}>
                    RECALL
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-5">
                <motion.div className="rounded-xl p-5 border relative overflow-hidden"
                  style={{ background: "rgba(2,11,40,0.9)", borderColor: "rgba(0,112,255,0.2)" }}>
                  <motion.div animate={{ opacity: [0.12, 0.28, 0.12] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(0,112,255,0.15), transparent 60%)" }} />
                  <div className="relative z-10 space-y-3">
                    <div className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: "rgba(0,112,255,0.8)" }}>
                      Key Takeaway — Previous Session
                    </div>
                    <p className="text-foreground text-sm leading-relaxed">
                      In the last session of <strong className="text-primary">{courseTitle}</strong>, we
                      established the foundational framework. The critical insight:{" "}
                      <strong>real-world application always diverges from theoretical models</strong> due to
                      contextual constraints — recognising this gap is the hallmark of an advanced practitioner.
                    </p>
                    <svg width="100%" height="60" viewBox="0 0 300 60">
                      <motion.line x1="20" y1="30" x2="280" y2="30"
                        stroke="rgba(0,112,255,0.3)" strokeWidth="1" strokeDasharray="4 4" />
                      {["Concept", "Theory", "Gap", "Apply", "Grow"].map((label, i) => (
                        <g key={label}>
                          <motion.circle cx={20 + i * 65} cy={30} r={6} fill="#0040C0" stroke="#0070FF" strokeWidth="1.5"
                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.15 }} />
                          <motion.text x={20 + i * 65} y={52} textAnchor="middle" fontSize="8" fill="rgba(100,160,255,0.7)"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15 + 0.2 }}>
                            {label}
                          </motion.text>
                        </g>
                      ))}
                      <motion.path d="M 20,30 Q 85,10 150,30 Q 215,50 280,30"
                        fill="none" stroke="#0070FF" strokeWidth="2" strokeLinecap="round"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }} />
                    </svg>
                  </div>
                </motion.div>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  onClick={() => setPhase("lecture")}
                  className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #0040C0, #0070FF)", color: "white", boxShadow: "0 0 24px rgba(0,112,255,0.35)" }}>
                  Begin Today's Lecture <ChevronRight size={16} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* LECTURE */}
          {phase === "lecture" && (
            <motion.div key="lecture"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }}
              className="space-y-4">
              <div className="rounded-xl p-4 border text-sm flex items-start gap-3"
                style={{ background: "rgba(0,112,255,0.05)", borderColor: "rgba(0,112,255,0.2)" }}>
                <Shield size={16} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-primary">Academic Integrity Notice</div>
                  <p className="text-muted-foreground text-xs leading-relaxed mt-0.5">
                    Sentinel Lecture Engine active — slides auto-advance sequentially.
                    The Assessment Gateway will unlock after all slides are reviewed.
                    {attempt > 1 && <span className="text-yellow-400 font-semibold"> · Retry attempt {attempt}/3.</span>}
                  </p>
                </div>
              </div>
              <SentinelPlayer
                courseTitle={courseTitle}
                courseId={parseInt(courseId || "1")}
                onEnded={handleLectureEnd}
              />
            </motion.div>
          )}

          {/* PORTAL ZOOM */}
          {phase === "portal_zoom" && (
            <motion.div
              key="portal_zoom"
              className="fixed inset-0 z-[500] flex items-center justify-center overflow-hidden"
              style={{ background: "rgba(2,6,23,0.97)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="rounded-full"
                style={{ background: "radial-gradient(circle, #0040C0 0%, #0070FF 40%, rgba(0,112,255,0.3) 70%, transparent 100%)" }}
                initial={{ width: 0, height: 0, opacity: 1 }}
                animate={{ width: "250vmax", height: "250vmax", opacity: [1, 1, 0] }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.div
                className="absolute font-black tracking-[0.25em] uppercase"
                style={{ color: "white", fontSize: "clamp(1rem, 3vw, 1.5rem)" }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0.85, 1, 1, 0.95] }}
                transition={{ duration: 1.4, times: [0, 0.25, 0.7, 1] }}
              >
                Assessment Gateway
              </motion.div>
            </motion.div>
          )}

          {/* QUIZ */}
          {phase === "quiz" && (
            <motion.div key="quiz"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }}>
              <QuizGateway
                courseTitle={courseTitle}
                courseId={parseInt(courseId || "1")}
                studentId={studentId}
                studentName={studentName}
                onPass={handleQuizPass}
                onFail={handleQuizFail}
                attempt={attempt}
              />
            </motion.div>
          )}

          {/* REMEDIAL */}
          {phase === "remedial" && (
            <motion.div key="remedial"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }}>
              <RemedialBridge courseTitle={courseTitle} onCooldownComplete={handleRemedialComplete} />
            </motion.div>
          )}

          {/* COMPLETE */}
          {phase === "complete" && (
            <motion.div key="complete"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border p-8 text-center space-y-4"
              style={{ background: "rgba(2,11,40,0.8)", borderColor: "rgba(0,112,255,0.3)" }}>
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.6, delay: 0.2 }}
                className="text-5xl">🎓</motion.div>
              <h2 className="text-2xl font-black text-foreground">Session Complete</h2>
              <p className="text-muted-foreground text-sm">Your Gold Card has been minted and saved to your Identity Vault.</p>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => setLocation("/student")}
                className="mx-auto px-8 py-3 rounded-xl font-semibold text-sm flex items-center gap-2"
                style={{ background: "linear-gradient(135deg, #0040C0, #0070FF)", color: "white" }}>
                Return to Portal
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>

      {/* Gold Card overlay */}
      <AnimatePresence>
        {phase === "gold_card" && goldCardData && (
          <GoldCard
            studentName={studentName}
            courseName={courseTitle}
            grade={goldCardData.grade}
            score={goldCardData.score}
            privateKey={goldCardData.privateKey}
            onDismiss={handleGoldCardDismiss}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
