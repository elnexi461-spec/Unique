import { useListCourses, useListStudents } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { GOLD_CARD_HISTORY, FRIDAY_BRIEF_WEEK18 } from "@/data/mockDatabase";
import { useState, useEffect } from "react";
import {
  TrendingUp, BookOpen, Users, Award, Cpu, ClipboardCheck,
  BarChart2, Megaphone, Brain, Zap, ArrowRight, Star,
  CheckCircle, AlertTriangle, Info,
} from "lucide-react";

const BRAND = { purple: "#A78BFA", electric: "#60A5FA", gold: "#F59E0B", green: "#34D399", red: "#F87171" };

const SENTINEL_MESSAGES = [
  "Your lectures are shaping the next generation of Nigerian innovators. Week 18 data confirms a 22.6% surge in Gold Card mints.",
  "3 at-risk students have been flagged by Sentinel. Early intervention this week could protect their academic trajectory.",
  "Your AI-synthesised lecture recorded a 94% completion rate — the highest in the faculty this semester.",
];

const ACTIONS = [
  { href: "/lecturer/grades", icon: TrendingUp, label: "Record Grades", desc: "Enter test, exam & assignment scores", color: BRAND.electric },
  { href: "/lecturer/upload", icon: Cpu, label: "AI Synthesis", desc: "Upload PDF → Sentinel lecture video", color: BRAND.purple },
  { href: "/lecturer/attendance", icon: ClipboardCheck, label: "Mark Attendance", desc: "Live attendance registry for your class", color: BRAND.green },
  { href: "/lecturer/analytics", icon: BarChart2, label: "Analytics", desc: "Student performance intelligence dashboard", color: BRAND.gold },
  { href: "/lecturer/announcements", icon: Megaphone, label: "Announcements", desc: "Post communications to your students", color: BRAND.red },
  { href: "/lecturer/grades", icon: Brain, label: "Sentinel Insights", desc: "AI flags, alerts and performance signals", color: "#34D399" },
];

const COURSE_PERF = FRIDAY_BRIEF_WEEK18.coursePerformance;

