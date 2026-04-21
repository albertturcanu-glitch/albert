import { Scenario, ScenarioFilter } from "@/lib/types/domain";

export function applyScenarioFilters(all: Scenario[], filter: ScenarioFilter): Scenario[] {
  return all.filter((s) => {
    if (filter.roomId && s.roomId !== filter.roomId) return false;
    if (filter.moduleId && s.moduleId !== filter.moduleId) return false;
    if (filter.family && s.family !== filter.family) return false;
    if (filter.villainId && s.villainId !== filter.villainId) return false;
    if (filter.phase && s.phase !== filter.phase) return false;
    if (filter.pkoContext && s.pkoContext !== filter.pkoContext) return false;
    if (filter.stackBand && s.stackBand !== filter.stackBand) return false;
    if (filter.nodeType && s.nodeType !== filter.nodeType) return false;
    return true;
  });
}

export function scoreAnswer(s: Scenario, selectedOptionId: string) {
  const isCorrect = s.correctOptionId === selectedOptionId;
  const leakHits = isCorrect ? [] : s.leakCategories;
  return { isCorrect, leakHits };
}
