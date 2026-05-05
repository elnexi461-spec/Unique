import { Router, type IRouter } from "express";
import { db, coursesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { CreateCourseBody, UpdateCourseBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/courses", requireAuth, async (_req, res): Promise<void> => {
  const courses = await db.select().from(coursesTable);
  res.json(courses);
});

router.post("/courses", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateCourseBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [course] = await db.insert(coursesTable).values(parsed.data).returning();
  res.status(201).json(course);
});

router.get("/courses/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params["id"]) ? req.params["id"][0]! : req.params["id"]!, 10);
  const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, id));
  if (!course) {
    res.status(404).json({ error: "Course not found" });
    return;
  }
  res.json(course);
});

router.patch("/courses/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params["id"]) ? req.params["id"][0]! : req.params["id"]!, 10);
  const parsed = UpdateCourseBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [course] = await db
    .update(coursesTable)
    .set(parsed.data)
    .where(eq(coursesTable.id, id))
    .returning();
  if (!course) {
    res.status(404).json({ error: "Course not found" });
    return;
  }
  res.json(course);
});

router.delete("/courses/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params["id"]) ? req.params["id"][0]! : req.params["id"]!, 10);
  await db.delete(coursesTable).where(eq(coursesTable.id, id));
  res.sendStatus(204);
});

export default router;
