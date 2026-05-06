import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, ChevronLeft, ChevronRight, CheckCircle,
  AlertTriangle, Brain, BookOpen, Network, Scale, HeartPulse, Cpu, Lightbulb, TrendingUp,
} from "lucide-react";
import { CORE_LECTURES } from "@/data/mockDatabase";

interface LectureImageSliderProps {
  courseTitle: string;
  courseId: number;
  onLectureComplete: () => void;
}

const SLIDE_DURATION = 24; /* seconds per slide in demo mode */

const VISUAL_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  mindset: Brain, framework: Network, canvas: BookOpen, capital: TrendingUp, scale: Network,
  alignment: Brain, rlhf: Cpu, governance: Scale, fairness: Scale, existential: AlertTriangle,
  systems: Network, hcd: Brain, prototype: Lightbulb, trl: TrendingUp, ip: BookOpen,
  constitution: Scale, federalism: Network, rights: Scale, admin: BookOpen, reform: TrendingUp,
  architecture: HeartPulse, financing: TrendingUp, workforce: Users, quality: CheckCircle, digital: Cpu,
};

function Users({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

const SLIDE_VISUALS: Record<string, React.ReactNode> = {};

function SlideVisual({ type, title }: { type: string; title: string }) {
  const Icon = VISUAL_MAP[type] ?? Brain;
  const points = ["Core Concept", "Application", "System Impact", "Evidence Base"];

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="max-w-sm w-full space-y-6">
        {/* Central icon with rings */}
        <div className="flex justify-center">
          <div className="relative">
            {[1, 2, 3].map(r => (
              <motion.div key={r}
                className="absolute rounded-full border border-blue-500/20"
                style={{ inset: -(r * 20), borderColor: `rgba(59,130,246,${0.15 - r * 0.04})` }}
                animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2 + r * 0.5, repeat: Infinity, delay: r * 0.3 }}
              />
            ))}
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center relative z-10"
              style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.35)" }}>
              <Icon size={36} className="text-blue-400" />
            </div>
          </div>
        </div>

        {/* Node map */}
        <svg width="100%" height="80" viewBox="0 0 320 80">
          {[60, 140, 220, 300].map((x, i) => (
            <g key={x}>
              {i < 3 && (
                <motion.line x1={x} y1="40" x2={x + 80} y2="40"
                  stroke="rgba(59,130,246,0.3)" strokeWidth="1.5" strokeDasharray="4 4"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.3 }} />
              )}
              <motion.circle cx={x} cy={40} r={8} fill="#1D4ED8" stroke="#60A5FA" strokeWidth="1.5"
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.25, type: "spring" }} />
              <motion.text x={x} y={66} textAnchor="middle" fontSize="9" fill="rgba(147,197,253,0.75)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.25 + 0.2 }}>
                {points[i]}
              </motion.text>
            </g>
          ))}
          <motion.path d="M 60,40 Q 140,10 220,40 Q 300,70 380,40"
            fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }} />
        </svg>
      </div>
    </div>
  );
}

