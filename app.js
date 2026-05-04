const content = window.STOP_SMOKING_CONTENT ?? {};
const utils = window.STOP_SMOKING_UTILS;
const reportEngine = window.STOP_SMOKING_REPORT;
const ui = window.STOP_SMOKING_UI;

const dimensions = content.dimensions ?? {};
const knowledgeItems = content.knowledgeItems ?? [];
const protocolItems = content.protocolItems ?? [];
const quizBanks = content.quizBanks ?? { quick: [], standard: [], deep: [] };
const panicModule = content.panicModule ?? { levels: [] };

const quizForm = document.querySelector("#quizForm");
const reportPanel = document.querySelector("#reportPanel");
const streakForm = document.querySelector("#streakForm");
const decisionDateInput = document.querySelector("#decisionDate");
const streakReadout = document.querySelector("#streakReadout");
const todayButton = document.querySelector("#todayButton");
const knowledgeGrid = document.querySelector("#knowledgeGrid");
const protocolGrid = document.querySelector("#protocolGrid");
const panicModuleContainer = document.querySelector("#panicModule");
const modeButtons = document.querySelectorAll(".mode-btn");

const dailyForm = document.querySelector("#dailyForm");
const urgeLevel = document.querySelector("#urgeLevel");
const stressLevel = document.querySelector("#stressLevel");
const energyLevel = document.querySelector("#energyLevel");
const urgeLevelValue = document.querySelector("#urgeLevelValue");
const stressLevelValue = document.querySelector("#stressLevelValue");
const energyLevelValue = document.querySelector("#energyLevelValue");
const mainTrigger = document.querySelector("#mainTrigger");
const nextIntent = document.querySelector("#nextIntent");
const dailyStatus = document.querySelector("#dailyStatus");

const cravingForm = document.querySelector("#cravingForm");
const cravingTrigger = document.querySelector("#cravingTrigger");
const cravingIntensity = document.querySelector("#cravingIntensity");
const cravingAction = document.querySelector("#cravingAction");
const cravingOutcome = document.querySelector("#cravingOutcome");
const cravingStatus = document.querySelector("#cravingStatus");
const cravingList = document.querySelector("#cravingList");

let activeQuizMode = "quick";
const milestones = [1, 3, 7, 14, 30, 90];

function quizItemsForMode(mode) {
  return quizBanks[mode] ?? quizBanks.quick;
}

function streakViewModel(dateString) {
  if (!dateString || !utils.isValidDecisionDate(dateString)) return null;

  const days = utils.cleanDaysSince(dateString);
  const next = utils.nextMilestone(days, milestones);
  const previous = [...milestones].reverse().find((m) => m <= days) ?? 0;
  const progress = next <= days ? 100 : Math.round(((days - previous) / Math.max(1, next - previous)) * 100);

  return {
    days,
    daysLabel: days === 1 ? "zi curata" : "zile curate",
    dateString,
    level: utils.levelFor(days),
    next,
    progress
  };
}

function renderStreak(dateString) {
  ui.renderStreak(streakReadout, streakViewModel(dateString));
  const relapseButton = document.querySelector("#relapseButton");
  if (relapseButton) {
    relapseButton.addEventListener("click", () => {
      saveStreak(utils.todayISO());
    });
  }
}

function saveStreak(dateString) {
  if (!utils.isValidDecisionDate(dateString)) {
    renderStreak(dateString);
    return;
  }

  utils.writeJSON(utils.keys.STREAK_KEY, { decisionDate: dateString });
  decisionDateInput.value = dateString;
  renderStreak(dateString);
}

function wireKnowledgeToggles() {
  document.querySelectorAll(".toggle-deep").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(`#knowledgeDeep-${button.dataset.index}`);
      const isHidden = target.hasAttribute("hidden");
      if (isHidden) {
        target.removeAttribute("hidden");
        button.textContent = "Ascunde aprofundarea";
      } else {
        target.setAttribute("hidden", "");
        button.textContent = "Aprofundeaza";
      }
    });
  });
}

function wirePanicModule() {
  const output = document.querySelector("#panicOutput");
  const buttons = [...document.querySelectorAll(".panic-btn")];
  const levelButtons = buttons.filter((button) => button.dataset.panicLevel);
  const rescueButton = document.querySelector("#panicRescue");
  const resetButton = document.querySelector("#panicReset");
  if (!buttons.length || !output) return;

  const resetProgression = () => {
    levelButtons.forEach((button, index) => {
      button.disabled = index !== 0;
      button.classList.remove("pulse");
    });
    output.innerHTML = '<p class="empty-state">Alege Nivel 1 ca prim pas.</p>';
  };

  if (rescueButton) {
    rescueButton.addEventListener("click", () => {
      output.innerHTML = `<p><strong>1-click rescue</strong></p><p>${panicModule.rescueSuggestion}</p>`;
      const state = utils.getAppState();
      state.panic = {
        lastPanicLevel: "rescue",
        lastPanicAt: new Date().toISOString()
      };
      utils.saveAppState(state);
    });
  }

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      resetProgression();
      const state = utils.getAppState();
      state.panic = {
        lastPanicLevel: "reset",
        lastPanicAt: new Date().toISOString()
      };
      utils.saveAppState(state);
    });
  }

  levelButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      const level = panicModule.levels.find((item) => item.id === button.dataset.panicLevel);
      if (!level) return;

      output.innerHTML = `<p><strong>${level.label}</strong></p><p>${level.suggestion}</p>`;

      button.disabled = true;
      const next = levelButtons[index + 1];
      if (next) {
        next.disabled = false;
        next.classList.add("pulse");
        setTimeout(() => next.classList.remove("pulse"), 650);
      }

      const state = utils.getAppState();
      state.panic = {
        lastPanicLevel: level.id,
        lastPanicAt: new Date().toISOString()
      };
      utils.saveAppState(state);
    });
  });
}

