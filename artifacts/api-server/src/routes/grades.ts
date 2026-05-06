import { Router } from "express";
import { db } from "@workspace/db";
import { grades } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

router.get("/grades", requireAuth, async (req, res) => {
  try {
    const allGrades = await db.select().from(grades);
    return res.json(allGrades);
  } catch (err) {
    req.log.error(err, "Failed to fetch grades");
    return res.status(500).json({ error: "Failed to fetch grades" });
  }
});

router.get("/grades/student/:studentId", requireAuth, async (req, res) => {
  try {
    const studentId = parseInt(req.params.studentId);
    const studentGrades = await db.select().from(grades).where(eq(grades.studentId, studentId));

    let totalPoints = 0;
    let totalCredits = 0;
    const gradeList = studentGrades.map(g => {
      const score = parseFloat(String(g.finalScore || "0"));
      let letter = "F";
      let points = 0.0;
      if (score >= 70) { letter = "A"; points = 5.0; }
      else if (score >= 60) { letter = "B"; points = 4.0; }
      else if (score >= 50) { letter = "C"; points = 3.0; }
      else if (score >= 45) { letter = "D"; points = 2.0; }
      else if (score >= 40) { letter = "E"; points = 1.0; }
      totalPoints += points * 3;
      totalCredits += 3;
      return { ...g, letter, points };
    });

    const cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";

    const avgAttendance = studentGrades.reduce((s, g) => s + parseFloat(String(g.attendancePct || "0")), 0) / (studentGrades.length || 1);
    const avgTest = studentGrades.reduce((s, g) => s + parseFloat(String(g.testScore || "0")), 0) / (studentGrades.length || 1);
    let insight = "Student shows balanced academic performance.";
    if (avgAttendance >= 90 && avgTest < 50) insight = "High punctuality but low test performance — recommend study support sessions.";
    else if (avgAttendance < 60 && avgTest >= 70) insight = "Excellent test scores despite low attendance — at risk of penalty due to absenteeism.";
    else if (avgAttendance >= 85 && avgTest >= 70) insight = "Outstanding all-round performance. Consistently engaged and high-achieving.";
    else if (avgAttendance < 60 && avgTest < 50) insight = "Critical alert: Low attendance and poor academic performance. Urgent intervention needed.";

    return res.json({ grades: gradeList, cgpa, insight });
  } catch (err) {
    req.log.error(err, "Failed to fetch student grades");
    return res.status(500).json({ error: "Failed to fetch student grades" });
  }
});

router.post("/grades", requireAuth, requireRole("lecturer", "coordinator", "founder"), async (req, res) => {
  try {
    const { studentId, courseId, testScore, examScore, assignmentScore, attendancePct, punctualityPct } = req.body;

    const finalScore = (
      parseFloat(testScore || 0) * 0.20 +
      parseFloat(examScore || 0) * 0.60 +
      parseFloat(assignmentScore || 0) * 0.10 +
      parseFloat(attendancePct || 0) * 0.10
    ).toFixed(2);

    let letterGrade = "F";
    let gradePoints = "0.0";
    const fs = parseFloat(finalScore);
    if (fs >= 70) { letterGrade = "A"; gradePoints = "5.0"; }
    else if (fs >= 60) { letterGrade = "B"; gradePoints = "4.0"; }
    else if (fs >= 50) { letterGrade = "C"; gradePoints = "3.0"; }
    else if (fs >= 45) { letterGrade = "D"; gradePoints = "2.0"; }
    else if (fs >= 40) { letterGrade = "E"; gradePoints = "1.0"; }

    const existing = await db.select().from(grades)
      .where(and(eq(grades.studentId, studentId), eq(grades.courseId, courseId)))
      .limit(1);

    let result;
    if (existing.length > 0) {
      result = await db.update(grades)
        .set({ testScore, examScore, assignmentScore, attendancePct, punctualityPct, finalScore, letterGrade, gradePoints, updatedAt: new Date() })
        .where(and(eq(grades.studentId, studentId), eq(grades.courseId, courseId)))
        .returning();
    } else {
      result = await db.insert(grades).values({
        studentId, courseId, testScore, examScore, assignmentScore, attendancePct, punctualityPct, finalScore, letterGrade, gradePoints
      }).returning();
    }

    return res.json(result[0]);
  } catch (err) {
    req.log.error(err, "Failed to save grade");
    return res.status(500).json({ error: "Failed to save grade" });
  }
});

export default router;
