export interface ActivityEntry {
  id: string;
  type:
    | "lecture_view"
    | "slide_view"
    | "video_progress"
    | "pdf_upload"
    | "quiz_complete"
    | "gold_card_mint"
    | "button_click"
    | "page_visit"
    | "login"
    | "logout";
  label: string;
  email: string;
  role: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

const STORAGE_KEY = "UOU_Activity_Log";
const MAX_ENTRIES = 500;

export const UserActivityService = {
  log(entry: Omit<ActivityEntry, "id" | "timestamp">): ActivityEntry | null {
    try {
      const existing: ActivityEntry[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );
      const newEntry: ActivityEntry = {
        ...entry,
        id: Math.random().toString(36).slice(2, 10),
        timestamp: new Date().toISOString(),
      };
      existing.unshift(newEntry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, MAX_ENTRIES)));
      return newEntry;
    } catch {
      return null;
    }
  },

  getAll(): ActivityEntry[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  },

  getForEmail(email: string): ActivityEntry[] {
    return this.getAll().filter((e) => e.email === email);
  },

  getSummaryByRole(): Record<string, number> {
    const entries = this.getAll();
    const summary: Record<string, number> = {};
    for (const e of entries) {
      summary[e.role] = (summary[e.role] || 0) + 1;
    }
    return summary;
  },

  getSummaryByType(): Record<string, number> {
    const entries = this.getAll();
    const summary: Record<string, number> = {};
    for (const e of entries) {
      summary[e.type] = (summary[e.type] || 0) + 1;
    }
    return summary;
  },

  saveLastSlide(courseId: string | number, slideIndex: number): void {
    try {
      localStorage.setItem(`uou_last_slide_${courseId}`, String(slideIndex));
    } catch {}
  },

  getLastSlide(courseId: string | number): number {
    try {
      const v = localStorage.getItem(`uou_last_slide_${courseId}`);
      return v !== null ? parseInt(v, 10) : 0;
    } catch {
      return 0;
    }
  },

  saveVideoTimestamp(courseId: string | number, ts: number): void {
    try {
      localStorage.setItem(`uou_video_ts_${courseId}`, String(ts));
    } catch {}
  },

  getVideoTimestamp(courseId: string | number): number {
    try {
      const v = localStorage.getItem(`uou_video_ts_${courseId}`);
      return v !== null ? parseFloat(v) : 0;
    } catch {
      return 0;
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  },
};
