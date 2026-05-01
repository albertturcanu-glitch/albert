import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clipboard,
  Moon,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { manualContent } from "./data/manualContent";
import { pillars } from "./data/pillars";
import { dayFlow, systemMapContent, systemMapModes } from "./data/systemMap";
import { theoryContent } from "./data/theoryContent";
import { quizItems, scaleLabels } from "./data/quizItems";
import { buildChatGptReport, calculateSnapshot } from "./lib/scoring";
import { clearQuizState, createInitialQuizState, loadQuizState, saveQuizState } from "./lib/storage";

const tabs = [
  { id: "idea", label: "Ideea principală" },
  { id: "deep", label: "Dive deeper" },
  { id: "quiz", label: "Short quiz" },
];

function getFirstUnansweredIndex(answers = {}) {
  const index = quizItems.findIndex((item) => answers[item.id] === undefined);
  return index === -1 ? quizItems.length - 1 : index;
}

export default function App() {
  const [bootQuizState] = useState(() => loadQuizState() ?? createInitialQuizState());
  const [activeTab, setActiveTab] = useState("idea");
  const [selectedPillar, setSelectedPillar] = useState(pillars[0].id);
  const [quizState, setQuizState] = useState(bootQuizState);
  const [currentIndex, setCurrentIndex] = useState(() => getFirstUnansweredIndex(bootQuizState.answers));
  const [copied, setCopied] = useState(false);

  const snapshot = useMemo(() => calculateSnapshot(quizState.answers), [quizState.answers]);
  const [quizStarted, setQuizStarted] = useState(() => snapshot.completedCount > 0);
  const completed = snapshot.completedCount === snapshot.totalCount || Boolean(quizState.completedAt);
  const currentItem = quizItems[currentIndex];
  const currentPillar = pillars.find((pillar) => pillar.id === currentItem.pillarId);

  useEffect(() => {
    saveQuizState(quizState);
  }, [quizState]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab, selectedPillar]);

  function updateAnswer(itemId, value) {
    setQuizState((state) => ({
      ...state,
      answers: { ...state.answers, [itemId]: Number(value) },
    }));
  }

  function goNext() {
    if (currentIndex < quizItems.length - 1) {
      setCurrentIndex((index) => index + 1);
      return;
    }

    setQuizState((state) => ({
      ...state,
      completedAt: state.completedAt ?? new Date().toISOString(),
    }));
  }

  function resetQuiz() {
    const shouldReset = window.confirm("Resetezi răspunsurile quiz-ului și snapshot-ul curent?");
    if (!shouldReset) return;

    clearQuizState();
    setQuizState(createInitialQuizState());
    setCurrentIndex(0);
    setQuizStarted(false);
    setCopied(false);
  }

  async function copyReport() {
    const report = buildChatGptReport(snapshot);

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(report);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = report;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function openPillar(pillarId) {
    setSelectedPillar(pillarId);
    setActiveTab("deep");
  }

  function startQuizAtPillar(pillarId) {
    const firstIndex = quizItems.findIndex((item) => item.pillarId === pillarId);
    setCurrentIndex(firstIndex === -1 ? 0 : firstIndex);
    setQuizStarted(true);
    setActiveTab("quiz");
  }

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <button className="brand" onClick={() => setActiveTab("idea")} aria-label="Go to overview">
          <span className="brand-mark"><Moon size={18} /></span>
          <span>
            <strong>THE PROFESSIONAL SLEEPER PROTOCOL</strong>
            <small>sleep architecture lab</small>
          </span>
        </button>

        <nav className="nav-tabs" aria-label="Main sections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? "active" : ""}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {activeTab === "idea" && (
        <CoreIdea
          onOpenPillar={openPillar}
          onStartPillarQuiz={startQuizAtPillar}
          onStartQuiz={() => setActiveTab("quiz")}
          onDive={() => setActiveTab("deep")}
        />
      )}
      {activeTab === "deep" && (
        <DiveDeeper selectedPillar={selectedPillar} onSelectPillar={setSelectedPillar} />
      )}
      {activeTab === "quiz" && (
        <QuizSection
          completed={completed}
          copied={copied}
          currentIndex={currentIndex}
          currentItem={currentItem}
          currentPillar={currentPillar}
          onBack={() => setCurrentIndex((index) => Math.max(0, index - 1))}
          onCopy={copyReport}
          onOpenPillar={openPillar}
          onNext={goNext}
          onReset={resetQuiz}
          onStartQuiz={() => setQuizStarted(true)}
          onUpdateAnswer={updateAnswer}
          quizStarted={quizStarted}
          quizState={quizState}
          snapshot={snapshot}
        />
      )}

      <footer className="app-footer">
        <span>THE PROFESSIONAL SLEEPER PROTOCOL</span>
        <span>Reflective self-regulation system. Not medical advice.</span>
      </footer>
    </main>
  );
}

