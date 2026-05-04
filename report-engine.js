window.STOP_SMOKING_REPORT = (() => {
  function topTriggers(state) {
    const map = {};
    state.dailyCheckins.forEach((c) => {
      map[c.trigger] = (map[c.trigger] ?? 0) + 1;
    });
    state.cravings.forEach((c) => {
      map[c.trigger] = (map[c.trigger] ?? 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => `${name} (${count})`);
  }

  function latestDaily(state) {
    return state.dailyCheckins[state.dailyCheckins.length - 1] ?? null;
  }

  function strengthsFromState(state, quiz) {
    const strengths = [];
    if ((state.cravings.filter((c) => c.action !== "am fumat").length || 0) >= 2) {
      strengths.push("Ai reusit sa opresti sau sa amani pofta in mai multe momente.");
    }
    if (latestDaily(state)?.intent) {
      strengths.push("Ai mentinut o intentie clara pentru urmatoarele 12h.");
    }
    if (quiz?.scores?.selfTrust > 0 || quiz?.scores?.readiness > 0) {
      strengths.push("Ai semnale de autoeficacitate si disponibilitate de revenire.");
    }
    return strengths.length ? strengths : ["Ai revenit in aplicatie si asta este deja un pas de progres."];
  }

  function vulnerabilitiesFromState(state, quiz) {
    const vulnerabilities = [];
    const daily = latestDaily(state);
    if (daily && Number(daily.stress) >= 7) vulnerabilities.push("Stres ridicat in prezent.");
    if (daily && Number(daily.energy) <= 3) vulnerabilities.push("Energie joasa, risc de decizii automate.");
    if ((quiz?.scores?.relapseRisk ?? 0) >= 1) vulnerabilities.push("Risc de recadere activ in autoevaluare.");
    if ((state.cravings.filter((c) => c.action === "am fumat").length || 0) >= 1) vulnerabilities.push("Exista episoade recente de reactie prin fumat.");
    return vulnerabilities.length ? vulnerabilities : ["Nu apar vulnerabilitati majore; mentine rutina minima."];
  }

  function focus24to72(quiz) {
    const primary = quiz?.top ?? "coping";
    const byDimension = {
      physical: "Foloseste protocolul 90 sec la primele semnale fizice de pofta.",
      contextual: "Schimba concret mediul principal de risc in urmatoarele 24h.",
      emotional: "Aplica un raspuns scurt de reglare la primul trigger emotional.",
      readiness: "Alege o fereastra protejata de 2 ore chiar azi.",
      relapseRisk: "Evita negocierea cu pofta. Ruleaza planul minim scris.",
      coping: "Repeta aceeasi strategie de coping de minimum 2 ori in 72h.",
      support: "Trimite un mesaj scurt unei persoane de suport inainte de urmatorul trigger.",
      selfTrust: "Noteaza zilnic o dovada mica de progres."
    };
    return byDimension[primary] ?? byDimension.coping;
  }

  function focus7Days(state) {
    const triggers = topTriggers(state);
    if (!triggers.length) return "Construieste trigger map-ul cu minimum 3 situatii observate in saptamana.";
    return `Consolideaza planul pentru triggerii dominanti: ${triggers.join(", ")}.`;
  }

  function buildReportModel(state, dimensions) {
    const quiz = state.quiz;
    if (!quiz) {
      return null;
    }

    let panicSummary = null;
    if (state.panic?.lastPanicLevel && state.panic?.lastPanicAt) {
      const labelMap = {
        rescue: "1-click rescue",
        reset: "reset modul panica",
        level1: "nivel 1",
        level2: "nivel 2",
        level3: "nivel 3"
      };
      panicSummary = `Ultimul eveniment panic: ${labelMap[state.panic.lastPanicLevel] ?? state.panic.lastPanicLevel} (${new Date(
        state.panic.lastPanicAt
      ).toLocaleString("ro-RO")}).`;
    }

    return {
      quizMode: quiz.mode,
      topLabel: dimensions[quiz.top]?.label ?? "profil mixt",
      secondaryLabel: dimensions[quiz.secondary]?.label ?? "profil mixt",
      strengths: strengthsFromState(state, quiz),
      vulnerabilities: vulnerabilitiesFromState(state, quiz),
      focusShort: focus24to72(quiz),
      focusWeek: focus7Days(state),
      panicSummary
    };
  }

  return {
    buildReportModel
  };
})();
