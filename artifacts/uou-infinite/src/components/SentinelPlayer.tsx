import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CORE_LECTURES } from "@/data/mockDatabase";
import { WhiteboardCanvas } from "@/components/WhiteboardCanvas";
import { SubtitleOverlay, type SubtitleCue } from "@/components/SubtitleOverlay";
import { useAuth } from "@/lib/auth-context";
import {
  ChevronRight, Cpu, Rocket, ShieldCheck, Wifi, WifiOff,
  Loader2, Video, Brain, Lock, CheckCircle,
} from "lucide-react";

interface SentinelPlayerProps {
  courseTitle: string;
  courseId: number;
  onEnded: () => void;
}

type SynthesisPhase = "synthesizing" | "ready" | "offline";

/* Each segment is exactly 60s — 5 segments × 60s = 5 min */
const SEGMENT_DURATION = 60;
const SYNTHESIS_TIMEOUT_MS = 20_000;
const POLL_INTERVAL_MS = 3_000;
const FALLBACK_VIDEO = "/BAM111_Sketch_Demo.mp4";

const WAVE_HEIGHTS = [6, 14, 22, 10, 28, 16, 32, 8, 20, 6, 26, 18, 32, 10, 24, 16, 6, 28, 14, 22, 30, 8, 18, 12];

/* ── Subtitle cues built for 60s segments ── */
function buildSubtitleCues(
  slides: typeof CORE_LECTURES[0]["slides"],
): SubtitleCue[] {
  const cues: SubtitleCue[] = [];
  slides.forEach((slide, si) => {
    const base = si * SEGMENT_DURATION;
    cues.push({ start: base, end: base + 8, text: slide.title });
    const excerpt = slide.content.split(" ").slice(0, 22).join(" ") + "…";
    cues.push({ start: base + 9, end: base + 22, text: excerpt });
    const perPt = Math.floor((SEGMENT_DURATION - 26) / Math.max(slide.keyPoints.length, 1));
    slide.keyPoints.forEach((pt, pi) => {
      const s = base + 26 + pi * perPt;
      cues.push({ start: s, end: s + perPt - 2, text: pt });
    });
  });
  return cues;
}

