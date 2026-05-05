import { Router, type IRouter } from "express";
import { db, lecturersTable, usersTable, coursesTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { CreateLecturerBody } from "@workspace/api-zod";

const router: IRouter = Router();

async function formatLecturer(l: typeof lecturersTable.$inferSelect) {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, l.userId));
  const [courseCountResult] = await db
    .select({ count: count() })
    .from(coursesTable)
    .where(eq(coursesTable.lecturerId, l.id));
  return {
    id: l.id,
    userId: l.userId,
    name: user?.name ?? "",
    email: user?.email ?? "",
    department: l.department,
    specialization: l.specialization,
    courseCount: courseCountResult?.count ?? 0,
    createdAt: l.createdAt,
  };
}

router.get("/lecturers", requireAuth, async (_req, res): Promise<void> => {
  const lecturers = await db.select().from(lecturersTable);
  const formatted = await Promise.all(lecturers.map(formatLecturer));
  res.json(formatted);
});

router.post("/lecturers", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateLecturerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [lecturer] = await db.insert(lecturersTable).values(parsed.data).returning();
  res.status(201).json(await formatLecturer(lecturer!));
});

router.get("/lecturers/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params["id"]) ? req.params["id"][0]! : req.params["id"]!, 10);
  const [lecturer] = await db.select().from(lecturersTable).where(eq(lecturersTable.id, id));
  if (!lecturer) {
    res.status(404).json({ error: "Lecturer not found" });
    return;
  }
  res.json(await formatLecturer(lecturer));
});

router.patch("/lecturers/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params["id"]) ? req.params["id"][0]! : req.params["id"]!, 10);
  const { department, specialization } = req.body as { department?: string; specialization?: string };
  const [lecturer] = await db
    .update(lecturersTable)
    .set({ ...(department && { department }), ...(specialization && { specialization }) })
    .where(eq(lecturersTable.id, id))
    .returning();
  if (!lecturer) {
    res.status(404).json({ error: "Lecturer not found" });
    return;
  }
  res.json(await formatLecturer(lecturer));
});

export default router;
