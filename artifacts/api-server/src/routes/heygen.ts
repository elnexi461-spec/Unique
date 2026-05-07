import { Router, type IRouter } from "express";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
const HEYGEN_BASE = "https://api.heygen.com";

const AVATAR_ID = "Wayne_20240711";
const VOICE_ID = "1bd001e7e50f421d891986aad5158bc8";

router.post("/heygen/synthesize", requireAuth, async (req, res): Promise<void> => {
  if (!HEYGEN_API_KEY) {
    res.status(503).json({ error: "HeyGen integration not configured", offlineMode: true });
    return;
  }

  const { courseCode, text } = req.body as { courseCode?: string; text?: string };
  if (!text) {
    res.status(400).json({ error: "text is required" });
    return;
  }

  const inputText = text.trim().split(/\s+/).slice(0, 200).join(" ");

  try {
    const response = await fetch(`${HEYGEN_BASE}/v2/video/generate`, {
      method: "POST",
      headers: {
        "X-Api-Key": HEYGEN_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        video_inputs: [
          {
            character: {
              type: "avatar",
              avatar_id: AVATAR_ID,
              avatar_style: "normal",
            },
            voice: {
              type: "text",
              input_text: inputText,
              voice_id: VOICE_ID,
              speed: 0.9,
            },
            background: {
              type: "color",
              value: "#040b1a",
            },
          },
        ],
        dimension: { width: 1280, height: 720 },
        aspect_ratio: "16:9",
        caption: true,
      }),
    });

    const data = (await response.json()) as {
      data?: { video_id: string };
      error?: string | null;
    };

    if (!response.ok || !data.data?.video_id) {
      req.log.error({ data, status: response.status }, "HeyGen API error");
      res
        .status(502)
        .json({ error: "HeyGen generation failed", offlineMode: true, detail: data.error });
      return;
    }

    res.json({ videoId: data.data.video_id, courseCode });
  } catch (err) {
    req.log.error({ err }, "HeyGen synthesize fetch error");
    res.status(500).json({ error: "Synthesis request failed", offlineMode: true });
  }
});

router.get("/heygen/status/:videoId", requireAuth, async (req, res): Promise<void> => {
  if (!HEYGEN_API_KEY) {
    res.status(503).json({ status: "failed", offlineMode: true });
    return;
  }

  const { videoId } = req.params as { videoId: string };

  try {
    const response = await fetch(
      `${HEYGEN_BASE}/v1/video_status.get?video_id=${encodeURIComponent(videoId)}`,
      { headers: { "X-Api-Key": HEYGEN_API_KEY } },
    );

    const data = (await response.json()) as {
      data?: {
        video_id: string;
        status: string;
        video_url?: string;
        thumbnail_url?: string;
      };
    };

    if (!response.ok || !data.data) {
      res.status(502).json({ status: "failed" });
      return;
    }

    const { status, video_url, thumbnail_url } = data.data;

    res.json({
      status:
        status === "completed"
          ? "completed"
          : status === "failed" || status === "error"
            ? "failed"
            : "pending",
      videoUrl: video_url ?? null,
      thumbnailUrl: thumbnail_url ?? null,
    });
  } catch (err) {
    req.log.error({ err }, "HeyGen status fetch error");
    res.status(500).json({ status: "failed" });
  }
});

export default router;
