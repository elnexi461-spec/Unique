import { useGetDashboardOverview, useGetDashboardRecentActivity, useGetDashboardEngagement, useGetDashboardCourseDistribution, useGetDashboardGeographic } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Users, BookOpen, GraduationCap, AlertTriangle, Activity, Zap, RefreshCw,
  Upload, Megaphone, Loader2, CheckCircle, Radio, Shield, TrendingUp,
  TrendingDown, Award, MapPin, Brain, Star, Database, UserPlus, Copy, X,
  Search, Trophy, Lock, FileText, Clock, Filter,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { FRIDAY_BRIEF_WEEK18, MOCK_STUDENTS, getAuditLog } from "@/data/mockDatabase";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

/* Brand palette */
const BRAND = {
  primary:  "#3B82F6",
  electric: "#60A5FA",
  brand:    "#1D4ED8",
  gold:     "#F59E0B",
  gold2:    "#FBBF24",
  purple:   "#A78BFA",
  green:    "#34D399",
  red:      "#F87171",
  muted:    "#6B7280",
};

const CHART_COLORS = [BRAND.primary, BRAND.electric, BRAND.purple, BRAND.green, BRAND.gold];

const TOOLTIP_STYLE = {
  backgroundColor: "rgba(8,18,50,0.97)",
  borderColor:     "rgba(59,130,246,0.3)",
  color:           "#F0F9FF",
  fontSize:        12,
  borderRadius:    8,
  border:          "1px solid rgba(59,130,246,0.3)",
};

const CAMPUS_COLOR: Record<string, string> = {
  Zaria: "#A78BFA",
  Lagos: "#34D399",
  Kano:  "#F59E0B",
};
const CAMPUS_BG: Record<string, string> = {
  Zaria: "rgba(167,139,250,0.12)",
  Lagos: "rgba(52,211,153,0.12)",
  Kano:  "rgba(245,158,11,0.12)",
};

interface LiveEvent {
  type: string;
  message?: string;
  studentName?: string;
  courseId?: number;
  keyType?: string;
  claimedAt?: string;
  prunedKeys?: number;
  timestamp: string;
}

function getPunctuality(gpa: number, idx: number): number {
  return Math.min(100, Math.round(62 + gpa * 8.5 + (idx % 6)));
}
function vanguardScore(gc: number, gpa: number, pct: number): number {
  return gc * 100 + gpa * 50 + pct * 2;
}

