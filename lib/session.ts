const memorySession = new Map<string, string>();

export function getSessionValue(key: string): string | null {
  if (typeof window === 'undefined') {
    return memorySession.get(key) ?? null;
  }

  try {
    return window.sessionStorage.getItem(key) ?? memorySession.get(key) ?? null;
  } catch {
    return memorySession.get(key) ?? null;
  }
}

export function setSessionValue(key: string, value: string) {
  memorySession.set(key, value);

  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // Some Safari privacy/storage modes throw here. Keep the in-memory fallback.
  }
}

export function removeSessionValue(key: string) {
  memorySession.delete(key);

  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // Ignore storage failures; the in-memory copy is already cleared.
  }
}
