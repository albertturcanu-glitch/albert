const STORAGE_KEY = "psp:v1:quiz";

export function loadQuizState() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveQuizState(state) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearQuizState() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function createInitialQuizState() {
  return {
    version: 1,
    startedAt: new Date().toISOString(),
    completedAt: null,
    answers: {},
  };
}
