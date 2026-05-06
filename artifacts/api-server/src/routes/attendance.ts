import { Router } from "express";
import { db } from "@workspace/db";
import { attendance } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

router.get("/attendance/student/:studentId", requireAuth, async (req, res) => {
  try {
    const studentId = parseInt(req.params.studentId);
    const records = await db.select().from(attendance).where(eq(attendance.studentId, studentId));
    const total = records.length;
    const present = records.filter(r => r.isPresent).length;
    const punctual = records.filter(r => r.isPunctual).length;
    return res.json({
      records,
      summary: {
        total,
        present,
        absent: total - present,
        attendancePct: total > 0 ? ((present / total) * 100).toFixed(1) : "0",
        punctualityPct: present > 0 ? ((punctual / present) * 100).toFixed(1) : "0",
      }
    });
  } catch (err) {
    req.log.error(err, "Failed to fetch attendance");
    return res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

router.get("/attendance/course/:courseId", requireAuth, requireRole("lecturer", "coordinator", "founder"), async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const records = await db.select().from(attendance).where(eq(attendance.courseId, courseId));
    return res.json(records);
  } catch (err) {
    req.log.error(err, "Failed to fetch attendance");
    return res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

router.post("/attendance", requireAuth, requireRole("lecturer", "coordinator", "founder"), async (req, res) => {
  try {
    const { studentId, courseId, sessionDate, isPresent, isPunctual, notes } = req.body;
    const markedBy = req.user?.userId;

    const existing = await db.select().from(attendance)
      .where(and(
        eq(attendance.studentId, studentId),
        eq(attendance.courseId, courseId),
        eq(attendance.sessionDate, new Date(sessionDate))
      )).limit(1);

    let result;
    if (existing.length > 0) {
      result = await db.update(attendance)
        .set({ isPresent, isPunctual, notes })
        .where(eq(attendance.id, existing[0].id))
        .returning();
    } else {
      result = await db.insert(attendance).values({
        studentId, courseId,
        sessionDate: new Date(sessionDate),
        isPresent, isPunctual, markedBy, notes
      }).returning();
    }

    return res.json(result[0]);
  } catch (err) {
    req.log.error(err, "Failed to mark attendance");
    return res.status(500).json({ error: "Failed to mark attendance" });
  }
});

export default router;
