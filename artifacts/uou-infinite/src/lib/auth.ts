export function getAuthToken() { return localStorage.getItem("uou_token"); }
export function setAuthToken(t: string) { localStorage.setItem("uou_token", t); }
export function clearAuthToken() { localStorage.removeItem("uou_token"); }

export interface GodModeUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export function getGodModeUser(): GodModeUser | null {
  try {
    const raw = localStorage.getItem("uou_godmode_user");
    return raw ? (JSON.parse(raw) as GodModeUser) : null;
  } catch {
    return null;
  }
}

export function setGodModeUser(user: GodModeUser) {
  localStorage.setItem("uou_godmode_user", JSON.stringify(user));
}

export function clearGodModeUser() {
  localStorage.removeItem("uou_godmode_user");
}
