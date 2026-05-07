import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListCourses } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Megaphone, Send, Trash2, AlertTriangle, Info, ChevronDown,
  Clock, CheckCircle, Zap, FileText, Bell,
} from "lucide-react";

const BRAND = { electric: "#60A5FA", purple: "#A78BFA", gold: "#F59E0B", green: "#34D399", red: "#F87171" };

type Priority = "info" | "warning" | "urgent";

interface Announcement {
  id: string;
  title: string;
  body: string;
  courseTarget: string;
  priority: Priority;
  createdAt: string;
  author: string;
}

const PRIORITY_CFG: Record<Priority, { label: string; color: string; bg: string; icon: typeof Info }> = {
  info:    { label: "Info",    color: BRAND.electric, bg: "rgba(96,165,250,0.12)", icon: Info },
  warning: { label: "Warning", color: BRAND.gold,     bg: "rgba(245,158,11,0.12)", icon: AlertTriangle },
  urgent:  { label: "Urgent",  color: BRAND.red,      bg: "rgba(248,113,113,0.12)", icon: Bell },
};

const TEMPLATES = [
  { label: "Assessment Reminder", title: "Upcoming Assessment — Action Required", body: "This is a reminder that your assessment for this course is scheduled for the end of the week. Please ensure you have reviewed all lecture materials and completed the prescribed readings. The Sentinel quiz gateway will be open for 72 hours." },
  { label: "Makeup Class", title: "Makeup Class Scheduled", body: "Due to the cancellation of our previous session, a makeup class has been scheduled. Please check your timetable for the updated slot. Attendance is mandatory and will be recorded by Sentinel." },
  { label: "Deadline Extension", title: "Assignment Deadline Extended", body: "After reviewing student progress data, the submission deadline for the current assignment has been extended by 48 hours. The Sentinel system will update the deadline automatically. Final extension — no further adjustments will be made." },
  { label: "Gold Card Alert", title: "Gold Card Opportunity This Week", body: "Students who complete this week's lecture module with a score of 70% or above on the gateway quiz will be eligible for a Gold Card mint. Review the lecture slides carefully — the quiz is comprehensive. Sentinel will issue credentials immediately upon pass." },
];

const FALLBACK_COURSES = [
  { id: 0, code: "ALL", title: "All Courses" },
  { id: 1, code: "ENT-101", title: "Principles of Entrepreneurship" },
  { id: 2, code: "AI-201",  title: "AI Safety & Ethics" },
  { id: 3, code: "DIG-301", title: "Digital Innovation Lab" },
  { id: 4, code: "LAW-201", title: "Constitutional Law & Governance" },
  { id: 5, code: "HSM-301", title: "Health Systems Management" },
];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const STORAGE_KEY = "uou_lecturer_announcements";

