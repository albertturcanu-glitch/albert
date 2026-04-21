import { LeakCategory, Scenario } from "@/lib/types/domain";

export interface Attempt {
  scenarioId: string;
  moduleId: string;
  roomId: string;
  isCorrect: boolean;
  ms: number;
  leakHits: LeakCategory[];
  at: string;
}

export interface DashboardStats {
  accuracy: number;
  avgMs: number;
  byModule: Record<string, { attempts: number; correct: number }>;
  byRoom: Record<string, { attempts: number; correct: number }>;
  leakCounts: Record<LeakCategory, number>;
  accuracy7d: number;
  accuracy30d: number;
  speed7dMs: number;
  speed30dMs: number;
  trendByDay: Array<{ day: string; attempts: number; accuracy: number }>;
}

const leakDefaults: Record<LeakCategory, number> = {
  "overrespecting-aggression": 0,
  "overfolding-wide-nodes": 0,
  "overcalling-curiosity": 0,
  "fancy-lines-bad-field": 0,
  "broadway-domination-preflop": 0,
  "river-heroism-underbluffed": 0,
  "thin-value-missed-vs-recs": 0,
  "oos-shove-flat-fold-confusion": 0,
  "oovs3bet-discipline": 0,
};

function summarizeWindow(attempts: Attempt[], days: number) {
  const now = Date.now();
  const start = now - days * 24 * 60 * 60 * 1000;
  const inWindow = attempts.filter((a) => new Date(a.at).getTime() >= start);
  if (inWindow.length === 0) return { accuracy: 0, avgMs: 0 };
  const correct = inWindow.filter((a) => a.isCorrect).length;
  const avgMs = inWindow.reduce((sum, a) => sum + a.ms, 0) / inWindow.length;
  return { accuracy: (correct / inWindow.length) * 100, avgMs };
}

export function buildTrendByDay(attempts: Attempt[], days = 7): Array<{ day: string; attempts: number; accuracy: number }> {
  const now = new Date();
  const buckets = new Map<string, { attempts: number; correct: number }>();

  for (let i = 0; i < days; i += 1) {
    const d = new Date(now);
    d.setUTCDate(now.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, { attempts: 0, correct: 0 });
  }

  for (const a of attempts) {
    const key = new Date(a.at).toISOString().slice(0, 10);
    if (!buckets.has(key)) continue;
    const current = buckets.get(key)!;
    current.attempts += 1;
    current.correct += a.isCorrect ? 1 : 0;
  }

  return [...buckets.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([day, info]) => ({
      day,
      attempts: info.attempts,
      accuracy: info.attempts ? (info.correct / info.attempts) * 100 : 0,
    }));
}

export function computeDashboardStats(attempts: Attempt[], scenarios: Scenario[]): DashboardStats {
  if (!attempts.length) {
    return {
      accuracy: 0,
      avgMs: 0,
      byModule: {},
      byRoom: {},
      leakCounts: leakDefaults,
      accuracy7d: 0,
      accuracy30d: 0,
      speed7dMs: 0,
      speed30dMs: 0,
      trendByDay: buildTrendByDay([]),
    };
  }

  const byModule: DashboardStats["byModule"] = {};
  const byRoom: DashboardStats["byRoom"] = {};
  const leakCounts = { ...leakDefaults };
  let correct = 0;
  let totalMs = 0;

  const scenarioMap = new Map(scenarios.map((s) => [s.id, s]));

  for (const a of attempts) {
    if (a.isCorrect) correct += 1;
    totalMs += a.ms;

    byModule[a.moduleId] ??= { attempts: 0, correct: 0 };
    byModule[a.moduleId].attempts += 1;
    byModule[a.moduleId].correct += a.isCorrect ? 1 : 0;

    byRoom[a.roomId] ??= { attempts: 0, correct: 0 };
    byRoom[a.roomId].attempts += 1;
    byRoom[a.roomId].correct += a.isCorrect ? 1 : 0;

    for (const leak of a.leakHits) leakCounts[leak] += 1;

    const s = scenarioMap.get(a.scenarioId);
    if (!a.isCorrect && s?.leakCategories.length === 0) leakCounts["fancy-lines-bad-field"] += 1;
  }

  const last7 = summarizeWindow(attempts, 7);
  const last30 = summarizeWindow(attempts, 30);

  return {
    accuracy: (correct / attempts.length) * 100,
    avgMs: totalMs / attempts.length,
    byModule,
    byRoom,
    leakCounts,
    accuracy7d: last7.accuracy,
    accuracy30d: last30.accuracy,
    speed7dMs: last7.avgMs,
    speed30dMs: last30.avgMs,
    trendByDay: buildTrendByDay(attempts),
  };
}
