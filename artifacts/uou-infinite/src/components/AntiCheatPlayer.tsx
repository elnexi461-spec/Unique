import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

interface AntiCheatPlayerProps {
  src: string;
  courseId: number;
  title: string;
  keyType?: "attendance" | "exam" | "test" | "assignment";
  onLectureComplete?: () => void;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function AntiCheatPlayer({
  src,
  courseId,
  title,
  keyType = "attendance",
  onLectureComplete,
}: AntiCheatPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [isMuted,      setIsMuted]      = useState(false);
  const [currentTime,  setCurrentTime]  = useState(0);
  const [duration,     setDuration]     = useState(0);
  const [maxWatched,   setMaxWatched]   = useState(0);
  const [completed,    setCompleted]    = useState(false);
  const [cheatAttempt, setCheatAttempt] = useState(false);
  const { toast } = useToast();

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setCurrentTime(v.currentTime);
    if (v.currentTime > maxWatched + 0.5) {
      v.currentTime = maxWatched;
      setCheatAttempt(true);
      setTimeout(() => setCheatAttempt(false), 2200);
      toast({ title: "Anti-cheat: Forward skip disabled", variant: "destructive" });
    } else if (v.currentTime > maxWatched) {
      setMaxWatched(v.currentTime);
    }
  }, [maxWatched, toast]);

  const handleEnded = useCallback(() => {
    if (maxWatched >= duration * 0.95) {
      setCompleted(true);
      onLectureComplete?.();
    }
  }, [maxWatched, duration, onLectureComplete]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onLoaded = () => setDuration(v.duration);
    v.addEventListener("timeupdate",   handleTimeUpdate);
    v.addEventListener("ended",        handleEnded);
    v.addEventListener("loadedmetadata", onLoaded);
    return () => {
      v.removeEventListener("timeupdate",    handleTimeUpdate);
      v.removeEventListener("ended",         handleEnded);
      v.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [handleTimeUpdate, handleEnded]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) { v.pause(); setIsPlaying(false); }
    else           { v.play(); setIsPlaying(true);   }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const pct        = duration > 0 ? (currentTime / duration) * 100 : 0;
  const watchedPct = duration > 0 ? (maxWatched / duration) * 100 : 0;

  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{ background: "rgba(6,14,44,0.9)", borderColor: "rgba(59,130,246,0.2)" }}
    >
      {/* Header */}
      <div
        className="p-4 border-b flex items-center justify-between"
        style={{ borderColor: "rgba(59,130,246,0.15)" }}
      >
        <div>
          <h3 className="font-semibold text-foreground text-sm">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
            <AlertTriangle size={10} className="text-yellow-500" />
            Anti-cheat enabled · Forward-skipping disabled
          </p>
        </div>
        {completed && (
          <CheckCircle className="text-primary" size={20} />
        )}
      </div>

      {/* Video */}
      <div className="relative bg-black aspect-video">
        <video ref={videoRef} src={src} className="w-full h-full" preload="metadata" />

        {/* Cheat flash */}
        <AnimatePresence>
          {cheatAttempt && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(220,38,38,0.28)" }}
            >
              <div className="bg-red-900/90 text-red-200 px-6 py-3 rounded-xl font-bold text-base border border-red-500">
                ⚠ Forward-seeking is disabled
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Play overlay */}
        {!isPlaying && (
          <motion.div
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: "radial-gradient(circle at 35% 35%, #60A5FA, #1D4ED8)",
                boxShadow: "0 0 32px rgba(59,130,246,0.7)",
              }}
            >
              <Play size={24} className="text-white ml-1" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="p-3 space-y-2">
        <div className="w-full h-2 rounded-full relative overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div className="absolute top-0 left-0 h-full rounded-full transition-all"
            style={{ width: `${watchedPct}%`, background: "rgba(59,130,246,0.3)" }} />
          <div className="absolute top-0 left-0 h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: "#3B82F6" }} />
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <button onClick={togglePlay}  className="text-foreground hover:text-primary transition-colors">
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button onClick={toggleMute} className="text-foreground hover:text-primary transition-colors">
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <span className="font-mono">
            {Math.floor(currentTime/60)}:{String(Math.floor(currentTime%60)).padStart(2,"0")} /
            {Math.floor(duration/60)}:{String(Math.floor(duration%60)).padStart(2,"0")}
          </span>
          <div className="flex-1" />
          <span className="font-mono" style={{ color: watchedPct >= 95 ? "#60A5FA" : undefined }}>
            {watchedPct.toFixed(0)}% watched
          </span>
        </div>
      </div>

      {/* Completion banner */}
      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="border-t p-4"
            style={{ borderColor: "rgba(59,130,246,0.25)", background: "rgba(59,130,246,0.07)" }}
          >
            <div className="flex items-center gap-2 text-primary text-sm font-semibold">
              <CheckCircle size={16} />
              Lecture complete — click "Enter Assessment Gateway" above to earn your Gold Card.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
