import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { SentinelPlayer } from "@/components/SentinelPlayer";
import {
  ArrowLeft, Upload, FileText, CheckCircle, Cpu,
  Zap, Eye, RotateCcw,
} from "lucide-react";

interface ProcessingStage {
  label: string;
  detail: string;
  from: number;
  to: number;
}

const STAGES: ProcessingStage[] = [
  { label: "Chunking PDF into semantic units", detail: "Splitting document into paragraph-level semantic blocks…", from: 0, to: 32 },
  { label: "Extracting key concepts & hierarchies", detail: "Identifying main themes, subtopics, and knowledge dependencies…", from: 32, to: 65 },
  { label: "Synthesising Sentinel Lecture Video", detail: "Generating cinematic slide sequence with AI narration script…", from: 65, to: 88 },
  { label: "Calibrating AI narrator voice model", detail: "Fine-tuning prosody and pacing for academic delivery…", from: 88, to: 100 },
];

type UploadState = "idle" | "dragging" | "processing" | "complete" | "preview";

interface UploadedFile {
  name: string;
  size: number;
  pages: number;
}

export default function CoordinatorUpload() {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [stageIdx, setStageIdx] = useState(0);
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [previewCourseId, setPreviewCourseId] = useState(1);
  const dropRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const runProcessing = useCallback(() => {
    setUploadState("processing");
    setProgress(0);
    setStageIdx(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 0.55;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => setUploadState("complete"), 600);
      }
      setProgress(current);
      const idx = STAGES.findIndex(s => current < s.to);
      setStageIdx(idx >= 0 ? idx : STAGES.length - 1);
    }, 80);
  }, []);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0]!;
    setFile({
      name: f.name,
      size: f.size,
      pages: Math.floor(Math.random() * 18 + 8),
    });
    setTimeout(() => runProcessing(), 400);
  }, [runProcessing]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setUploadState("idle");
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setUploadState("dragging"); };
  const handleDragLeave = () => setUploadState("idle");

  const currentStage = STAGES[stageIdx] ?? STAGES[0]!;
  const progressInStage = stageIdx < STAGES.length
    ? Math.max(0, Math.min(100, ((progress - currentStage.from) / (currentStage.to - currentStage.from)) * 100))
    : 100;

  const formatBytes = (b: number) => b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`;

  return (
    <div className="space-y-6 pb-10">
      {/* Nav */}
      <div className="flex items-center gap-4">
        <Link href="/coordinator">
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft size={15} /> Back to Hub
          </button>
        </Link>
        <div className="h-4 w-px bg-border" />
        <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
          Coordinator · PDF Upload Portal
        </span>
      </div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center border shrink-0"
            style={{ background: "rgba(59,130,246,0.12)", borderColor: "rgba(59,130,246,0.3)" }}
          >
            <Upload size={18} className="text-primary" />
          </div>
          Sentinel PDF Upload
        </h1>
        <p className="text-muted-foreground text-sm">
          Upload a course PDF and the Sentinel will synthesise a cinematic lecture video automatically.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">

        {/* IDLE / DRAGGING state */}
        {(uploadState === "idle" || uploadState === "dragging") && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="grid gap-6"
          >
            {/* Drop zone */}
            <div
              ref={dropRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className="relative rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-14 cursor-pointer transition-all overflow-hidden group"
              style={{
                borderColor: uploadState === "dragging"
                  ? "rgba(59,130,246,0.8)"
                  : "rgba(59,130,246,0.3)",
                background: uploadState === "dragging"
                  ? "rgba(59,130,246,0.08)"
                  : "rgba(8,16,50,0.6)",
              }}
            >
              {/* Ambient glow on drag */}
              <AnimatePresence>
                {uploadState === "dragging" && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.15), transparent 70%)" }}
                  />
                )}
              </AnimatePresence>

              {/* Idle glow pulse */}
              <motion.div
                className="absolute inset-0 pointer-events-none rounded-2xl"
                animate={{ boxShadow: uploadState === "dragging"
                  ? ["0 0 0 0 rgba(59,130,246,0.4)", "0 0 40px 8px rgba(59,130,246,0.15)", "0 0 0 0 rgba(59,130,246,0.4)"]
                  : "none" }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={e => handleFiles(e.target.files)}
              />

              <motion.div
                animate={{ y: uploadState === "dragging" ? -8 : 0, scale: uploadState === "dragging" ? 1.08 : 1 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center gap-4"
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center border-2 transition-all"
                  style={{
                    background: uploadState === "dragging" ? "rgba(59,130,246,0.2)" : "rgba(59,130,246,0.06)",
                    borderColor: uploadState === "dragging" ? "rgba(96,165,250,0.6)" : "rgba(59,130,246,0.25)",
                  }}
                >
                  <FileText size={36} style={{ color: uploadState === "dragging" ? "#60A5FA" : "#3B82F6" }} />
                </div>

                <div className="text-center space-y-1.5">
                  <p className="text-foreground font-semibold text-lg">
                    {uploadState === "dragging" ? "Release to Upload" : "Drag & Drop your PDF"}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    or <span className="text-primary underline underline-offset-2">browse to select</span> a file
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-2">
                    PDF only · Max 50 MB · Any academic content
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Info cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: Cpu, title: "AI Chunking", desc: "Semantic paragraph-level extraction from your PDF" },
                { icon: Zap, title: "Sentinel Synthesis", desc: "AI generates slide sequence with narration script" },
                { icon: Eye, title: "Live Preview", desc: "Review the generated lecture before publishing" },
              ].map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="rounded-xl p-4 border flex flex-col gap-2"
                  style={{ background: "rgba(8,16,50,0.7)", borderColor: "rgba(59,130,246,0.15)" }}
                >
                  <c.icon size={18} className="text-primary" />
                  <div className="font-semibold text-foreground text-sm">{c.title}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{c.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* PROCESSING state */}
        {uploadState === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border overflow-hidden"
            style={{ background: "rgba(4,10,36,0.95)", borderColor: "rgba(59,130,246,0.25)" }}
          >
            {/* Header bar */}
            <div
              className="px-6 py-4 border-b flex items-center justify-between"
              style={{ borderColor: "rgba(59,130,246,0.15)" }}
            >
              <div className="flex items-center gap-2.5">
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full"
                  style={{ background: "#3B82F6" }}
                />
                <Cpu size={14} className="text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">
                  Sentinel Processing
                </span>
              </div>
              {file && (
                <div className="text-xs text-muted-foreground font-mono">
                  {file.name} · {formatBytes(file.size)} · {file.pages}p
                </div>
              )}
            </div>

            {/* Stage progress */}
            <div className="p-8 space-y-8">
              {/* Overall progress */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-muted-foreground uppercase tracking-widest">Overall</span>
                  <span className="font-mono font-bold text-foreground tabular-nums">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: "linear-gradient(90deg, #1D4ED8, #3B82F6, #60A5FA)",
                      width: `${progress}%`,
                      boxShadow: "0 0 12px rgba(96,165,250,0.5)",
                    }}
                    transition={{ duration: 0.08 }}
                  />
                </div>
              </div>

              {/* Stage steps */}
              <div className="space-y-4">
                {STAGES.map((stage, i) => {
                  const done = progress >= stage.to;
                  const active = stageIdx === i;
                  return (
                    <motion.div
                      key={i}
                      className="flex items-start gap-4"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 border"
                        style={{
                          background: done
                            ? "rgba(16,185,129,0.15)"
                            : active
                            ? "rgba(59,130,246,0.15)"
                            : "rgba(255,255,255,0.04)",
                          borderColor: done
                            ? "rgba(16,185,129,0.5)"
                            : active
                            ? "rgba(59,130,246,0.5)"
                            : "rgba(255,255,255,0.08)",
                        }}
                      >
                        {done ? (
                          <CheckCircle size={13} style={{ color: "#10B981" }} />
                        ) : active ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                            className="w-3 h-3 rounded-full border-t-2"
                            style={{ borderColor: "#60A5FA" }}
                          />
                        ) : (
                          <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
                        )}
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <div
                          className="text-sm font-semibold"
                          style={{ color: done ? "#10B981" : active ? "#F0F9FF" : "rgba(148,163,184,0.5)" }}
                        >
                          {stage.label}
                        </div>
                        {active && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="text-xs text-muted-foreground mb-1.5">{stage.detail}</div>
                            <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(59,130,246,0.1)" }}>
                              <motion.div
                                className="h-full rounded-full"
                                style={{
                                  background: "linear-gradient(90deg, #1D4ED8, #60A5FA)",
                                  width: `${progressInStage}%`,
                                }}
                                transition={{ duration: 0.08 }}
                              />
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Waveform decoration */}
              <div className="flex items-center justify-center gap-1 pt-2">
                {Array.from({ length: 28 }, (_, i) => (
                  <motion.div
                    key={i}
                    className="rounded-full"
                    style={{ width: 3, background: "rgba(59,130,246,0.4)" }}
                    animate={{
                      height: [4, [6, 10, 18, 22, 14, 24, 8, 16][i % 8]! * 0.9, 4],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{ duration: 0.5 + (i % 4) * 0.08, repeat: Infinity, delay: i * 0.04, ease: "easeInOut" }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* COMPLETE state */}
        {uploadState === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            {/* Success header */}
            <div
              className="rounded-2xl border p-6 flex items-center justify-between"
              style={{ background: "rgba(4,10,36,0.9)", borderColor: "rgba(16,185,129,0.3)" }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center border"
                  style={{ background: "rgba(16,185,129,0.12)", borderColor: "rgba(16,185,129,0.35)" }}
                >
                  <CheckCircle size={22} style={{ color: "#10B981" }} />
                </div>
                <div>
                  <div className="font-bold text-foreground">Sentinel Lecture Synthesised</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {file?.name ?? "document.pdf"} · {file?.pages ?? 12} pages processed · Preview ready
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={previewCourseId}
                  onChange={e => setPreviewCourseId(Number(e.target.value))}
                  className="text-xs rounded-lg px-2 py-1.5 border font-mono"
                  style={{
                    background: "rgba(8,16,50,0.9)",
                    borderColor: "rgba(59,130,246,0.3)",
                    color: "#93C5FD",
                  }}
                >
                  <option value={1}>ENT-101</option>
                  <option value={2}>AI-201</option>
                  <option value={3}>DIG-301</option>
                  <option value={4}>LAW-201</option>
                  <option value={5}>HSM-301</option>
                </select>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setUploadState("idle"); setFile(null); setProgress(0); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium"
                  style={{
                    borderColor: "rgba(59,130,246,0.3)",
                    color: "#60A5FA",
                    background: "rgba(59,130,246,0.08)",
                  }}
                >
                  <RotateCcw size={11} /> New Upload
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setUploadState("preview")}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold"
                  style={{
                    background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
                    color: "white",
                    boxShadow: "0 0 16px rgba(59,130,246,0.4)",
                  }}
                >
                  <Eye size={12} /> Preview Lecture
                </motion.button>
              </div>
            </div>

            {/* Inline player */}
            <AnimatePresence>
              {uploadState === "preview" && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <SentinelPlayer
                    courseTitle="Synthesised Lecture"
                    courseId={previewCourseId}
                    onEnded={() => {}}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Semantic Chunks", value: `${Math.floor((file?.pages ?? 12) * 3.2)}` },
                { label: "Key Concepts", value: `${Math.floor((file?.pages ?? 12) * 1.8)}` },
                { label: "Slides Generated", value: "5" },
                { label: "Processing Time", value: "14.2s" },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-xl border p-4"
                  style={{ background: "rgba(8,16,50,0.7)", borderColor: "rgba(59,130,246,0.15)" }}
                >
                  <div className="text-xl font-black text-foreground">{s.value}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* PREVIEW state — full player */}
        {uploadState === "preview" && (
          <motion.div
            key="preview-full"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-foreground">Sentinel Lecture Preview</div>
              <button
                onClick={() => setUploadState("complete")}
                className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft size={12} /> Back to results
              </button>
            </div>
            <SentinelPlayer
              courseTitle={file?.name.replace(".pdf", "") ?? "Synthesised Lecture"}
              courseId={previewCourseId}
              onEnded={() => {}}
            />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
