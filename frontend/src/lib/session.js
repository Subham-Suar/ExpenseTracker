export const SESSION_STORAGE_KEY = "expense-tracker-session";

export function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);

    if (!raw) {
      return { token: null, user: null };
    }

    const parsed = JSON.parse(raw);

    return {
      token: parsed?.token || null,
      user: parsed?.user || null,
    };
  } catch {
    return { token: null, user: null };
  }
}

export function saveSession(session) {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}