/* ── Friday Brief ─────────────────────────────────────────────────────────── */
function FridayBriefSection() {
  const b = FRIDAY_BRIEF_WEEK18;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border overflow-hidden"
      style={{ background: "rgba(4,11,36,0.85)", borderColor: "rgba(245,158,11,0.35)" }}
    >
      <div className="px-6 py-4 border-b flex items-center justify-between"
        style={{ borderColor: "rgba(245,158,11,0.2)", background: "rgba(245,158,11,0.04)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border"
            style={{ background: "rgba(245,158,11,0.12)", borderColor: "rgba(245,158,11,0.3)" }}>
            <Zap size={18} style={{ color: BRAND.gold }} />
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-[0.3em] uppercase mb-0.5"
              style={{ color: "rgba(251,191,36,0.7)" }}>
              Sentinel Intelligence Brief · Week {b.week}
            </div>
            <h2 className="text-lg font-black text-white">Friday Brief</h2>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-mono text-muted-foreground">{b.period}</div>
          <div className="text-xs" style={{ color: BRAND.gold }}>{b.generatedAt}</div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="p-4 rounded-xl border text-sm leading-relaxed italic text-white"
          style={{ background: "rgba(245,158,11,0.06)", borderColor: "rgba(245,158,11,0.2)" }}>
          ❝ {b.headline} ❞
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {b.kpis.map((kpi, i) => (
            <motion.div key={kpi.label}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              className="rounded-xl p-4 border"
              style={{ background: "rgba(8,18,50,0.6)", borderColor: "rgba(59,130,246,0.2)" }}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-muted-foreground font-medium">{kpi.label}</div>
                <div className="text-xs font-bold flex items-center gap-1"
                  style={{ color: kpi.up ? BRAND.green : BRAND.red }}>
                  {kpi.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {kpi.delta}
                </div>
              </div>
              <div className="text-2xl font-black text-white">{kpi.value}</div>
              <div className="text-[10px] text-muted-foreground mt-1">prev: {kpi.prev}</div>
            </motion.div>
          ))}
        </div>

        {/* Campus breakdown */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Campus Performance
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {b.campusBreakdown.map((c) => (
              <div key={c.campus} className="rounded-xl p-4 border relative overflow-hidden"
                style={{
                  background:   c.highlight ? "rgba(59,130,246,0.08)" : "rgba(8,18,50,0.5)",
                  borderColor:  c.highlight ? "rgba(59,130,246,0.35)" : "rgba(59,130,246,0.15)",
                }}>
                {c.highlight && (
                  <div className="absolute top-2 right-2">
                    <Star size={12} style={{ color: BRAND.gold }} />
                  </div>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={14} className="text-primary" />
                  <span className="font-bold text-white text-sm">{c.campus}</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Punctuality</span>
                    <span className="font-bold" style={{ color: BRAND.electric }}>{c.punctuality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Week change</span>
                    <span className="font-bold" style={{ color: c.highlight ? BRAND.gold : BRAND.green }}>{c.change}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Students</span>
                    <span className="font-medium text-white">{c.students}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gold Cards</span>
                    <span className="font-medium" style={{ color: BRAND.gold }}>{c.goldCards}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sentinel Insights */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <Brain size={13} className="text-primary" /> Sentinel AI Insights
          </div>
          <div className="space-y-2">
            {b.sentinelInsights.map((ins, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="flex items-start gap-3 rounded-xl p-3 border text-sm"
                style={{
                  background:
                    ins.type === "risk"    ? "rgba(248,113,113,0.06)" :
                    ins.type === "success" ? "rgba(52,211,153,0.06)" :
                    "rgba(59,130,246,0.05)",
                  borderColor:
                    ins.type === "risk"    ? "rgba(248,113,113,0.25)" :
                    ins.type === "success" ? "rgba(52,211,153,0.25)" :
                    "rgba(59,130,246,0.2)",
                }}>
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                  style={{
                    background:
                      ins.type === "risk"    ? BRAND.red :
                      ins.type === "success" ? BRAND.green : BRAND.primary,
                    boxShadow: `0 0 6px ${ins.type === "risk" ? BRAND.red : ins.type === "success" ? BRAND.green : BRAND.primary}`,
                  }} />
                <span className="text-muted-foreground leading-relaxed">{ins.message}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Top Scholars */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <Award size={13} style={{ color: BRAND.gold }} /> Top Scholars — Week {b.week}
          </div>
          <div className="space-y-1.5">
            {b.topStudents.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg border"
                style={{ background: i === 0 ? "rgba(245,158,11,0.08)" : "rgba(8,18,50,0.5)", borderColor: i === 0 ? "rgba(245,158,11,0.25)" : "rgba(59,130,246,0.12)" }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                  style={{ background: i === 0 ? "rgba(245,158,11,0.2)" : "rgba(59,130,246,0.12)", color: i === 0 ? BRAND.gold : BRAND.electric }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white">{s.name}</div>
                  <div className="text-[10px] font-mono text-muted-foreground">{s.id} · {s.campus}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black" style={{ color: i === 0 ? BRAND.gold : BRAND.electric }}>{s.merit}</div>
                  <div className="text-[10px] text-muted-foreground">{s.goldCards} cards</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Founder message */}
        <div className="p-5 rounded-xl border relative overflow-hidden"
          style={{ background: "rgba(245,158,11,0.05)", borderColor: "rgba(245,158,11,0.25)" }}>
          <div className="text-[10px] font-bold tracking-[0.25em] uppercase mb-2" style={{ color: "rgba(251,191,36,0.6)" }}>
            Founder's Note
          </div>
          <p className="text-sm text-foreground leading-relaxed italic">{b.founderMessage}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Seed Button ───────────────────────────────────────────────────────────── */
function SeedButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<Record<string, number> | null>(null);
  const { toast } = useToast();

  const runSeed = async () => {
    setStatus("loading");
    try {
      const r    = await fetch(`${BASE}/api/seed`, { method: "POST" });
      const data = await r.json();
      if (r.ok && data.success) {
        setStatus("done");
        setResult(data.seeded);
        toast({ title: "Seed complete", description: `${data.seeded.students} students · ${data.seeded.goldCards} Gold Cards` });
      } else {
        setStatus("error");
        toast({ title: "Seed failed", description: data.error || "Unknown error", variant: "destructive" });
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Populate the database with 50 Nigerian scholars, 5 core courses, demo users, and 200+ Gold Cards.
        Safe to run multiple times — idempotent.
      </p>
      <Button onClick={runSeed} disabled={status === "loading"}
        className="w-full font-semibold"
        style={{ background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", color: "white", border: "none" }}>
        {status === "loading" ? <Loader2 size={14} className="animate-spin mr-2" /> : <Database size={14} className="mr-2" />}
        {status === "loading" ? "Seeding..." : status === "done" ? "Seed Again" : "Run Supernatural Seed"}
      </Button>
      {result && (
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(result).map(([k, v]) => (
            <div key={k} className="text-center p-2 rounded-lg border"
              style={{ background: "rgba(59,130,246,0.05)", borderColor: "rgba(59,130,246,0.2)" }}>
              <div className="text-lg font-black" style={{ color: BRAND.electric }}>{v}</div>
              <div className="text-[10px] text-muted-foreground capitalize">{k}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Provision Modal ───────────────────────────────────────────────────────── */
interface ProvisionResult {
  user:         { name: string; email: string; role: string; campus: string };
  tempPassword: string;
  accessKey:    string;
}

function ProvisionModal({ result, onClose }: { result: ProvisionResult; onClose: () => void }) {
  const { toast } = useToast();

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() =>
      toast({ title: `${label} copied`, description: "Ready to paste." })
    );
  };

  const inviteText =
    `Welcome to UOU Infinite!\n\nName: ${result.user.name}\nEmail: ${result.user.email}\nRole: ${result.user.role}\nCampus: ${result.user.campus}\n\nTemporary Password: ${result.tempPassword}\nSystem Access Key: ${result.accessKey}\n\nLogin at: https://uou.edu.ng/login\nPlease change your password after first login.`;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="w-full max-w-md rounded-2xl border overflow-hidden"
        style={{ background: "rgba(4,11,36,0.98)", borderColor: "rgba(52,211,153,0.4)" }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: "rgba(52,211,153,0.2)", background: "rgba(52,211,153,0.06)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)" }}>
              <CheckCircle size={16} style={{ color: BRAND.green }} />
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-wider uppercase mb-0.5" style={{ color: "rgba(52,211,153,0.7)" }}>
                Access Provisioned
              </div>
              <div className="font-black text-white text-base">Welcome to UOU Infinite</div>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* User summary */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              ["Name",   result.user.name],
              ["Email",  result.user.email],
              ["Role",   result.user.role],
              ["Campus", result.user.campus],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg p-2.5 border"
                style={{ background: "rgba(8,18,50,0.6)", borderColor: "rgba(59,130,246,0.15)" }}>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
                <div className="font-semibold text-white capitalize">{value}</div>
              </div>
            ))}
          </div>

          {/* Credentials */}
          {[
            { label: "Temporary Password", value: result.tempPassword, icon: Lock },
            { label: "System Access Key",  value: result.accessKey,    icon: Shield },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl border p-3"
              style={{ background: "rgba(59,130,246,0.05)", borderColor: "rgba(59,130,246,0.2)" }}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Icon size={12} className="text-primary" />
                  {label}
                </div>
                <button
                  onClick={() => copy(value, label)}
                  className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg transition-all hover:bg-primary/20"
                  style={{ color: BRAND.electric, border: "1px solid rgba(59,130,246,0.25)" }}
                >
                  <Copy size={11} /> Copy
                </button>
              </div>
              <div className="font-mono text-sm font-bold text-white">{value}</div>
            </div>
          ))}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={() => copy(inviteText, "Invite details")}
              className="flex-1 text-xs font-semibold"
              style={{ background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", color: "white", border: "none" }}
            >
              <Copy size={13} className="mr-1.5" /> Copy Invite Details
            </Button>
            <Button onClick={onClose} variant="outline" className="px-4 text-xs border-border">
              Done
            </Button>
          </div>

          <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
            Share these credentials securely with the new user. They must change their password on first login.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Audit Log Section ──────────────────────────────────────────────────────── */
function AuditLogSection() {
  const [filterResult, setFilterResult] = useState<"all" | "pass" | "fail">("all");
  const entries = getAuditLog();
  const filtered = filterResult === "all" ? entries : entries.filter(e => e.result === filterResult);

  const passCount = entries.filter(e => e.result === "pass").length;
  const failCount = entries.filter(e => e.result === "fail").length;
  const avgScore = entries.length > 0
    ? Math.round(entries.reduce((s, e) => s + e.score, 0) / entries.length)
    : 0;

  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Submissions", value: entries.length, color: "#60A5FA" },
          { label: "Passed", value: passCount, color: "#10B981" },
          { label: "Failed", value: failCount, color: "#EF4444" },
          { label: "Avg Score", value: entries.length ? `${avgScore}%` : "—", color: "#F59E0B" },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-xl border p-4"
            style={{ background: "rgba(8,16,50,0.8)", borderColor: "rgba(59,130,246,0.15)" }}
          >
            <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filter bar */}
      <div
        className="rounded-xl border p-4 flex items-center gap-3"
        style={{ background: "rgba(8,16,50,0.7)", borderColor: "rgba(59,130,246,0.15)" }}
      >
        <Filter size={13} className="text-muted-foreground shrink-0" />
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Filter:</span>
        {(["all", "pass", "fail"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilterResult(f)}
            className="px-3 py-1 rounded-lg text-xs font-semibold transition-all border capitalize"
            style={{
              background: filterResult === f ? "rgba(59,130,246,0.18)" : "transparent",
              borderColor: filterResult === f ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.08)",
              color: filterResult === f ? "#93C5FD" : "rgba(148,163,184,0.7)",
            }}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground font-mono">{filtered.length} entries</span>
      </div>

      {/* Log table */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: "rgba(4,10,36,0.9)", borderColor: "rgba(59,130,246,0.18)" }}
      >
        <div
          className="grid text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground px-4 py-2.5 border-b"
          style={{ borderColor: "rgba(59,130,246,0.12)", gridTemplateColumns: "1fr 1.4fr 1.2fr 0.6fr 0.7fr 0.7fr 0.7fr" }}
        >
          <span>Timestamp</span>
          <span>Student</span>
          <span>Course</span>
          <span>Attempt</span>
          <span>Score</span>
          <span>Time</span>
          <span>Result</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <FileText size={32} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground text-sm">No audit entries yet.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Entries appear when students submit the Knowledge Gateway assessment.
            </p>
          </div>
        ) : (
          <div className="max-h-[520px] overflow-y-auto divide-y" style={{ divideColor: "rgba(59,130,246,0.08)" }}>
            {filtered.map((entry, i) => {
              const ts = new Date(entry.timestamp);
              const timeStr = ts.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
              const dateStr = ts.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
              const mins = Math.floor(entry.timeTaken / 60);
              const secs = entry.timeTaken % 60;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.025 }}
                  className="grid items-center px-4 py-3 text-xs hover:bg-white/[0.02] transition-colors"
                  style={{ gridTemplateColumns: "1fr 1.4fr 1.2fr 0.6fr 0.7fr 0.7fr 0.7fr" }}
                >
                  <span className="text-muted-foreground font-mono">
                    <span className="block">{dateStr}</span>
                    <span className="opacity-60">{timeStr}</span>
                  </span>
                  <span>
                    <span className="font-semibold text-foreground block truncate">{entry.studentName}</span>
                    <span className="text-muted-foreground/60 font-mono text-[9px]">{entry.studentId}</span>
                  </span>
                  <span className="text-muted-foreground truncate">{entry.courseTitle}</span>
                  <span className="text-muted-foreground font-mono">{entry.attempt}/3</span>
                  <span
                    className="font-bold font-mono"
                    style={{ color: entry.score >= 70 ? "#10B981" : "#EF4444" }}
                  >
                    {entry.score}%
                  </span>
                  <span className="text-muted-foreground font-mono flex items-center gap-1">
                    <Clock size={9} />
                    {mins > 0 ? `${mins}m ` : ""}{secs}s
                  </span>
                  <span>
                    <span
                      className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide"
                      style={{
                        background: entry.result === "pass" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.12)",
                        color: entry.result === "pass" ? "#10B981" : "#EF4444",
                        border: `1px solid ${entry.result === "pass" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.25)"}`,
                      }}
                    >
                      {entry.result}
                    </span>
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────────────────── */
export default function FounderPage() {
  const { data: overview }          = useGetDashboardOverview();
  const { data: recentActivity }    = useGetDashboardRecentActivity();
  const { data: engagement }        = useGetDashboardEngagement();
  const { data: courseDistribution }= useGetDashboardCourseDistribution();
  const { data: geographic }        = useGetDashboardGeographic();
  const { token }                   = useAuth();
  const { toast }                   = useToast();

  const [activeTab, setActiveTab] = useState<"brief" | "analytics" | "scout" | "registry" | "controls" | "audit">("brief");

  /* Controls state */
  const [redSwitchActive, setRedSwitchActive] = useState(false);
  const [refreshing,      setRefreshing]      = useState(false);
  const [refreshResult,   setRefreshResult]   = useState<{ prunedKeys: number; timestamp: string } | null>(null);
  const [liveEvents,      setLiveEvents]      = useState<LiveEvent[]>([]);
  const feedRef = useRef<HTMLDivElement>(null);
  const [announcement, setAnnouncement] = useState({ title: "", body: "", priority: "normal" });
  const [posting,      setPosting]      = useState(false);
  const [importMode,   setImportMode]   = useState<"csv" | "json" | "url">("csv");
  const [importJson,   setImportJson]   = useState("");
  const [importUrl,    setImportUrl]    = useState("");
  const [importing,    setImporting]    = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; errors: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  /* Scout state */
  const [scoutCampus, setScoutCampus] = useState<"All" | "Zaria" | "Lagos" | "Kano">("All");

  /* Registry state */
  const [provision, setProvision] = useState({ name: "", email: "", role: "student", campus: "Zaria" });
  const [provisioning,    setProvisioning]   = useState(false);
  const [provisionResult, setProvisionResult]= useState<ProvisionResult | null>(null);
  const [showModal,       setShowModal]      = useState(false);

  useEffect(() => {
    if (!token) return;
    const es = new EventSource(`${BASE}/api/system/live-feed`);
    es.onmessage = (e) => {
      try {
        const payload: LiveEvent = JSON.parse(e.data);
        setLiveEvents(prev => [payload, ...prev].slice(0, 50));
        if (feedRef.current) feedRef.current.scrollTop = 0;
      } catch {}
    };
    return () => es.close();
  }, [token]);

  const handleRedSwitch = async () => {
    setRefreshing(true);
    setRedSwitchActive(true);
    try {
      const r = await fetch(`${BASE}/api/system/red-switch`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await r.json();
      if (r.ok) {
        setRefreshResult({ prunedKeys: data.prunedKeys, timestamp: data.timestamp });
        toast({ title: "Hard System Refresh Complete", description: `${data.prunedKeys} expired keys pruned.` });
      } else {
        toast({ title: "Refresh failed", description: data.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Network error", variant: "destructive" });
    }
    setRefreshing(false);
    setTimeout(() => setRedSwitchActive(false), 2000);
  };

  const handleAnnouncement = async () => {
    setPosting(true);
    try {
      const r = await fetch(`${BASE}/api/announcements`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(announcement),
      });
      if (r.ok) {
        toast({ title: "Announcement broadcast!", description: "All active dashboards will receive this in real time." });
        setAnnouncement({ title: "", body: "", priority: "normal" });
      }
    } catch {}
    setPosting(false);
  };

  const handleImport = async () => {
    setImporting(true);
    try {
      const fd = new FormData();
      if (importMode === "csv") {
        if (fileRef.current?.files?.[0]) fd.append("file", fileRef.current.files[0]);
      } else if (importMode === "json") {
        fd.append("json", importJson);
      } else {
        fd.append("url", importUrl);
      }
      const r = await fetch(`${BASE}/api/import/students`, {
        method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd,
      });
      const data = await r.json();
      setImportResult({ imported: data.imported, errors: data.errors });
      toast({ title: `Imported ${data.imported} students`, description: `${data.errors} rows skipped.` });
    } catch {
      toast({ title: "Import failed", variant: "destructive" });
    }
    setImporting(false);
  };

  const handleProvision = async () => {
    if (!provision.name || !provision.email) {
      toast({ title: "All fields required", variant: "destructive" });
      return;
    }
    setProvisioning(true);
    try {
      const r = await fetch(`${BASE}/api/provision/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(provision),
      });
      const data = await r.json();
      if (r.ok && data.success) {
        setProvisionResult(data as ProvisionResult);
        setShowModal(true);
        setProvision({ name: "", email: "", role: "student", campus: "Zaria" });
        toast({ title: "User provisioned", description: `${data.user.name} — ${data.user.role}` });
      } else {
        toast({ title: "Provisioning failed", description: data.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Network error", variant: "destructive" });
    }
    setProvisioning(false);
  };

  /* Scout data */
  const scoutData = MOCK_STUDENTS
    .map((s, i) => {
      const pct = getPunctuality(s.gpa, i);
      return { ...s, punctuality: pct, score: vanguardScore(s.goldCards, s.gpa, pct) };
    })
    .filter(s => scoutCampus === "All" || s.campus === scoutCampus)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const kpis = overview ? [
    { title: "Total Scholars", value: overview.totalStudents,      icon: Users,          color: BRAND.primary },
    { title: "Lecturers",      value: overview.totalLecturers,     icon: GraduationCap,  color: BRAND.purple },
    { title: "Active Courses", value: overview.totalCourses,       icon: BookOpen,       color: BRAND.electric },
    { title: "At-Risk",        value: overview.retentionRiskCount, icon: AlertTriangle,  color: BRAND.red },
  ] : [];

  const TABS = [
    { id: "brief",    label: "Friday Brief", icon: Zap },
    { id: "analytics",label: "Analytics",   icon: Activity },
    { id: "scout",    label: "Talent Scout", icon: Search },
    { id: "registry", label: "Registry",    icon: UserPlus },
    { id: "controls", label: "Controls",    icon: Shield },
    { id: "audit",    label: "Audit Log",   icon: FileText },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Founder's War Room</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Institutional intelligence · Week {FRIDAY_BRIEF_WEEK18.week}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-primary rounded-full border px-3 py-1.5"
          style={{ background: "rgba(59,130,246,0.08)", borderColor: "rgba(59,130,246,0.25)" }}>
          <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full" style={{ background: BRAND.primary }} />
          Live Telemetry
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.title}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}>
            <Card className="bg-card border-border hover:border-primary/40 transition-colors relative overflow-hidden">
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
                style={{ background: `radial-gradient(circle at 100% 0%, ${kpi.color}10, transparent 60%)` }} />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                <kpi.icon className="h-4 w-4" style={{ color: kpi.color }} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-foreground">{kpi.value.toLocaleString()}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tab nav */}
      <div className="flex items-center gap-1 p-1 rounded-xl border flex-wrap"
        style={{ background: "rgba(8,18,50,0.7)", borderColor: "rgba(59,130,246,0.2)", width: "fit-content" }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background:  activeTab === tab.id ? "rgba(59,130,246,0.2)" : "transparent",
              color:       activeTab === tab.id ? BRAND.electric : "rgba(148,163,184,0.7)",
              border:      activeTab === tab.id ? "1px solid rgba(59,130,246,0.3)" : "1px solid transparent",
            }}>
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── FRIDAY BRIEF ── */}
        {activeTab === "brief" && (
          <motion.div key="brief"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}>
            <FridayBriefSection />
          </motion.div>
        )}

        {/* ── ANALYTICS ── */}
        {activeTab === "analytics" && (
          <motion.div key="analytics"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}
            className="space-y-4">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Radio size={14} style={{ color: BRAND.red }} className="animate-pulse" /> Live Feed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div ref={feedRef} className="h-44 overflow-y-auto space-y-1.5 pr-1">
                    {liveEvents.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                        <Radio size={14} className="mr-2 animate-pulse" /> Listening...
                      </div>
                    ) : liveEvents.map((ev, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-2 p-2 rounded-lg border text-xs"
                        style={{ background: "rgba(8,18,50,0.6)", borderColor: "rgba(59,130,246,0.15)" }}>
                        <div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0"
                          style={{ background: ev.type === "key_claimed" ? BRAND.primary : ev.type === "system_refresh" ? BRAND.red : BRAND.gold }} />
                        <span className="flex-1 text-foreground">
                          {ev.type === "key_claimed" ? `${ev.studentName} claimed ${ev.keyType} key` : ev.message || ev.type}
                        </span>
                        <span className="font-mono text-muted-foreground shrink-0">
                          {ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString() : ""}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="lg:col-span-2">
                <Card className="bg-card border-border">
                  <CardHeader><CardTitle className="text-base">Engagement Timeseries</CardTitle></CardHeader>
                  <CardContent className="h-[192px]">
                    {engagement && (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={engagement}>
                          <XAxis dataKey="date" stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                          <RechartsTooltip contentStyle={TOOLTIP_STYLE} />
                          <Line type="monotone" dataKey="activeUsers"    stroke={BRAND.primary} strokeWidth={2}   dot={false} name="Active Users" />
                          <Line type="monotone" dataKey="newEnrollments" stroke={BRAND.gold}    strokeWidth={1.5} dot={false} name="Enrollments" />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-card border-border">
                <CardHeader><CardTitle className="text-base">Course Distribution</CardTitle></CardHeader>
                <CardContent className="h-[220px]">
                  {courseDistribution && (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={courseDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="enrollmentCount">
                          {courseDistribution.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                        </Pie>
                        <RechartsTooltip contentStyle={TOOLTIP_STYLE} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader><CardTitle className="text-base">Geographic Spread</CardTitle></CardHeader>
                <CardContent className="h-[220px]">
                  {geographic && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={geographic.slice(0, 7)}>
                        <XAxis dataKey="state" stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                        <RechartsTooltip contentStyle={TOOLTIP_STYLE} />
                        <Bar dataKey="studentCount" fill={BRAND.primary} radius={[4, 4, 0, 0]} name="Students" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="text-base">System Telemetry Log</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentActivity?.slice(0, 6).map((activity) => (
                    <div key={activity.id}
                      className="flex items-center gap-4 p-3 rounded-lg border hover:border-primary/30 transition-colors"
                      style={{ background: "rgba(8,18,50,0.5)", borderColor: "rgba(59,130,246,0.12)" }}>
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: BRAND.primary }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.actorName} · {activity.type}</p>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground shrink-0">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── TALENT SCOUT ── */}
        {activeTab === "scout" && (
          <motion.div key="scout"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}
            className="space-y-4">

            {/* Header */}
            <div className="rounded-2xl border p-5"
              style={{ background: "rgba(4,11,36,0.88)", borderColor: "rgba(59,130,246,0.2)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.3)" }}>
                  <Search size={18} className="text-primary" />
                </div>
                <div>
                  <div className="text-[10px] font-bold tracking-[0.25em] uppercase mb-0.5"
                    style={{ color: "rgba(96,165,250,0.7)" }}>Founder Exclusive</div>
                  <h2 className="font-black text-white text-lg">Talent Scout View</h2>
                </div>
                <div className="ml-auto text-xs text-muted-foreground">
                  Top 5 scholars by Vanguard Score
                </div>
              </div>

              {/* Campus filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground font-medium mr-1">Filter by campus:</span>
                {(["All", "Zaria", "Lagos", "Kano"] as const).map(camp => {
                  const color = camp === "All" ? BRAND.electric : (CAMPUS_COLOR[camp] ?? BRAND.electric);
                  return (
                    <button
                      key={camp}
                      onClick={() => setScoutCampus(camp)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                      style={{
                        background:  scoutCampus === camp ? (CAMPUS_BG[camp] ?? "rgba(59,130,246,0.15)") : "transparent",
                        borderColor: scoutCampus === camp ? color : "rgba(59,130,246,0.2)",
                        border:      "1px solid",
                        color:       scoutCampus === camp ? color : "rgba(148,163,184,0.6)",
                        boxShadow:   scoutCampus === camp ? `0 0 12px ${color}30` : "none",
                      }}
                    >
                      {camp !== "All" && <MapPin size={10} />}
                      {camp}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Top 5 list */}
            <div className="space-y-2">
              <AnimatePresence>
                {scoutData.map((s, i) => {
                  const isFirst   = i === 0;
                  const campColor = CAMPUS_COLOR[s.campus] ?? BRAND.electric;
                  const campBg    = CAMPUS_BG[s.campus]    ?? "rgba(59,130,246,0.08)";

                  return (
                    <motion.div
                      key={s.id}
                      layout
                      layoutId={`scout-${s.id}`}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ layout: { type: "spring", stiffness: 380, damping: 32 }, delay: i * 0.06 }}
                      className="relative flex items-center gap-4 p-4 rounded-2xl border overflow-hidden"
                      style={{
                        background:  isFirst ? "rgba(245,158,11,0.07)" : "rgba(8,18,50,0.6)",
                        borderColor: isFirst ? "rgba(245,158,11,0.45)" : "rgba(59,130,246,0.15)",
                        boxShadow:   isFirst ? "0 0 32px rgba(245,158,11,0.12), 0 4px 20px rgba(0,0,0,0.4)" : "0 2px 12px rgba(0,0,0,0.3)",
                      }}
                    >
                      {isFirst && (
                        <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
                          animate={{ opacity: [0.2, 0.5, 0.2] }}
                          transition={{ duration: 2.8, repeat: Infinity }}
                          style={{ border: "1.5px solid rgba(245,158,11,0.5)" }} />
                      )}

                      {/* Rank */}
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shrink-0"
                        style={{
                          background:  isFirst ? "rgba(245,158,11,0.2)" : "rgba(59,130,246,0.1)",
                          border:      `1.5px solid ${isFirst ? "rgba(245,158,11,0.4)" : "rgba(59,130,246,0.2)"}`,
                          color:       isFirst ? BRAND.gold : BRAND.electric,
                          boxShadow:   isFirst ? "0 0 16px rgba(245,158,11,0.25)" : "none",
                        }}>
                        {isFirst ? <Trophy size={20} /> : i + 1}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base font-black text-white">{s.name}</span>
                          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: campBg, color: campColor, border: `1px solid ${campColor}50` }}>
                            <MapPin size={9} /> {s.campus}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5 font-mono">{s.id} · {s.dept}</div>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: "rgba(245,158,11,0.1)", color: BRAND.gold, border: "1px solid rgba(245,158,11,0.25)" }}>
                            {s.goldCards} Gold Cards
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: "rgba(59,130,246,0.08)", color: BRAND.electric, border: "1px solid rgba(59,130,246,0.2)" }}>
                            GPA {s.gpa.toFixed(2)}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: "rgba(52,211,153,0.08)", color: BRAND.green, border: "1px solid rgba(52,211,153,0.2)" }}>
                            {s.punctuality}% Punctuality
                          </span>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-right shrink-0">
                        <div className="text-2xl font-black"
                          style={{ color: isFirst ? BRAND.gold : BRAND.electric }}>
                          {Math.round(s.score).toLocaleString()}
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">Vanguard Score</div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {scoutData.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Search size={32} className="mx-auto mb-3 opacity-30" />
                  <p>No scholars found for this campus.</p>
                </div>
              )}
            </div>

            {/* Formula */}
            <div className="text-[11px] font-mono text-muted-foreground text-center py-2">
              Vanguard Score = (Gold Cards × 100) + (GPA × 50) + (Punctuality % × 2)
            </div>
          </motion.div>
        )}

        {/* ── REGISTRY & PROVISIONING ── */}
        {activeTab === "registry" && (
          <motion.div key="registry"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}
            className="space-y-4">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Provision Form */}
              <div className="rounded-2xl border overflow-hidden"
                style={{ background: "rgba(4,11,36,0.88)", borderColor: "rgba(59,130,246,0.25)" }}>
                <div className="px-6 py-4 border-b flex items-center gap-3"
                  style={{ borderColor: "rgba(59,130,246,0.15)", background: "rgba(8,18,50,0.5)" }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.3)" }}>
                    <UserPlus size={16} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.25em] uppercase mb-0.5"
                      style={{ color: "rgba(96,165,250,0.7)" }}>Secure Provisioning</div>
                    <h3 className="font-black text-white text-base">Create New User</h3>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                    <Input
                      placeholder="e.g. Adaeze Okonkwo"
                      value={provision.name}
                      onChange={e => setProvision(p => ({ ...p, name: e.target.value }))}
                      style={{ background: "rgba(8,18,50,0.6)", borderColor: "rgba(59,130,246,0.2)", color: "white" }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                    <Input
                      type="email"
                      placeholder="e.g. adaeze@uou.edu.ng"
                      value={provision.email}
                      onChange={e => setProvision(p => ({ ...p, email: e.target.value }))}
                      style={{ background: "rgba(8,18,50,0.6)", borderColor: "rgba(59,130,246,0.2)", color: "white" }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Role */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</Label>
                      <div className="grid grid-cols-1 gap-1.5">
                        {["student", "coordinator", "lecturer", "founder"].map(role => (
                          <button
                            key={role}
                            onClick={() => setProvision(p => ({ ...p, role }))}
                            className="text-left px-3 py-2 rounded-lg border text-sm font-medium capitalize transition-all"
                            style={{
                              background:  provision.role === role ? "rgba(59,130,246,0.18)" : "rgba(8,18,50,0.5)",
                              borderColor: provision.role === role ? "rgba(59,130,246,0.5)" : "rgba(59,130,246,0.12)",
                              color:       provision.role === role ? BRAND.electric : "rgba(148,163,184,0.7)",
                              boxShadow:   provision.role === role ? "0 0 10px rgba(59,130,246,0.15)" : "none",
                            }}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Campus */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Campus</Label>
                      <div className="grid grid-cols-1 gap-1.5">
                        {["Zaria", "Lagos", "Kano"].map(campus => {
                          const col = CAMPUS_COLOR[campus] ?? BRAND.electric;
                          const bg  = CAMPUS_BG[campus]    ?? "rgba(59,130,246,0.08)";
                          return (
                            <button
                              key={campus}
                              onClick={() => setProvision(p => ({ ...p, campus }))}
                              className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all"
                              style={{
                                background:  provision.campus === campus ? bg : "rgba(8,18,50,0.5)",
                                borderColor: provision.campus === campus ? `${col}60` : "rgba(59,130,246,0.12)",
                                color:       provision.campus === campus ? col : "rgba(148,163,184,0.7)",
                              }}
                            >
                              <MapPin size={12} /> {campus}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleProvision}
                    disabled={provisioning || !provision.name || !provision.email}
                    className="w-full h-11 font-bold"
                    style={{
                      background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
                      color: "white",
                      border: "none",
                      opacity: provisioning || !provision.name || !provision.email ? 0.6 : 1,
                    }}
                  >
                    {provisioning
                      ? <><Loader2 size={14} className="animate-spin mr-2" /> Provisioning...</>
                      : <><UserPlus size={14} className="mr-2" /> Provision Access</>
                    }
                  </Button>
                </div>
              </div>

              {/* Info panel */}
              <div className="space-y-3">
                <div className="rounded-2xl border p-5"
                  style={{ background: "rgba(4,11,36,0.88)", borderColor: "rgba(59,130,246,0.15)" }}>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <Shield size={13} className="text-primary" /> Security Policy
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { icon: Lock,   text: "Passwords are hashed with SHA-256 + institutional salt before storage." },
                      { icon: Copy,   text: "A temporary password is generated; user must change it on first login." },
                      { icon: Shield, text: "System Access Key is a unique 32-char hex token for session binding." },
                      { icon: Users,  text: "All provisioned accounts are logged to the institutional audit trail." },
                    ].map(({ icon: Icon, text }, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                        <Icon size={12} className="text-primary shrink-0 mt-0.5" />
                        {text}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border p-5"
                  style={{ background: "rgba(4,11,36,0.88)", borderColor: "rgba(59,130,246,0.15)" }}>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <Activity size={13} className="text-primary" /> Role Permissions
                  </div>
                  <div className="space-y-2">
                    {[
                      { role: "Student",     desc: "Course access, Gold Cards, credential passport", color: BRAND.electric },
                      { role: "Lecturer",    desc: "Grade entry, course management, portal oversight", color: BRAND.purple },
                      { role: "Coordinator", desc: "Student oversight, admissions, timetable control", color: BRAND.green },
                      { role: "Founder",     desc: "Full War Room access, all controls, data bridge", color: BRAND.gold },
                    ].map(({ role, desc, color }) => (
                      <div key={role} className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: color, boxShadow: `0 0 5px ${color}` }} />
                        <div>
                          <span className="text-xs font-bold" style={{ color }}>{role}</span>
                          <span className="text-xs text-muted-foreground ml-1.5">{desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── CONTROLS ── */}
        {activeTab === "controls" && (
          <motion.div key="controls"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}
            className="space-y-4">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Supernatural Seed */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Database size={15} className="text-primary" /> Supernatural Seed
                  </CardTitle>
                </CardHeader>
                <CardContent><SeedButton /></CardContent>
              </Card>

              {/* Red Switch — founder only */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap size={15} style={{ color: BRAND.red }} /> Manual Overdrive
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4 py-2">
                  <p className="text-sm text-muted-foreground text-center leading-relaxed">
                    Hard System Refresh — clears expired keys, re-initializes server state.
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.93 }}
                    onClick={handleRedSwitch}
                    disabled={refreshing}
                    className="w-20 h-20 rounded-full flex flex-col items-center justify-center font-bold text-xs border-4 focus:outline-none"
                    style={{
                      background:   redSwitchActive ? "radial-gradient(circle, #dc2626, #7f1d1d)" : "radial-gradient(circle, #1a0505, #0a0202)",
                      borderColor:  redSwitchActive ? "#ef4444" : "#7f1d1d",
                      boxShadow:    redSwitchActive ? "0 0 40px rgba(239,68,68,0.8)" : "0 0 15px rgba(127,29,29,0.4)",
                      color:        "#fca5a5",
                    }}
                  >
                    {refreshing ? <Loader2 size={22} className="animate-spin" /> : <RefreshCw size={22} />}
                    <span className="mt-1 font-mono text-[9px]">{refreshing ? "RUNNING" : "OVERRIDE"}</span>
                  </motion.button>
                  {refreshResult && (
                    <div className="text-xs text-center text-muted-foreground rounded-lg p-2 border"
                      style={{ borderColor: "rgba(59,130,246,0.2)", background: "rgba(8,18,50,0.5)" }}>
                      <CheckCircle size={11} className="inline mr-1 text-primary" />
                      Pruned {refreshResult.prunedKeys} keys · {new Date(refreshResult.timestamp).toLocaleTimeString()}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Announcement Hub */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Megaphone size={15} className="text-primary" /> Announcements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  <Input placeholder="Announcement title"
                    value={announcement.title}
                    onChange={e => setAnnouncement(a => ({ ...a, title: e.target.value }))} />
                  <Textarea placeholder="Message body..."
                    className="resize-none h-16 text-sm"
                    value={announcement.body}
                    onChange={e => setAnnouncement(a => ({ ...a, body: e.target.value }))} />
                  <div className="flex gap-1.5">
                    {["normal", "urgent", "breaking"].map(p => (
                      <button key={p} onClick={() => setAnnouncement(a => ({ ...a, priority: p }))}
                        className="flex-1 text-xs py-1.5 rounded-lg border font-medium capitalize transition-all"
                        style={{
                          background:  announcement.priority === p ? "rgba(59,130,246,0.15)" : "transparent",
                          borderColor: announcement.priority === p ? "rgba(59,130,246,0.5)" : "rgba(59,130,246,0.15)",
                          color:       announcement.priority === p ? BRAND.electric : "#666",
                        }}>
                        {p}
                      </button>
                    ))}
                  </div>
                  <Button onClick={handleAnnouncement}
                    disabled={posting || !announcement.title || !announcement.body}
                    className="w-full bg-primary text-background hover:bg-primary/90 text-xs">
                    {posting ? <Loader2 size={12} className="animate-spin mr-1" /> : <Megaphone size={12} className="mr-1" />}
                    Broadcast
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Data Bridge */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Upload size={15} className="text-primary" /> Data Bridge
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">Pull student records from CSV, JSON, or external URLs into UOU Infinite.</p>
                <div className="flex gap-2">
                  {(["csv", "json", "url"] as const).map(m => (
                    <button key={m} onClick={() => setImportMode(m)}
                      className="text-xs px-3 py-1.5 rounded-lg border font-medium uppercase tracking-wider transition-all"
                      style={{
                        background:  importMode === m ? "rgba(59,130,246,0.15)" : "transparent",
                        borderColor: importMode === m ? "rgba(59,130,246,0.5)" : "rgba(59,130,246,0.15)",
                        color:       importMode === m ? BRAND.electric : "#888",
                      }}>
                      {m}
                    </button>
                  ))}
                </div>
                {importMode === "csv" && (
                  <div className="space-y-2">
                    <input ref={fileRef} type="file" accept=".csv"
                      className="w-full text-sm text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
                    <a href={`${BASE}/api/import/template`} className="text-xs text-primary underline hover:text-primary/80">
                      Download CSV template
                    </a>
                  </div>
                )}
                {importMode === "json" && (
                  <Textarea placeholder={'[{"name":"Jane Doe","email":"jane@uou.edu.ng","department":"CS","level":"100"}]'}
                    className="resize-none h-24 font-mono text-xs"
                    value={importJson} onChange={e => setImportJson(e.target.value)} />
                )}
                {importMode === "url" && (
                  <Input placeholder="https://example.com/students.csv"
                    value={importUrl} onChange={e => setImportUrl(e.target.value)} />
                )}
                <Button onClick={handleImport} disabled={importing} variant="outline"
                  className="border-primary/40 text-primary hover:bg-primary/10">
                  {importing ? <Loader2 size={14} className="animate-spin mr-2" /> : <Upload size={14} className="mr-2" />}
                  {importing ? "Importing..." : "Import Records"}
                </Button>
                {importResult && (
                  <div className="text-xs text-center text-muted-foreground rounded-lg p-2 border"
                    style={{ background: "rgba(59,130,246,0.05)", borderColor: "rgba(59,130,246,0.2)" }}>
                    <CheckCircle size={11} className="inline mr-1 text-primary" />
                    {importResult.imported} imported · {importResult.errors} skipped
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── AUDIT LOG ── */}
        {activeTab === "audit" && (
          <motion.div key="audit"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}
            className="space-y-4">

            <AuditLogSection />
          </motion.div>
        )}

      </AnimatePresence>

      {/* Provision Modal */}
      <AnimatePresence>
        {showModal && provisionResult && (
          <ProvisionModal
            result={provisionResult}
            onClose={() => { setShowModal(false); setProvisionResult(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
