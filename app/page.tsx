"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { archetypes, modules, rooms, tendencies } from "@/lib/data/catalog";
import { scenarios } from "@/lib/data/scenarios";
import { applyScenarioFilters, scoreAnswer } from "@/lib/engine/scenario-engine";
import { Attempt, computeDashboardStats } from "@/lib/engine/progress";
import { getSuggestedModules, getWeakestRooms } from "@/lib/engine/recommendations";
import { FeedbackTag, ScenarioFilter } from "@/lib/types/domain";

const FEEDBACK_TAG_LABEL: Record<FeedbackTag, string> = {
  clar_ev_plus: "[clar EV+]",
  exploit_ok: "[exploit ok]",
  prea_fin_pentru_field: "[prea fin pentru field]",
};

const STORAGE_KEY = "mtt-dojo-attempts-v2";

export default function HomePage() {
  const [screen, setScreen] = useState<"dojo" | "dashboard" | "library" | "modules" | "rooms" | "manual">("dojo");
  const [filter, setFilter] = useState<ScenarioFilter>({});
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [mode, setMode] = useState<"standard" | "compression">("standard");
  const [timeLeft, setTimeLeft] = useState(20);
  const [startedAt, setStartedAt] = useState<number>(Date.now());

  const filtered = useMemo(() => applyScenarioFilters(scenarios, filter), [filter]);
  const current = filtered[index % Math.max(filtered.length, 1)];
  const stats = useMemo(() => computeDashboardStats(attempts, scenarios), [attempts]);
  const suggestedModules = useMemo(() => getSuggestedModules(stats), [stats]);
  const weakestRooms = useMemo(() => getWeakestRooms(stats), [stats]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setAttempts(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
  }, [attempts]);

  useEffect(() => {
    if (mode !== "compression" || selected || !current) return;
    if (timeLeft <= 0) {
      setSelected("__timeout__");
      return;
    }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [mode, timeLeft, selected, current]);

  function nextScenario() {
    setSelected(null);
    setTimeLeft(20);
    setStartedAt(Date.now());
    setIndex((v) => v + 1);
  }

  function submit(optionId: string) {
    if (!current || selected) return;
    setSelected(optionId);
    const result = scoreAnswer(current, optionId);
    setAttempts((old) => [
      {
        scenarioId: current.id,
        moduleId: current.moduleId,
        roomId: current.roomId,
        isCorrect: result.isCorrect,
        ms: Date.now() - startedAt,
        leakHits: result.leakHits,
        at: new Date().toISOString(),
      },
      ...old,
    ]);
  }

  const tendency = tendencies.find((t) => t.id === current?.relevantPoolTendencyId);

  return (
    <main className="mx-auto min-h-screen max-w-7xl p-5">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">MTT Exploit Dojo v2</h1>
          <p className="text-sm text-slate-300">Structured exploit training for $5–$30 online MTT volume execution.</p>
        </div>
        <div className="flex gap-2">
          {(["dojo", "dashboard", "library", "modules", "rooms", "manual"] as const).map((s) => (
            <Button key={s} className={screen === s ? "" : "bg-slate-700 text-white hover:bg-slate-600"} onClick={() => setScreen(s)}>
              {s}
            </Button>
          ))}
        </div>
      </header>

      {screen === "dojo" && (
        <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
          <Card>
            <h2 className="mb-2 font-semibold">Filters</h2>
            <div className="space-y-2">
              <FilterSelect label="Room" value={filter.roomId ?? ""} onChange={(v) => setFilter((f) => ({ ...f, roomId: v || undefined }))} options={rooms.map((r) => ({ value: r.id, label: r.name }))} />
              <FilterSelect label="Module" value={filter.moduleId ?? ""} onChange={(v) => setFilter((f) => ({ ...f, moduleId: v || undefined }))} options={modules.map((m) => ({ value: m.id, label: m.title }))} />
              <FilterSelect label="Family" value={filter.family ?? ""} onChange={(v) => setFilter((f) => ({ ...f, family: v || undefined }))} options={Array.from(new Set(scenarios.map((s) => s.family))).map((family) => ({ value: family, label: family }))} />
              <FilterSelect label="Villain" value={filter.villainId ?? ""} onChange={(v) => setFilter((f) => ({ ...f, villainId: (v as ScenarioFilter["villainId"]) || undefined }))} options={archetypes.map((a) => ({ value: a.id, label: a.label }))} />
              <FilterSelect label="Phase" value={filter.phase ?? ""} onChange={(v) => setFilter((f) => ({ ...f, phase: (v as ScenarioFilter["phase"]) || undefined }))} options={["early", "middle", "late", "bubble", "final-table"].map((p) => ({ value: p, label: p }))} />
              <FilterSelect label="PKO" value={filter.pkoContext ?? ""} onChange={(v) => setFilter((f) => ({ ...f, pkoContext: (v as ScenarioFilter["pkoContext"]) || undefined }))} options={[{ value: "non-pko", label: "Non-PKO" }, { value: "pko", label: "PKO" }]} />
              <FilterSelect label="Stack Band" value={filter.stackBand ?? ""} onChange={(v) => setFilter((f) => ({ ...f, stackBand: (v as ScenarioFilter["stackBand"]) || undefined }))} options={["10-15bb", "16-20bb", "21-30bb", "31-45bb", "46bb+"].map((b) => ({ value: b, label: b }))} />
              <FilterSelect label="Node Type" value={filter.nodeType ?? ""} onChange={(v) => setFilter((f) => ({ ...f, nodeType: (v as ScenarioFilter["nodeType"]) || undefined }))} options={["rfi", "vs-open", "vs-3bet", "squeeze", "jam-decision", "pko-iso"].map((n) => ({ value: n, label: n }))} />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-300">Scenarios: {filtered.length}</span>
              <Button className="bg-slate-700 text-white hover:bg-slate-600" onClick={() => setFilter({})}>Reset</Button>
            </div>
            <div className="mt-5 border-t border-white/10 pt-4">
              <h3 className="mb-2 font-semibold">Mode</h3>
              <div className="flex gap-2">
                <Button className={mode === "standard" ? "" : "bg-slate-700 text-white hover:bg-slate-600"} onClick={() => setMode("standard")}>Standard</Button>
                <Button className={mode === "compression" ? "" : "bg-slate-700 text-white hover:bg-slate-600"} onClick={() => { setMode("compression"); setTimeLeft(20); }}>Compression</Button>
              </div>
              {mode === "compression" && <p className="mt-2 text-xs text-amber-300">Timer active: {timeLeft}s. Train for 10–15 table pace.</p>}
            </div>
          </Card>

          <Card>
            {!current ? (
              <p>No scenarios match these filters yet.</p>
            ) : (
              <>
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-cyan-300">{current.theme}</p>
                    <h2 className="text-xl font-semibold">{current.title}</h2>
                  </div>
                  <span className="rounded bg-slate-800 px-2 py-1 text-xs">{FEEDBACK_TAG_LABEL[current.tag]}</span>
                </div>
                <div className="grid gap-2 text-sm text-slate-200 md:grid-cols-2">
                  <p><b>Room:</b> {rooms.find((r) => r.id === current.roomId)?.name}</p>
                  <p><b>Module:</b> {modules.find((m) => m.id === current.moduleId)?.title}</p>
                  <p><b>Villain:</b> {archetypes.find((a) => a.id === current.villainId)?.label}</p>
                  <p><b>Phase:</b> {current.phase}</p>
                  <p><b>Hero Hand:</b> {current.heroHand}</p>
                  <p><b>Stacks:</b> {current.stackSizes}</p>
                </div>
                <p className="mt-3 text-sm text-slate-300">{current.context}</p>
                <p className="mt-2 text-sm"><b>Action history:</b> {current.actionHistory}</p>
                <p className="mt-4 font-medium">{current.question}</p>
                <div className="mt-2 grid gap-2">
                  {current.options.map((o) => (
                    <button
                      key={o.id}
                      onClick={() => submit(o.id)}
                      disabled={!!selected}
                      className="rounded-md border border-white/15 bg-slate-900 p-3 text-left hover:border-cyan-300 disabled:opacity-80"
                    >
                      <p className="font-medium">{o.label}</p>
                      <p className="text-xs text-slate-300">{o.action}</p>
                    </button>
                  ))}
                </div>

                {selected && (
                  <Card className="mt-4 bg-slate-950">
                    <p className={selected === current.correctOptionId ? "text-success" : "text-danger"}>
                      {selected === current.correctOptionId ? "Correct line." : "Incorrect line."} {FEEDBACK_TAG_LABEL[current.tag]}
                    </p>
                    <p className="mt-2 text-sm"><b>Pool tendency:</b> {tendency?.title} — {tendency?.practicalDefault}</p>
                    <p className="mt-2 text-sm"><b>Exploit logic:</b> {current.exploitExplanation}</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                      {current.whyAlternativesWrong.map((w) => <li key={w}>{w}</li>)}
                    </ul>
                    <p className="mt-2 text-sm"><b>Likely thinking mistake:</b> {current.typicalThinkingError}</p>
                    <p className="mt-2 text-sm italic text-cyan-300">"{current.memorableInscription}"</p>
                    <Button className="mt-3" onClick={nextScenario}>Next scenario</Button>
                  </Card>
                )}
              </>
            )}
          </Card>
        </div>
      )}

      {screen === "dashboard" && (
        <Card>
          <h2 className="text-xl font-semibold">Progress & Leak Dashboard</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-3 lg:grid-cols-6">
            <Metric label="Accuracy" value={`${stats.accuracy.toFixed(1)}%`} />
            <Metric label="Avg Decision Time" value={`${(stats.avgMs / 1000).toFixed(1)}s`} />
            <Metric label="Total Attempts" value={`${attempts.length}`} />
            <Metric label="Accuracy 7d" value={`${stats.accuracy7d.toFixed(1)}%`} />
            <Metric label="Accuracy 30d" value={`${stats.accuracy30d.toFixed(1)}%`} />
            <Metric label="Speed 7d" value={`${(stats.speed7dMs / 1000).toFixed(1)}s`} />
          </div>
          <h3 className="mt-5 font-semibold">Accuracy Trend (7 days)</h3>
          <div className="mt-2 grid gap-2 md:grid-cols-7">
            {stats.trendByDay.map((t) => (
              <div key={t.day} className="rounded border border-white/10 bg-slate-900 p-2 text-center text-xs">
                <p className="text-slate-400">{t.day.slice(5)}</p>
                <p className="font-semibold">{t.accuracy.toFixed(0)}%</p>
                <p>{t.attempts} hands</p>
              </div>
            ))}
          </div>
          <h3 className="mt-5 font-semibold">Recurring Leak Patterns</h3>
          <div className="mt-2 grid gap-2 md:grid-cols-3">
            {Object.entries(stats.leakCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 9)
              .map(([k, v]) => (
                <div key={k} className={`rounded border px-3 py-2 text-sm ${v > 6 ? "border-red-500/60 bg-red-950/40" : v > 2 ? "border-amber-500/60 bg-amber-950/30" : "border-emerald-600/40 bg-emerald-950/20"}`}>
                  <b>{k}</b>: {v}
                </div>
              ))}
          </div>
          <h3 className="mt-5 font-semibold">Weakest Rooms</h3>
          <div className="mt-2 grid gap-2 md:grid-cols-2">
            {weakestRooms.length === 0 ? (
              <p className="text-sm text-slate-300">Need more volume before room weakness can be inferred.</p>
            ) : (
              weakestRooms.map((r) => (
                <div key={r.roomId} className="rounded border border-white/10 bg-slate-900 p-3 text-sm">
                  <p className="font-semibold">{r.roomName}</p>
                  <p>Accuracy: {r.accuracy.toFixed(1)}%</p>
                  <p>Attempts: {r.attempts}</p>
                </div>
              ))
            )}
          </div>
          <h3 className="mt-5 font-semibold">Suggested Next Modules</h3>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-300">
            {suggestedModules.map((item) => {
              const module = modules.find((m) => m.id === item.moduleId);
              if (!module) return null;
              return <li key={item.moduleId}><b>{module.title}</b> — {item.reason}</li>;
            })}
          </ul>
        </Card>
      )}

      {screen === "library" && (
        <Card>
          <h2 className="text-xl font-semibold">Pool Tendencies Library</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {tendencies.map((t) => (
              <Card key={t.id} className="bg-slate-950">
                <p className="font-semibold">{t.title}</p>
                <p className="text-sm text-slate-300">{t.summary}</p>
                <p className="mt-1 text-xs text-cyan-300">Default: {t.practicalDefault}</p>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {screen === "modules" && (
        <Card>
          <h2 className="text-xl font-semibold">Module Browser</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {modules.map((m) => (
              <Card key={m.id} className="bg-slate-950">
                <p className="font-semibold">{m.title}</p>
                <p className="text-sm text-slate-300">{m.focus}</p>
                <p className="text-xs text-cyan-300">Family: {m.family}</p>
                <p className="text-xs">Scenarios: {scenarios.filter((s) => s.moduleId === m.id).length}</p>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {screen === "rooms" && (
        <Card>
          <h2 className="text-xl font-semibold">Room Browser (Mental Castle)</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {rooms.map((r) => (
              <Card key={r.id} className="bg-slate-950">
                <p className="font-semibold">{r.name}</p>
                <p className="text-sm text-slate-300">{r.focus}</p>
                <p className="text-xs">Scenarios: {scenarios.filter((s) => s.roomId === r.id).length}</p>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {screen === "manual" && (
        <Card>
          <h2 className="text-xl font-semibold">Manual / Principles</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
            <li>Train robust defaults first, then add table-specific exploits.</li>
            <li>Use compression mode to stress-test decision speed under multitabling constraints.</li>
            <li>Tag mistakes by leak category, not by emotion.</li>
            <li>Prefer repeatable EV over fancy thin lines in weak fields.</li>
            <li>Respect tighter EP/MP opens and avoid dominated broadway traps.</li>
          </ul>
        </Card>
      )}
    </main>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs text-slate-300">{label}</span>
      <Select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">All</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </Select>
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-slate-900 p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}
