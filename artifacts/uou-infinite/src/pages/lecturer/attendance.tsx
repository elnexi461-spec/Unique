import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListCourses } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { MOCK_STUDENTS } from "@/data/mockDatabase";
import { Button } from "@/components/ui/button";
import {
  ClipboardCheck, CheckCircle, XCircle, Clock, Users,
  ChevronDown, Calendar, Loader2, Save, RotateCcw, History,
} from "lucide-react";

const BRAND = { green: "#34D399", red: "#F87171", gold: "#F59E0B", electric: "#60A5FA" };

type AttendanceStatus = "present" | "late" | "absent" | null;

interface AttendanceRecord {
  id: string;
  courseCode: string;
  date: string;
  session: string;
  present: number;
  late: number;
  absent: number;
  total: number;
  submittedAt: string;
}

const FALLBACK_COURSES = [
  { id: 1, code: "ENT-101", title: "Principles of Entrepreneurship" },
  { id: 2, code: "AI-201",  title: "AI Safety & Ethics" },
  { id: 3, code: "DIG-301", title: "Digital Innovation Lab" },
  { id: 4, code: "LAW-201", title: "Constitutional Law & Governance" },
  { id: 5, code: "HSM-301", title: "Health Systems Management" },
  { id: 6, code: "BAM-111", title: "Business Administration & Management" },
];

