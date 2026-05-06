import { Router } from "express";
import type { Response as ExpressResponse } from "express";
import { db } from "@workspace/db";
import { lectureKeys, logEntriesTable } from "@workspace/db/schema";
import { lt, eq } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/auth";
import cron from "node-cron";
import crypto from "crypto";
import { logger } from "../lib/logger";

const router = Router();
const liveFeedClients: Set<ExpressResponse> = new Set();

export function broadcastLiveFeed(event: Record<string, unknown>) {
  const data = `data: ${JSON.stringify(event)}\n\n`;
  for (const client of liveFeedClients) client.write(data);
}

router.get("/system/live-feed", requireAuth, requireRole("founder", "coordinator"), (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();
  liveFeedClients.add(res);
  const ka = setInterval(() => res.write(": ping\n\n"), 15000);
  req.on("close", () => { clearInterval(ka); liveFeedClients.delete(res); });
});

router.post("/system/generate-key", requireAuth, async (req, res) => {
  try {
    const { courseId, keyType } = req.body;
    const user = req.user!;
    const keyHash = crypto.randomBytes(8).toString("hex").toUpperCase();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.insert(lectureKeys).values({
      studentId: user.userId,
      courseId: parseInt(courseId),
      keyHash,
      keyType: keyType || "attendance",
      isClaimed: false,
      expiresAt,
    });

    return res.json({ key: keyHash, expiresAt });
  } catch (err) {
    req.log.error(err, "Failed to generate key");
    return res.status(500).json({ error: "Failed to generate key" });
  }
});

router.post("/system/claim-key", requireAuth, async (req, res) => {
  try {
    const { key } = req.body;
    const user = req.user!;

    const found = await db.select().from(lectureKeys)
      .where(eq(lectureKeys.keyHash, key.toUpperCase()))
      .limit(1);

    if (!found.length) return res.status(404).json({ error: "Key not found" });
    const record = found[0];
    if (record.isClaimed) return res.status(400).json({ error: "Key already claimed" });
    if (new Date() > record.expiresAt) return res.status(400).json({ error: "Key has expired" });

    await db.update(lectureKeys)
      .set({ isClaimed: true, claimedAt: new Date() })
      .where(eq(lectureKeys.id, record.id));

    broadcastLiveFeed({
      type: "key_claimed",
      studentName: user.email,
      courseId: record.courseId,
      keyType: record.keyType,
      claimedAt: new Date().toISOString(),
    });

    return res.json({ success: true, message: `${record.keyType} attendance recorded.` });
  } catch (err) {
    req.log.error(err, "Failed to claim key");
    return res.status(500).json({ error: "Failed to claim key" });
  }
});

router.post("/system/red-switch", requireAuth, requireRole("founder"), async (req, res) => {
  try {
    const pruned = await db.delete(lectureKeys)
      .where(lt(lectureKeys.expiresAt, new Date()))
      .returning();

    await db.insert(logEntriesTable).values({
      type: "system",
      actorId: req.user!.userId,
      actorName: req.user!.email,
      message: `MANUAL OVERDRIVE: Founder triggered Hard System Refresh. Cleared ${pruned.length} expired keys.`,
      metadata: JSON.stringify({ prunedKeys: pruned.length, timestamp: new Date().toISOString() }),
    });

    logger.info({ prunedKeys: pruned.length }, "Red Switch activated by Founder");

    broadcastLiveFeed({
      type: "system_refresh",
      message: "Hard System Refresh triggered by Founder",
      prunedKeys: pruned.length,
      timestamp: new Date().toISOString(),
    });

    return res.json({
      success: true,
      message: "Hard System Refresh complete.",
      prunedKeys: pruned.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    req.log.error(err, "Red switch failed");
    return res.status(500).json({ error: "System refresh failed" });
  }
});

router.get("/system/health-scan", requireAuth, requireRole("founder", "coordinator"), async (req, res) => {
  try {
    const now = new Date();
    const expiredKeys = await db.select().from(lectureKeys).where(lt(lectureKeys.expiresAt, now));
    return res.json({
      timestamp: now.toISOString(),
      expiredKeys: expiredKeys.length,
      status: "healthy",
      uptime: process.uptime(),
      memoryMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    });
  } catch (err) {
    req.log.error(err, "Health scan failed");
    return res.status(500).json({ error: "Health scan failed" });
  }
});

// Midnight Sentinel
cron.schedule("0 0 * * *", async () => {
  logger.info("Midnight Sentinel: System Health Scan starting...");
  try {
    const pruned = await db.delete(lectureKeys)
      .where(lt(lectureKeys.expiresAt, new Date()))
      .returning();

    await db.insert(logEntriesTable).values({
      type: "system",
      actorId: 0,
      actorName: "Midnight Sentinel",
      message: `Auto-Heal complete: pruned ${pruned.length} expired keys. System state re-initialized.`,
      metadata: JSON.stringify({ pruned: pruned.length, run: new Date().toISOString() }),
    });

    broadcastLiveFeed({
      type: "midnight_scan",
      message: `Midnight Sentinel: pruned ${pruned.length} expired keys.`,
      timestamp: new Date().toISOString(),
    });

    logger.info({ pruned: pruned.length }, "Midnight Sentinel: complete");
  } catch (err) {
    logger.error(err, "Midnight Sentinel failed");
  }
});

export default router;
