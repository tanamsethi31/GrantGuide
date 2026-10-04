// Small wrapper over localStorage. Private windows and blocked storage throw,
// so every read falls back and every write is best-effort.

export function readStore(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeStore(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable: the value still lives in React state for this visit.
  }
}
