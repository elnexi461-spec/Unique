import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CORE_LECTURES } from "@/data/mockDatabase";
import { ChevronRight, Cpu, Rocket, ShieldCheck } from "lucide-react";

interface SentinelPlayerProps {
  courseTitle: string;
  courseId: number;
  onEnded: () => void;
}

const SLIDE_DURATION = 10;

const WAVE_HEIGHTS = [6, 14, 22, 10, 28, 16, 32, 8, 20, 6, 26, 18, 32, 10, 24, 16, 6, 28, 14, 22, 30, 8, 18, 12];

function NeuralSVG() {
  const nodes = [
    { cx: 40, cy: 80 }, { cx: 40, cy: 130 }, { cx: 40, cy: 180 },
    { cx: 120, cy: 60 }, { cx: 120, cy: 110 }, { cx: 120, cy: 160 }, { cx: 120, cy: 210 },
    { cx: 200, cy: 80 }, { cx: 200, cy: 145 }, { cx: 200, cy: 210 },
    { cx: 270, cy: 120 }, { cx: 270, cy: 180 },
  ];
  const edges = [
    [0, 3], [0, 4], [1, 3], [1, 4], [1, 5], [2, 4], [2, 5], [2, 6],
    [3, 7], [3, 8], [4, 7], [4, 8], [4, 9], [5, 8], [5, 9], [6, 9],
    [7, 10], [7, 11], [8, 10], [8, 11], [9, 10], [9, 11],
  ];
  return (
    <svg viewBox="0 0 310 270" className="w-full h-full">
      {edges.map(([a, b], i) => (
        <motion.line key={i} x1={nodes[a]!.cx} y1={nodes[a]!.cy} x2={nodes[b]!.cx} y2={nodes[b]!.cy}
          stroke="#0040C0" strokeWidth="1" opacity="0.45"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: i * 0.05, ease: "easeOut" }} />
      ))}
      {nodes.map((n, i) => (
        <motion.circle key={i} cx={n.cx} cy={n.cy} r={7} fill="#020B1A" stroke="#0070FF" strokeWidth="1.5"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.4 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: `${n.cx}px ${n.cy}px` }} />
      ))}
    </svg>
  );
}

function BlockSVG() {
  const blocks = [
    { x: 20, y: 30, w: 80, h: 50, label: "INPUT" },
    { x: 130, y: 30, w: 80, h: 50, label: "PROCESS" },
    { x: 240, y: 30, w: 80, h: 50, label: "OUTPUT" },
    { x: 20, y: 120, w: 80, h: 50, label: "VALIDATE" },
    { x: 130, y: 120, w: 80, h: 50, label: "ITERATE" },
    { x: 240, y: 120, w: 80, h: 50, label: "SCALE" },
  ];
  return (
    <svg viewBox="0 0 340 200" className="w-full h-full">
      {blocks.map((b, i) => (
        <g key={i}>
          <motion.rect x={b.x} y={b.y} width={b.w} height={b.h} rx={6}
            fill="rgba(0,32,100,0.8)" stroke="#0070FF" strokeWidth="1.2"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: `${b.x + b.w / 2}px ${b.y + b.h / 2}px` }} />
          <motion.text x={b.x + b.w / 2} y={b.y + b.h / 2 + 4} textAnchor="middle"
            fontSize="9" fill="#60A5FA" fontWeight="700" letterSpacing="1"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.12 + 0.3 }}>
            {b.label}
          </motion.text>
          {i < 2 && (
            <motion.path d={`M ${b.x + b.w + 2} ${b.y + b.h / 2} L ${blocks[i + 1]!.x - 2} ${blocks[i + 1]!.y + blocks[i + 1]!.h / 2}`}
              fill="none" stroke="#0070FF" strokeWidth="1.5" markerEnd="url(#arr)"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: (i + 1) * 0.12, duration: 0.4 }} />
          )}
          {i >= 3 && i < 5 && (
            <motion.path d={`M ${b.x + b.w + 2} ${b.y + b.h / 2} L ${blocks[i + 1]!.x - 2} ${blocks[i + 1]!.y + blocks[i + 1]!.h / 2}`}
              fill="none" stroke="#0070FF" strokeWidth="1.5"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: (i + 1) * 0.12, duration: 0.4 }} />
          )}
        </g>
      ))}
    </svg>
  );
}

