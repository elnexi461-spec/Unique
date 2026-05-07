import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, BookOpen, Award, GraduationCap, AlertTriangle } from "lucide-react";
import { useLocation } from "wouter";

const SEMESTER_EVENTS = [
  { week: 1,  date: "Jan 13 – Jan 17",  label: "Semester Begins",               type: "milestone", done: true  },
  { week: 4,  date: "Feb 3 – Feb 7",    label: "Course Registration Closes",    type: "admin",     done: true  },
  { week: 8,  date: "Mar 3 – Mar 7",    label: "Mid-Semester Assessment",        type: "exam",      done: true  },
  { week: 10, date: "Mar 17 – Mar 21",  label: "Sentinel AI Progress Review",   type: "ai",        done: true  },
  { week: 14, date: "Apr 14 – Apr 18",  label: "Gold Card Ceremony (Batch 1)",  type: "ceremony",  done: true  },
  { week: 16, date: "Apr 28 – May 2",   label: "Final Exam Timetable Released", type: "admin",     done: false },
  { week: 18, date: "May 12 – May 16",  label: "Week 18 Friday Brief",          type: "milestone", done: false },
  { week: 20, date: "May 26 – May 30",  label: "Final Assessments Begin",       type: "exam",      done: false },
  { week: 21, date: "Jun 2 – Jun 6",    label: "Final Assessments Close",       type: "exam",      done: false },
  { week: 22, date: "Jun 9",            label: "Scholarship Deadline",          type: "admin",     done: false },
  { week: 24, date: "Jun 23 – Jun 27",  label: "Gold Card Ceremony (Batch 2)",  type: "ceremony",  done: false },
  { week: 26, date: "Jul 7",            label: "Convocation — Abuja NCC",       type: "milestone", done: false },
];

const IMPORTANT_DATES = [
  { date: "May 15, 2026",  desc: "Fee payment deadline — Semester 2",     urgent: true  },
  { date: "May 22, 2026",  desc: "Appeal submission window opens",         urgent: false },
  { date: "Jun 1, 2026",   desc: "Library loan return deadline",           urgent: false },
  { date: "Jun 9, 2026",   desc: "₦50M scholarship application closes",   urgent: true  },
  { date: "Jun 15, 2026",  desc: "Graduation clearance form due",          urgent: false },
];

const TYPE_CONFIG: Record<string, { color: string; bg: string; border: string; label: string }> = {
  milestone: { color: "#0070FF", bg: "rgba(0,112,255,0.1)",  border: "rgba(0,112,255,0.3)",  label: "Milestone" },
  admin:     { color: "#A78BFA", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.3)", label: "Admin" },
  exam:      { color: "#F87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)", label: "Exam" },
  ai:        { color: "#34D399", bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.3)",  label: "Sentinel" },
  ceremony:  { color: "#F59E0B", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.3)",  label: "Ceremony" },
};

const CURRENT_WEEK = 18;

export default function AcademicCalendar() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ x: -2, scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => setLocation("/student")}
          className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border"
          style={{ background: "rgba(4,11,26,0.6)", borderColor: "rgba(0,112,255,0.25)", color: "rgba(100,160,255,0.9)", backdropFilter: "blur(12px)" }}
        >
          <ArrowLeft size={14} /> Back to Portal
        </motion.button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border"
            style={{ background: "rgba(0,112,255,0.1)", borderColor: "rgba(0,112,255,0.3)" }}>
            <Calendar size={18} style={{ color: "#0070FF" }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Academic Calendar</h1>
            <p className="text-muted-foreground text-sm">Semester 2 · 2025/2026 Academic Year</p>
          </div>
        </div>
      </motion.div>

      {/* Current week banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl border p-4 flex items-center gap-4"
        style={{ background: "rgba(0,112,255,0.07)", borderColor: "rgba(0,112,255,0.35)" }}
      >
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full shrink-0" style={{ background: "#0070FF" }}
        />
        <div>
          <div className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: "#0070FF" }}>You Are Here</div>
          <div className="text-white font-semibold text-sm">Week {CURRENT_WEEK} — May 12–16, 2026</div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-xs text-muted-foreground">Weeks remaining</div>
          <div className="text-2xl font-black" style={{ color: "#0070FF" }}>8</div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-2 space-y-3">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">Semester Timeline</div>
          {SEMESTER_EVENTS.map((ev, i) => {
            const cfg = TYPE_CONFIG[ev.type]!;
            const isCurrent = ev.week === CURRENT_WEEK;
            const isPast = ev.week < CURRENT_WEEK;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="flex items-start gap-4 p-4 rounded-xl border relative overflow-hidden"
                style={{
                  background: isCurrent ? "rgba(0,112,255,0.1)" : isPast ? "rgba(4,11,26,0.4)" : "rgba(4,11,26,0.65)",
                  borderColor: isCurrent ? "rgba(0,112,255,0.5)" : isPast ? "rgba(255,255,255,0.05)" : "rgba(0,112,255,0.12)",
                  opacity: isPast ? 0.6 : 1,
                }}
              >
                {isCurrent && (
                  <motion.div
                    animate={{ opacity: [0, 0.15, 0] }} transition={{ duration: 2.5, repeat: Infinity }}
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(0,112,255,0.25), transparent 60%)" }}
                  />
                )}
                <div className="text-xs font-mono text-muted-foreground w-16 shrink-0 mt-0.5">
                  Wk {ev.week}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-foreground mb-0.5 flex items-center gap-2">
                    {ev.label}
                    {isCurrent && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: "rgba(0,112,255,0.2)", color: "#0070FF", border: "1px solid rgba(0,112,255,0.4)" }}>
                        NOW
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock size={10} /> {ev.date}
                  </div>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                  {cfg.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Important dates sidebar */}
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Important Dates</div>
          {IMPORTANT_DATES.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.07 }}
              className="rounded-xl border p-4"
              style={{
                background: d.urgent ? "rgba(248,113,113,0.07)" : "rgba(4,11,26,0.65)",
                borderColor: d.urgent ? "rgba(248,113,113,0.3)" : "rgba(0,112,255,0.12)",
              }}
            >
              <div className="flex items-start gap-2">
                {d.urgent && <AlertTriangle size={13} className="mt-0.5 shrink-0" style={{ color: "#F87171" }} />}
                <div>
                  <div className="text-xs font-mono mb-1" style={{ color: d.urgent ? "#F87171" : "#0070FF" }}>{d.date}</div>
                  <div className="text-sm text-foreground leading-snug">{d.desc}</div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Quick links */}
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mt-6">Quick Access</div>
          {[
            { label: "Live Timetable",  href: "/student/timetable", icon: Clock },
            { label: "Fee Status",       href: "/student/fees",       icon: Award },
            { label: "My Courses",       href: "/student/courses",    icon: BookOpen },
          ].map((link, i) => (
            <motion.button
              key={i}
              whileHover={{ x: 3 }}
              onClick={() => setLocation(link.href)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border text-sm text-left"
              style={{ background: "rgba(4,11,26,0.65)", borderColor: "rgba(0,112,255,0.12)", color: "rgba(148,163,184,0.9)" }}
            >
              <link.icon size={14} style={{ color: "#0070FF" }} />
              {link.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
