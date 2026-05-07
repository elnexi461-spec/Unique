import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Award, Flame, Star, BookOpen, Shield, Trophy, Zap, GraduationCap, Clock, CheckCircle, Lock } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { useListEnrollments } from "@workspace/api-client-react";
import { MOCK_STUDENTS } from "@/data/mockDatabase";
import { PageTransition } from "@/components/PageTransition";
import { StudyStreak } from "@/components/StudyStreak";

const CAMPUS_COLORS: Record<string, string> = {
  Zaria: "#A78BFA", Lagos: "#34D399", Kano: "#F59E0B", default: "#0070FF",
};

interface Achievement {
  id: string;
  name: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  earned: boolean;
}

function getAchievements(goldCount: number, enrolled: number, gpa: number, streak: number): Achievement[] {
  return [
    { id: "registered",   name: "Sentinel Registered",  desc: "Active in the system",           icon: Shield,       color: "#0070FF", earned: true },
    { id: "first_gold",   name: "Gold Standard",         desc: "First Gold Card minted",          icon: Award,        color: "#F59E0B", earned: goldCount >= 1 },
    { id: "five_gold",    name: "Vault Builder",         desc: "5 Gold Cards minted",             icon: Star,         color: "#FCD34D", earned: goldCount >= 5 },
    { id: "ten_gold",     name: "Gold Sovereign",        desc: "10 Gold Cards minted",            icon: Trophy,       color: "#F59E0B", earned: goldCount >= 10 },
    { id: "enrolled",     name: "Knowledge Seeker",      desc: "Enrolled in first course",        icon: BookOpen,     color: "#60A5FA", earned: enrolled >= 1 },
    { id: "multi_course", name: "Polymath Candidate",    desc: "Enrolled in 3+ courses",          icon: GraduationCap,color: "#A78BFA", earned: enrolled >= 3 },
    { id: "high_gpa",     name: "Distinction Class",     desc: "GPA above 3.5",                   icon: TrendingUp,   color: "#34D399", earned: gpa >= 3.5 },
    { id: "perfect_gpa",  name: "Academic Sovereign",    desc: "GPA above 3.9",                   icon: Star,         color: "#FCD34D", earned: gpa >= 3.9 },
    { id: "streak_3",     name: "Consistency Rising",    desc: "3-day study streak",              icon: Flame,        color: "#FB923C", earned: streak >= 3 },
    { id: "streak_7",     name: "Weekly Warrior",        desc: "7-day study streak",              icon: Flame,        color: "#F97316", earned: streak >= 7 },
    { id: "streak_14",    name: "Fortnight Champion",    desc: "14-day study streak",             icon: Flame,        color: "#EF4444", earned: streak >= 14 },
    { id: "vanguard",     name: "Vanguard Elite",        desc: "Top 10 on the leaderboard",       icon: Zap,          color: "#A78BFA", earned: false },
  ];
}

