import { useAuth } from "@/lib/auth-context";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Brain, BookOpen, Award, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

interface GradeRecord {
  id: number;
  courseId: number;
  testScore: string;
  examScore: string;
  assignmentScore: string;
  attendancePct: string;
  punctualityPct: string;
  finalScore: string;
  letterGrade: string;
  letter?: string;
  points?: number;
}

interface GradeData {
  grades: GradeRecord[];
  cgpa: string;
  insight: string;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const GRADE_COLORS: Record<string, string> = {
  A: "#60A5FA",
  B: "#34D399",
  C: "#F59E0B",
  D: "#F97316",
  E: "#EF4444",
  F: "#DC2626",
};

export default function StudentGrades() {
  const { user, token } = useAuth();
  const [data, setData] = useState<GradeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !token) return;
    fetch(`${BASE}/api/grades/student/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, token]);

  const cgpaNum = parseFloat(data?.cgpa || "0");
  const cgpaColor = cgpaNum >= 4.0 ? "#60A5FA" : cgpaNum >= 3.0 ? "#34D399" : cgpaNum >= 2.0 ? "#F59E0B" : "#EF4444";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Academic Record</h1>
          <p className="text-muted-foreground mt-1">Your grades, GPA, and AI insight summary</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
          <TrendingUp size={16} /> AI Registrar
        </div>
      </div>

      {/* CGPA Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-6 border relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(10,25,47,0.9), rgba(15,35,65,0.9))",
          borderColor: `${cgpaColor}40`,
        }}
      >
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="cgpa-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke={cgpaColor} strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cgpa-grid)" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-3xl border"
              style={{ background: `${cgpaColor}15`, borderColor: `${cgpaColor}40`, color: cgpaColor, boxShadow: `0 0 30px ${cgpaColor}30` }}
            >
              {data?.cgpa || "—"}
            </div>
            <div>
              <div className="text-sm text-muted-foreground uppercase tracking-widest font-mono mb-1">Cumulative GPA</div>
              <div className="text-2xl font-bold text-foreground">
                {cgpaNum >= 4.5 ? "First Class" : cgpaNum >= 3.5 ? "Second Class Upper" : cgpaNum >= 2.5 ? "Second Class Lower" : cgpaNum >= 1.5 ? "Third Class" : "Pass"}
              </div>
            </div>
          </div>

          {data?.insight && (
            <div
              className="flex-1 flex items-start gap-3 rounded-xl p-4 border"
              style={{ background: "rgba(59,130,246,0.06)", borderColor: "rgba(59,130,246,0.2)" }}
            >
              <Brain size={18} className="text-primary mt-0.5 shrink-0" />
              <div>
                <div className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">AI Registrar Insight</div>
                <p className="text-sm text-foreground">{data.insight}</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Grade Table */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading academic records...</div>
      ) : !data?.grades?.length ? (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No grades yet</h3>
            <p className="text-muted-foreground text-sm">Your grades will appear here once lecturers submit them.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-card border-border overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="text-primary w-5 h-5" /> Course Grades
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-background/50">
                    {["Course", "Test (20%)", "Exam (60%)", "Assignment (10%)", "Attend. (10%)", "Final Score", "Grade", "Points"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.grades.map((g, i) => {
                    const grade = g.letterGrade || g.letter || "F";
                    const color = GRADE_COLORS[grade] || "#666";
                    return (
                      <motion.tr
                        key={g.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b border-border/50 hover:bg-primary/5 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-foreground">Course {g.courseId}</td>
                        <td className="px-4 py-3 font-mono">{g.testScore || "—"}</td>
                        <td className="px-4 py-3 font-mono">{g.examScore || "—"}</td>
                        <td className="px-4 py-3 font-mono">{g.assignmentScore || "—"}</td>
                        <td className="px-4 py-3 font-mono">{g.attendancePct || "—"}%</td>
                        <td className="px-4 py-3 font-mono font-semibold">{g.finalScore || "—"}</td>
                        <td className="px-4 py-3">
                          <span
                            className="font-black text-lg"
                            style={{ color, textShadow: `0 0 10px ${color}60` }}
                          >
                            {grade}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-muted-foreground">{g.points || "—"}</td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