/* ──────────────────────────────────────────────
   Synthesis Loading Overlay
────────────────────────────────────────────── */
function SynthesisOverlay({ courseCode }: { courseCode: string }) {
  const [dots, setDots] = useState(".");
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const d = setInterval(() => setDots((p) => (p.length >= 3 ? "." : p + ".")), 600);
    const p = setInterval(() => setPulse((v) => v + 1), 1200);
    return () => { clearInterval(d); clearInterval(p); };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 rounded-2xl"
      style={{ background: "rgba(2, 6, 18, 0.97)", backdropFilter: "blur(20px)" }}
    >
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 rounded-full border-2 border-transparent"
          style={{
            background: "conic-gradient(from 0deg, #0040C0, #0070FF, #60A5FA, transparent 60%)",
            WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 3px))",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 3px))",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}>
            <Brain size={28} style={{ color: "#60A5FA" }} />
          </motion.div>
        </div>
        <motion.div
          key={pulse}
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 rounded-full"
          style={{ border: "1px solid rgba(0, 112, 255, 0.5)" }}
        />
      </div>
      <div className="text-center space-y-1.5 px-6">
        <div className="text-xs font-bold uppercase tracking-[0.32em] text-primary">
          Sketch Engine Synthesizing{dots}
        </div>
        <div className="text-[11px] text-muted-foreground tracking-wide">
          Mapping{" "}
          <span className="font-mono font-bold" style={{ color: "#60A5FA" }}>{courseCode}</span>
          {" "}Logic to Whiteboard Canvas
        </div>
      </div>
      <div className="w-48 h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="w-1/2 h-full rounded-full"
          style={{ background: "linear-gradient(90deg, transparent, #60A5FA, transparent)" }}
        />
      </div>
      <div className="grid grid-cols-5 gap-2 opacity-30">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div key={i}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#60A5FA" }}
          />
        ))}
      </div>
      <div className="text-[9px] font-mono tracking-[0.2em] uppercase" style={{ color: "rgba(96,165,250,0.4)" }}>
        HeyGen · UOU Sketch Engine · v2
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   Avatar PiP Placeholder (offline mode)
────────────────────────────────────────────── */
function AvatarPiP() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-1 relative overflow-hidden">
      <div className="absolute inset-0 opacity-15" style={{ background: "radial-gradient(ellipse at 50% 60%, #0040C0, transparent 70%)" }} />
      <motion.div
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -inset-2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,112,255,0.3), transparent 70%)" }}
        />
        <div className="w-10 h-10 rounded-full flex items-center justify-center relative z-10"
          style={{
            background: "linear-gradient(135deg, #020D28, #0040C0)",
            border: "1.5px solid rgba(0,112,255,0.5)",
            boxShadow: "0 0 16px rgba(0,112,255,0.3)",
          }}>
          <span className="text-sm font-black" style={{ color: "#60A5FA" }}>AI</span>
        </div>
      </motion.div>
      <div className="z-10 text-center">
        <div className="text-[7px] font-bold uppercase tracking-[0.25em] text-primary/70">AI Faculty</div>
        <div className="text-[6px] text-muted-foreground/50 mt-0.5">Sketch Mode</div>
      </div>
      <div className="flex items-center gap-0.5 z-10">
        {WAVE_HEIGHTS.slice(0, 10).map((h, i) => (
          <motion.div key={i} className="rounded-full"
            style={{ width: 2, background: "rgba(0,112,255,0.6)", minHeight: 2 }}
            animate={{ height: [2, h * 0.45, 2] }}
            transition={{ duration: 0.45 + (i % 4) * 0.08, repeat: Infinity, delay: i * 0.06, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Main SentinelPlayer
────────────────────────────────────────────── */
export function SentinelPlayer({ courseId, onEnded }: SentinelPlayerProps) {
  const { token } = useAuth();
  const lectureData = CORE_LECTURES[(courseId - 1) % CORE_LECTURES.length] ?? CORE_LECTURES[0]!;
  const slides = lectureData.slides;
  const courseCode = lectureData.code;

  /* ── Phase & video state ── */
  const [phase, setPhase] = useState<SynthesisPhase>("synthesizing");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [offlineBanner, setOfflineBanner] = useState(false);
  const [fallbackActive, setFallbackActive] = useState(false);

  /* ── Segment progression ── */
  const [currentSegment, setCurrentSegment] = useState(0);
  const [segmentProgress, setSegmentProgress] = useState(0);
  const [segmentUnlocked, setSegmentUnlocked] = useState(false);
  const [visiblePoints, setVisiblePoints] = useState(0);
  const [showExamButton, setShowExamButton] = useState(false);
  const [examCountdown, setExamCountdown] = useState(3);
  const [examReady, setExamReady] = useState(false);

  /* ── Video tracking ── */
  const videoRef = useRef<HTMLVideoElement>(null);
  const fallbackVideoRef = useRef<HTMLVideoElement>(null);
  const [videoTime, setVideoTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  /* ── Polling refs ── */
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const subtitleCues = buildSubtitleCues(slides);

  /* ── Current subtitle time ── */
  const currentTime = phase === "ready"
    ? videoTime
    : fallbackActive
      ? currentSegment * SEGMENT_DURATION + segmentProgress * SEGMENT_DURATION
      : currentSegment * SEGMENT_DURATION + segmentProgress * SEGMENT_DURATION;

  /* ── Trigger offline fallback ── */
  const triggerOffline = useCallback(() => {
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPhase("offline");
    setFallbackActive(true);
    setOfflineBanner(true);
    setTimeout(() => setOfflineBanner(false), 6000);
  }, []);

  /* ── Fallback video failed — go to pure SVG sketch ── */
  const handleFallbackVideoError = useCallback(() => {
    setFallbackActive(false);
  }, []);

  /* ── HeyGen synthesis on mount ── */
  useEffect(() => {
    if (!token) { triggerOffline(); return; }

    const text = lectureData.scriptSummary;

    (async () => {
      try {
        const synRes = await fetch("/api/heygen/synthesize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ courseCode, text }),
        });
        const synData = (await synRes.json()) as {
          videoId?: string;
          offlineMode?: boolean;
          error?: string;
        };

        if (!synRes.ok || synData.offlineMode || !synData.videoId) {
          triggerOffline();
          return;
        }

        const videoId = synData.videoId;
        timeoutRef.current = setTimeout(() => triggerOffline(), SYNTHESIS_TIMEOUT_MS);

        pollTimerRef.current = setInterval(async () => {
          try {
            const statRes = await fetch(`/api/heygen/status/${videoId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const statData = (await statRes.json()) as {
              status: "pending" | "completed" | "failed";
              videoUrl?: string | null;
            };
            if (statData.status === "completed" && statData.videoUrl) {
              if (pollTimerRef.current) clearInterval(pollTimerRef.current);
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
              setVideoUrl(statData.videoUrl);
              setPhase("ready");
            } else if (statData.status === "failed") {
              triggerOffline();
            }
          } catch {
            triggerOffline();
          }
        }, POLL_INTERVAL_MS);
      } catch {
        triggerOffline();
      }
    })();

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  /* ── Reset segmentUnlocked when segment changes ── */
  useEffect(() => {
    setSegmentUnlocked(false);
    setVisiblePoints(0);
    setSegmentProgress(0);
  }, [currentSegment]);

  /* ── Offline / sketch mode: 60s timer per segment ── */
  useEffect(() => {
    if (phase !== "offline" || showExamButton || fallbackActive) return;

    const start = Date.now();

    const progressTimer = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const progress = Math.min(elapsed / SEGMENT_DURATION, 1);
      setSegmentProgress(progress);
    }, 80);

    /* Unlock Next button after 60s */
    const unlockTimer = setTimeout(() => {
      clearInterval(progressTimer);
      setSegmentProgress(1);
      setSegmentUnlocked(true);
    }, SEGMENT_DURATION * 1000);

    /* Reveal key points staggered through the 60s */
    const slide = slides[currentSegment];
    const bulletTimers = (slide?.keyPoints ?? []).map((_, i) =>
      setTimeout(() => setVisiblePoints(i + 1), 10_000 + i * 15_000),
    );

    return () => {
      clearInterval(progressTimer);
      clearTimeout(unlockTimer);
      bulletTimers.forEach(clearTimeout);
    };
  }, [currentSegment, phase, showExamButton, fallbackActive]);

  /* ── Video segment tracking (online mode) ── */
  const handleVideoTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const t = v.currentTime;
    setVideoTime(t);
    const seg = Math.min(Math.floor(t / SEGMENT_DURATION), slides.length - 1);
    const prog = (t % SEGMENT_DURATION) / SEGMENT_DURATION;
    setCurrentSegment(seg);
    setSegmentProgress(prog);
  }, [slides.length]);

  const handleVideoEnded = useCallback(() => {
    setShowExamButton(true);
  }, []);

  /* ── Fallback video segment tracking ── */
  const handleFallbackTimeUpdate = useCallback(() => {
    const v = fallbackVideoRef.current;
    if (!v) return;
    const t = v.currentTime;
    const seg = Math.min(Math.floor(t / SEGMENT_DURATION), slides.length - 1);
    const prog = (t % SEGMENT_DURATION) / SEGMENT_DURATION;
    setCurrentSegment(seg);
    setSegmentProgress(prog);
    if (prog >= 0.99) setSegmentUnlocked(true);
  }, [slides.length]);

  /* ── Manual Next button ── */
  const handleNextSegment = useCallback(() => {
    if (!segmentUnlocked) return;
    if (currentSegment + 1 >= slides.length) {
      setShowExamButton(true);
    } else {
      setCurrentSegment((s) => s + 1);
    }
  }, [segmentUnlocked, currentSegment, slides.length]);

  /* ── Exam countdown ── */
  useEffect(() => {
    if (!examReady) return;
    if (examCountdown <= 0) { onEnded(); return; }
    const t = setTimeout(() => setExamCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [examReady, examCountdown]);

  const currentSlide = slides[currentSegment];

  const overallProgress = showExamButton
    ? 100
    : phase === "ready" && videoDuration > 0
    ? (videoTime / videoDuration) * 100
    : ((currentSegment + segmentProgress) / slides.length) * 100;

  if (!currentSlide) return null;

  /* ── Show/hide Next button: only in offline/fallback sketch mode ── */
  const showNextButton = phase !== "ready" && !showExamButton;

  return (
    <div
      className="rounded-2xl overflow-hidden border flex flex-col relative"
      style={{
        background: "rgba(2,8,22,0.97)",
        borderColor: "rgba(0,112,255,0.35)",
        backdropFilter: "blur(20px)",
        minHeight: 560,
        boxShadow: "0 0 0 1px rgba(0,112,255,0.12), 0 0 40px rgba(0,112,255,0.15), 0 0 80px rgba(0,64,192,0.08)",
      }}
    >
      {/* Synthesis overlay */}
      <AnimatePresence>
        {phase === "synthesizing" && <SynthesisOverlay key="synth" courseCode={courseCode} />}
      </AnimatePresence>

      {/* Offline mode banner */}
      <AnimatePresence>
        {offlineBanner && (
          <motion.div
            key="offline-banner"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="absolute top-12 left-4 right-4 z-30 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold"
            style={{
              background: "rgba(30,20,0,0.95)",
              border: "1px solid rgba(245,158,11,0.4)",
              color: "#FCD34D",
              boxShadow: "0 0 20px rgba(245,158,11,0.15)",
            }}
          >
            <WifiOff size={12} className="shrink-0" />
            {fallbackActive
              ? "Sketch Engine Active: Loading pre-rendered fallback…"
              : "Offline Sketch Mode: SVG Animation Engine engaged."}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overall progress bar */}
      <div className="h-0.5 w-full flex-shrink-0" style={{ background: "rgba(255,255,255,0.05)" }}>
        <motion.div
          className="h-full"
          style={{
            background: "linear-gradient(90deg, #0040C0, #0070FF, #60A5FA)",
            width: `${overallProgress}%`,
            boxShadow: "0 0 8px rgba(0,112,255,0.6)",
          }}
          transition={{ duration: 0.15 }}
        />
      </div>

      {/* Header */}
      <div className="px-5 py-3 border-b flex items-center justify-between shrink-0"
        style={{ borderColor: "rgba(0,112,255,0.15)" }}>
        <div className="flex items-center gap-2.5">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="w-2 h-2 rounded-full"
            style={{ background: phase === "ready" ? "#34D399" : "#0070FF" }}
          />
          <Cpu size={13} className="text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Sentinel Sketch Engine
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Phase badge */}
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest"
            style={{
              background: phase === "synthesizing"
                ? "rgba(0,64,192,0.2)"
                : phase === "ready"
                  ? "rgba(52,211,153,0.12)"
                  : fallbackActive
                    ? "rgba(245,158,11,0.12)"
                    : "rgba(96,165,250,0.1)",
              color: phase === "synthesizing"
                ? "#60A5FA"
                : phase === "ready"
                  ? "#34D399"
                  : fallbackActive
                    ? "#FCD34D"
                    : "#60A5FA",
              border: `1px solid ${phase === "synthesizing"
                ? "rgba(96,165,250,0.25)"
                : phase === "ready"
                  ? "rgba(52,211,153,0.25)"
                  : fallbackActive
                    ? "rgba(245,158,11,0.25)"
                    : "rgba(96,165,250,0.2)"}`,
            }}
          >
            {phase === "synthesizing" ? (
              <><Loader2 size={9} className="animate-spin" /> Synthesizing</>
            ) : phase === "ready" ? (
              <><Video size={9} /> Live Avatar</>
            ) : fallbackActive ? (
              <><WifiOff size={9} /> Fallback Video</>
            ) : (
              <><Brain size={9} /> Sketch Mode</>
            )}
          </div>

          {/* Segment dots */}
          <div className="flex gap-1">
            {slides.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === currentSegment ? 16 : 5,
                  height: 5,
                  background: i < currentSegment ? "#0070FF"
                    : i === currentSegment ? "#60A5FA"
                    : "rgba(255,255,255,0.10)",
                  boxShadow: i === currentSegment ? "0 0 6px rgba(0,112,255,0.6)" : "none",
                }}
              />
            ))}
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {currentSegment + 1}/{slides.length}
          </span>
        </div>
      </div>

      {/* Main content — only shown when not synthesizing */}
      <AnimatePresence>
        {phase !== "synthesizing" && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex flex-col"
          >
            {/* ── Whiteboard area (full width) + PiP floating corner ── */}
            <div
              className="relative flex-1"
              style={{ minHeight: 280, background: "rgba(1,6,20,0.6)" }}
            >
              {/* Radial background glow */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.06]"
                style={{ background: "radial-gradient(ellipse at 50% 50%, #0040C0, transparent 70%)" }}
              />

              {/* Fallback pre-rendered sketch video */}
              {fallbackActive && (
                <video
                  ref={fallbackVideoRef}
                  src={FALLBACK_VIDEO}
                  autoPlay
                  playsInline
                  onError={handleFallbackVideoError}
                  onTimeUpdate={handleFallbackTimeUpdate}
                  onEnded={() => setShowExamButton(true)}
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{ background: "rgba(0,5,20,1)" }}
                />
              )}

              {/* SVG Whiteboard sketch (when NOT showing fallback video) */}
              {!fallbackActive && (
                <div className="w-full h-full flex items-center justify-center p-4">
                  <div className="w-full h-full" style={{ maxWidth: 540 }}>
                    <WhiteboardCanvas
                      courseCode={courseCode}
                      segmentIndex={currentSegment}
                    />
                  </div>
                </div>
              )}

              {/* ── PiP Avatar — floating bottom-right corner ── */}
              {!fallbackActive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute bottom-3 right-3 z-10 rounded-xl overflow-hidden"
                  style={{
                    width: 152,
                    height: 94,
                    border: "1px solid rgba(0,112,255,0.35)",
                    background: "rgba(1,5,16,0.95)",
                    boxShadow: "0 0 24px rgba(0,112,255,0.2), inset 0 0 0 1px rgba(96,165,250,0.08)",
                  }}
                >
                  {phase === "ready" && videoUrl ? (
                    <video
                      ref={videoRef}
                      src={videoUrl}
                      autoPlay
                      playsInline
                      onTimeUpdate={handleVideoTimeUpdate}
                      onEnded={handleVideoEnded}
                      onLoadedMetadata={() => {
                        if (videoRef.current) setVideoDuration(videoRef.current.duration);
                      }}
                      onError={triggerOffline}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <AvatarPiP />
                  )}
                  {/* PiP label badge */}
                  <div
                    className="absolute top-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-wider"
                    style={{
                      background: phase === "ready" ? "rgba(52,211,153,0.15)" : "rgba(0,64,192,0.2)",
                      color: phase === "ready" ? "#34D399" : "#60A5FA",
                      border: `1px solid ${phase === "ready" ? "rgba(52,211,153,0.3)" : "rgba(0,112,255,0.3)"}`,
                    }}
                  >
                    {phase === "ready" ? (
                      <>
                        <motion.span
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.2, repeat: Infinity }}
                          className="w-1 h-1 rounded-full bg-current"
                        />
                        HeyGen
                      </>
                    ) : (
                      <>AI Faculty</>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* ── Electric Blue CC Subtitle Bar ── */}
            <SubtitleOverlay cues={subtitleCues} currentTime={currentTime} />

            {/* ── Key points panel ── */}
            <div
              className="px-5 py-3 border-t flex flex-col gap-2"
              style={{ borderColor: "rgba(0,112,255,0.1)" }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSegment}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[8px] font-bold uppercase tracking-[0.3em] text-primary/60">
                        Segment {currentSegment + 1} · {currentSlide.title}
                      </div>
                    </div>
                    {/* Segment timer indicator (sketch mode) */}
                    {showNextButton && (
                      <div
                        className="flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full"
                        style={{
                          background: segmentUnlocked ? "rgba(52,211,153,0.1)" : "rgba(245,158,11,0.1)",
                          color: segmentUnlocked ? "#34D399" : "#FCD34D",
                          border: `1px solid ${segmentUnlocked ? "rgba(52,211,153,0.25)" : "rgba(245,158,11,0.25)"}`,
                        }}
                      >
                        {segmentUnlocked ? (
                          <><CheckCircle size={9} /> Segment Unlocked</>
                        ) : (
                          <><Lock size={9} />{Math.ceil((1 - segmentProgress) * SEGMENT_DURATION)}s</>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {currentSlide.keyPoints.map((pt, i) => (
                      <AnimatePresence key={i}>
                        {(phase === "ready" || fallbackActive || i < visiblePoints) && (
                          <motion.div
                            initial={{ opacity: 0, x: -12, filter: "blur(4px)" }}
                            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                            className="flex items-start gap-2 text-[11px]"
                          >
                            <ChevronRight size={10} className="mt-0.5 shrink-0" style={{ color: "#0070FF" }} />
                            <span className="text-foreground/80 leading-relaxed">{pt}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Segment timer bar + Integrity Gate Next button ── */}
            {showNextButton && (
              <div className="px-5 pb-3 flex items-center gap-3">
                {/* Segment progress bar */}
                <div className="flex-1 h-[2px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: segmentUnlocked
                        ? "linear-gradient(90deg, #34D399, #6EE7B7)"
                        : "linear-gradient(90deg, #0040C0, #0070FF, #60A5FA)",
                      width: `${segmentProgress * 100}%`,
                      boxShadow: `0 0 6px ${segmentUnlocked ? "rgba(52,211,153,0.5)" : "rgba(0,112,255,0.5)"}`,
                    }}
                    transition={{ duration: 0.08 }}
                  />
                </div>

                {/* Integrity Gate Next/Exam Button */}
                <motion.button
                  whileHover={segmentUnlocked ? { scale: 1.04 } : {}}
                  whileTap={segmentUnlocked ? { scale: 0.96 } : {}}
                  onClick={segmentUnlocked ? handleNextSegment : undefined}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={{
                    background: segmentUnlocked
                      ? "linear-gradient(135deg, #0040C0, #0070FF)"
                      : "rgba(255,255,255,0.04)",
                    color: segmentUnlocked ? "white" : "rgba(255,255,255,0.2)",
                    border: `1px solid ${segmentUnlocked ? "rgba(0,112,255,0.5)" : "rgba(255,255,255,0.07)"}`,
                    boxShadow: segmentUnlocked ? "0 0 18px rgba(0,112,255,0.4)" : "none",
                    cursor: segmentUnlocked ? "pointer" : "not-allowed",
                  }}
                >
                  {segmentUnlocked ? (
                    currentSegment + 1 >= slides.length ? (
                      <><Rocket size={11} />Launch Exam</>
                    ) : (
                      <><ChevronRight size={11} />Next Segment</>
                    )
                  ) : (
                    <><Lock size={10} />Locked</>
                  )}
                </motion.button>
              </div>
            )}

            {/* ── Exam Gate ── */}
            <AnimatePresence>
              {showExamButton && (
                <motion.div
                  key="exam-gate"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="mx-5 mb-5 mt-2 rounded-2xl border overflow-hidden"
                  style={{
                    background: "rgba(0,20,70,0.97)",
                    borderColor: "rgba(0,112,255,0.4)",
                    boxShadow: "0 0 30px rgba(0,112,255,0.2)",
                  }}
                >
                  <div
                    className="px-5 py-3 border-b flex items-center gap-2"
                    style={{ borderColor: "rgba(0,112,255,0.2)", background: "rgba(0,112,255,0.06)" }}
                  >
                    <ShieldCheck size={14} className="text-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">
                      Lecture Complete — Academic Integrity Gate
                    </span>
                  </div>
                  <div className="p-5 flex flex-col items-center gap-4 text-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(0,112,255,0.12)", border: "1px solid rgba(0,112,255,0.35)" }}
                    >
                      <Rocket size={20} style={{ color: "#0070FF" }} />
                    </motion.div>
                    <div>
                      <p className="text-white font-bold text-sm mb-1">
                        All {slides.length} segments completed.
                      </p>
                      <p className="text-muted-foreground text-xs leading-relaxed max-w-xs">
                        You have reviewed the full lecture. The Assessment Gateway is now
                        unlocked. Confirm readiness to begin the comprehensive exam.
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
                        <p className="text-xs text-muted-foreground">
                          Launching assessment in {examCountdown}s…
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Voice wave footer ── */}
            <div
              className="shrink-0 px-5 py-3 border-t flex items-center gap-3"
              style={{ borderColor: "rgba(0,112,255,0.12)", background: "rgba(2,6,23,0.7)" }}
            >
              <div className="flex items-center gap-1.5 shrink-0">
                {phase === "ready" ? (
                  <Wifi size={10} style={{ color: "#34D399" }} />
                ) : (
                  <WifiOff size={10} style={{ color: "#FCD34D" }} />
                )}
                <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-primary/60">
                  {phase === "ready" ? "HeyGen Live" : fallbackActive ? "Sketch Fallback" : "Sketch Engine"}
                </div>
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
