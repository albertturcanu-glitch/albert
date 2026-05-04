window.STOP_SMOKING_UI = (() => {
  function renderStreak(container, model) {
    if (!model) {
      container.innerHTML = '<p class="empty-state">Seteaza o data valida, nu mai tarziu de azi.</p>';
      return;
    }

    container.innerHTML = `
      <div>
        <div class="streak-number">${model.days}</div>
        <p class="streak-meta">${model.daysLabel} de la ${model.dateString}</p>
      </div>
      <div>
        <span class="report-topline">${model.level}</span>
        <p class="streak-meta">Urmatorul prag: ${model.next} zile. Streak-ul e informatie, nu identitate.</p>
      </div>
      <div class="progress-shell" aria-label="Progres">
        <div class="progress-fill" style="width:${model.progress}%"></div>
      </div>
      <button type="button" id="relapseButton">Am fumat. Repornesc azi, fara rusine.</button>
    `;
  }

  function renderKnowledge(container, items) {
    container.innerHTML = items
      .map(
        (item, index) => `
        <article class="knowledge-card">
          <h3>${item.title}</h3>
          <p><strong>Pe scurt:</strong> ${item.short}</p>
          <button type="button" class="toggle-deep" data-index="${index}">Aprofundeaza</button>
          <p class="knowledge-deep" id="knowledgeDeep-${index}" hidden>${item.deep}</p>
          <p class="knowledge-today"><strong>Ce fac azi:</strong> ${item.today}</p>
        </article>
      `
      )
      .join("");
  }

  function renderProtocols(container, items) {
    container.innerHTML = items
      .map(
        (item) => `
        <article class="action-card">
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </article>
      `
      )
      .join("");
  }

  function renderQuiz(container, items) {
    container.innerHTML = items
      .map(
        (item, index) => `
        <fieldset class="question">
          <h3>${index + 1}. ${item.question}</h3>
          <div class="options">
            ${item.options
              .map(
                ([label, dimension, feedback], optionIndex) => `
                <label class="option">
                  <input type="radio" name="${item.id}" value="${dimension}" data-feedback="${feedback}" required />
                  <span>${label}</span>
                </label>
                <p class="answer-feedback" id="fb-${item.id}-${optionIndex}" hidden>${feedback}</p>
              `
              )
              .join("")}
          </div>
        </fieldset>
      `
      )
      .join("");

    container.insertAdjacentHTML(
      "beforeend",
      `
      <div class="form-actions">
        <button type="submit">Genereaza raportul</button>
        <button type="button" id="resetQuiz">Reseteaza quiz</button>
      </div>
    `
    );
  }

  function renderCravings(container, cravings) {
    if (!cravings.length) {
      container.innerHTML = '<p class="empty-state">Nu exista craving-uri logate.</p>';
      return;
    }

    container.innerHTML = `
      <ul class="report-list">
        ${cravings
          .slice()
          .reverse()
          .slice(0, 8)
          .map(
            (entry) => `
            <li>
              <strong>${entry.trigger}</strong> | intensitate ${entry.intensity}/10 | ${entry.action}<br />
              ${entry.outcome}
            </li>
          `
          )
          .join("")}
      </ul>
    `;
  }

  function renderReport(container, model) {
    if (!model) {
      container.innerHTML = '<p class="empty-state">Completeaza quiz-ul ca sa primesti raportul personalizat.</p>';
      return;
    }

    container.innerHTML = `
      <span class="report-topline">Profil dominant: ${model.topLabel}</span>
      <h3>Raport personalizat (${model.quizMode})</h3>
      <p>Profil secundar: ${model.secondaryLabel}. Date folosite: quiz + check-in + craving log.</p>
      <h4>Puncte forte</h4>
      <ul class="report-list">${model.strengths.map((item) => `<li>${item}</li>`).join("")}</ul>
      <h4>Vulnerabilitati active</h4>
      <ul class="report-list">${model.vulnerabilities.map((item) => `<li>${item}</li>`).join("")}</ul>
      <h4>Focus 24-72h</h4>
      <p>${model.focusShort}</p>
      <h4>Focus 7 zile</h4>
      <p>${model.focusWeek}</p>
      ${model.panicSummary ? `<p class="panic-summary"><strong>${model.panicSummary}</strong></p>` : ""}
      <p><strong>Decizie recomandata:</strong> continua daca ai control minim; ajusteaza daca triggerii domina; cere suport daca repeti episoade greu de gestionat.</p>
    `;
  }

  function renderPanicModule(container, panicModule) {
    if (!panicModule?.levels?.length) {
      container.innerHTML = '<p class="empty-state">Modulul de panica nu este disponibil.</p>';
      return;
    }

    container.innerHTML = `
      <article class="panic-card">
        <h3>${panicModule.title}</h3>
        <p>${panicModule.subtitle}</p>
        <p class="panic-intro">${panicModule.intro}</p>
        <div class="panic-top-actions">
          <button type="button" class="panic-btn rescue" id="panicRescue">
            ${panicModule.rescueLabel ?? "1-click rescue"}
          </button>
          <button type="button" class="panic-btn" id="panicReset">
            ${panicModule.resetLabel ?? "Reseteaza modul panica"}
          </button>
        </div>
        <div class="panic-actions">
          ${panicModule.levels
            .map(
              (level, index) => `
              <button
                type="button"
                class="panic-btn"
                data-panic-level="${level.id}"
                ${index === 0 ? "" : "disabled"}
              >
                ${level.label}
              </button>
            `
            )
            .join("")}
        </div>
        <div class="panic-output" id="panicOutput">
          <p class="empty-state">Alege Nivel 1 ca prim pas.</p>
        </div>
        <p class="panic-fallback">${panicModule.fallbackMessage ?? ""}</p>
      </article>
    `;
  }

  return {
    renderStreak,
    renderKnowledge,
    renderProtocols,
    renderQuiz,
    renderCravings,
    renderReport,
    renderPanicModule
  };
})();
