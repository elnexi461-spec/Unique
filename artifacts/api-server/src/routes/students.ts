import { Router, type IRouter } from "express";
import { db, studentsTable, usersTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import crypto from "crypto";

const router: IRouter = Router();

function formatStudent(s: typeof studentsTable.$inferSelect, u?: typeof usersTable.$inferSelect) {
  return {
    id: s.id,
    userId: s.userId,
    name: u?.name ?? "",
    email: u?.email ?? "",
    studentId: s.studentId,
    department: s.department,
    level: s.level,
    status: s.status,
    gpa: s.gpa,
    lastLoginAt: s.lastLoginAt,
    loginCount: s.loginCount,
    credentialToken: s.credentialToken,
    skills: s.skills,
    createdAt: s.createdAt,
  };
}

router.get("/students", requireAuth, async (req, res): Promise<void> => {
  const students = await db
    .select({
      student: studentsTable,
      user: usersTable,
    })
    .from(studentsTable)
    .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id));
  res.json(students.map(({ student, user }) => formatStudent(student, user)));
});

router.get("/students/at-risk", requireAuth, async (req, res): Promise<void> => {
  const students = await db
    .select({ student: studentsTable, user: usersTable })
    .from(studentsTable)
    .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id));

  const atRisk = students
    .map(({ student, user }) => {
      let riskScore = 0;
      let riskReason = "Low activity";
      if (student.loginCount < 5) riskScore += 40;
      if (student.gpa !== null && student.gpa < 2.0) riskScore += 30;
      if (!student.lastLoginAt) riskScore += 30;
      else {
        const daysSinceLogin = Math.floor((Date.now() - student.lastLoginAt.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceLogin > 14) riskScore += 25;
        if (daysSinceLogin > 30) riskScore += 15;
      }
      if (riskScore >= 35) {
        if (student.loginCount < 3) riskReason = "Very low platform engagement";
        else if (student.gpa !== null && student.gpa < 2.0) riskReason = "GPA below threshold";
        else riskReason = "Infrequent logins detected";
      }
      return {
        id: student.id,
        name: user.name,
        studentId: student.studentId,
        department: student.department,
        riskScore: Math.min(100, riskScore),
        riskReason,
        lastLoginAt: student.lastLoginAt,
        loginCount: student.loginCount,
      };
    })
    .filter((s) => s.riskScore >= 35)
    .sort((a, b) => b.riskScore - a.riskScore);

  res.json(atRisk);
});

router.get("/students/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params["id"]) ? req.params["id"][0]! : req.params["id"]!, 10);
  const [row] = await db
    .select({ student: studentsTable, user: usersTable })
    .from(studentsTable)
    .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
    .where(eq(studentsTable.id, id));
  if (!row) {
    res.status(404).json({ error: "Student not found" });
    return;
  }
  res.json(formatStudent(row.student, row.user));
});

router.patch("/students/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params["id"]) ? req.params["id"][0]! : req.params["id"]!, 10);
  const { department, level, status, skills } = req.body as {
    department?: string;
    level?: string;
    status?: string;
    skills?: string;
  };
  const [student] = await db
    .update(studentsTable)
    .set({
      ...(department && { department }),
      ...(level && { level }),
      ...(status && { status }),
      ...(skills !== undefined && { skills }),
    })
    .where(eq(studentsTable.id, id))
    .returning();
  if (!student) {
    res.status(404).json({ error: "Student not found" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, student.userId));
  res.json(formatStudent(student, user));
});

router.get("/students/:id/credential", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params["id"]) ? req.params["id"][0]! : req.params["id"]!, 10);
  const [row] = await db
    .select({ student: studentsTable, user: usersTable })
    .from(studentsTable)
    .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
    .where(eq(studentsTable.id, id));
  if (!row) {
    res.status(404).json({ error: "Student not found" });
    return;
  }
  const { student, user } = row;
  const qrData = JSON.stringify({
    token: student.credentialToken,
    studentId: student.studentId,
    name: user.name,
    institution: "Unique Open University",
  });
  res.json({
    studentId: student.studentId,
    name: user.name,
    department: student.department,
    skills: student.skills,
    credentialToken: student.credentialToken,
    issuedAt: student.createdAt,
    qrData,
  });
});

export default router;