export function LectureImageSlider({ courseTitle, courseId, onLectureComplete }: LectureImageSliderProps) {
  const lecture = CORE_LECTURES.find(l =>
    l.title.toLowerCase() === courseTitle.toLowerCase() ||
    l.code === String(courseId)
  ) ?? CORE_LECTURES[0]!;

  const slides = lecture.slides;
  const totalSlides = slides.length;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeOnSlide, setTimeOnSlide] = useState(0);
  const [maxSlideReached, setMaxSlideReached] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [cheatFlash, setCheatFlash] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalWatchedPct = Math.round(
    ((maxSlideReached + Math.min(timeOnSlide / SLIDE_DURATION, 1)) / totalSlides) * 100
  );

  useEffect(() => {
    if (!isPlaying || completed) return;
    timerRef.current = setInterval(() => {
      setTimeOnSlide(t => {
        if (t + 1 >= SLIDE_DURATION) {
          clearInterval(timerRef.current!);
          const next = currentSlide + 1;
          setMaxSlideReached(m => Math.max(m, currentSlide + 1));
          if (next >= totalSlides) {
            setCompleted(true);
            onLectureComplete();
          } else {
            setCurrentSlide(next);
            setTimeOnSlide(0);
          }
          return 0;
        }
        return t + 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, currentSlide, completed]);

  const goToSlide = useCallback((idx: number) => {
    if (idx > maxSlideReached + 1) {
      setCheatFlash(true);
      setTimeout(() => setCheatFlash(false), 2000);
      return;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrentSlide(idx);
    setTimeOnSlide(0);
    setMaxSlideReached(m => Math.max(m, idx > 0 ? idx - 1 : 0));
  }, [maxSlideReached]);

  const slide = slides[currentSlide]!;
  const slideProgress = (timeOnSlide / SLIDE_DURATION) * 100;

  return (
    <div className="rounded-2xl overflow-hidden border"
      style={{ background: "rgba(6,14,44,0.95)", borderColor: "rgba(59,130,246,0.2)" }}>

      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between"
        style={{ borderColor: "rgba(59,130,246,0.15)" }}>
        <div>
          <h3 className="font-semibold text-foreground text-sm">{courseTitle}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
            <AlertTriangle size={10} className="text-yellow-500" />
            Sequential mode · Forward-skipping disabled · Slide {currentSlide + 1}/{totalSlides}
          </p>
        </div>
        {completed && <CheckCircle className="text-primary" size={20} />}
      </div>

      {/* Slide progress dots */}
      <div className="px-4 pt-3 flex items-center gap-1.5">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goToSlide(i)}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === currentSlide ? 28 : 8,
              height: 8,
              background:
                i < currentSlide ? "#3B82F6" :
                i === currentSlide ? "#60A5FA" :
                i <= maxSlideReached ? "rgba(59,130,246,0.4)" :
                "rgba(255,255,255,0.1)",
              cursor: i <= maxSlideReached + 1 ? "pointer" : "not-allowed",
            }}
          />
        ))}
        <span className="ml-auto text-xs font-mono text-muted-foreground">{totalWatchedPct}%</span>
      </div>

      {/* Slide timer bar */}
      <div className="px-4 pt-1.5">
        <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div animate={{ width: `${slideProgress}%` }} transition={{ duration: 0.5 }}
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #1D4ED8, #60A5FA)", boxShadow: "0 0 6px rgba(59,130,246,0.5)" }} />
        </div>
      </div>

      {/* Main slide area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[340px] relative">

        {/* Anti-cheat flash */}
        <AnimatePresence>
          {cheatFlash && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex items-center justify-center"
              style={{ background: "rgba(220,38,38,0.22)" }}>
              <div className="bg-red-900/90 text-red-200 px-6 py-3 rounded-xl font-bold text-sm border border-red-500">
                ⚠ Complete the current slide before advancing
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Visual panel */}
        <div className="relative overflow-hidden border-r"
          style={{ borderColor: "rgba(59,130,246,0.12)", background: "rgba(4,10,36,0.8)" }}>
          <AnimatePresence mode="wait">
            <motion.div key={currentSlide} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="h-full">
              <SlideVisual type={slide.visual} title={slide.title} />
            </motion.div>
          </AnimatePresence>

          {/* Slide counter badge */}
          <div className="absolute top-3 left-3 text-xs font-mono px-2 py-1 rounded"
            style={{ background: "rgba(0,0,0,0.5)", color: "rgba(147,197,253,0.7)", border: "1px solid rgba(59,130,246,0.2)" }}>
            SLIDE {currentSlide + 1} · {SLIDE_DURATION - timeOnSlide}s
          </div>
        </div>

        {/* Content panel */}
        <div className="p-6 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div key={currentSlide} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }} className="space-y-4">

              {/* Slide title */}
              <div>
                <div className="text-[10px] font-bold tracking-[0.3em] uppercase mb-1.5"
                  style={{ color: "rgba(96,165,250,0.7)" }}>
                  {lecture.code} · Session Material
                </div>
                <h2 className="text-xl font-black text-white leading-tight">{slide.title}</h2>
              </div>

              {/* Content */}
              <p className="text-sm text-muted-foreground leading-relaxed">{slide.content}</p>

              {/* Key points */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-primary uppercase tracking-wider">Key Concepts</div>
                {slide.keyPoints.map((pt, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    className="flex items-start gap-2 text-xs text-foreground">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ background: "#3B82F6", boxShadow: "0 0 4px rgba(59,130,246,0.6)" }} />
                    {pt}
                  </motion.div>
                ))}
              </div>

              {/* Professor attribution */}
              <div className="text-xs text-muted-foreground italic border-t pt-3"
                style={{ borderColor: "rgba(59,130,246,0.1)" }}>
                — {lecture.professor} · UOU Sentinel Verified Content
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-t flex items-center gap-3"
        style={{ borderColor: "rgba(59,130,246,0.15)", background: "rgba(4,10,36,0.6)" }}>

        <button onClick={() => goToSlide(Math.max(0, currentSlide - 1))}
          disabled={currentSlide === 0}
          className="p-2 rounded-lg transition-all disabled:opacity-30"
          style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}>
          <ChevronLeft size={16} className="text-primary" />
        </button>

        <button
          onClick={() => setIsPlaying(p => !p)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all"
          style={{
            background: isPlaying ? "rgba(59,130,246,0.15)" : "linear-gradient(135deg, #1D4ED8, #3B82F6)",
            color: "white",
            boxShadow: isPlaying ? "none" : "0 0 20px rgba(59,130,246,0.35)",
            border: isPlaying ? "1px solid rgba(59,130,246,0.3)" : "none",
          }}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          {isPlaying ? "Pause Lecture" : (currentSlide === 0 && timeOnSlide === 0 ? "Begin Lecture" : "Resume Lecture")}
        </button>

        <button onClick={() => goToSlide(Math.min(maxSlideReached + 1, totalSlides - 1))}
          disabled={currentSlide >= maxSlideReached + 1 || currentSlide >= totalSlides - 1}
          className="p-2 rounded-lg transition-all disabled:opacity-30"
          style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}>
          <ChevronRight size={16} className="text-primary" />
        </button>
      </div>

      {/* Completion banner */}
      <AnimatePresence>
        {completed && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            className="border-t p-4 flex items-center gap-2"
            style={{ borderColor: "rgba(59,130,246,0.25)", background: "rgba(59,130,246,0.07)" }}>
            <CheckCircle size={16} className="text-primary shrink-0" />
            <span className="text-sm text-primary font-semibold">
              All {totalSlides} slides completed — click "Enter Assessment Gateway" to earn your Gold Card.
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