const SESSIONS = ["Morning (8:00 AM)", "Afternoon (1:00 PM)", "Evening (5:00 PM)"];
const DEMO_STUDENTS = MOCK_STUDENTS.slice(0, 20);

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function LecturerAttendance() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: apiCourses } = useListCourses();
  const courses = (apiCourses && apiCourses.length > 0) ? apiCourses : FALLBACK_COURSES;

  const [selectedCourseId, setSelectedCourseId] = useState<number>(1);
  const [date, setDate] = useState(todayStr());
  const [session, setSession] = useState(SESSIONS[0]!);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const selectedCourse = courses.find((c: any) => c.id === selectedCourseId) ?? courses[0];

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("uou_attendance_records") ?? "[]");
      setHistory(stored);
    } catch { /* ignore */ }
  }, []);

  const setStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const markAll = (status: AttendanceStatus) => {
    const next: Record<string, AttendanceStatus> = {};
    DEMO_STUDENTS.forEach(s => { next[s.id] = status; });
    setAttendance(next);
  };

  const counts = DEMO_STUDENTS.reduce(
    (acc, s) => {
      const st = attendance[s.id] ?? null;
      if (st === "present") acc.present++;
      else if (st === "late") acc.late++;
      else if (st === "absent") acc.absent++;
      else acc.unmarked++;
      return acc;
    },
    { present: 0, late: 0, absent: 0, unmarked: 0 }
  );

  const handleSubmit = async () => {
    if (counts.unmarked > 0) {
      toast({ title: "Mark all students", description: `${counts.unmarked} student(s) still unmarked.`, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    const record: AttendanceRecord = {
      id: Date.now().toString(),
      courseCode: (selectedCourse as any)?.code ?? "—",
      date,
      session: session.split(" ")[0]!,
      present: counts.present,
      late: counts.late,
      absent: counts.absent,
      total: DEMO_STUDENTS.length,
      submittedAt: new Date().toISOString(),
    };
    const updated = [record, ...history].slice(0, 50);
    setHistory(updated);
    try { localStorage.setItem("uou_attendance_records", JSON.stringify(updated)); } catch { /* ignore */ }
    setSubmitting(false);
    setSubmitted(true);
    setAttendance({});
    toast({ title: "Attendance submitted!", description: `${counts.present} present · ${counts.late} late · ${counts.absent} absent` });
    setTimeout(() => setSubmitted(false), 4000);
  };

  const statusCfg: Record<string, { label: string; icon: typeof CheckCircle; color: string; bg: string }> = {
    present: { label: "Present", icon: CheckCircle, color: BRAND.green, bg: "rgba(52,211,153,0.12)" },
    late:    { label: "Late",    icon: Clock,        color: BRAND.gold,  bg: "rgba(245,158,11,0.12)" },
    absent:  { label: "Absent",  icon: XCircle,      color: BRAND.red,   bg: "rgba(248,113,113,0.12)" },
  };

  const CAMPUS_COLOR: Record<string, string> = { Zaria: "#A78BFA", Lagos: "#34D399", Kano: "#F59E0B" };

  return (
    <div className="space-y-7 pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-[0.22em] mb-1">
          <ClipboardCheck size={10} className="text-primary" /> Attendance Registry
        </div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Mark Attendance</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">Record student attendance for each lecture session in real time.</p>
      </motion.div>

      {/* Controls */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid sm:grid-cols-3 gap-4">
        {/* Course */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Course</label>
          <div className="relative">
            <select value={selectedCourseId} onChange={e => { setSelectedCourseId(Number(e.target.value)); setAttendance({}); }}
              className="w-full appearance-none text-sm font-semibold rounded-xl px-3 py-2.5 pr-8 border focus:outline-none focus:ring-1 focus:ring-primary/40"
              style={{ background: "rgba(4,10,36,0.88)", borderColor: "rgba(96,165,250,0.22)", color: "#F0F9FF" }}>
              {courses.map((c: any) => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </div>
        {/* Date */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <Calendar size={10} /> Date
          </label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="w-full text-sm rounded-xl px-3 py-2.5 border focus:outline-none focus:ring-1 focus:ring-primary/40"
            style={{ background: "rgba(4,10,36,0.88)", borderColor: "rgba(96,165,250,0.22)", color: "#F0F9FF" }} />
        </div>
        {/* Session */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Session</label>
          <div className="relative">
            <select value={session} onChange={e => setSession(e.target.value)}
              className="w-full appearance-none text-sm font-semibold rounded-xl px-3 py-2.5 pr-8 border focus:outline-none focus:ring-1 focus:ring-primary/40"
              style={{ background: "rgba(4,10,36,0.88)", borderColor: "rgba(96,165,250,0.22)", color: "#F0F9FF" }}>
              {SESSIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* Quick-mark row */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}
        className="flex items-center gap-3 flex-wrap">
        <span className="text-xs text-muted-foreground">Mark all as:</span>
        {(["present", "late", "absent"] as const).map(s => {
          const cfg = statusCfg[s]!;
          return (
            <button key={s} onClick={() => markAll(s)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all hover:brightness-110"
              style={{ background: cfg.bg, borderColor: `${cfg.color}30`, color: cfg.color }}>
              <cfg.icon size={11} /> All {cfg.label}
            </button>
          );
        })}
        <button onClick={() => setAttendance({})}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
          <RotateCcw size={11} /> Clear
        </button>
      </motion.div>

      {/* Student Grid */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {DEMO_STUDENTS.map((student, i) => {
          const status = attendance[student.id] ?? null;
          const campusColor = CAMPUS_COLOR[student.campus] ?? "#60A5FA";
          return (
            <motion.div key={student.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.025 }}
              className="rounded-xl border p-3.5 transition-all"
              style={{
                background: status ? `${statusCfg[status]!.bg}` : "rgba(4,10,36,0.80)",
                borderColor: status ? `${statusCfg[status]!.color}25` : "rgba(96,165,250,0.10)",
              }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border shrink-0"
                  style={{ background: `${campusColor}15`, borderColor: `${campusColor}30`, color: campusColor }}>
                  {student.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">{student.name}</div>
                  <div className="text-[10px] font-mono text-muted-foreground mt-0.5 flex items-center gap-1.5">
                    {student.studentId}
                    <span className="px-1 rounded text-[9px]" style={{ background: `${campusColor}18`, color: campusColor }}>{student.campus}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(["present", "late", "absent"] as const).map(s => {
                  const cfg = statusCfg[s]!;
                  const active = status === s;
                  return (
                    <button key={s} onClick={() => setStatus(student.id, active ? null : s)}
                      className="py-1 rounded-lg text-[10px] font-bold transition-all border"
                      style={{
                        background: active ? cfg.bg : "rgba(255,255,255,0.03)",
                        borderColor: active ? `${cfg.color}40` : "rgba(255,255,255,0.07)",
                        color: active ? cfg.color : "rgba(148,163,184,0.6)",
                      }}>
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Summary + Submit */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-xl border p-4 flex items-center justify-between gap-4 flex-wrap"
        style={{ background: "rgba(4,10,36,0.90)", borderColor: "rgba(96,165,250,0.18)" }}>
        <div className="flex items-center gap-6 text-sm">
          {[
            { label: "Present", count: counts.present, color: BRAND.green },
            { label: "Late",    count: counts.late,    color: BRAND.gold },
            { label: "Absent",  count: counts.absent,  color: BRAND.red },
            { label: "Unmarked",count: counts.unmarked, color: "rgba(148,163,184,0.5)" },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className="text-xl font-black" style={{ color: item.color }}>{item.count}</span>
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Users size={13} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{DEMO_STUDENTS.length} students</span>
          <Button onClick={handleSubmit} disabled={submitting || submitted}
            className="ml-2 h-9 px-5 font-semibold text-sm"
            style={{ background: submitted ? "#10B981" : "linear-gradient(135deg,#1D4ED8,#3B82F6)", color: "white" }}>
            {submitting ? <Loader2 size={14} className="animate-spin mr-2" /> : submitted ? <CheckCircle size={14} className="mr-2" /> : <Save size={14} className="mr-2" />}
            {submitting ? "Submitting…" : submitted ? "Submitted!" : "Submit Attendance"}
          </Button>
        </div>
      </motion.div>

      {/* History */}
      {history.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          <button onClick={() => setShowHistory(h => !h)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3">
            <History size={14} />
            <span className="font-semibold">Attendance History</span>
            <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full border border-primary/20">{history.length}</span>
            <ChevronDown size={13} className={`transition-transform ${showHistory ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {showHistory && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <div className="rounded-xl border overflow-hidden" style={{ background: "rgba(4,10,36,0.85)", borderColor: "rgba(96,165,250,0.12)" }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                        {["Course", "Date", "Session", "Present", "Late", "Absent", "Rate"].map(h => (
                          <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((r, i) => (
                        <tr key={r.id} className="border-b hover:bg-white/[0.02] transition-colors" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                          <td className="px-4 py-2.5 font-mono text-xs" style={{ color: "#60A5FA" }}>{r.courseCode}</td>
                          <td className="px-4 py-2.5 text-xs text-muted-foreground">{r.date}</td>
                          <td className="px-4 py-2.5 text-xs text-muted-foreground">{r.session}</td>
                          <td className="px-4 py-2.5 text-xs font-bold" style={{ color: BRAND.green }}>{r.present}</td>
                          <td className="px-4 py-2.5 text-xs font-bold" style={{ color: BRAND.gold }}>{r.late}</td>
                          <td className="px-4 py-2.5 text-xs font-bold" style={{ color: BRAND.red }}>{r.absent}</td>
                          <td className="px-4 py-2.5 text-xs font-semibold text-foreground">
                            {Math.round((r.present / r.total) * 100)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