function renderQuiz(mode = activeQuizMode) {
  activeQuizMode = mode;
  modeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });

  ui.renderQuiz(quizForm, quizItemsForMode(mode));

  quizForm.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      const fieldset = radio.closest("fieldset");
      fieldset.querySelectorAll(".answer-feedback").forEach((node) => node.setAttribute("hidden", ""));
      const match = [...fieldset.querySelectorAll('input[type="radio"]')].find((el) => el.checked);
      if (!match) return;
      const index = [...fieldset.querySelectorAll('input[type="radio"]')].indexOf(match);
      fieldset.querySelector(`#fb-${fieldset.querySelector('input[type="radio"]').name}-${index}`)?.removeAttribute("hidden");
    });
  });

  document.querySelector("#resetQuiz").addEventListener("click", () => {
    quizForm.reset();
    ui.renderReport(reportPanel, null);
  });
}

function renderReportFromState(state) {
  const model = reportEngine.buildReportModel(state, dimensions);
  ui.renderReport(reportPanel, model);
}

function bindRanges() {
  const bind = (input, output) => {
    const refresh = () => {
      output.textContent = input.value;
    };
    input.addEventListener("input", refresh);
    refresh();
  };
  bind(urgeLevel, urgeLevelValue);
  bind(stressLevel, stressLevelValue);
  bind(energyLevel, energyLevelValue);
}

function bootstrap() {
  ui.renderKnowledge(knowledgeGrid, knowledgeItems);
  ui.renderProtocols(protocolGrid, protocolItems);
  ui.renderPanicModule(panicModuleContainer, panicModule);
  wireKnowledgeToggles();
  wirePanicModule();
  renderQuiz("quick");
  bindRanges();
  decisionDateInput.max = utils.todayISO();

  const parsedStreak = utils.readJSON(utils.keys.STREAK_KEY);
  if (parsedStreak?.decisionDate && utils.isValidDecisionDate(parsedStreak.decisionDate)) {
    decisionDateInput.value = parsedStreak.decisionDate;
    renderStreak(parsedStreak.decisionDate);
  }

  const state = utils.getAppState();
  ui.renderCravings(cravingList, state.cravings);
  renderReportFromState(state);
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => renderQuiz(button.dataset.mode));
});

quizForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const result = utils.scoreQuiz(new FormData(quizForm), quizItemsForMode(activeQuizMode), dimensions, activeQuizMode);
  const state = utils.getAppState();
  state.quiz = result;
  const saved = utils.saveAppState(state);
  utils.saveLegacyReportCompat(result);
  renderReportFromState(saved);
  document.querySelector("#report").scrollIntoView({ behavior: "smooth", block: "start" });
});

streakForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveStreak(decisionDateInput.value);
});

todayButton.addEventListener("click", () => {
  saveStreak(utils.todayISO());
});

dailyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const state = utils.getAppState();
  state.dailyCheckins.push({
    date: utils.todayISO(),
    urge: Number(urgeLevel.value),
    stress: Number(stressLevel.value),
    energy: Number(energyLevel.value),
    trigger: mainTrigger.value,
    intent: nextIntent.value.trim()
  });
  if (state.dailyCheckins.length > 30) state.dailyCheckins = state.dailyCheckins.slice(-30);
  const saved = utils.saveAppState(state);
  dailyStatus.textContent = "Check-in salvat. Ai un punct clar pentru urmatoarele 12h.";
  renderReportFromState(saved);
});

cravingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const state = utils.getAppState();
  state.cravings.push({
    createdAt: new Date().toISOString(),
    trigger: cravingTrigger.value.trim(),
    intensity: Number(cravingIntensity.value),
    action: cravingAction.value,
    outcome: cravingOutcome.value.trim()
  });
  if (state.cravings.length > 50) state.cravings = state.cravings.slice(-50);
  const saved = utils.saveAppState(state);
  cravingStatus.textContent = "Craving adaugat. Foloseste-l ca date, nu ca verdict.";
  cravingForm.reset();
  ui.renderCravings(cravingList, saved.cravings);
  renderReportFromState(saved);
});

bootstrap();