function CoreIdea({ onStartQuiz, onDive, onOpenPillar, onStartPillarQuiz }) {
  const [activePillarId, setActivePillarId] = useState(pillars[0].id);
  const [mapMode, setMapMode] = useState(systemMapModes[0].id);
  const activePillar = pillars.find((pillar) => pillar.id === activePillarId) ?? pillars[0];
  const activeManual = manualContent[activePillar.id];
  const activeTheory = theoryContent[activePillar.id];
  const activeMap = systemMapContent[activePillar.id];
  const activeMode = systemMapModes.find((mode) => mode.id === mapMode) ?? systemMapModes[0];
  const connectedPillars = activeMap.connections
    .map((pillarId) => pillars.find((pillar) => pillar.id === pillarId))
    .filter(Boolean);
  const activeQuizCount = quizItems.filter((item) => item.pillarId === activePillar.id).length;

  return (
    <section className="hero-grid section-enter">
      <div className="hero-copy">
        <p className="eyebrow">Premium self-regulation protocol</p>
        <h1>Nu repari somnul doar în pat.</h1>
        <p className="thesis">Construiești tipul de zi care face somnul bun posibil.</p>
        <p className="hero-text">
          PSP tratează somnul ca rezultat al unui sistem complet: lumină, mișcare, atenție, hrană,
          conexiune, disconfort util și încredere în sine. Nu este un verdict despre tine. Este o
          hartă calmă a locurilor unde sistemul tău poate deveni mai stabil.
        </p>

        <div className="hero-actions">
          <button className="primary-btn" onClick={onStartQuiz}>
            Începe self-check-ul <ArrowRight size={18} />
          </button>
          <button className="secondary-btn" onClick={onDive}>
            Explorează pilonii <BookOpen size={18} />
          </button>
        </div>
      </div>

      <div className="system-card glass-card">
        <span className="system-label">Sistemul PSP</span>
        {["teorie clară", "auto-observare", "scor reflexiv", "3 micro-acțiuni", "self-trust"].map(
          (step, index) => (
            <div className="system-step" key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
            </div>
          ),
        )}
      </div>

      <div className="architecture-console glass-card">
        <div className="map-heading console-heading">
          <div>
            <p className="eyebrow">Sleep Architecture Console</p>
            <h2>Alege un pilon. Vezi cum modifică ziua care produce somnul.</h2>
            <p>
              Nu este o hartă motivațională. Este o consolă de cauze: ce stabilizează sistemul,
              unde se rupe și ce micro-schimbare poate proteja noaptea de azi.
            </p>
          </div>
          <div className="console-status">
            <span>Pilon activ</span>
            <strong>{activePillar.title}</strong>
            <small>{activeMap.phase} / {activeMap.phaseLabel}</small>
          </div>
        </div>

        <div className="console-mode-tabs" aria-label="Moduri consolă">
          {systemMapModes.map((mode) => (
            <button
              className={mode.id === mapMode ? "selected" : ""}
              key={mode.id}
              onClick={() => setMapMode(mode.id)}
            >
              <strong>{mode.label}</strong>
              <span>{mode.description}</span>
            </button>
          ))}
        </div>

        <div className="console-layout">
          <div className="console-left">
            {mapMode === "map" && (
              <div className="system-orbit" aria-label={activeMode.description}>
                {pillars.map((pillar, index) => {
                  const map = systemMapContent[pillar.id];

                  return (
                    <button
                      className={pillar.id === activePillar.id ? "orbit-node selected" : "orbit-node"}
                      key={pillar.id}
                      onClick={() => setActivePillarId(pillar.id)}
                      onMouseEnter={() => setActivePillarId(pillar.id)}
                    >
                      <span>{String(index + 1).padStart(2, "0")} / {map.phase}</span>
                      <strong>{pillar.title}</strong>
                      <small>{map.phaseLabel}</small>
                    </button>
                  );
                })}
              </div>
            )}

            {mapMode === "flow" && (
              <div className="day-flow-board" aria-label={activeMode.description}>
                {dayFlow.map((phase) => {
                  const phasePillars = pillars.filter((pillar) => systemMapContent[pillar.id].phase === phase);

                  return (
                    <div className="flow-lane" key={phase}>
                      <span>{phase}</span>
                      <div>
                        {phasePillars.map((pillar) => (
                          <button
                            className={pillar.id === activePillar.id ? "flow-chip selected" : "flow-chip"}
                            key={pillar.id}
                            onClick={() => setActivePillarId(pillar.id)}
                          >
                            {pillar.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {mapMode === "links" && (
              <div className="connection-board" aria-label={activeMode.description}>
                <div className="connection-core">
                  <span>pilon selectat</span>
                  <strong>{activePillar.title}</strong>
                  <small>{activeMap.systemRole}</small>
                </div>
                <div className="connection-lines">
                  {connectedPillars.map((pillar) => {
                    const map = systemMapContent[pillar.id];

                    return (
                      <button
                        className="connection-card"
                        key={pillar.id}
                        onClick={() => setActivePillarId(pillar.id)}
                      >
                        <span>influențează</span>
                        <strong>{pillar.title}</strong>
                        <small>{map.phase}: {map.phaseLabel}</small>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="console-context-strip">
              <div>
              <span>Teza activă</span>
                <strong>{activeTheory.thesis}</strong>
              </div>
              <div>
                <span>Itemi în quiz</span>
                <strong>{activeQuizCount} întrebări reflexive</strong>
              </div>
            </div>
          </div>

          <article className="architecture-detail-panel">
            <span>{activePillar.roTitle}</span>
            <h3>{activePillar.title}</h3>
            <p>{activeMap.systemRole}</p>

            <div className="causal-chain">
              <div>
                <small>Când merge bine</small>
                <strong>{activeMap.whenStable}</strong>
              </div>
              <div>
                <small>Când se rupe</small>
                <strong>{activeMap.whenBroken}</strong>
              </div>
              <div>
                <small>Cost pentru somn</small>
                <strong>{activeMap.sleepCost}</strong>
              </div>
            </div>

            <div className="repair-card">
              <small>Micro-shift de azi</small>
              <strong>{activeMap.microShift}</strong>
              <span>{activeManual.todayPractice.title}</span>
            </div>

            <blockquote className="reflection-quote">
              {activeMap.reflectionQuestion}
            </blockquote>

            <div className="console-actions">
              <button className="secondary-btn" onClick={() => onOpenPillar(activePillar.id)}>
                Deschide teoria <BookOpen size={18} />
              </button>
              <button className="primary-btn" onClick={() => onStartPillarQuiz(activePillar.id)}>
                Testează în quiz <ArrowRight size={18} />
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function DiveDeeper({ selectedPillar, onSelectPillar }) {
  const pillar = pillars.find((item) => item.id === selectedPillar) ?? pillars[0];
  const manual = manualContent[pillar.id];
  const theory = theoryContent[pillar.id];

  return (
    <section className="section-stack section-enter">
      <div className="section-heading">
        <p className="eyebrow">Manual compact</p>
        <h2>Dive deeper</h2>
        <p>
          Fiecare pilon este o fișă de teren: mecanism, punct de rupere, practică de azi și o
          întrebare de reflecție care duce teoria în viața reală.
        </p>
      </div>

      <div className="manual-layout">
        <aside className="pillar-list glass-card">
          {pillars.map((item) => (
            <button
              key={item.id}
              className={item.id === pillar.id ? "selected" : ""}
              onClick={() => onSelectPillar(item.id)}
            >
              <span>{item.roTitle}</span>
              <strong>{item.title}</strong>
            </button>
          ))}
        </aside>

        <article className="manual-card glass-card">
          <div className="manual-hero">
            <div>
              <p className="eyebrow">{pillar.roTitle}</p>
              <h2>{pillar.title}</h2>
              <p className="manual-core">{theory.thesis}</p>
            </div>
            <div className="manual-lens">
              <Sparkles size={18} />
              <span>{manual.mechanism}</span>
            </div>
          </div>

          <div className="theory-story-card">
            <span>Storyline</span>
            <p>{theory.story}</p>
          </div>

          <div className="theory-reader">
            <TheoryBlock title="Mecanismul de bază" body={theory.coreMechanism} />
            <TheoryBlock title="Ce înseamnă pentru somn" body={theory.whyItMattersForSleep} />
            <TheoryBlock title="Impact asupra sistemului zilei" body={theory.daySystemImpact} />
            <TheoryBlock title="Cum se rupe sistemul" body={theory.failureMode} />
            <TheoryBlock title="Reframe" body={theory.reframe} />
            <TheoryBlock title="Scenariu concret" body={theory.exampleScenario} />
          </div>

          <div className="manual-columns">
            <CardSection title="Principii teoretice" items={theory.principles} />
            <CardSection title="Unde se rupe sistemul" items={manual.systemBreaks} />
            <CardSection title="Capcane frecvente" items={pillar.traps} />
            <CardSection title="Micro-practici" items={pillar.microPractices} />
          </div>

          <div className="theory-application">
            <div>
              <span>Ce faci azi</span>
              <h3>{manual.todayPractice.title}</h3>
              <ol>
                {manual.todayPractice.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <small>Fallback: {manual.todayPractice.fallback}</small>
            </div>
            <div>
              <span>Note de sursă</span>
              <ul>
                {manual.sourceNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="reflection-card">
            <span>Întrebări de reflecție</span>
            <div className="reflection-list">
              {theory.reflectionPrompts.map((prompt) => (
                <strong key={prompt}>{prompt}</strong>
              ))}
            </div>
          </div>

          <div className="source-row">
            {pillar.authorities.map((source) => (
              <span key={source}>{source}</span>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function CardSection({ title, items }) {
  return (
    <div className="manual-section">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function TheoryBlock({ title, body }) {
  return (
    <article className="theory-section">
      <span>{title}</span>
      <p>{body}</p>
    </article>
  );
}

function QuizSection({
  completed,
  copied,
  currentIndex,
  currentItem,
  currentPillar,
  onBack,
  onCopy,
  onOpenPillar,
  onNext,
  onReset,
  onStartQuiz,
  onUpdateAnswer,
  quizStarted,
  quizState,
  snapshot,
}) {
  if (completed) {
    return (
      <SnapshotReport
        copied={copied}
        onCopy={onCopy}
        onOpenPillar={onOpenPillar}
        onReset={onReset}
        snapshot={snapshot}
      />
    );
  }

  if (!quizStarted && snapshot.completedCount === 0 && currentIndex === 0) {
    return <QuizIntro onStart={onStartQuiz} />;
  }

  const currentAnswer = quizState.answers[currentItem.id];
  const value = quizState.answers[currentItem.id] ?? 3;
  const hasAnswered = currentAnswer !== undefined;
  const progress = ((currentIndex + 1) / quizItems.length) * 100;
  const pillarProgress = pillars.map((pillar) => {
    const pillarItems = quizItems.filter((item) => item.pillarId === pillar.id);
    const answered = pillarItems.filter((item) => quizState.answers[item.id] !== undefined).length;

    return {
      ...pillar,
      answered,
      total: pillarItems.length,
      isCurrent: pillar.id === currentPillar.id,
      isDone: answered === pillarItems.length,
    };
  });

  return (
    <section className="quiz-focus section-enter">
      <div className="quiz-shell glass-card">
        <div className="quiz-topline">
          <span>{currentIndex + 1} / {quizItems.length}</span>
          <span>{currentPillar.title}</span>
        </div>
        <div className="progress-track">
          <div style={{ width: `${progress}%` }} />
        </div>
        <div className="pillar-progress-rail" aria-label="Progress pe piloni">
          {pillarProgress.map((pillar) => (
            <span
              className={[
                pillar.isCurrent ? "current" : "",
                pillar.isDone ? "done" : "",
              ].join(" ")}
              key={pillar.id}
              title={`${pillar.title}: ${pillar.answered}/${pillar.total}`}
            >
              {pillar.answered}/{pillar.total}
            </span>
          ))}
        </div>

        <div className="quiz-prompt">
          <p className="eyebrow">{currentPillar.roTitle}</p>
          <h2>{currentItem.text}</h2>
          <p>
            Răspunde sincer, nu ideal. Scopul este să observăm patternul, nu să demonstrăm ceva.
          </p>
          <div className="construct-chip">
            <Sparkles size={15} />
            <span>Observăm: {currentItem.construct}</span>
          </div>
        </div>

        <div className="slider-panel">
          <div className="answer-readout">
            <span>Răspuns selectat</span>
            <strong>{value} - {scaleLabels[value]}</strong>
          </div>
          <input
            aria-label="Răspuns quiz"
            max="5"
            min="1"
            onChange={(event) => onUpdateAnswer(currentItem.id, event.target.value)}
            step="1"
            type="range"
            value={value}
          />
          <div className="scale-row">
            {Object.entries(scaleLabels).map(([score, label]) => (
              <button
                className={Number(score) === value ? "chosen" : ""}
                key={score}
                onClick={() => onUpdateAnswer(currentItem.id, score)}
              >
                <strong>{score}</strong>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="quiz-actions">
          <button className="secondary-btn" disabled={currentIndex === 0} onClick={onBack}>
            <ArrowLeft size={18} /> Înapoi
          </button>
          <button className="primary-btn" disabled={!hasAnswered} onClick={onNext}>
            {!hasAnswered
              ? "Alege un răspuns"
              : currentIndex === quizItems.length - 1
                ? "Vezi snapshot-ul"
                : "Următorul"}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

function QuizIntro({ onStart }) {
  return (
    <section className="quiz-focus section-enter">
      <div className="quiz-intro glass-card">
        <p className="eyebrow">Short quiz</p>
        <h2>Un self-check, nu un examen.</h2>
        <p>
          Vei parcurge 48 de întrebări scurte, câte 6 pentru fiecare pilon. Răspunsurile rămân în
          browserul tău și construiesc un snapshot despre sistemul zilei tale: unde te susține, unde
          devine vulnerabil și ce merită încercat 7 zile.
        </p>

        <div className="quiz-intro-grid">
          <div>
            <strong>48</strong>
            <span>itemi reflexivi</span>
          </div>
          <div>
            <strong>1-5</strong>
            <span>scală simplă</span>
          </div>
          <div>
            <strong>3</strong>
            <span>micro-acțiuni</span>
          </div>
        </div>

        <div className="intro-note">
          <Sparkles size={18} />
          <span>Răspunsul sincer este mai valoros decât răspunsul ideal.</span>
        </div>

        <button className="primary-btn" onClick={onStart}>
          Intră în focus mode <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}

function SnapshotReport({ copied, onCopy, onOpenPillar, onReset, snapshot }) {
  return (
    <section className="section-stack section-enter">
      <div className="snapshot-hero glass-card">
        <div>
          <p className="eyebrow">Snapshot reflexiv</p>
          <h2>{snapshot.overallScore.toFixed(1)} / 5</h2>
          <p>
            Profilul tău PSP pare <strong>{snapshot.overallBand}</strong>, cu {snapshot.confidence}.
            Acesta este un semnal de sistem, nu un verdict despre caracterul tău.
          </p>
          <div className="narrative-card">
            <Sparkles size={18} />
            <span>{snapshot.narrative}</span>
          </div>
        </div>
        <div className="snapshot-pair">
          <div>
            <span>Pilon puternic</span>
            <strong>{snapshot.strongest?.title ?? "insuficient date"}</strong>
          </div>
          <div>
            <span>Pilon vulnerabil</span>
            <strong>{snapshot.vulnerable?.title ?? "insuficient date"}</strong>
          </div>
          <div>
            <span>Focus 7 zile</span>
            <strong>{snapshot.weeklyFocus}</strong>
          </div>
        </div>
      </div>

      {snapshot.vulnerable && (
        <div className="next-step-banner glass-card">
          <div>
            <span>Următorul pas firesc</span>
            <strong>Revizuiește teoria pentru {snapshot.vulnerable.title}</strong>
            <p>
              Raportul devine mai util când legi scorul de mecanismul din spate, nu doar de acțiunea
              recomandată.
            </p>
          </div>
          <button className="secondary-btn" onClick={() => onOpenPillar(snapshot.vulnerable.id)}>
            Deschide pilonul <BookOpen size={18} />
          </button>
        </div>
      )}

      <div className="report-grid">
        <article className="glass-card report-card">
          <h3>Pattern-uri principale</h3>
          {snapshot.patternDetails.map((pattern) => (
            <div className="pattern-card" key={`${pattern.pillar}-${pattern.construct}`}>
              <span>{pattern.pillar}</span>
              <strong>{pattern.construct}</strong>
              <p>Patternul tău pare să includă {pattern.label}.</p>
              <small>Scor ajustat: {pattern.score}/5</small>
            </div>
          ))}
        </article>

        <article className="glass-card report-card">
          <h3>3 micro-acțiuni pentru 7 zile</h3>
          {snapshot.recommendedActions.map((action) => (
            <div className="action-card" key={action.title}>
              <span>{action.pillar}</span>
              <strong>{action.title}</strong>
              <small>{action.reason}</small>
              <p>{action.action}</p>
              <small>Fallback: {action.fallback}</small>
            </div>
          ))}
        </article>
      </div>

      <div className="snapshot-metrics">
        <div className="metric-card glass-card">
          <span>Piloni susținători</span>
          <strong>{snapshot.supportiveCount}</strong>
          <p>Zone cu scor peste 3.5, utile ca fundație pentru schimbare.</p>
        </div>
        <div className="metric-card glass-card">
          <span>Piloni vulnerabili</span>
          <strong>{snapshot.vulnerableCount}</strong>
          <p>Zone sub 2.5 unde intervențiile trebuie să rămână mici.</p>
        </div>
        <div className="metric-card glass-card">
          <span>Contrast profil</span>
          <strong>{snapshot.spread.toFixed(1)}</strong>
          <p>Diferența dintre cel mai puternic și cel mai vulnerabil pilon.</p>
        </div>
      </div>

      <div className="score-grid">
        {snapshot.pillarScores.map((pillar) => (
          <div className="score-card glass-card" key={pillar.id}>
            <span>{pillar.title}</span>
            <strong>{pillar.score ? pillar.score.toFixed(1) : "n/a"}</strong>
            <div className="mini-track">
              <div style={{ width: `${pillar.score ? ((pillar.score - 1) / 4) * 100 : 0}%` }} />
            </div>
            <small>{pillar.band}</small>
          </div>
        ))}
      </div>

      <div className="report-actions glass-card">
        <p>
          <ShieldCheck size={18} />
          The Professional Sleeper Protocol Short quiz este o auto-evaluare reflexivă pentru insight
          personal și experimente comportamentale. Nu este instrument medical sau diagnostic.
        </p>
        <div>
          <button className="primary-btn" onClick={onCopy}>
            {copied ? <CheckCircle2 size={18} /> : <Clipboard size={18} />}
            {copied ? "Copiat" : "Copiază raportul"}
          </button>
          <button className="secondary-btn" onClick={onReset}>
            <RefreshCw size={18} /> Reset quiz
          </button>
        </div>
      </div>
    </section>
  );
}