function TrendingUp({ size, style }: { size: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

export default function ScholarProfile() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { data: enrollments } = useListEnrollments();

  const [goldCount, setGoldCount] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!user?.id) return;
    try {
      const vault = JSON.parse(localStorage.getItem(`uou_vault_${user.id}`) ?? "[]");
      setGoldCount(vault.length);
    } catch {/* ignore */}

    try {
      const dates: string[] = JSON.parse(localStorage.getItem("uou_login_dates") ?? "[]");
      let s = 0;
      const cursor = new Date();
      while (true) {
        const ds = cursor.toISOString().slice(0, 10);
        if (dates.includes(ds)) { s++; cursor.setDate(cursor.getDate() - 1); }
        else break;
      }
      setStreak(s);
    } catch {/* ignore */}
  }, [user?.id]);

  const campus = (user as any)?.campus?.replace?.(/( Center| Campus| Main| Hub)/g, "") ?? "Zaria";
  const campusColor = CAMPUS_COLORS[campus] ?? CAMPUS_COLORS.default;
  const mockStudent = MOCK_STUDENTS.find(s => s.name === user?.name) ?? MOCK_STUDENTS[0]!;
  const gpa = mockStudent.gpa;
  const meritScore = mockStudent.merit;
  const enrolled = enrollments?.length ?? 0;
  const passed = enrollments?.filter((e: any) => e.grade && !["F", "Ongoing"].includes(e.grade)).length ?? 0;
  const studentId = `UOU-${campus.slice(0, 2).toUpperCase()}-${String(user?.id ?? "001").padStart(5, "0")}`;

  const achievements = getAchievements(goldCount, enrolled, gpa, streak);
  const earnedCount = achievements.filter(a => a.earned).length;

  return (
    <PageTransition>
      <div className="space-y-6 pb-10">
        {/* Back */}
        <motion.button whileHover={{ x: -2 }} whileTap={{ scale: 0.97 }}
          onClick={() => setLocation("/student")}
          className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border"
          style={{ background: "rgba(4,11,26,0.6)", borderColor: "rgba(0,112,255,0.25)", color: "rgba(100,160,255,0.9)" }}>
          <ArrowLeft size={14} /> Back to Portal
        </motion.button>

        {/* Hero card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl overflow-hidden border relative"
          style={{ background: "linear-gradient(145deg, rgba(4,11,26,0.9) 0%, rgba(8,20,50,0.95) 100%)", borderColor: `${campusColor}30` }}>
          <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, #0040C0, ${campusColor}, #60A5FA, ${campusColor}, #0040C0)` }} />
          <div className="p-6">
            <div className="flex items-start gap-5">
              {/* Avatar */}
              <motion.div
                animate={{ boxShadow: [`0 0 20px ${campusColor}40`, `0 0 40px ${campusColor}70`, `0 0 20px ${campusColor}40`] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black border-2 shrink-0"
                style={{ background: `${campusColor}18`, borderColor: campusColor, color: campusColor }}>
                {user?.name?.charAt(0).toUpperCase() ?? "S"}
              </motion.div>

              {/* Identity */}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-black text-white truncate">{user?.name ?? "Scholar"}</h1>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${campusColor}18`, color: campusColor, border: `1px solid ${campusColor}35` }}>
                    {campus} Campus
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(0,112,255,0.1)", color: "#0070FF", border: "1px solid rgba(0,112,255,0.3)" }}>
                    Scholar
                  </span>
                </div>
                <div className="text-xs font-mono mt-1.5" style={{ color: "rgba(148,163,184,0.5)" }}>{studentId}</div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 mt-5">
              {[
                { label: "GPA",        value: gpa.toFixed(2),  color: "#60A5FA" },
                { label: "Gold Cards", value: goldCount || mockStudent.goldCards, color: "#F59E0B" },
                { label: "Merit",      value: meritScore,      color: campusColor },
                { label: "Enrolled",   value: enrolled || mockStudent.goldCards, color: "#34D399" },
              ].map(stat => (
                <div key={stat.label} className="text-center p-2 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="text-lg font-black" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Study Streak */}
        <StudyStreak />

        {/* Course progress */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl border p-4"
          style={{ background: "rgba(4,11,26,0.65)", borderColor: "rgba(0,112,255,0.18)" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen size={15} style={{ color: "#0070FF" }} />
              <span className="text-sm font-bold text-white">Course Progress</span>
            </div>
            <span className="text-xs font-mono" style={{ color: "#60A5FA" }}>
              {passed}/{enrolled} passed
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(0,112,255,0.1)" }}>
            <motion.div
              initial={{ width: 0 }} animate={{ width: enrolled ? `${(passed / enrolled) * 100}%` : "0%" }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #0040C0, #0070FF, #60A5FA)" }}
            />
          </div>
          <div className="mt-2 space-y-1.5">
            {enrollments?.map((enr: any) => (
              <div key={enr.id} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground truncate flex-1">{enr.courseName}</span>
                <span className="ml-2 font-bold font-mono shrink-0"
                  style={{ color: enr.grade && enr.grade !== "Ongoing" ? "#34D399" : "rgba(148,163,184,0.5)" }}>
                  {enr.grade ?? "Ongoing"}
                </span>
              </div>
            ))}
            {!enrollments?.length && (
              <p className="text-xs text-muted-foreground text-center py-2">No enrollments yet</p>
            )}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy size={15} style={{ color: "#F59E0B" }} />
              <span className="text-sm font-bold text-white">Achievements</span>
            </div>
            <span className="text-xs font-mono" style={{ color: "#F59E0B" }}>
              {earnedCount}/{achievements.length} earned
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {achievements.map((ach, i) => {
              const Icon = ach.icon;
              return (
                <motion.div key={ach.id}
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-xl border p-3 flex items-start gap-2.5 relative overflow-hidden"
                  style={{
                    background: ach.earned ? `${ach.color}0a` : "rgba(4,11,26,0.4)",
                    borderColor: ach.earned ? `${ach.color}30` : "rgba(255,255,255,0.05)",
                    opacity: ach.earned ? 1 : 0.5,
                  }}>
                  {ach.earned && (
                    <motion.div
                      animate={{ opacity: [0, 0.3, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                      className="absolute inset-0 rounded-xl"
                      style={{ background: `radial-gradient(ellipse at 30% 30%, ${ach.color}20, transparent 70%)` }}
                    />
                  )}
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 relative z-10"
                    style={{ background: ach.earned ? `${ach.color}18` : "rgba(255,255,255,0.04)", border: `1px solid ${ach.earned ? ach.color + "35" : "rgba(255,255,255,0.07)"}` }}>
                    {ach.earned
                      ? <Icon size={13} style={{ color: ach.color }} />
                      : <Lock size={11} style={{ color: "rgba(148,163,184,0.3)" }} />
                    }
                  </div>
                  <div className="flex-1 min-w-0 relative z-10">
                    <div className="text-xs font-bold leading-tight" style={{ color: ach.earned ? "white" : "rgba(148,163,184,0.4)" }}>
                      {ach.name}
                    </div>
                    <div className="text-[9px] leading-tight mt-0.5" style={{ color: ach.earned ? "rgba(148,163,184,0.65)" : "rgba(148,163,184,0.3)" }}>
                      {ach.desc}
                    </div>
                  </div>
                  {ach.earned && (
                    <CheckCircle size={10} className="shrink-0 mt-0.5 relative z-10" style={{ color: ach.color }} />
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
