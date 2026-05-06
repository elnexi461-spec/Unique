import { Router } from "express";
import { db } from "@workspace/db";
import { timetable, coursesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function isSessionActive(slot: { dayOfWeek: number; startTime: string; endTime: string }) {
  const now = new Date();
  if (now.getDay() !== slot.dayOfWeek) return false;
  const [sh, sm] = slot.startTime.split(":").map(Number);
  const [eh, em] = slot.endTime.split(":").map(Number);
  const nowMins = now.getHours() * 60 + now.getMinutes();
  return nowMins >= sh * 60 + sm && nowMins < eh * 60 + em;
}

router.get("/timetable", requireAuth, async (req, res) => {
  try {
    const slots = await db.select().from(timetable);
    const allCourses = await db.select().from(coursesTable);
    const courseMap = Object.fromEntries(allCourses.map(c => [c.id, c]));

    const result = slots.map(slot => ({
      ...slot,
      courseName: courseMap[slot.courseId]?.title || "Unknown",
      courseCode: courseMap[slot.courseId]?.code || "",
      dayName: DAYS[slot.dayOfWeek],
      isLive: isSessionActive(slot),
    }));

    return res.json(result);
  } catch (err) {
    req.log.error(err, "Failed to fetch timetable");
    return res.status(500).json({ error: "Failed to fetch timetable" });
  }
});

router.post("/timetable", requireAuth, requireRole("coordinator", "founder"), async (req, res) => {
  try {
    const { courseId, dayOfWeek, startTime, endTime, hallLocation, meetLink, zoomLink, isOnline, semester } = req.body;
    const result = await db.insert(timetable).values({
      courseId, dayOfWeek, startTime, endTime, hallLocation, meetLink, zoomLink,
      isOnline: isOnline ?? false, semester
    }).returning();
    return res.status(201).json(result[0]);
  } catch (err) {
    req.log.error(err, "Failed to create timetable slot");
    return res.status(500).json({ error: "Failed to create timetable slot" });
  }
});

router.put("/timetable/:id", requireAuth, requireRole("coordinator", "founder"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { courseId, dayOfWeek, startTime, endTime, hallLocation, meetLink, zoomLink, isOnline } = req.body;
    const result = await db.update(timetable)
      .set({ courseId, dayOfWeek, startTime, endTime, hallLocation, meetLink, zoomLink, isOnline })
      .where(eq(timetable.id, id))
      .returning();
    return res.json(result[0]);
  } catch (err) {
    req.log.error(err, "Failed to update timetable slot");
    return res.status(500).json({ error: "Failed to update timetable slot" });
  }
});

router.delete("/timetable/:id", requireAuth, requireRole("coordinator", "founder"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(timetable).where(eq(timetable.id, id));
    return res.json({ success: true });
  } catch (err) {
    req.log.error(err, "Failed to delete timetable slot");
    return res.status(500).json({ error: "Failed to delete timetable slot" });
  }
});

export default router;
