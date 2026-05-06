import { Router, type IRouter } from "express";
import { db, logEntriesTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import { openaiAvailable, requireOpenAI } from "@workspace/integrations-openai-ai-server";
import { desc, lte } from "drizzle-orm";
import os from "os";

const router: IRouter = Router();

router.get("/admin/health", requireAuth, async (req, res): Promise<void> => {
  const logs = await db
    .select()
    .from(logEntriesTable)
    .orderBy(desc(logEntriesTable.createdAt))
    .limit(50);

  const errorLogs = logs.filter((l) => l.level === "error");
  const warnLogs = logs.filter((l) => l.level === "warn");

  let aiDiagnosis = "System operating normally. No critical issues detected.";
  let suggestions: string[] = ["Continue monitoring system logs", "Review error patterns periodically"];

  if (errorLogs.length > 0) {
    try {
      const logSummary = errorLogs.slice(0, 10).map((l) => `[${l.level.toUpperCase()}] ${l.message}`).join("\n");
      const completion = await requireOpenAI().chat.completions.create({
        model: "gpt-5.4",
        max_completion_tokens: 512,
        messages: [
          {
            role: "user",
            content: `You are a system diagnostics AI for UOU Infinite university platform. Analyze these recent error logs and provide a brief diagnosis and one-click fix suggestions.\n\nLogs:\n${logSummary}\n\nReturn JSON: {"diagnosis": "...", "suggestions": ["fix1", "fix2", "fix3"]}`,
          },
        ],
      });
      const content = completion.choices[0]?.message?.content ?? "{}";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        aiDiagnosis = parsed.diagnosis ?? aiDiagnosis;
        suggestions = parsed.suggestions ?? suggestions;
      }
    } catch {
      aiDiagnosis = `Detected ${errorLogs.length} error(s). Manual review recommended.`;
    }
  }

  const memUsage = process.memoryUsage();
  const totalMem = os.totalmem();
  const usedMem = memUsage.heapUsed;

  res.json({
    status: errorLogs.length > 5 ? "degraded" : "healthy",
    uptime: process.uptime(),
    memoryUsage: Math.round((usedMem / totalMem) * 100),
    errorCount: errorLogs.length,
    warningCount: warnLogs.length,
    aiDiagnosis,
    suggestions,
    lastChecked: new Date(),
  });
});

router.get("/admin/logs", requireAuth, async (req, res): Promise<void> => {
  const level = req.query["level"] as string | undefined;
  const limit = parseInt((req.query["limit"] as string) ?? "50", 10);

  const logs = await db
    .select()
    .from(logEntriesTable)
    .orderBy(desc(logEntriesTable.createdAt))
    .limit(Math.min(limit, 200));

  const filtered = level ? logs.filter((l) => l.level === level) : logs;
  res.json(filtered);
});

export default router;
