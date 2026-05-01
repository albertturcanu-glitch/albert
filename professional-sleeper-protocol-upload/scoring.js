import { pillars } from "../data/pillars.js";
import { microProtocols } from "../data/microProtocols.js";
import { quizItems } from "../data/quizItems.js";

export function getAdjustedScore(item, rawScore) {
  if (!rawScore) return null;
  return item.reverseScored ? 6 - rawScore : rawScore;
}

export function getBand(score) {
  if (score < 2.5) return "fricțiune ridicată acum";
  if (score < 3.5) return "mixt / variabil";
  if (score < 4.3) return "în general susținător";
  return "foarte susținător";
}

export function calculateSnapshot(answers) {
  const answeredItems = quizItems
    .map((item) => ({
      ...item,
      rawScore: answers[item.id],
      adjustedScore: getAdjustedScore(item, answers[item.id]),
    }))
    .filter((item) => item.adjustedScore !== null);

  const pillarScores = pillars.map((pillar) => {
    const items = answeredItems.filter((item) => item.pillarId === pillar.id);
    const score = items.length
      ? items.reduce((sum, item) => sum + item.adjustedScore, 0) / items.length
      : 0;

    return {
      ...pillar,
      answeredCount: items.length,
      score,
      band: score ? getBand(score) : "fără date",
    };
  });

  const completedCount = answeredItems.length;
  const overallScore = completedCount
    ? answeredItems.reduce((sum, item) => sum + item.adjustedScore, 0) / completedCount
    : 0;

  const scoredPillars = pillarScores.filter((pillar) => pillar.answeredCount >= 2);
  const strongest = [...scoredPillars].sort((a, b) => b.score - a.score)[0] ?? null;
  const vulnerable = [...scoredPillars].sort((a, b) => a.score - b.score)[0] ?? null;
  const secondVulnerable =
    [...scoredPillars].sort((a, b) => a.score - b.score).find((pillar) => pillar.id !== vulnerable?.id) ??
    null;
  const lowestItems = [...answeredItems]
    .sort((a, b) => a.adjustedScore - b.adjustedScore)
    .slice(0, 5);

  const confidence =
    completedCount >= quizItems.length
      ? "încredere mai ridicată"
      : completedCount >= quizItems.length * 0.6
        ? "încredere moderată"
        : "încredere redusă";

  const spread =
    scoredPillars.length > 1
      ? Math.max(...scoredPillars.map((pillar) => pillar.score)) -
        Math.min(...scoredPillars.map((pillar) => pillar.score))
      : 0;
  const vulnerableCount = scoredPillars.filter((pillar) => pillar.score < 2.5).length;
  const supportiveCount = scoredPillars.filter((pillar) => pillar.score >= 3.5).length;
  const patternDetails = lowestItems.slice(0, 3).map((item) => ({
    label: item.lowPattern,
    construct: item.construct,
    pillar: pillars.find((pillar) => pillar.id === item.pillarId)?.title ?? "Pattern",
    score: item.adjustedScore,
    action: item.microIntervention,
  }));
  const recommendedActions = getRecommendedActions(vulnerable, secondVulnerable, lowestItems);

  return {
    completedCount,
    totalCount: quizItems.length,
    overallScore,
    overallBand: overallScore ? getBand(overallScore) : "fără date",
    confidence,
    pillarScores,
    strongest,
    vulnerable,
    secondVulnerable,
    spread,
    vulnerableCount,
    supportiveCount,
    patterns: patternDetails.map((item) => item.label),
    patternDetails,
    recommendedActions,
    narrative: buildNarrative({ overallScore, strongest, vulnerable, spread, vulnerableCount, supportiveCount }),
    weeklyFocus: buildWeeklyFocus(vulnerable, secondVulnerable),
  };
}

function buildNarrative({ overallScore, strongest, vulnerable, spread, vulnerableCount, supportiveCount }) {
  if (!overallScore) {
    return "Încă nu avem suficiente date pentru o interpretare utilă.";
  }

  if (vulnerableCount >= 3) {
    return `Sistemul tău pare să aibă mai multe zone sub presiune în același timp. Asta nu indică o problemă de caracter; sugerează că intervenția trebuie să fie mică, stabilă și ușor de repetat.`;
  }

  if (spread >= 1.2 && strongest && vulnerable) {
    return `Profilul tău are contrast: ${strongest.title} pare să te susțină, în timp ce ${vulnerable.title} cere cea mai multă grijă în următoarele 7 zile.`;
  }

  if (supportiveCount >= 6) {
    return "Fundația pare destul de stabilă. Următoarea intervenție ar trebui să fie fină, nu agresivă: protejează ce merge și ajustează un singur punct vulnerabil.";
  }

  return "Profilul pare mixt: ai zone care susțin sistemul și zone care devin vulnerabile când ziua se aglomerează. O intervenție mică, repetată, este mai utilă decât o schimbare mare.";
}

