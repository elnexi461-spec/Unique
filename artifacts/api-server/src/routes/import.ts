import { Router, Request } from "express";
import { db } from "@workspace/db";
import { studentsTable, usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/auth";
import multer from "multer";
import Papa from "papaparse";
import crypto from "crypto";
import fs from "fs";

const router = Router();
const upload = multer({ dest: "/tmp/uou-uploads/" });

function hashPassword(pw: string) {
  return crypto.createHash("sha256").update(pw + "uou_salt").digest("hex");
}

router.post(
  "/import/students",
  requireAuth,
  requireRole("founder", "coordinator"),
  upload.single("file"),
  async (req: Request, res) => {
    try {
      let rows: Record<string, string>[] = [];

      if (req.file) {
        const content = fs.readFileSync(req.file.path, "utf-8");
        const parsed = Papa.parse<Record<string, string>>(content, { header: true, skipEmptyLines: true });
        rows = parsed.data;
        fs.unlinkSync(req.file.path);
      } else if (req.body.json) {
        rows = JSON.parse(req.body.json);
      } else if (req.body.url) {
        const resp = await fetch(req.body.url);
        const text = await resp.text();
        const parsed = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true });
        rows = parsed.data;
      } else {
        return res.status(400).json({ error: "Provide file, json, or url" });
      }

      const imported: string[] = [];
      const errors: string[] = [];

      for (const row of rows) {
        try {
          const email = row.email || row.Email;
          const name = row.name || row.Name || row.fullName;
          const department = row.department || row.Department || "General";
          const level = row.level || row.Level || "100";
          if (!email || !name) { errors.push("Skipped: missing name/email"); continue; }

          const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
          let userId: number;
          if (existing.length > 0) {
            userId = existing[0].id;
          } else {
            const userResult = await db.insert(usersTable).values({
              email,
              name,
              role: "student",
              passwordHash: hashPassword("password123"),
            }).returning();
            userId = userResult[0].id;
          }

          const studentId = `UOU/${new Date().getFullYear()}/${department.toUpperCase().slice(0, 3)}/${String(userId).padStart(3, "0")}`;
          await db.insert(studentsTable).values({
            userId,
            studentId,
            department,
            level: parseInt(level) || 100,
            gpa: parseFloat(row.gpa || "0"),
          }).onConflictDoNothing();

          imported.push(email);
        } catch {
          errors.push(`Failed row: ${JSON.stringify(row)}`);
        }
      }

      return res.json({ success: true, imported: imported.length, errors: errors.length, details: errors.slice(0, 10) });
    } catch (err) {
      req.log.error(err, "Import failed");
      return res.status(500).json({ error: "Import failed" });
    }
  }
);

router.get("/import/template", requireAuth, requireRole("founder", "coordinator"), (req, res) => {
  const csv = "name,email,department,level,gpa\nJohn Doe,john@example.com,Computer Science,100,0\n";
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=uou-student-template.csv");
  return res.send(csv);
});

export default router;
