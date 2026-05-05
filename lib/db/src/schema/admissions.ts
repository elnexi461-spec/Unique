import { pgTable, serial, integer, varchar, text, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { coursesTable } from "./courses";

export const admissionsTable = pgTable("admissions", {
  id: serial("id").primaryKey(),
  applicantName: varchar("applicant_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  courseId: integer("course_id").notNull().references(() => coursesTable.id),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  matchPercentage: real("match_percentage"),
  waecResults: text("waec_results"),
  jambScore: integer("jamb_score"),
  analysisResult: text("analysis_result"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertAdmissionSchema = createInsertSchema(admissionsTable).omit({ id: true, submittedAt: true });
export type InsertAdmission = z.infer<typeof insertAdmissionSchema>;
export type Admission = typeof admissionsTable.$inferSelect;
