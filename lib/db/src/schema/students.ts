import { pgTable, serial, integer, varchar, real, timestamp, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const studentsTable = pgTable("students", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  studentId: varchar("student_id", { length: 50 }).notNull().unique(),
  department: varchar("department", { length: 255 }).notNull(),
  level: varchar("level", { length: 50 }).notNull().default("100"),
  status: varchar("status", { length: 50 }).notNull().default("active"),
  gpa: real("gpa"),
  lastLoginAt: timestamp("last_login_at"),
  loginCount: integer("login_count").notNull().default(0),
  credentialToken: text("credential_token").notNull(),
  skills: text("skills").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStudentSchema = createInsertSchema(studentsTable).omit({ id: true, createdAt: true });
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof studentsTable.$inferSelect;
