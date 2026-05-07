import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from "recharts";
import { useListCourses } from "@workspace/api-client-react";
import { MOCK_STUDENTS, FRIDAY_BRIEF_WEEK18 } from "@/data/mockDatabase";
import {
  BarChart2, Users, TrendingUp, AlertTriangle, Award,
  ChevronDown, Trophy, ArrowUp, ArrowDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const BRAND = { electric: "#60A5FA", purple: "#A78BFA", gold: "#F59E0B", green: "#34D399", red: "#F87171" };
const GRADE_COLORS: Record<string, string> = { A: "#60A5FA", B: "#34D399", C: "#F59E0B", D: "#F97316", E: "#EF4444", F: "#DC2626" };
const CAMPUS_COLOR: Record<string, string> = { Zaria: "#A78BFA", Lagos: "#34D399", Kano: "#F59E0B" };

const FALLBACK_COURSES = [
  { id: 1, code: "ENT-101", title: "Principles of Entrepreneurship" },
  { id: 2, code: "AI-201",  title: "AI Safety & Ethics" },
  { id: 3, code: "DIG-301", title: "Digital Innovation Lab" },
  { id: 4, code: "LAW-201", title: "Constitutional Law & Governance" },
  { id: 5, code: "HSM-301", title: "Health Systems Management" },
  { id: 6, code: "BAM-111", title: "Business Administration & Management" },
];

const TOOLTIP_STYLE = {
  backgroundColor: "rgba(8,18,50,0.97)",
  borderColor: "rgba(59,130,246,0.3)",
  color: "#F0F9FF",
  fontSize: 12,
  borderRadius: 8,
  border: "1px solid rgba(59,130,246,0.3)",
};

function getLetterGrade(score: number): string {
  if (score >= 70) return "A";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  if (score >= 45) return "D";
  if (score >= 40) return "E";
  return "F";
}

function computeGradeDist(courseIdx: number): Record<string, number> {
  const perf = FRIDAY_BRIEF_WEEK18.coursePerformance[courseIdx] ?? FRIDAY_BRIEF_WEEK18.coursePerformance[0]!;
  const dist: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
  const n = Math.min(perf.enrolled, MOCK_STUDENTS.length);
  for (let i = 0; i < n; i++) {
    const s = MOCK_STUDENTS[i]!;
    const raw = perf.avgScore + (s.gpa - 3.0) * 12 + ((i * 7 + courseIdx * 13) % 20) - 10;
    const score = Math.max(20, Math.min(100, Math.round(raw)));
    dist[getLetterGrade(score)]!++;
  }
  return dist;
}

function computeRankings(courseIdx: number) {
  const perf = FRIDAY_BRIEF_WEEK18.coursePerformance[courseIdx] ?? FRIDAY_BRIEF_WEEK18.coursePerformance[0]!;
  const n = Math.min(perf.enrolled, MOCK_STUDENTS.length);
  return MOCK_STUDENTS.slice(0, n)
    .map((s, i) => {
      const raw = perf.avgScore + (s.gpa - 3.0) * 12 + ((i * 7 + courseIdx * 13) % 20) - 10;
      const score = Math.max(20, Math.min(100, Math.round(raw)));
      return { ...s, score, grade: getLetterGrade(score) };
    })
    .sort((a, b) => b.score - a.score);
}

export default function LecturerAnalytics() {
  const { data: apiCourses } = useListCourses();
  const courses = (apiCourses && apiCourses.length > 0) ? apiCourses : FALLBACK_COURSES;
  const [selectedCourseIdx, setSelectedCourseIdx] = useState(0);

  const coursePerf = FRIDAY_BRIEF_WEEK18.coursePerformance[selectedCourseIdx] ?? FRIDAY_BRIEF_WEEK18.coursePerformance[0]!;
  const gradeDist = useMemo(() => computeGradeDist(selectedCourseIdx), [selectedCourseIdx]);
  const rankings = useMemo(() => computeRankings(selectedCourseIdx), [selectedCourseIdx]);

  const atRisk = rankings.filter(s => s.grade === "E" || s.grade === "F");
  const topPerformer = rankings[0];
  const passCount = rankings.filter(s => s.grade !== "F" && s.grade !== "E").length;
  const passRate = Math.round((passCount / rankings.length) * 100);

  const distData = ["A", "B", "C", "D", "E", "F"].map(g => ({
    grade: g, count: gradeDist[g] ?? 0, color: GRADE_COLORS[g]!,
  }));

  const pieData = distData.filter(d => d.count > 0).map(d => ({ name: d.grade, value: d.count, fill: d.color }));

  const kpis = [
    { label: "Class Average",   value: `${coursePerf.avgScore}`, sub: "out of 100", icon: BarChart2, color: BRAND.electric },
    { label: "Top Performer",   value: topPerformer?.name.split(" ")[0] ?? "—", sub: `${topPerformer?.score ?? 0}/100`, icon: Trophy, color: BRAND.gold },
    { label: "At-Risk Students",value: `${atRisk.length}`, sub: "E or F grade", icon: AlertTriangle, color: BRAND.red },
    { label: "Pass Rate",       value: `${passRate}%`, sub: "above E grade", icon: TrendingUp, color: BRAND.green },
  ];

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="space-y-7 pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-[0.22em] mb-1">
          <BarChart2 size={10} className="text-primary" /> Student Performance Analytics
        </div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Course Analytics</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">Sentinel-powered insights into student performance, grades, and risk detection.</p>
      </motion.div>

      {/* Course Selector */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex items-center gap-4">
        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">Viewing Course</label>
        <div className="relative flex-1 max-w-sm">
          <select value={selectedCourseIdx} onChange={e => setSelectedCourseIdx(Number(e.target.value))}
            className="w-full appearance-none text-sm font-semibold rounded-xl px-3 py-2.5 pr-8 border focus:outline-none focus:ring-1 focus:ring-primary/40"
            style={{ background: "rgba(4,10,36,0.88)", borderColor: "rgba(96,165,250,0.22)", color: "#F0F9FF" }}>
            {FRIDAY_BRIEF_WEEK18.coursePerformance.map((c, i) => (
              <option key={i} value={i}>{c.course}</option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
        <div className="text-xs text-muted-foreground">
          <span style={{ color: "#60A5FA" }}>{coursePerf.enrolled}</span> students enrolled
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.07 }}>
            <div className="rounded-xl border p-4 relative overflow-hidden"
              style={{ background: "rgba(4,10,36,0.88)", borderColor: `${kpi.color}25` }}>
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-[0.07] blur-2xl pointer-events-none"
                style={{ background: kpi.color, transform: "translate(30%,-30%)" }} />
              <kpi.icon size={16} style={{ color: kpi.color }} className="mb-2" />
              <div className="text-2xl font-black text-foreground truncate" style={{ textShadow: `0 0 20px ${kpi.color}50` }}>
                {kpi.value}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{kpi.sub}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{kpi.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grade Distribution Bar */}
        <div className="lg:col-span-2 rounded-xl border p-5 space-y-3"
          style={{ background: "rgba(4,10,36,0.88)", borderColor: "rgba(96,165,250,0.12)" }}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Grade Distribution</h3>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">A–F Scale</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={distData} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
              <XAxis dataKey="grade" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={false} tickLine={false} />
              <RechartsTooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={48}>
                {distData.map((d, i) => (
                  <Cell key={i} fill={d.color} opacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie */}
        <div className="rounded-xl border p-5 flex flex-col"
          style={{ background: "rgba(4,10,36,0.88)", borderColor: "rgba(96,165,250,0.12)" }}>
          <h3 className="text-sm font-bold text-foreground mb-3">Grade Breakdown</h3>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={46} outerRadius={70} paddingAngle={3} dataKey="value">
                  {pieData.map((d, i) => <Cell key={i} fill={d.fill} opacity={0.85} />)}
                </Pie>
                <RechartsTooltip contentStyle={TOOLTIP_STYLE} />
                <Legend formatter={(v) => <span style={{ color: "#94A3B8", fontSize: 11 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Rankings + At-Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Rankings */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground flex items-center gap-2">
            <Trophy size={10} style={{ color: BRAND.gold }} /> Student Rankings
          </h3>
          <div className="rounded-xl border overflow-hidden" style={{ background: "rgba(4,10,36,0.85)", borderColor: "rgba(96,165,250,0.10)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  {["Rank", "Student", "Campus", "Score", "Grade"].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rankings.slice(0, 15).map((student, i) => {
                  const campusColor = CAMPUS_COLOR[student.campus] ?? "#60A5FA";
                  const gc = GRADE_COLORS[student.grade]!;
                  return (
                    <motion.tr key={student.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                      className="border-b hover:bg-white/[0.02] transition-colors" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                      <td className="px-4 py-2.5 text-sm font-bold" style={{ color: i < 3 ? BRAND.gold : "rgba(148,163,184,0.5)" }}>
                        {medals[i] ?? `#${i + 1}`}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="font-semibold text-foreground text-sm">{student.name}</div>
                        <div className="text-[10px] font-mono text-muted-foreground">{student.id}</div>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${campusColor}18`, color: campusColor }}>
                          {student.campus}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="font-bold font-mono" style={{ color: gc }}>{student.score}</span>
                        <span className="text-muted-foreground text-xs">/100</span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-base font-black" style={{ color: gc, textShadow: `0 0 16px ${gc}60` }}>
                          {student.grade}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* At-Risk Alerts */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground flex items-center gap-2">
            <AlertTriangle size={10} style={{ color: BRAND.red }} /> At-Risk Students
          </h3>
          {atRisk.length === 0 ? (
            <div className="rounded-xl border p-6 text-center"
              style={{ background: "rgba(4,10,36,0.82)", borderColor: "rgba(52,211,153,0.2)" }}>
              <TrendingUp size={28} className="mx-auto mb-2" style={{ color: BRAND.green }} />
              <div className="text-sm font-semibold text-foreground">No At-Risk Students</div>
              <div className="text-xs text-muted-foreground mt-1">All students are passing this course.</div>
            </div>
          ) : (
            <div className="space-y-2">
              {atRisk.map((s, i) => {
                const campusColor = CAMPUS_COLOR[s.campus] ?? "#60A5FA";
                return (
                  <motion.div key={s.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                    className="rounded-xl border p-3.5" style={{ background: "rgba(248,113,113,0.06)", borderColor: "rgba(248,113,113,0.18)" }}>
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border shrink-0"
                        style={{ background: `${campusColor}15`, borderColor: `${campusColor}25`, color: campusColor }}>
                        {s.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-foreground truncate">{s.name}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{s.id}</div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                            style={{ background: "rgba(248,113,113,0.15)", color: BRAND.red }}>
                            Score: {s.score}
                          </span>
                          <span className="text-[10px] font-black text-lg leading-none" style={{ color: GRADE_COLORS[s.grade]! }}>{s.grade}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-1.5">
                          Sentinel recommends: Schedule remedial session
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Course Performance Snapshot */}
          <div className="rounded-xl border p-4 mt-2" style={{ background: "rgba(4,10,36,0.82)", borderColor: "rgba(96,165,250,0.12)" }}>
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Course Snapshot</div>
            <div className="space-y-2 text-xs">
              {[
                { label: "Enrolled", value: coursePerf.enrolled },
                { label: "Pass Rate", value: coursePerf.passRate },
                { label: "Avg Score", value: `${coursePerf.avgScore}/100` },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-bold text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
