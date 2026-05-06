import { pgTable, serial, integer, numeric, varchar, timestamp } from "drizzle-orm/pg-core";

export const grades = pgTable("grades", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  courseId: integer("course_id").notNull(),
  testScore: numeric("test_score", { precision: 5, scale: 2 }),
  examScore: numeric("exam_score", { precision: 5, scale: 2 }),
  assignmentScore: numeric("assignment_score", { precision: 5, scale: 2 }),
  attendancePct: numeric("attendance_pct", { precision: 5, scale: 2 }),
  punctualityPct: numeric("punctuality_pct", { precision: 5, scale: 2 }),
  finalScore: numeric("final_score", { precision: 5, scale: 2 }),
  letterGrade: varchar("letter_grade", { length: 2 }),
  gradePoints: numeric("grade_points", { precision: 3, scale: 2 }),
  aiInsight: varchar("ai_insight", { length: 500 }),
  recordedAt: timestamp("recorded_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
