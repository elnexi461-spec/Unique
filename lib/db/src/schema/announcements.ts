import { pgTable, serial, integer, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  authorId: integer("author_id").notNull(),
  authorName: varchar("author_name", { length: 100 }),
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body").notNull(),
  priority: varchar("priority", { length: 10 }).default("normal"), // normal | urgent | breaking
  targetRoles: varchar("target_roles", { length: 100 }).default("all"), // all | student | lecturer | coordinator
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});
