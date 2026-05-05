import { pgTable, serial, integer, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const lecturersTable = pgTable("lecturers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  department: varchar("department", { length: 255 }).notNull(),
  specialization: varchar("specialization", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLecturerSchema = createInsertSchema(lecturersTable).omit({ id: true, createdAt: true });
export type InsertLecturer = z.infer<typeof insertLecturerSchema>;
export type Lecturer = typeof lecturersTable.$inferSelect;
