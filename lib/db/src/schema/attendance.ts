import { pgTable, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";

export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  courseId: integer("course_id").notNull(),
  sessionDate: timestamp("session_date").notNull(),
  isPresent: boolean("is_present").default(false),
  isPunctual: boolean("is_punctual").default(false),
  markedBy: integer("marked_by"),
  notes: varchar("notes", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});