function buildWeeklyFocus(vulnerable, secondVulnerable) {
  if (!vulnerable) return "Completează quiz-ul pentru a primi un focus de 7 zile.";

  if (secondVulnerable) {
    return `Focusul recomandat: stabilizează ${vulnerable.title}, apoi folosește ${secondVulnerable.title} ca zonă de sprijin secundar.`;
  }

  return `Focusul recomandat: stabilizează ${vulnerable.title} cu o intervenție suficient de mică încât să o poți repeta 7 zile.`;
}

function getRecommendedActions(vulnerable, secondVulnerable, lowestItems) {
  const actions = [];

  if (vulnerable) {
    const protocol = microProtocols[vulnerable.id]?.[0];
    if (protocol) {
      actions.push({
        pillar: vulnerable.title,
        reason: "Pilonul cel mai vulnerabil din snapshot.",
        ...protocol,
      });
    }
  }

  if (secondVulnerable) {
    const protocol = microProtocols[secondVulnerable.id]?.[1] ?? microProtocols[secondVulnerable.id]?.[0];
    if (protocol) {
      actions.push({
        pillar: secondVulnerable.title,
        reason: "Zonă secundară care poate reduce presiunea asupra sistemului.",
        ...protocol,
      });
    }
  }

  const itemAction = lowestItems.find((item) => item.microIntervention);
  if (itemAction) {
    actions.push({
      pillar: pillars.find((pillar) => pillar.id === itemAction.pillarId)?.title ?? "Pattern",
      title: "Intervenție pe pattern-ul cel mai jos",
      action: itemAction.microIntervention,
      fallback: "Redu acțiunea până încape într-o zi grea.",
      reason: `Răspuns vulnerabil pe constructul: ${itemAction.construct}.`,
    });
  }

  actions.push({
    pillar: "Build Self-Trust",
    title: "Dovadă mică zilnică",
    action: "Alege o promisiune sub 10 minute și ține-o 7 zile.",
    fallback: "Dacă ratezi, reia cu o acțiune de 1%.",
    reason: "Self-trust este multiplicatorul care face planul sustenabil.",
  });

  return dedupeByTitle(actions).slice(0, 3);
}

function dedupeByTitle(actions) {
  const seen = new Set();
  return actions.filter((action) => {
    if (seen.has(action.title)) return false;
    seen.add(action.title);
    return true;
  });
}

export function buildChatGptReport(snapshot) {
  const scores = snapshot.pillarScores
    .map((pillar) => `${pillar.title}: ${pillar.score ? pillar.score.toFixed(1) : "n/a"}/5`)
    .join("\n");

  const actions = snapshot.recommendedActions
    .map(
      (action, index) =>
        `${index + 1}. ${action.title} (${action.pillar})\n   De ce: ${action.reason}\n   Acțiune: ${action.action}\n   Fallback: ${action.fallback}`,
    )
    .join("\n");

  const patternDetails = snapshot.patternDetails
    .map(
      (pattern) =>
        `- ${pattern.pillar}: ${pattern.construct} (${pattern.score}/5 ajustat) -> ${pattern.label}`,
    )
    .join("\n");

  return `THE PROFESSIONAL SLEEPER PROTOCOL - Snapshot

Scor PSP: ${snapshot.overallScore.toFixed(1)}/5 (${snapshot.overallBand})
Încredere interpretare: ${snapshot.confidence}
Interpretare: ${snapshot.narrative}
Focus 7 zile: ${snapshot.weeklyFocus}

Pilon puternic: ${snapshot.strongest?.title ?? "insuficient date"}
Pilon vulnerabil: ${snapshot.vulnerable?.title ?? "insuficient date"}
Pilon secundar vulnerabil: ${snapshot.secondVulnerable?.title ?? "insuficient date"}

Scoruri pe piloni:
${scores}

Pattern-uri observate:
${patternDetails}

Micro-acțiuni pentru 7 zile:
${actions}

Te rog interpretează asta ca auto-observare comportamentală, nu ca diagnostic. Ajută-mă să transform aceste 3 acțiuni într-un plan realist pentru următoarele 7 zile, cu versiune minimă pentru zile grele.`;
}