export default function LecturerPortal() {
  const { user } = useAuth();
  const { data: courses } = useListCourses();
  const { data: students } = useListStudents();
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setMsgIdx(i => (i + 1) % SENTINEL_MESSAGES.length), 8000);
    return () => clearInterval(t);
  }, []);

  const myCourses = courses?.slice(0, 5) ?? [];
  const totalStudents = students?.length ?? 50;
  const totalGoldCards = GOLD_CARD_HISTORY.length;
  const dateStr = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const kpis = [
    { label: "Active Courses", value: myCourses.length || 5, icon: BookOpen, color: BRAND.electric },
    { label: "Students Enrolled", value: totalStudents, icon: Users, color: BRAND.purple },
    { label: "Gold Cards Issued", value: totalGoldCards, icon: Award, color: BRAND.gold },
    { label: "Assessment Pass Rate", value: "84%", icon: TrendingUp, color: BRAND.green },
  ];

  const recentActivity = GOLD_CARD_HISTORY.slice(0, 10);
  const insights = FRIDAY_BRIEF_WEEK18.sentinelInsights;

  return (
    <div className="space-y-7 pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-[0.22em] mb-1">
            <Zap size={10} className="text-primary" /> Faculty Command Center · UOU Infinite
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Welcome, Prof.{" "}
            <span style={{ color: BRAND.purple }}>
              {user?.name?.split(" ").slice(-1)[0] ?? "Imumolen"}
            </span>
          </h1>
          <p className="text-muted-foreground mt-0.5 text-sm">{dateStr}</p>
        </div>
        <Badge className="mt-1 shrink-0 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest border"
          style={{ background: "rgba(167,139,250,0.10)", borderColor: "rgba(167,139,250,0.35)", color: BRAND.purple }}>
          Faculty Member
        </Badge>
      </motion.div>

      {/* Sentinel message bar */}
      <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 }}
        className="rounded-xl border px-5 py-3 flex items-center gap-3"
        style={{ background: "rgba(4,10,36,0.88)", borderColor: "rgba(96,165,250,0.18)" }}>
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full shrink-0" style={{ background: "#60A5FA" }} />
        <Brain size={13} className="text-primary shrink-0" />
        <AnimatePresence mode="wait">
          <motion.p key={msgIdx} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.4 }}
            className="text-sm text-muted-foreground italic flex-1">
            {SENTINEL_MESSAGES[msgIdx]}
          </motion.p>
        </AnimatePresence>
        <span className="text-[9px] font-mono text-primary/50 uppercase tracking-widest shrink-0">Sentinel AI</span>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.07 }}>
            <Card className="border relative overflow-hidden" style={{ background: "rgba(4,10,36,0.88)", borderColor: `${kpi.color}28` }}>
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.08] blur-3xl pointer-events-none"
                style={{ background: kpi.color, transform: "translate(30%, -30%)" }} />
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <kpi.icon size={17} style={{ color: kpi.color }} />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.6 }}
                    className="w-1.5 h-1.5 rounded-full" style={{ background: kpi.color }} />
                </div>
                <div className="text-2xl font-black text-foreground" style={{ textShadow: `0 0 24px ${kpi.color}50` }}>
                  {kpi.value}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] mt-1.5 leading-tight">{kpi.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground mb-3 flex items-center gap-2">
          <Zap size={11} className="text-primary" /> Faculty Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {ACTIONS.map((action, i) => (
            <motion.div key={action.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 + i * 0.06 }}>
              <Link href={action.href}>
                <motion.div whileHover={{ scale: 1.025, y: -2 }} whileTap={{ scale: 0.975 }}
                  className="group cursor-pointer rounded-xl border p-4 flex flex-col gap-2.5 transition-all relative overflow-hidden h-full"
                  style={{ background: "rgba(4,10,36,0.88)", borderColor: `${action.color}1C` }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at top left, ${action.color}0A, transparent 70%)` }} />
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 relative z-10"
                    style={{ background: `${action.color}12`, borderColor: `${action.color}30` }}>
                    <action.icon size={16} style={{ color: action.color }} />
                  </div>
                  <div className="relative z-10">
                    <div className="font-semibold text-sm text-foreground group-hover:text-white transition-colors leading-snug">
                      {action.label}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{action.desc}</div>
                  </div>
                  <ArrowRight size={11} className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-50 transition-opacity"
                    style={{ color: action.color }} />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Courses + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Courses */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground flex items-center gap-2">
            <BookOpen size={11} className="text-primary" /> Active Courses
          </h2>
          {COURSE_PERF.map((perf, i) => (
            <motion.div key={perf.course} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.38 + i * 0.07 }}>
              <div className="rounded-xl border p-4 flex items-center justify-between group hover:border-primary/25 transition-all cursor-default"
                style={{ background: "rgba(4,10,36,0.82)", borderColor: "rgba(96,165,250,0.10)" }}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center border shrink-0"
                    style={{ background: "rgba(96,165,250,0.07)", borderColor: "rgba(96,165,250,0.18)" }}>
                    <BookOpen size={15} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-foreground truncate">{perf.course}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {perf.enrolled} students · Avg {perf.avgScore} · Pass {perf.passRate}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <Link href="/lecturer/grades">
                    <Button size="sm" variant="outline" className="h-7 text-xs border-primary/20 text-primary hover:bg-primary/10 px-2.5">
                      Grades
                    </Button>
                  </Link>
                  <Link href="/lecturer/analytics">
                    <Button size="sm" variant="outline" className="h-7 text-xs border-primary/20 text-primary hover:bg-primary/10 px-2.5">
                      Analytics
                    </Button>
                  </Link>
                </div>
                <div className="ml-3 shrink-0 group-hover:opacity-0 transition-opacity">
                  <div className="text-right">
                    <div className="text-xs font-bold" style={{ color: BRAND.green }}>{perf.passRate}</div>
                    <div className="text-[10px] text-muted-foreground">pass rate</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sentinel Insights + Activity */}
        <div className="space-y-3">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground flex items-center gap-2">
            <Brain size={11} className="text-primary" /> Sentinel Flags
          </h2>
          <div className="rounded-xl border overflow-hidden" style={{ background: "rgba(4,10,36,0.88)", borderColor: "rgba(96,165,250,0.12)" }}>
            <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
              {insights.slice(0, 6).map((ins, i) => {
                const Icon = ins.type === "risk" ? AlertTriangle : ins.type === "success" ? CheckCircle : Info;
                const color = ins.type === "risk" ? BRAND.red : ins.type === "success" ? BRAND.green : BRAND.electric;
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 + i * 0.06 }}
                    className="p-3 flex items-start gap-2.5 hover:bg-white/[0.02] transition-colors">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: `${color}15` }}>
                      <Icon size={9} style={{ color }} />
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{ins.message}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <h2 className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground flex items-center gap-2 pt-1">
            <Award size={11} style={{ color: BRAND.gold }} /> Recent Gold Cards
          </h2>
          <div className="rounded-xl border overflow-hidden" style={{ background: "rgba(4,10,36,0.85)", borderColor: "rgba(245,158,11,0.12)" }}>
            <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
              {recentActivity.slice(0, 5).map((card, i) => (
                <motion.div key={card.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.52 + i * 0.05 }}
                  className="p-2.5 flex items-center gap-2 hover:bg-white/[0.02] transition-colors">
                  <Star size={10} style={{ color: BRAND.gold }} className="shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-semibold text-foreground truncate">{card.studentName}</div>
                    <div className="text-[10px] text-muted-foreground">{card.courseCode} · {card.score}%</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
