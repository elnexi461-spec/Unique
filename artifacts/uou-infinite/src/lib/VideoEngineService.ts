const KEY = "UOU_VIDEO_API_KEY";

export const VideoEngineService = {
  getApiKey(): string | null {
    try { return localStorage.getItem(KEY); } catch { return null; }
  },
  setApiKey(key: string): void {
    try { localStorage.setItem(KEY, key.trim()); } catch {}
  },
  clearApiKey(): void {
    try { localStorage.removeItem(KEY); } catch {}
  },
  hasKey(): boolean {
    const k = this.getApiKey();
    return typeof k === "string" && k.length > 0;
  },
};