function ChartSVG() {
  const pts = [
    [20, 170], [60, 145], [100, 130], [140, 110], [180, 80], [220, 60], [270, 32],
  ] as [number, number][];
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
  return (
    <svg viewBox="0 0 300 200" className="w-full h-full">
      <motion.line x1="15" y1="10" x2="15" y2="185" stroke="rgba(0,112,255,0.3)" strokeWidth="1"
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} style={{ transformOrigin: "15px 185px" }}
        transition={{ duration: 0.6 }} />
      <motion.line x1="15" y1="185" x2="290" y2="185" stroke="rgba(0,112,255,0.3)" strokeWidth="1"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ transformOrigin: "15px 185px" }}
        transition={{ duration: 0.6 }} />
      <motion.path d={d} fill="none" stroke="#0070FF" strokeWidth="2.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }} />
      <motion.path d={d + ` L 270 185 L 20 185 Z`} fill="rgba(0,112,255,0.08)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} />
      {pts.map((p, i) => (
        <motion.circle key={i} cx={p[0]} cy={p[1]} r={4} fill="#0070FF"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.2 + i * 0.15, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: `${p[0]}px ${p[1]}px` }} />
      ))}
    </svg>
  );
}

function PyramidSVG() {
  const levels = [
    { x: 130, y: 20, w: 50, label: "VISION" },
    { x: 100, y: 65, w: 110, label: "STRATEGY" },
    { x: 60, y: 115, w: 190, label: "OPERATIONS" },
    { x: 20, y: 165, w: 270, label: "FOUNDATION" },
  ];
  return (
    <svg viewBox="0 0 310 220" className="w-full h-full">
      {levels.map((l, i) => (
        <g key={i}>
          <motion.rect x={l.x} y={l.y} width={l.w} height={38} rx={3}
            fill={`rgba(0,32,100,${0.6 + i * 0.1})`} stroke="#0070FF"
            strokeWidth={1 + i * 0.3}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            style={{ transformOrigin: `${l.x + l.w / 2}px ${l.y + 19}px` }}
            transition={{ delay: (3 - i) * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }} />
          <motion.text x={l.x + l.w / 2} y={l.y + 23} textAnchor="middle"
            fontSize="9" fill="#93C5FD" fontWeight="700" letterSpacing="1.5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: (3 - i) * 0.12 + 0.3 }}>
            {l.label}
          </motion.text>
        </g>
      ))}
    </svg>
  );
}

function CirclesSVG() {
  return (
    <svg viewBox="0 0 280 220" className="w-full h-full">
      <motion.circle cx={100} cy={110} r={75} fill="rgba(0,40,160,0.12)" stroke="#0040C0" strokeWidth="1.5"
        initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformOrigin: "100px 110px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} />
      <motion.circle cx={180} cy={110} r={75} fill="rgba(0,112,255,0.12)" stroke="#0070FF" strokeWidth="1.5"
        initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformOrigin: "180px 110px" }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} />
      <motion.text x={80} y={110} textAnchor="middle" fontSize="9" fill="#93C5FD" fontWeight="600"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>CURRENT</motion.text>
      <motion.text x={200} y={110} textAnchor="middle" fontSize="9" fill="#93C5FD" fontWeight="600"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>TARGET</motion.text>
      <motion.text x={140} y={107} textAnchor="middle" fontSize="8" fill="#0070FF" fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>ALIGN</motion.text>
    </svg>
  );
}

function WaveSVG() {
  return (
    <svg viewBox="0 0 300 160" className="w-full h-full">
      {[0, 1, 2].map((i) => (
        <motion.path key={i}
          d="M 0 80 Q 40 40 80 80 Q 120 120 160 80 Q 200 40 240 80 Q 280 120 300 80"
          fill="none" stroke="#0070FF" strokeWidth={2 - i * 0.5}
          opacity={0.8 - i * 0.25}
          style={{ translateY: i * 18 }}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: i * 0.2, ease: "easeInOut" }} />
      ))}
    </svg>
  );
}

function FeedbackSVG() {
  return (
    <svg viewBox="0 0 280 220" className="w-full h-full">
      {[
        { cx: 80, cy: 70, label: "HUMAN" },
        { cx: 200, cy: 70, label: "MODEL" },
        { cx: 140, cy: 170, label: "REWARD" },
      ].map((n, i) => (
        <g key={i}>
          <motion.circle cx={n.cx} cy={n.cy} r={35} fill="rgba(0,32,100,0.8)"
            stroke="#0070FF" strokeWidth="1.5"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}
            transition={{ delay: i * 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }} />
          <motion.text x={n.cx} y={n.cy + 4} textAnchor="middle" fontSize="8"
            fill="#60A5FA" fontWeight="700" letterSpacing="0.5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.18 + 0.3 }}>
            {n.label}
          </motion.text>
        </g>
      ))}
      {[[80, 70, 200, 70], [200, 70, 140, 170], [140, 170, 80, 70]].map(([x1, y1, x2, y2], i) => (
        <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0040C0" strokeWidth="1.5"
          strokeDasharray="5 3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.6 + i * 0.2, duration: 0.5 }} />
      ))}
    </svg>
  );
}

