import { Router, type IRouter } from "express";
import { db, studentsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const router: IRouter = Router();

router.get("/verify/:token", async (req, res): Promise<void> => {
  const token = Array.isArray(req.params["token"]) ? req.params["token"][0]! : req.params["token"]!;
  const [row] = await db
    .select({ student: studentsTable, user: usersTable })
    .from(studentsTable)
    .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
    .where(eq(studentsTable.credentialToken, token));

  if (!row) {
    res.status(404).json({ error: "Credential not found or invalid" });
    return;
  }

  const { student, user } = row;
  const blockchainHash = "0x" + crypto.createHash("sha256").update(token + student.studentId + user.email).digest("hex");

  res.json({
    valid: true,
    studentName: user.name,
    studentId: student.studentId,
    department: student.department,
    skills: student.skills,
    issuedAt: student.createdAt,
    verifiedAt: new Date(),
    blockchainHash,
  });
});

export default router;
