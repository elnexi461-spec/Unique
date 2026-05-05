import { Router, type IRouter } from "express";
import { db, enrollmentsTable, studentsTable, coursesTable, usersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { CreateEnrollmentBody } from "@workspace/api-zod";

const router: IRouter = Router();

async function formatEnrollment(e: typeof enrollmentsTable.$inferSelect) {
  const [student] = await db
    .select({ student: studentsTable, user: usersTable })
    .from(studentsTable)
    .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
    .where(eq(studentsTable.id, e.studentId));
  const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, e.courseId));
  return {
    id: e.id,
    studentId: e.studentId,
    courseId: e.courseId,
    courseName: course?.title ?? "Unknown",
    studentName: student?.user?.name ?? "Unknown",
    grade: e.grade,
    enrolledAt: e.enrolledAt,
  };
}

router.get("/enrollments", requireAuth, async (req, res): Promise<void> => {
  const studentId = req.query["studentId"] ? parseInt(req.query["studentId"] as string, 10) : undefined;
  const courseId = req.query["courseId"] ? parseInt(req.query["courseId"] as string, 10) : undefined;

  let enrollments = await db.select().from(enrollmentsTable);
  if (studentId) enrollments = enrollments.filter((e) => e.studentId === studentId);
  if (courseId) enrollments = enrollments.filter((e) => e.courseId === courseId);

  const result = await Promise.all(enrollments.map(formatEnrollment));
  res.json(result);
});

router.post("/enrollments", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateEnrollmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [enrollment] = await db.insert(enrollmentsTable).values(parsed.data).returning();
  res.status(201).json(await formatEnrollment(enrollment!));
});

router.delete("/enrollments/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params["id"]) ? req.params["id"][0]! : req.params["id"]!, 10);
  await db.delete(enrollmentsTable).where(eq(enrollmentsTable.id, id));
  res.sendStatus(204);
});

export default router;
