import { useState } from "react";
import { useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { AntiCheatPlayer } from "@/components/AntiCheatPlayer";
import { QuizGateway } from "@/components/QuizGateway";
import { GoldCard } from "@/components/GoldCard";
import { RemedialBridge } from "@/components/RemedialBridge";
import { ArrowLeft, Shield, Brain, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useListCourses } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth-context";

const DEMO_VIDEO = "https://www.w3schools.com/html/mov_bbb.mp4";

type Phase = "recall" | "lecture" | "quiz" | "remedial" | "gold_card" | "complete";

interface GoldCardData {
  score: number;
  grade: string;
  privateKey: string;
}

export default function StudentLecture() {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: courses } = useListCourses();
  const { user } = useAuth();
  const course = courses?.find(c => String(c.id) === courseId);

  const [phase, setPhase] = useState<Phase>("recall");
  const [lectureComplete, setLectureComplete] = useState(false);
  const [attempt, setAttempt] = useState(1);
  const [goldCardData, setGoldCardData] = useState<GoldCardData | null>(null);

  const courseTitle = course?.title || `Course ${courseId} Lecture`;
  const studentName = user?.name || "Scholar";
  const studentId   = String(user?.id || "stu-001");

  const handleLectureEnd = () => setLectureComplete(true);

  const handleStartQuiz = () => setPhase("quiz");

  const handleQuizPass = (score: number, grade: string, privateKey: string) => {
    setGoldCardData({ score, grade, privateKey });
    setPhase("gold_card");
  };

  const handleQuizFail = (failedAttempt: number) => {
    if (failedAttempt >= 3) {
      setPhase("remedial");
    } else {
      setAttempt(failedAttempt + 1);
      setPhase("lecture");
      setLectureComplete(false);
    }
  };

  const handleRemedialComplete = () => {
    setAttempt(3);
    setPhase("quiz");
  };

  const handleGoldCardDismiss = () => setPhase("complete");

  const STEPS = ["Recap", "Lecture", "Assessment", "Gold Card"];
  const stepIdx =
    phase === "recall" ? 0 :
    phase === "lecture" ? 1 :
    phase === "quiz" || phase === "remedial" ? 2 : 3;

  return (
    <div className="space-y-6">
      {/* Nav */}
      <div className="flex items-center gap-4 flex-wrap">
        <Link href="/student/timetable">
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft size={16} /> Back to Timetable
          </button>
        </Link>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {STEPS.map((step, i) => (
            <span key={step} className="flex items-center gap-1">
              <span style={{
                color: i === stepIdx ? "#3B82F6" : i < stepIdx ? "#60A5FA" : undefined,
                fontWeight: i === stepIdx ? 700 : undefined,
              }}>
                {step}
              </span>
              {i < STEPS.length - 1 && <ChevronRight size={10} className="opacity-30" />}
            </span>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{courseTitle}</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
            <Shield size={14} className="text-primary" />
            Neural Ledger active · Micro-learning session · Attempt {attempt}/3
          </p>
        </div>

        <AnimatePresence mode="wait">

          {/* RECALL — 10-second "Previously on…" */}
          {phase === "recall" && (
            <motion.div
              key="recall"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }}
              className="rounded-2xl border overflow-hidden"
              style={{ background: "rgba(8,16,48,0.8)", borderColor: "rgba(59,130,246,0.25)" }}
            >
              <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: "rgba(59,130,246,0.15)" }}>
                <Brain size={16} className="text-primary" />
                <div>
                  <div className="font-bold text-foreground text-sm">Previously on {courseTitle}</div>
                  <div className="text-xs text-muted-foreground">10-second knowledge bridge — pages 1-3</div>
                </div>
                <div className="ml-auto">
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full border"
                    style={{ background: "rgba(59,130,246,0.08)", borderColor: "rgba(59,130,246,0.25)", color: "#60A5FA" }}>
                    RECALL
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-5">
                <motion.div className="rounded-xl p-5 border relative overflow-hidden"
                  style={{ background: "rgba(15,25,65,0.9)", borderColor: "rgba(59,130,246,0.2)" }}>
                  <motion.div animate={{ opacity: [0.12, 0.28, 0.12] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(59,130,246,0.15), transparent 60%)" }}
                  />
                  <div className="relative z-10 space-y-3">
                    <div className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: "rgba(96,165,250,0.7)" }}>
                      Key Takeaway — Previous Session
                    </div>
                    <p className="text-foreground text-sm leading-relaxed">
                      In the last session of <strong className="text-primary">{courseTitle}</strong>, we
                      established the foundational framework. The critical insight:{" "}
                      <strong>real-world application always diverges from theoretical models</strong> due to
                      contextual constraints — and recognizing this gap is the hallmark of an advanced practitioner.
                    </p>
                    <svg width="100%" height="60" viewBox="0 0 300 60">
                      <motion.line x1="20" y1="30" x2="280" y2="30"
                        stroke="rgba(59,130,246,0.3)" strokeWidth="1" strokeDasharray="4 4" />
                      {["Concept","Theory","Gap","Apply","Grow"].map((label, i) => (
                        <g key={label}>
                          <motion.circle cx={20+i*65} cy={30} r={6} fill="#1D4ED8" stroke="#60A5FA" strokeWidth="1.5"
                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i*0.15 }} />
                          <motion.text x={20+i*65} y={52} textAnchor="middle" fontSize="8" fill="rgba(147,197,253,0.7)"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i*0.15+0.2 }}>
                            {label}
                          </motion.text>
                        </g>
                      ))}
                      <motion.path d="M 20,30 Q 85,10 150,30 Q 215,50 280,30"
                        fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }} />
                    </svg>
                  </div>
                </motion.div>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  onClick={() => setPhase("lecture")}
                  className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", color: "white", boxShadow: "0 0 24px rgba(59,130,246,0.35)" }}>
                  Continue to Today's Lecture <ChevronRight size={16} />
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
                style={{ background: "rgba(59,130,246,0.05)", borderColor: "rgba(59,130,246,0.2)" }}>
                <Shield size={16} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-primary">Academic Integrity Notice</div>
                  <p className="text-muted-foreground text-xs leading-relaxed mt-0.5">
                    Rewind is permitted — forward-skipping is disabled. Complete 100% to unlock the Assessment Gateway.
                    {attempt > 1 && <span className="text-yellow-400 font-semibold"> · Retry attempt {attempt}/3.</span>}
                  </p>
                </div>
              </div>
              <AntiCheatPlayer
                src={DEMO_VIDEO}
                courseId={parseInt(courseId || "1")}
                title={courseTitle}
                keyType="attendance"
                onLectureComplete={handleLectureEnd}
              />
              <AnimatePresence>
                {lectureComplete && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.4 }}>
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      onClick={handleStartQuiz}
                      className="w-full py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2"
                      style={{ background: "linear-gradient(135deg, #0F4C8C, #1D4ED8, #3B82F6)", color: "white" }}
                      animate={{ boxShadow: ["0 0 20px rgba(59,130,246,0.4)","0 0 40px rgba(59,130,246,0.7)","0 0 20px rgba(59,130,246,0.4)"] }}
                      transition={{ duration: 2, repeat: Infinity }}>
                      <Brain size={18} /> Enter Assessment Gateway <ChevronRight size={16} />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
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
              style={{ background: "rgba(8,20,60,0.8)", borderColor: "rgba(59,130,246,0.3)" }}>
              <div className="text-4xl">🎓</div>
              <h2 className="text-2xl font-black text-foreground">Session Complete</h2>
              <p className="text-muted-foreground text-sm">Your Gold Card has been minted. The Sentinel acknowledges your achievement.</p>
              <Link href="/student">
                <motion.button whileHover={{ scale: 1.02 }}
                  className="mx-auto px-8 py-3 rounded-xl font-semibold text-sm flex items-center gap-2"
                  style={{ background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", color: "white" }}>
                  Return to Portal
                </motion.button>
              </Link>
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
