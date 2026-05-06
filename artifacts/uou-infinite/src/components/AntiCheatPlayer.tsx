import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, CheckCircle, AlertTriangle, Key, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

interface AntiCheatPlayerProps {
  src: string;
  courseId: number;
  title: string;
  keyType?: "attendance" | "exam" | "test" | "assignment";
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function AntiCheatPlayer({ src, courseId, title, keyType = "attendance" }: AntiCheatPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [maxWatched, setMaxWatched] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [claimInput, setClaimInput] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [cheatAttempt, setCheatAttempt] = useState(false);
  const { token } = useAuth();
  const { toast } = useToast();

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setCurrentTime(v.currentTime);

    // Anti-cheat: if user tries to seek past max watched, snap back
    if (v.currentTime > maxWatched + 0.5) {
      v.currentTime = maxWatched;
      setCheatAttempt(true);
      setTimeout(() => setCheatAttempt(false), 2000);
      toast({ title: "Anti-cheat: Forward skip disabled", variant: "destructive" });
    } else if (v.currentTime > maxWatched) {
      setMaxWatched(v.currentTime);
    }
  }, [maxWatched, toast]);

  const handleEnded = useCallback(async () => {
    if (maxWatched >= duration * 0.95) {
      setCompleted(true);
      // Generate attendance key
      try {
        const r = await fetch(`${BASE}/api/system/generate-key`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ courseId, keyType }),
        });
        const data = await r.json();
        if (data.key) setGeneratedKey(data.key);
      } catch {}
    }
  }, [maxWatched, duration, courseId, keyType, token]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.addEventListener("timeupdate", handleTimeUpdate);
    v.addEventListener("ended", handleEnded);
    v.addEventListener("loadedmetadata", () => setDuration(v.duration));
    return () => {
      v.removeEventListener("timeupdate", handleTimeUpdate);
      v.removeEventListener("ended", handleEnded);
    };
  }, [handleTimeUpdate, handleEnded]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) { v.pause(); setIsPlaying(false); }
    else { v.play(); setIsPlaying(true); }
  };

  const handleClaim = async () => {
    setClaiming(true);
    try {
      const r = await fetch(`${BASE}/api/system/claim-key`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ key: claimInput }),
      });
      const data = await r.json();
      if (data.success) {
        setClaimed(true);
        toast({ title: "Attendance Claimed!", description: data.message });
      } else {
        toast({ title: "Invalid Key", description: data.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Claim failed", variant: "destructive" });
    }
    setClaiming(false);
  };

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const watchedPct = duration > 0 ? (maxWatched / duration) * 100 : 0;

  return (
    <div className="rounded-2xl overflow-hidden border border-border bg-card">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
            <AlertTriangle size={10} className="text-yellow-500" />
            Anti-cheat enabled · Forward-skipping disabled
          </p>
        </div>
        {completed && <CheckCircle className="text-primary" size={20} />}
      </div>

      <div className="relative bg-black aspect-video">
        <video ref={videoRef} src={src} className="w-full h-full" preload="metadata" />

        {/* Cheat attempt flash */}
        <AnimatePresence>
          {cheatAttempt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(220,38,38,0.3)" }}
            >
              <div className="bg-red-900/90 text-red-200 px-6 py-3 rounded-xl font-bold text-lg border border-red-500">
                ⚠ Forward-seeking is disabled
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Click to play overlay */}
        {!isPlaying && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-[0_0_30px_rgba(100,255,218,0.5)]">
              <Play size={24} className="text-background ml-1" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="p-3 space-y-2">
        {/* Progress bar */}
        <div
          ref={progressRef}
          className="w-full h-2 bg-border rounded-full relative overflow-hidden cursor-pointer"
        >
          {/* Max watched (lighter) */}
          <div
            className="absolute top-0 left-0 h-full rounded-full transition-all"
            style={{ width: `${watchedPct}%`, background: "rgba(100,255,218,0.25)" }}
          />
          {/* Current position */}
          <div
            className="absolute top-0 left-0 h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: "#64FFDA" }}
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <button onClick={togglePlay} className="text-foreground hover:text-primary transition-colors">
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={() => { setIsMuted(!isMuted); if (videoRef.current) videoRef.current.muted = !isMuted; }}
            className="text-foreground hover:text-primary transition-colors"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <span className="font-mono">
            {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, "0")} /
            {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, "0")}
          </span>
          <div className="flex-1" />
          <span className="font-mono">
            {watchedPct.toFixed(0)}% watched
          </span>
        </div>
      </div>

      {/* Key generation / claim */}
      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="border-t border-primary/30 bg-primary/5 p-4 space-y-3"
          >
            <div className="flex items-center gap-2 text-primary text-sm font-semibold">
              <CheckCircle size={16} />
              Lecture completed! Your attendance key:
            </div>
            {generatedKey ? (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-background border border-primary/40">
                <Key size={16} className="text-primary" />
                <span className="font-mono text-primary text-lg tracking-widest flex-1">{generatedKey}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 size={14} className="animate-spin" /> Generating key...
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Copy this key and paste it in the Attendance Claim box below to record your presence.
            </p>
            {!claimed ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Paste your attendance key here..."
                  value={claimInput}
                  onChange={e => setClaimInput(e.target.value.toUpperCase())}
                  className="font-mono uppercase tracking-wider"
                />
                <Button
                  onClick={handleClaim}
                  disabled={claiming || claimInput.length < 16}
                  className="bg-primary text-background hover:bg-primary/90 shrink-0"
                >
                  {claiming ? <Loader2 size={14} className="animate-spin" /> : "Claim"}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                <CheckCircle size={16} /> Attendance recorded successfully!
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
