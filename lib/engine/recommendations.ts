import { modules, rooms } from "@/lib/data/catalog";
import { DashboardStats } from "@/lib/engine/progress";
import { LeakCategory } from "@/lib/types/domain";

const leakToModuleHint: Partial<Record<LeakCategory, string>> = {
  "broadway-domination-preflop": "m2-respect-tight-ep-mp",
  "oovs3bet-discipline": "m3-oop-vs-3bet-discipline",
  "oos-shove-flat-fold-confusion": "m4-20-30bb-clarity",
  "overcalling-curiosity": "m5-pko-cover-short-aggressor",
  "fancy-lines-bad-field": "m1-late-opens-vs-blind-leaks",
};

export function getSuggestedModules(stats: DashboardStats): Array<{ moduleId: string; reason: string }> {
  const topLeaks = Object.entries(stats.leakCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .filter(([, count]) => count > 0) as Array<[LeakCategory, number]>;

  const suggestions: Array<{ moduleId: string; reason: string }> = [];

  for (const [leak, count] of topLeaks) {
    const moduleId = leakToModuleHint[leak];
    if (!moduleId || suggestions.some((s) => s.moduleId === moduleId)) continue;
    suggestions.push({ moduleId, reason: `Recurring leak: ${leak} (${count} misses)` });
  }

  if (suggestions.length < 3) {
    const weakestModule = Object.entries(stats.byModule)
      .filter(([, v]) => v.attempts >= 3)
      .sort((a, b) => a[1].correct / Math.max(a[1].attempts, 1) - b[1].correct / Math.max(b[1].attempts, 1))[0];
    if (weakestModule && !suggestions.some((s) => s.moduleId === weakestModule[0])) {
      suggestions.push({ moduleId: weakestModule[0], reason: "Lowest conversion rate among practiced modules" });
    }
  }

  for (const m of modules) {
    if (suggestions.length >= 3) break;
    if (!suggestions.some((s) => s.moduleId === m.id)) {
      suggestions.push({ moduleId: m.id, reason: "Baseline rotation to maintain robust defaults" });
    }
  }

  return suggestions;
}

export function getWeakestRooms(stats: DashboardStats) {
  return Object.entries(stats.byRoom)
    .sort((a, b) => a[1].correct / Math.max(a[1].attempts, 1) - b[1].correct / Math.max(b[1].attempts, 1))
    .slice(0, 2)
    .map(([roomId, value]) => ({
      roomId,
      roomName: rooms.find((r) => r.id === roomId)?.name ?? roomId,
      accuracy: value.attempts ? (value.correct / value.attempts) * 100 : 0,
      attempts: value.attempts,
    }));
}
