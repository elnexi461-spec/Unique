import { Router, type IRouter } from "express";
import { db, usersTable, studentsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const router: IRouter = Router();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "uou_salt").digest("hex");
}

function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let pass = "UOU-";
  for (let i = 0; i < 8; i++) {
    pass += chars[Math.floor(Math.random() * chars.length)];
  }
  return pass;
}

function generateAccessKey(): string {
  return crypto.randomBytes(16).toString("hex").toUpperCase();
}

function randHex(n: number): string {
  return crypto.randomBytes(Math.ceil(n / 2)).toString("hex").slice(0, n).toUpperCase();
}

router.post("/provision/user", async (req, res): Promise<void> => {
  try {
    const { name, email, role, campus } = req.body as {
      name: string;
      email: string;
      role: string;
      campus: string;
    };

    if (!name || !email || !role || !campus) {
      res.status(400).json({ error: "All fields required: name, email, role, campus" });
      return;
    }

    const validRoles = ["student", "coordinator", "lecturer", "founder"];
    if (!validRoles.includes(role)) {
      res.status(400).json({ error: "Invalid role. Must be: student, coordinator, lecturer, or founder" });
      return;
    }

    const validCampuses = ["Zaria", "Lagos", "Kano"];
    if (!validCampuses.includes(campus)) {
      res.status(400).json({ error: "Invalid campus. Must be: Zaria, Lagos, or Kano" });
      return;
    }

    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (existing) {
      res.status(409).json({ error: "Email already registered in the system" });
      return;
    }

    const tempPassword = generateTempPassword();
    const accessKey    = generateAccessKey();

    const [user] = await db.insert(usersTable).values({
      name,
      email,
      passwordHash: hashPassword(tempPassword),
      role,
    }).returning();

    if (!user) {
      res.status(500).json({ error: "Failed to create user record" });
      return;
    }

    if (role === "student") {
      const campusCode = campus.slice(0, 2).toUpperCase();
      const stuId      = `UOU-${campusCode}-${String(user.id).padStart(4, "0")}`;
      const credToken  = `UOU-${randHex(6)}-${randHex(6)}-${randHex(6)}`;
      await db.insert(studentsTable).values({
        userId:           user.id,
        studentId:        stuId,
        department:       "General Studies",
        level:            "100",
        status:           "active",
        gpa:              0,
        loginCount:       0,
        credentialToken:  credToken,
        skills:           "",
        lastLoginAt:      new Date(),
      });
    }

    res.json({
      success:      true,
      user:         { id: user.id, name, email, role, campus },
      tempPassword,
      accessKey,
    });
  } catch (err) {
    console.error("Provision error:", err);
    res.status(500).json({ error: "Provisioning failed", detail: String(err) });
  }
});

export default router;
