import { useAuth } from "@/lib/auth-context";
import { useListEnrollments } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Award, Activity, TrendingUp, Calendar, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { SkillGraph } from "@/components/SkillGraph";
import { VanguardLeaderboard } from "@/components/VanguardLeaderboard";

export default function StudentPortal() {
  const { user } = useAuth();
  const { data: enrollments } = useListEnrollments();

  const passed = enrollments?.filter(e => e.grade && !["F", "Ongoing"].includes(e.grade)).length ?? 0;
  const total  = enrollments?.length ?? 0;

  const quickLinks = [
    { href: "/student/grades",     icon: TrendingUp, label: "Grades & GPA",       desc: "AI-powered academic report" },
    { href: "/student/timetable",  icon: Calendar,   label: "Live Timetable",      desc: "Lecture schedule & countdown" },
    { href: "/student/courses",    icon: BookOpen,   label: "Course Browser",      desc: "Browse & enroll in courses" },
    { href: "/student/credential", icon: Award,      label: "Credential Passport", desc: "Cryptographic proof of skill" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome, {user?.name}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Student Academic Portal</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
          <Activity size={16} className="animate-pulse" /> Status: Active
        </div>
      </div>

      {/* Sentinel message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border p-3.5 flex items-center gap-3"
        style={{
          background:   "rgba(8,20,60,0.7)",
          borderColor:  "rgba(59,130,246,0.2)",
        }}
      >
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: "#3B82F6", boxShadow: "0 0 8px #3B82F6" }}
        />
        <p className="text-sm italic" style={{ color: "rgba(147,197,253,0.85)" }}>
          "Your value is increasing, Scholar. The Sentinel is monitoring your progress across all sessions."
        </p>
        <Zap size={14} className="text-primary shrink-0" />
      </motion.div>

      {/* 2-col grid: quick links + skill graph */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Quick links */}
        <div className="space-y-3">
          {quickLinks.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <Link href={item.href}>
                <div className="group cursor-pointer rounded-xl border border-border bg-card p-4 hover:border-primary/50 hover:bg-primary/5 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <item.icon size={18} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm">
                        {item.label}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                    </div>
                    <motion.div
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: "#3B82F6" }}
                    >
                      →
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Neural Skill Graph */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <SkillGraph
            passedCourses={passed}
            totalCourses={total}
            enrollments={enrollments?.map(e => ({
              courseName: e.courseName,
              grade:      e.grade,
            })) ?? []}
          />
        </motion.div>
      </div>

      {/* Vanguard Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <VanguardLeaderboard />
      </motion.div>

      {/* Current Enrollments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="text-primary w-5 h-5" /> Current Enrollments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {enrollments?.length ? (
                enrollments.map((enr, i) => (
                  <motion.div
                    key={enr.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex justify-between items-center p-3 rounded-lg bg-background border border-border hover:border-primary/30 transition-colors"
                  >
                    <span className="font-medium text-foreground text-sm">{enr.courseName}</span>
                    <span
                      className="font-mono text-sm font-bold px-2.5 py-0.5 rounded-full border"
                      style={{
                        color:        enr.grade && enr.grade !== "Ongoing" ? "#60A5FA" : "hsl(var(--muted-foreground))",
                        borderColor:  enr.grade && enr.grade !== "Ongoing" ? "rgba(59,130,246,0.3)" : "hsl(var(--border))",
                        background:   enr.grade && enr.grade !== "Ongoing" ? "rgba(59,130,246,0.08)" : "transparent",
                      }}
                    >
                      {enr.grade || "Ongoing"}
                    </span>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No active courses yet.</p>
                </div>
              )}
              <Link href="/student/courses">
                <Button className="w-full mt-1" variant="outline">
                  Browse Course Catalog
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
