import { pgTable, serial, integer, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { lecturersTable } from "./lecturers";

export const coursesTable = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  department: varchar("department", { length: 255 }).notNull(),
  description: text("description"),
  credits: integer("credits").notNull().default(3),
  capacity: integer("capacity").notNull().default(100),
  lecturerId: integer("lecturer_id").references(() => lecturersTable.id),
  requiredSubjects: text("required_subjects").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCourseSchema = createInsertSchema(coursesTable).omit({ id: true, createdAt: true });
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof coursesTable.$inferSelect;