const VISUAL_MAP: Record<string, React.ComponentType> = {
  mindset: NeuralSVG,
  alignment: CirclesSVG,
  framework: BlockSVG,
  canvas: BlockSVG,
  capital: ChartSVG,
  scale: PyramidSVG,
  rlhf: FeedbackSVG,
  governance: PyramidSVG,
  fairness: CirclesSVG,
  existential: ChartSVG,
};

function SlideVisual({ visual }: { visual: string }) {
  const Component = VISUAL_MAP[visual] ?? WaveSVG;
  return <Component />;
}

export function SentinelPlayer({ courseId, onEnded }: SentinelPlayerProps) {
  const lectureData = CORE_LECTURES[(courseId - 1) % CORE_LECTURES.length] ?? CORE_LECTURES[0]!;
  const slides = lectureData.slides;

  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [slideTimeProgress, setSlideTimeProgress] = useState(0);
  const [visiblePoints, setVisiblePoints] = useState(0);
  const [ended, setEnded] = useState(false);
  const [showExamButton, setShowExamButton] = useState(false);
  const [examCountdown, setExamCountdown] = useState(3);
  const [examReady, setExamReady] = useState(false);

  useEffect(() => {
    if (showExamButton) return;
    setSlideTimeProgress(0);
    setVisiblePoints(0);
    const start = Date.now();

    const progressTimer = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      setSlideTimeProgress(Math.min(elapsed / SLIDE_DURATION, 1));
    }, 80);

    const isLastSlide = currentSlideIdx + 1 >= slides.length;

    const slideTimer = setTimeout(() => {
      clearInterval(progressTimer);
      if (isLastSlide) {
        if (!ended) {
          setEnded(true);
          setShowExamButton(true);
        }
      } else {
        setCurrentSlideIdx(i => i + 1);
      }
    }, SLIDE_DURATION * 1000);

    const slide = slides[currentSlideIdx];
    const bulletTimers = (slide?.keyPoints ?? []).map((_, i) =>
      setTimeout(() => setVisiblePoints(i + 1), (i + 1) * 1800)
    );

    return () => {
      clearInterval(progressTimer);
      clearTimeout(slideTimer);
      bulletTimers.forEach(clearTimeout);
    };
  }, [currentSlideIdx, showExamButton]);

  // Countdown when exam button is clicked
  useEffect(() => {
    if (!examReady) return;
    if (examCountdown <= 0) {
      onEnded();
      return;
    }
    const t = setTimeout(() => setExamCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [examReady, examCountdown]);

  const currentSlide = slides[currentSlideIdx];
  const overallProgress = showExamButton
    ? 100
    : ((currentSlideIdx + slideTimeProgress) / slides.length) * 100;

  if (!currentSlide) return null;

  return (
    <div
      className="rounded-2xl overflow-hidden border flex flex-col"
      style={{
        background: "rgba(2,8,22,0.95)",
        borderColor: "rgba(0,112,255,0.22)",
        backdropFilter: "blur(20px)",
        minHeight: 460,
      }}
    >
      {/* Overall progress bar */}
      <div className="h-0.5 w-full bg-white/5">
        <motion.div
          className="h-full"
          style={{ background: "linear-gradient(90deg, #0040C0, #0070FF)", width: `${overallProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Header */}
      <div
        className="px-5 py-3 border-b flex items-center justify-between shrink-0"
        style={{ borderColor: "rgba(0,112,255,0.15)" }}
      >
        <div className="flex items-center gap-2.5">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="w-2 h-2 rounded-full"
            style={{ background: "#0070FF" }}
          />
          <Cpu size={13} className="text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Sentinel Lecture Engine
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted-foreground">
            {currentSlideIdx + 1} / {slides.length}
          </span>
          <div className="flex gap-1">
            {slides.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === currentSlideIdx ? 16 : 5,
                  height: 5,
                  background: i < currentSlideIdx
                    ? "#0070FF"
                    : i === currentSlideIdx
                    ? "#0070FF"
                    : "rgba(255,255,255,0.12)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* SVG area */}
        <div
          className="lg:w-5/12 flex items-center justify-center p-6 border-b lg:border-b-0 lg:border-r relative"
          style={{ borderColor: "rgba(0,112,255,0.1)", minHeight: 200 }}
        >
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 50%, #0040C0, transparent 70%)" }}
          />
          <div className="w-full max-w-[280px] aspect-video relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.visual + currentSlideIdx}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full"
              >
                <SlideVisual visual={currentSlide.visual} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Text area */}
        <div className="flex-1 p-6 flex flex-col gap-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlideIdx}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-3 flex-1"
            >
              <div>
                <div className="text-[9px] font-bold uppercase tracking-[0.28em] text-primary/70 mb-1.5">
                  Slide {currentSlideIdx + 1}
                </div>
                <h3 className="text-lg font-black text-foreground leading-tight">
                  {currentSlide.title}
                </h3>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {currentSlide.content}
              </p>

              {/* Bullet points — staggered */}
              <div className="flex flex-col gap-2 mt-1">
                <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary/60 mb-1">
                  Key Takeaways
                </div>
                {currentSlide.keyPoints.map((pt, i) => (
                  <AnimatePresence key={i}>
                    {i < visiblePoints && (
                      <motion.div
                        initial={{ opacity: 0, x: -18, filter: "blur(4px)" }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-start gap-2.5 text-xs"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="mt-0.5 shrink-0"
                          style={{ color: "#0070FF" }}
                        >
                          <ChevronRight size={11} />
                        </motion.div>
                        <span className="text-foreground/85 leading-relaxed">{pt}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide timer bar */}
          {!showExamButton && (
            <div className="h-[2px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #0040C0, #0070FF)",
                  width: `${slideTimeProgress * 100}%`,
                }}
                transition={{ duration: 0.08 }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Launch Exam Gate — appears after last slide */}
      <AnimatePresence>
        {showExamButton && (
          <motion.div
            key="exam-gate"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mx-5 mb-5 mt-2 rounded-2xl border overflow-hidden"
            style={{ background: "rgba(0,20,70,0.95)", borderColor: "rgba(0,112,255,0.4)" }}
          >
            <div className="px-5 py-3 border-b flex items-center gap-2"
              style={{ borderColor: "rgba(0,112,255,0.2)", background: "rgba(0,112,255,0.06)" }}>
              <ShieldCheck size={14} className="text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Lecture Complete — Academic Integrity Gate
              </span>
            </div>
            <div className="p-5 flex flex-col items-center gap-4 text-center">
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "rgba(0,112,255,0.12)", border: "1px solid rgba(0,112,255,0.35)" }}
              >
                <Rocket size={20} style={{ color: "#0070FF" }} />
              </motion.div>
              <div>
                <p className="text-white font-bold text-sm mb-1">All 5 slides completed.</p>
                <p className="text-muted-foreground text-xs leading-relaxed max-w-xs">
                  You have reviewed the full lecture. The Assessment Gateway is now unlocked.
                  Confirm readiness to begin the comprehensive exam.
                </p>
              </div>

              {!examReady ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setExamReady(true)}
                  className="px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #0040C0, #0070FF)",
                    color: "white",
                    boxShadow: "0 0 28px rgba(0,112,255,0.45)",
                    border: "1px solid rgba(0,112,255,0.4)",
                  }}
                >
                  <Rocket size={15} /> Launch Comprehensive Exam
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <motion.div
                    key={examCountdown}
                    initial={{ scale: 1.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-5xl font-black"
                    style={{ color: "#0070FF" }}
                  >
                    {examCountdown > 0 ? examCountdown : "—"}
                  </motion.div>
                  <p className="text-xs text-muted-foreground">Launching assessment in {examCountdown}s…</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice wave footer */}
      <div
        className="shrink-0 px-5 py-3 border-t flex items-center gap-3"
        style={{ borderColor: "rgba(0,112,255,0.12)", background: "rgba(2,6,23,0.6)" }}
      >
        <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-primary/60 shrink-0">
          AI Narrator
        </div>
        <div className="flex items-center gap-0.5 flex-1">
          {WAVE_HEIGHTS.map((maxH, i) => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{ width: 3, background: "rgba(0,112,255,0.7)", minHeight: 3 }}
              animate={{ height: showExamButton ? 3 : [3, maxH * 0.85, 3] }}
              transition={showExamButton ? {} : {
                duration: 0.38 + (i % 5) * 0.07,
                repeat: Infinity,
                delay: i * 0.04,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        <div className="text-[9px] font-mono text-muted-foreground/50 shrink-0 tabular-nums">
          {Math.round(overallProgress)}%
        </div>
      </div>
    </div>
  );
}
