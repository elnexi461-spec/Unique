export function getAuthToken() { return localStorage.getItem('uou_token'); }
export function setAuthToken(t: string) { localStorage.setItem('uou_token', t); }
export function clearAuthToken() { localStorage.removeItem('uou_token'); }
