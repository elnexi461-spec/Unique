import { motion } from "framer-motion";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
} from "recharts";

interface SkillGraphProps {
  passedCourses?: number;
  totalCourses?: number;
  enrollments?: Array<{ courseName?: string; grade?: string | null }>;
}

function gradeToScore(grade: string | null | undefined): number {
  switch (grade) {
    case "A+": return 98;
    case "A":  return 92;
    case "B":  return 78;
    case "C":  return 65;
    case "D":  return 52;
    case "F":  return 20;
    default:   return 40;
  }
}

const DEFAULT_SKILLS = [
  { subject: "Analysis",     A: 55 },
  { subject: "Application",  A: 40 },
  { subject: "Retention",    A: 60 },
  { subject: "Integrity",    A: 70 },
  { subject: "Punctuality",  A: 50 },
  { subject: "Engagement",   A: 45 },
];

export function SkillGraph({ passedCourses = 0, totalCourses = 0, enrollments = [] }: SkillGraphProps) {
  const pct = totalCourses > 0 ? Math.round((passedCourses / totalCourses) * 100) : 0;

  /* Build radar data from enrollments or defaults */
  const skills =
    enrollments.length > 0
      ? enrollments.slice(0, 6).map((e, i) => ({
          subject: (e.courseName || `Course ${i + 1}`).split(" ").slice(0, 2).join(" "),
          A: gradeToScore(e.grade),
        }))
      : DEFAULT_SKILLS;

  const avgScore =
    skills.reduce((sum, s) => sum + s.A, 0) / skills.length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border p-5 space-y-4"
      style={{
        background: "rgba(8,16,48,0.7)",
        borderColor: "rgba(59,130,246,0.2)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-foreground text-sm">Neural Skill Graph</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Academic competency mapping · {passedCourses}/{totalCourses} courses passed
          </p>
        </div>
        {/* Circular score badge */}
        <div className="relative w-14 h-14 shrink-0">
          <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
            <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(59,130,246,0.15)" strokeWidth="4" />
            <motion.circle
              cx="28" cy="28" r="24"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 24}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 24 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 24 * (1 - pct / 100) }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ filter: "drop-shadow(0 0 4px rgba(59,130,246,0.6))" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-black text-foreground">{pct}%</span>
          </div>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={skills} margin={{ top: 4, right: 16, bottom: 4, left: 16 }}>
            <PolarGrid
              stroke="rgba(59,130,246,0.15)"
              gridType="polygon"
            />
            <PolarAngleAxis
              dataKey="subject"
              tick={{
                fill: "rgba(147,197,253,0.7)",
                fontSize: 10,
                fontWeight: 600,
              }}
            />
            <Radar
              name="Skills"
              dataKey="A"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.22}
              strokeWidth={1.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Average score bar */}
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span>Average Competency</span>
          <span className="font-mono font-bold" style={{ color: "#60A5FA" }}>
            {avgScore.toFixed(0)}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-border overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${avgScore}%` }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #1D4ED8, #3B82F6, #60A5FA)",
              boxShadow: "0 0 8px rgba(59,130,246,0.5)",
            }}
          />
        </div>
      </div>

      {/* Growth label */}
      <div
        className="rounded-lg p-2.5 text-center text-xs border"
        style={{
          background: "rgba(59,130,246,0.06)",
          borderColor: "rgba(59,130,246,0.15)",
          color: "rgba(147,197,253,0.8)",
        }}
      >
        {passedCourses === 0
          ? "Complete your first Gold Card assessment to grow this graph"
          : `Your value is increasing — ${passedCourses} skill node${passedCourses > 1 ? "s" : ""} unlocked`}
      </div>
    </motion.div>
  );
}
