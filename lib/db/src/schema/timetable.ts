import { pgTable, serial, integer, varchar, timestamp, boolean } from "drizzle-orm/pg-core";

export const timetable = pgTable("timetable", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0=Sun,1=Mon,...6=Sat
  startTime: varchar("start_time", { length: 5 }).notNull(), // "09:00"
  endTime: varchar("end_time", { length: 5 }).notNull(),     // "11:00"
  hallLocation: varchar("hall_location", { length: 100 }),
  meetLink: varchar("meet_link", { length: 255 }),
  zoomLink: varchar("zoom_link", { length: 255 }),
  isOnline: boolean("is_online").default(false),
  semester: varchar("semester", { length: 20 }).default("2024/2025"),
  createdAt: timestamp("created_at").defaultNow(),
});
