import { Router, Request, Response } from "express";
import { db } from "@workspace/db";
import { announcements } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

const sseClients: Set<Response> = new Set();

router.get("/announcements/stream", requireAuth, (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  sseClients.add(res);
  const keepAlive = setInterval(() => res.write(": ping\n\n"), 15000);
  req.on("close", () => { clearInterval(keepAlive); sseClients.delete(res); });
});

function broadcastAnnouncement(data: Record<string, unknown>) {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) client.write(payload);
}

router.get("/announcements", requireAuth, async (req, res) => {
  try {
    const all = await db.select().from(announcements)
      .where(eq(announcements.isActive, true))
      .orderBy(desc(announcements.createdAt));
    return res.json(all);
  } catch (err) {
    req.log.error(err, "Failed to fetch announcements");
    return res.status(500).json({ error: "Failed to fetch announcements" });
  }
});

router.post("/announcements", requireAuth, requireRole("founder", "coordinator"), async (req, res) => {
  try {
    const { title, body, priority, targetRoles, expiresAt } = req.body;
    const user = req.user!;
    const result = await db.insert(announcements).values({
      authorId: user.userId,
      authorName: user.email,
      title,
      body,
      priority: priority || "normal",
      targetRoles: targetRoles || "all",
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    }).returning();

    broadcastAnnouncement({ type: "new_announcement", announcement: result[0] });
    return res.status(201).json(result[0]);
  } catch (err) {
    req.log.error(err, "Failed to create announcement");
    return res.status(500).json({ error: "Failed to create announcement" });
  }
});

router.delete("/announcements/:id", requireAuth, requireRole("founder", "coordinator"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.update(announcements).set({ isActive: false }).where(eq(announcements.id, id));
    return res.json({ success: true });
  } catch (err) {
    req.log.error(err, "Failed to delete announcement");
    return res.status(500).json({ error: "Failed to delete announcement" });
  }
});

export { broadcastAnnouncement };
export default router;
