window.STOP_SMOKING_UTILS = (() => {
  const STORAGE_KEY = "smoke-free-return:v1";
  const STREAK_KEY = "smoke-free-return:streak:v1";
  const APP_STATE_KEY = "smoke-free-return:app-state:v2";

  function todayISO() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function parseDecisionDate(dateString) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString ?? "")) return null;
    const [year, month, day] = dateString.split("-").map(Number);
    const parsed = new Date(year, month - 1, day);
    const isRealDate =
      parsed.getFullYear() === year &&
      parsed.getMonth() === month - 1 &&
      parsed.getDate() === day;

    return isRealDate ? parsed : null;
  }

  function isValidDecisionDate(dateString) {
    return Boolean(parseDecisionDate(dateString)) && dateString <= todayISO();
  }

  function cleanDaysSince(dateString) {
    const start = parseDecisionDate(dateString);
    const today = parseDecisionDate(todayISO());
    return Math.max(0, Math.floor((today.getTime() - start.getTime()) / 86400000));
  }

  function readJSON(key) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch {
      localStorage.removeItem(key);
      return null;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  function getDefaultAppState() {
    return {
      version: 2,
      dailyCheckins: [],
      cravings: [],
      quiz: null,
      panic: {
        lastPanicLevel: null,
        lastPanicAt: null
      },
      updatedAt: new Date().toISOString()
    };
  }

  function migrateState(parsed) {
    if (!parsed) return getDefaultAppState();

    if (parsed.version === 2) {
      return {
        version: 2,
        dailyCheckins: Array.isArray(parsed.dailyCheckins) ? parsed.dailyCheckins : [],
        cravings: Array.isArray(parsed.cravings) ? parsed.cravings : [],
        quiz: parsed.quiz ?? null,
        panic: {
          lastPanicLevel: parsed.panic?.lastPanicLevel ?? null,
          lastPanicAt: parsed.panic?.lastPanicAt ?? null
        },
        updatedAt: parsed.updatedAt ?? new Date().toISOString()
      };
    }

    if (parsed.version === 1) {
      return {
        version: 2,
        dailyCheckins: Array.isArray(parsed.dailyCheckins) ? parsed.dailyCheckins : [],
        cravings: Array.isArray(parsed.cravings) ? parsed.cravings : [],
        quiz: parsed.quiz ?? null,
        panic: {
          lastPanicLevel: parsed.panic?.lastPanicLevel ?? null,
          lastPanicAt: parsed.panic?.lastPanicAt ?? null
        },
        updatedAt: new Date().toISOString()
      };
    }

    return getDefaultAppState();
  }

  function getAppState() {
    const parsed = readJSON(APP_STATE_KEY);
    return migrateState(parsed);
  }

  function saveAppState(nextState) {
    const state = {
      ...nextState,
      version: 2,
      updatedAt: new Date().toISOString()
    };
    writeJSON(APP_STATE_KEY, state);
    return state;
  }

  function levelFor(days) {
    if (days >= 90) return "Arhitect de libertate";
    if (days >= 30) return "Stabilitate reala";
    if (days >= 14) return "Ritmul se aseaza";
    if (days >= 7) return "Prima saptamana protejata";
    if (days >= 3) return "Revenire vizibila";
    if (days >= 1) return "Prima zi castigata";
    return "Decizia e activa";
  }

  function nextMilestone(days, milestones) {
    return milestones.find((m) => m > days) ?? milestones[milestones.length - 1];
  }

  function scoreQuiz(formData, quizItems, dimensions, mode) {
    const scores = Object.fromEntries(Object.keys(dimensions).map((key) => [key, 0]));
    const answers = {};

    quizItems.forEach((item) => {
      const value = formData.get(item.id);
      if (value && scores[value] !== undefined) scores[value] += 1;
      answers[item.id] = value;
    });

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

    return {
      mode,
      answers,
      scores,
      top: sorted[0]?.[0] ?? null,
      secondary: sorted[1]?.[0] ?? null,
      createdAt: new Date().toISOString()
    };
  }

  function saveLegacyReportCompat(result) {
    writeJSON(STORAGE_KEY, {
      scores: result.scores,
      topKey: "returnEnergy",
      createdAt: result.createdAt
    });
  }

  return {
    keys: {
      STORAGE_KEY,
      STREAK_KEY,
      APP_STATE_KEY
    },
    todayISO,
    parseDecisionDate,
    isValidDecisionDate,
    cleanDaysSince,
    readJSON,
    writeJSON,
    getAppState,
    saveAppState,
    levelFor,
    nextMilestone,
    scoreQuiz,
    saveLegacyReportCompat
  };
})();
