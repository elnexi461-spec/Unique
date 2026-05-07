import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CORE_LECTURES } from "@/data/mockDatabase";
import { WhiteboardCanvas } from "@/components/WhiteboardCanvas";
import { SubtitleOverlay, type SubtitleCue } from "@/components/SubtitleOverlay";
import { useAuth } from "@/lib/auth-context";
import {
  ChevronRight, Cpu, Rocket, ShieldCheck, Wifi, WifiOff,
  Loader2, Video, Brain,
} from "lucide-react";

interface SentinelPlayerProps {
  courseTitle: string;
  courseId: number;
  onEnded: () => void;
}

type SynthesisPhase = "synthesizing" | "ready" | "offline";

const OFFLINE_SLIDE_DURATION = 24;
const VIDEO_SEGMENT_DURATION = 60;
const SYNTHESIS_TIMEOUT_MS = 20_000;
const POLL_INTERVAL_MS = 3_000;

const WAVE_HEIGHTS = [6, 14, 22, 10, 28, 16, 32, 8, 20, 6, 26, 18, 32, 10, 24, 16, 6, 28, 14, 22, 30, 8, 18, 12];

function buildSubtitleCues(
  slides: typeof CORE_LECTURES[0]["slides"],
  segDuration: number,
): SubtitleCue[] {
  const cues: SubtitleCue[] = [];
  slides.forEach((slide, si) => {
    const base = si * segDuration;
    cues.push({ start: base, end: base + 7, text: slide.title });
    const excerpt = slide.content.split(" ").slice(0, 18).join(" ") + "…";
    cues.push({ start: base + 8, end: base + 16, text: excerpt });
    const perPt = Math.floor((segDuration - 18) / 3);
    slide.keyPoints.forEach((pt, pi) => {
      const s = base + 18 + pi * perPt;
      cues.push({ start: s, end: s + perPt - 1, text: pt });
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
      {/* Animated circuit ring */}
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
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          >
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
          Institutional Faculty Synthesizing{dots}
        </div>
        <div className="text-[11px] text-muted-foreground tracking-wide">
          Mapping{" "}
          <span className="font-mono font-bold" style={{ color: "#60A5FA" }}>
            {courseCode}
          </span>{" "}
          Logic to Avatar
        </div>
      </div>

      {/* Scanning bar */}
      <div
        className="w-48 h-0.5 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="w-1/2 h-full rounded-full"
          style={{ background: "linear-gradient(90deg, transparent, #60A5FA, transparent)" }}
        />
      </div>

      {/* Node grid */}
      <div className="grid grid-cols-5 gap-2 opacity-30">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#60A5FA" }}
          />
        ))}
      </div>

      <div
        className="text-[9px] font-mono tracking-[0.2em] uppercase"
        style={{ color: "rgba(96,165,250,0.4)" }}
      >
        HeyGen · UOU Synthesis Engine · v2
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   Avatar PiP Placeholder (offline mode)
────────────────────────────────────────────── */
function AvatarPlaceholder() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: "radial-gradient(ellipse at 50% 60%, #0040C0, transparent 70%)",
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <motion.div
          animate={{ opacity: [0.25, 0.6, 0.25] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -inset-3 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(0,112,255,0.3), transparent 70%)",
          }}
        />
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center relative z-10"
          style={{
            background: "linear-gradient(135deg, #020D28, #0040C0)",
            border: "2px solid rgba(0, 112, 255, 0.5)",
            boxShadow: "0 0 24px rgba(0, 112, 255, 0.3)",
          }}
        >
          <span
            className="text-xl font-black"
            style={{ color: "#60A5FA", letterSpacing: "-1px" }}
          >
            AI
          </span>
        </div>
      </motion.div>

      <div className="z-10 text-center">
        <div className="text-[8px] font-bold uppercase tracking-[0.25em] text-primary/70">
          AI Faculty
        </div>
        <div className="text-[7px] text-muted-foreground/50 mt-0.5">Cached Mode</div>
      </div>

      {/* Waveform */}
      <div className="flex items-center gap-0.5 z-10">
        {WAVE_HEIGHTS.slice(0, 12).map((h, i) => (
          <motion.div
            key={i}
            className="rounded-full"
            style={{ width: 2, background: "rgba(0,112,255,0.6)", minHeight: 2 }}
            animate={{ height: [2, h * 0.5, 2] }}
            transition={{
              duration: 0.45 + (i % 4) * 0.08,
              repeat: Infinity,
              delay: i * 0.06,
              ease: "easeInOut",
            }}
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

  /* ── Segment progression ── */
  const [currentSegment, setCurrentSegment] = useState(0);
  const [segmentProgress, setSegmentProgress] = useState(0);
  const [visiblePoints, setVisiblePoints] = useState(0);
  const [showExamButton, setShowExamButton] = useState(false);
  const [examCountdown, setExamCountdown] = useState(3);
  const [examReady, setExamReady] = useState(false);

  /* ── Video tracking ── */
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoTime, setVideoTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  /* ── Polling refs ── */
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const segDuration = phase === "ready" ? VIDEO_SEGMENT_DURATION : OFFLINE_SLIDE_DURATION;
  const totalDuration = slides.length * segDuration;

  const subtitleCues = buildSubtitleCues(slides, segDuration);

  /* ── Trigger offline fallback ── */
  const triggerOffline = useCallback(() => {
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPhase("offline");
    setOfflineBanner(true);
    setTimeout(() => setOfflineBanner(false), 6000);
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

        /* 20-second hard timeout */
        timeoutRef.current = setTimeout(() => {
          triggerOffline();
        }, SYNTHESIS_TIMEOUT_MS);

        /* Poll for completion */
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

  /* ── Offline timer-based progression ── */
  useEffect(() => {
    if (phase !== "offline" || showExamButton) return;
    setSegmentProgress(0);
    setVisiblePoints(0);
    const start = Date.now();

    const progressTimer = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      setSegmentProgress(Math.min(elapsed / OFFLINE_SLIDE_DURATION, 1));
    }, 80);

    const slideTimer = setTimeout(() => {
      clearInterval(progressTimer);
      if (currentSegment + 1 >= slides.length) {
        setShowExamButton(true);
      } else {
        setCurrentSegment((s) => s + 1);
      }
    }, OFFLINE_SLIDE_DURATION * 1000);

    const slide = slides[currentSegment];
    const bulletTimers = (slide?.keyPoints ?? []).map((_, i) =>
      setTimeout(() => setVisiblePoints(i + 1), (i + 1) * 1800),
    );

    return () => {
      clearInterval(progressTimer);
      clearTimeout(slideTimer);
      bulletTimers.forEach(clearTimeout);
    };
  }, [currentSegment, phase, showExamButton]);

  /* ── Video-based progression ── */
  const handleVideoTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const t = v.currentTime;
    setVideoTime(t);
    const seg = Math.min(Math.floor(t / VIDEO_SEGMENT_DURATION), slides.length - 1);
    const prog = (t % VIDEO_SEGMENT_DURATION) / VIDEO_SEGMENT_DURATION;
    setCurrentSegment(seg);
    setSegmentProgress(prog);
  }, [slides.length]);

  const handleVideoEnded = useCallback(() => {
    setShowExamButton(true);
  }, []);

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

  return (
    <div
      className="rounded-2xl overflow-hidden border flex flex-col relative"
      style={{
        background: "rgba(2,8,22,0.97)",
        borderColor: "rgba(0, 112, 255, 0.35)",
        backdropFilter: "blur(20px)",
        minHeight: 520,
        boxShadow: "0 0 0 1px rgba(0,112,255,0.12), 0 0 40px rgba(0,112,255,0.15), 0 0 80px rgba(0,64,192,0.08)",
      }}
    >
      {/* Synthesis overlay */}
      <AnimatePresence>
        {phase === "synthesizing" && (
          <SynthesisOverlay key="synth" courseCode={courseCode} />
        )}
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
              background: "rgba(30, 20, 0, 0.95)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              color: "#FCD34D",
              boxShadow: "0 0 20px rgba(245,158,11,0.15)",
            }}
          >
            <WifiOff size={12} className="shrink-0" />
            Offline Mode Active: Using Institutional Cache.
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
      <div
        className="px-5 py-3 border-b flex items-center justify-between shrink-0"
        style={{ borderColor: "rgba(0,112,255,0.15)" }}
      >
        <div className="flex items-center gap-2.5">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="w-2 h-2 rounded-full"
            style={{ background: phase === "ready" ? "#34D399" : "#0070FF" }}
          />
          <Cpu size={13} className="text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Sentinel Lecture Engine
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Phase badge */}
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest"
            style={{
              background:
                phase === "synthesizing"
                  ? "rgba(0,64,192,0.2)"
                  : phase === "ready"
                    ? "rgba(52,211,153,0.12)"
                    : "rgba(245,158,11,0.12)",
              color:
                phase === "synthesizing"
                  ? "#60A5FA"
                  : phase === "ready"
                    ? "#34D399"
                    : "#FCD34D",
              border: `1px solid ${phase === "synthesizing" ? "rgba(96,165,250,0.25)" : phase === "ready" ? "rgba(52,211,153,0.25)" : "rgba(245,158,11,0.25)"}`,
            }}
          >
            {phase === "synthesizing" ? (
              <><Loader2 size={9} className="animate-spin" /> Synthesizing</>
            ) : phase === "ready" ? (
              <><Video size={9} /> Live Avatar</>
            ) : (
              <><WifiOff size={9} /> Cache Mode</>
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
                  background:
                    i < currentSegment
                      ? "#0070FF"
                      : i === currentSegment
                        ? "#60A5FA"
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
            {/* Visual row: Whiteboard + PiP */}
            <div className="flex flex-col lg:flex-row flex-1" style={{ minHeight: 240 }}>
              {/* Whiteboard canvas — main area */}
              <div
                className="lg:w-7/12 relative flex items-center justify-center p-4 border-b lg:border-b-0 lg:border-r"
                style={{ borderColor: "rgba(0,112,255,0.1)", minHeight: 200 }}
              >
                {/* Background glow */}
                <div
                  className="absolute inset-0 opacity-[0.07] pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 50%, #0040C0, transparent 70%)",
                  }}
                />
                <div className="w-full max-w-[320px] aspect-[4/3] relative z-10">
                  <WhiteboardCanvas
                    courseCode={courseCode}
                    segmentIndex={currentSegment}
                  />
                </div>
                {/* Subtitle overlay */}
                <SubtitleOverlay
                  cues={subtitleCues}
                  currentTime={
                    phase === "ready" ? videoTime : currentSegment * OFFLINE_SLIDE_DURATION + segmentProgress * OFFLINE_SLIDE_DURATION
                  }
                />
              </div>

              {/* PiP panel — Avatar video or placeholder */}
              <div
                className="lg:w-5/12 flex flex-col"
                style={{ background: "rgba(1,5,16,0.6)" }}
              >
                {/* Video PiP */}
                <div className="relative flex-1 flex items-center justify-center overflow-hidden" style={{ minHeight: 160 }}>
                  {phase === "ready" && videoUrl ? (
                    <>
                      <video
                        ref={videoRef}
                        src={videoUrl}
                        autoPlay
                        playsInline
                        controls
                        onTimeUpdate={handleVideoTimeUpdate}
                        onEnded={handleVideoEnded}
                        onLoadedMetadata={() => {
                          if (videoRef.current) {
                            setVideoDuration(videoRef.current.duration);
                          }
                        }}
                        onError={triggerOffline}
                        className="w-full h-full object-cover"
                        style={{ maxHeight: 260 }}
                      />
                      <div
                        className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider"
                        style={{
                          background: "rgba(52,211,153,0.15)",
                          color: "#34D399",
                          border: "1px solid rgba(52,211,153,0.3)",
                        }}
                      >
                        <motion.span
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.2, repeat: Infinity }}
                          className="w-1.5 h-1.5 rounded-full bg-current"
                        />
                        HeyGen Live
                      </div>
                    </>
                  ) : (
                    <AvatarPlaceholder />
                  )}
                </div>

                {/* Slide text panel */}
                <div className="p-4 border-t flex flex-col gap-3" style={{ borderColor: "rgba(0,112,255,0.1)" }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSegment}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="flex flex-col gap-2"
                    >
                      <div>
                        <div className="text-[8px] font-bold uppercase tracking-[0.3em] text-primary/60 mb-1">
                          Segment {currentSegment + 1}
                        </div>
                        <h3 className="text-sm font-black text-foreground leading-snug">
                          {currentSlide.title}
                        </h3>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-primary/50">
                          Key Takeaways
                        </div>
                        {currentSlide.keyPoints.map((pt, i) => (
                          <AnimatePresence key={i}>
                            {(phase === "ready" || i < visiblePoints) && (
                              <motion.div
                                initial={{ opacity: 0, x: -12, filter: "blur(4px)" }}
                                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                className="flex items-start gap-2 text-[11px]"
                              >
                                <ChevronRight
                                  size={10}
                                  className="mt-0.5 shrink-0"
                                  style={{ color: "#0070FF" }}
                                />
                                <span className="text-foreground/80 leading-relaxed">{pt}</span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Segment timer bar (offline only) */}
            {!showExamButton && phase !== "ready" && (
              <div
                className="mx-5 mb-2 h-[2px] rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #0040C0, #0070FF, #60A5FA)",
                    width: `${segmentProgress * 100}%`,
                    boxShadow: "0 0 6px rgba(0,112,255,0.5)",
                  }}
                  transition={{ duration: 0.08 }}
                />
              </div>
            )}

            {/* Exam Gate */}
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
                    style={{
                      borderColor: "rgba(0,112,255,0.2)",
                      background: "rgba(0,112,255,0.06)",
                    }}
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
                      style={{
                        background: "rgba(0,112,255,0.12)",
                        border: "1px solid rgba(0,112,255,0.35)",
                      }}
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

            {/* Voice wave footer */}
            <div
              className="shrink-0 px-5 py-3 border-t flex items-center gap-3"
              style={{
                borderColor: "rgba(0,112,255,0.12)",
                background: "rgba(2,6,23,0.7)",
              }}
            >
              <div className="flex items-center gap-1.5 shrink-0">
                {phase === "ready" ? (
                  <Wifi size={10} style={{ color: "#34D399" }} />
                ) : (
                  <WifiOff size={10} style={{ color: "#FCD34D" }} />
                )}
                <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-primary/60">
                  {phase === "ready" ? "HeyGen Live" : "AI Narrator"}
                </div>
              </div>
              <div className="flex items-center gap-0.5 flex-1">
                {WAVE_HEIGHTS.map((maxH, i) => (
                  <motion.div
                    key={i}
                    className="rounded-full"
                    style={{ width: 3, background: "rgba(0,112,255,0.7)", minHeight: 3 }}
                    animate={{ height: showExamButton ? 3 : [3, maxH * 0.85, 3] }}
                    transition={
                      showExamButton
                        ? {}
                        : {
                            duration: 0.38 + (i % 5) * 0.07,
                            repeat: Infinity,
                            delay: i * 0.04,
                            ease: "easeInOut",
                          }
                    }
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
