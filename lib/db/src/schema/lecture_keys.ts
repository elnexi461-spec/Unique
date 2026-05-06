import { pgTable, serial, integer, varchar, timestamp, boolean } from "drizzle-orm/pg-core";

export const lectureKeys = pgTable("lecture_keys", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  courseId: integer("course_id").notNull(),
  keyHash: varchar("key_hash", { length: 32 }).notNull().unique(),
  keyType: varchar("key_type", { length: 20 }).default("attendance"), // attendance | exam | test | assignment
  isClaimed: boolean("is_claimed").default(false),
  claimedAt: timestamp("claimed_at"),
  expiresAt: timestamp("expires_at").notNull(),
  timetableId: integer("timetable_id"),
  createdAt: timestamp("created_at").defaultNow(),
});