export default function LecturerAnnouncements() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: apiCourses } = useListCourses();

  const allCourseOpt = { id: 0, code: "ALL", title: "All Courses" };
  const courses = [allCourseOpt, ...(apiCourses && apiCourses.length > 0 ? apiCourses : FALLBACK_COURSES.slice(1))];

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [courseTarget, setCourseTarget] = useState("ALL");
  const [priority, setPriority] = useState<Priority>("info");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    try {
      const stored: Announcement[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      setAnnouncements(stored);
    } catch { /* ignore */ }
  }, []);

  const save = (list: Announcement[]) => {
    setAnnouncements(list);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch { /* ignore */ }
  };

  const handlePost = async () => {
    if (!title.trim() || !body.trim()) {
      toast({ title: "Missing fields", description: "Please provide a title and body.", variant: "destructive" });
      return;
    }
    setSending(true);
    await new Promise(r => setTimeout(r, 900));
    const newItem: Announcement = {
      id: Date.now().toString(),
      title: title.trim(),
      body: body.trim(),
      courseTarget,
      priority,
      createdAt: new Date().toISOString(),
      author: user?.name ?? "Lecturer",
    };
    save([newItem, ...announcements]);
    setTitle("");
    setBody("");
    setSending(false);
    toast({ title: "Announcement posted!", description: `Sent to ${courseTarget === "ALL" ? "all courses" : courseTarget}.` });
  };

  const handleDelete = (id: string) => {
    save(announcements.filter(a => a.id !== id));
  };

  const applyTemplate = (t: typeof TEMPLATES[0]) => {
    setTitle(t.title);
    setBody(t.body);
  };

  const selectedPriorityCfg = PRIORITY_CFG[priority];

  return (
    <div className="space-y-7 pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-[0.22em] mb-1">
          <Megaphone size={10} className="text-primary" /> Course Communications
        </div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Announcements</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">Post important notices to your students. Sentinel will distribute them across all enrolled portals.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Post Form */}
        <div className="lg:col-span-3 space-y-4">
          {/* Quick Templates */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground mb-2 flex items-center gap-1.5">
              <Zap size={9} className="text-primary" /> Quick Templates
            </div>
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map((t, i) => (
                <button key={i} onClick={() => applyTemplate(t)}
                  className="text-left px-3 py-2 rounded-lg border text-xs font-semibold transition-all hover:border-primary/40 hover:bg-primary/5"
                  style={{ background: "rgba(4,10,36,0.80)", borderColor: "rgba(96,165,250,0.12)", color: "#94A3B8" }}>
                  <FileText size={10} className="inline mr-1.5 text-primary" />
                  {t.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
            className="rounded-xl border p-5 space-y-4"
            style={{ background: "rgba(4,10,36,0.90)", borderColor: "rgba(96,165,250,0.16)" }}>
            <div className="text-sm font-bold text-foreground">New Announcement</div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Title</label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Announcement title…"
                className="bg-background/60 border-border focus:border-primary/50 text-sm" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Message</label>
              <Textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Write your announcement…"
                rows={5} className="bg-background/60 border-border focus:border-primary/50 text-sm resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Course Target */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Target Course</label>
                <div className="relative">
                  <select value={courseTarget} onChange={e => setCourseTarget(e.target.value)}
                    className="w-full appearance-none text-sm rounded-lg px-3 py-2 pr-7 border focus:outline-none focus:ring-1 focus:ring-primary/40"
                    style={{ background: "rgba(8,16,50,0.9)", borderColor: "rgba(59,130,246,0.22)", color: "#F0F9FF" }}>
                    {courses.map((c: any) => <option key={c.id} value={c.code}>{c.code} — {c.title}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Priority</label>
                <div className="flex gap-1.5">
                  {(["info", "warning", "urgent"] as Priority[]).map(p => {
                    const cfg = PRIORITY_CFG[p];
                    const active = priority === p;
                    return (
                      <button key={p} onClick={() => setPriority(p)}
                        className="flex-1 py-2 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all"
                        style={{
                          background: active ? cfg.bg : "rgba(255,255,255,0.03)",
                          borderColor: active ? `${cfg.color}40` : "rgba(255,255,255,0.07)",
                          color: active ? cfg.color : "rgba(148,163,184,0.5)",
                        }}>
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <Button onClick={handlePost} disabled={sending || !title.trim() || !body.trim()}
              className="w-full h-10 font-semibold text-sm"
              style={{ background: "linear-gradient(135deg,#1D4ED8,#3B82F6)", color: "white" }}>
              {sending ? (
                <><CheckCircle size={14} className="mr-2 animate-pulse" /> Sending…</>
              ) : (
                <><Send size={14} className="mr-2" /> Post Announcement</>
              )}
            </Button>
          </motion.div>
        </div>

        {/* Recent Announcements */}
        <div className="lg:col-span-2 space-y-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground flex items-center gap-2">
            <Clock size={9} /> Recent Announcements
            <span className="ml-auto text-primary text-[10px]">{announcements.length} total</span>
          </div>

          {announcements.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-xl border p-8 text-center"
              style={{ background: "rgba(4,10,36,0.82)", borderColor: "rgba(96,165,250,0.10)" }}>
              <Megaphone size={32} className="mx-auto mb-3 text-muted-foreground opacity-40" />
              <div className="text-sm font-semibold text-muted-foreground">No announcements yet</div>
              <div className="text-xs text-muted-foreground/60 mt-1">Post your first announcement using the form.</div>
            </motion.div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              <AnimatePresence>
                {announcements.map((ann, i) => {
                  const cfg = PRIORITY_CFG[ann.priority];
                  const Icon = cfg.icon;
                  return (
                    <motion.div key={ann.id}
                      initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12, height: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-xl border p-4 group relative"
                      style={{ background: "rgba(4,10,36,0.88)", borderColor: `${cfg.color}1C` }}>
                      <div className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: cfg.bg }}>
                          <Icon size={11} style={{ color: cfg.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="font-semibold text-sm text-foreground leading-snug line-clamp-1">{ann.title}</div>
                            <button onClick={() => handleDelete(ann.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-400 shrink-0">
                              <Trash2 size={12} />
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-3">{ann.body}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide"
                              style={{ background: cfg.bg, color: cfg.color }}>
                              {cfg.label}
                            </span>
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
                              style={{ background: "rgba(96,165,250,0.10)", color: "#60A5FA" }}>
                              {ann.courseTarget}
                            </span>
                            <span className="text-[10px] text-muted-foreground ml-auto">{timeAgo(ann.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
