# Educational Architecture — The Professional Sleeper Protocol

## 1. Purpose
This document defines how PSP should teach behavior change, not just deliver content.

Target outcome: users do not only "know" the protocol; they repeatedly apply it in real life, recover after misses, and build self-trust.

Design principle: every learning moment must pass through this chain:
1. Understand
2. Retrieve
3. Apply
4. Reflect
5. Adapt
6. Repeat

---

## 2. Learning Model: From Theory to Behavior

PSP should use a layered educational system:
1. **Concept encoding (short theory):** teach one behavioral principle in plain language.
2. **Active recall (short quiz):** force memory retrieval and discrimination under realistic scenarios.
3. **Micro-practice (daily action):** assign one tiny behavior that can be executed the same day.
4. **Reflection prompts (metacognition):** ask what happened, why, and what to adjust.
5. **Spaced repetition (timed reactivation):** revisit key ideas after 1 day, 3 days, 7 days, and in weekly review.
6. **Feedback (immediate + weekly):** show pattern-level interpretation and one next best action.

This architecture translates educational psychology into product behavior:
- Active recall: quiz and scenario choice.
- Self-explanation: user explains why they chose an action and what pattern was active.
- Reflection: daily and weekly prompts.
- Micro-practice: small, low-friction reps.
- Spaced repetition: scheduled revisit of prior concepts.
- Feedback: action-specific, non-shaming guidance.

---

## 3. Module Blueprint (What Users Learn, Do, Reflect)

Each module must include four blocks:
1. **Understand:** what the user should grasp conceptually.
2. **Practice:** one primary and one fallback micro-action.
3. **Reflect:** short prompts to convert experience into learning.
4. **Reinforce:** how the app should revisit and strengthen this module over time.

### 3.1 Do Hard Things
- Understand:
  - Avoidance creates short-term relief and long-term stress.
  - Action can happen before motivation.
  - A tiny start (2–10 min) is a valid behavioral win.
- Practice:
  - Primary: one "hard thing" started before noon.
  - Fallback: 2-minute start on the avoided task.
- Reflect:
  - "What discomfort did I avoid today?"
  - "What tiny action reduced future regret?"
- Reinforce:
  - Re-ask approach-vs-avoidance scenarios every 3–7 days.
  - Weekly report tracks "return speed after avoidance." 

### 3.2 The Night Before
- Understand:
  - Evening behaviors are upstream drivers of sleep quality.
  - Light, stimulation, caffeine/alcohol timing, and closure affect sleep readiness.
- Practice:
  - Primary: 20–60 minute wind-down with phone out of bed.
  - Fallback: 2-minute closure note + phone away from reach.
- Reflect:
  - "What kept my brain in day mode tonight?"
  - "What would make bedtime easier tomorrow?"
- Reinforce:
  - Daily evening check prompt.
  - Weekly trend on bedtime friction triggers.

### 3.3 Start With Purpose
- Understand:
  - Mornings set attentional direction (reactive vs intentional).
  - Body-first cues (light, water, movement) stabilize regulation.
- Practice:
  - Primary: no-phone start + water + light + 1–3 min movement + one priority sentence.
  - Fallback: one anchor action before phone.
- Reflect:
  - "Who set my day first: me or my notifications?"
  - "What morning cue worked best?"
- Reinforce:
  - Morning check-in asks if first action was intentional.
  - Spaced reminder on "minimum viable morning" after low-adherence days.

### 3.4 Train the Future Body
- Understand:
  - Movement supports sleep pressure, energy regulation, and long-term autonomy.
  - Continuity matters more than perfect workouts.
- Practice:
  - Primary: planned movement session (scaled by level).
  - Fallback: 10-minute minimum movement or movement snack.
- Reflect:
  - "Did my body earn sleep today?"
  - "What blocked movement, and how can I reduce that friction?"
- Reinforce:
  - Daily yes/no movement signal.
  - Weekly consistency score (not intensity score).

### 3.5 Food as Medicine
- Understand:
  - Food timing and quality influence energy, cravings, and sleep.
  - Stability beats perfection.
- Practice:
  - Primary: protein + fiber first meal; structured evening meal timing.
  - Fallback: one emergency "safe meal" choice.
- Reflect:
  - "Was I hungry, stressed, or both?"
  - "Which meal improved or hurt evening stability?"
- Reinforce:
  - Check-ins include context tags (late meal, stress eating, high-UPF day).
  - Weekly report identifies repeated food-context patterns.

### 3.6 Kill Distractions
- Understand:
  - Attention fragmentation increases stress carryover and weakens sleep readiness.
  - Environment design beats willpower-only control.
- Practice:
  - Primary: one notification-silent focus block.
  - Fallback: 2-minute no-phone pause before reactive checking.
- Reflect:
  - "When did I lose attention control today?"
  - "What environmental change would prevent that tomorrow?"
- Reinforce:
  - Repeated scenarios on attention residue and phone reflex loops.
  - Weekly report tracks highest-risk time windows.

### 3.7 End Isolation
- Understand:
  - Social connection regulates stress and supports behavioral resilience.
  - Isolation often increases unhealthy coping loops.
- Practice:
  - Primary: one meaningful human contact (2–10 min).
  - Fallback: one low-pressure message.
- Reflect:
  - "Did I reach for people or only for my phone under stress?"
  - "What made connection easier or harder?"
- Reinforce:
  - Daily optional social check.
  - Weekly correlation between isolation days and behavior drift.

### 3.8 Build Self-Trust
- Understand:
  - Self-trust is built through repeated kept promises.
  - Recovery after misses is more important than perfection.
- Practice:
  - Primary: 1–3 tiny promises/day, executed visibly.
  - Fallback: one repair action after a miss.
- Reflect:
  - "What promise did I keep today?"
  - "How quickly did I return after a miss?"
- Reinforce:
  - Daily "evidence log" of kept promises.
  - Weekly self-trust report: keep, break, repair, return latency.

---

## 4. Reinforcement Over Time (How the App Should Teach Longitudinally)

### 4.1 Spaced repetition schedule
Every module concept should be reactivated on a cadence:
1. First exposure: module completion day.
2. First revisit: next day (quick recall prompt).
3. Second revisit: day 3 (scenario-based recall).
4. Third revisit: day 7 (applied reflection in weekly review).
5. Ongoing revisits: when behavior data indicates drift.

### 4.2 Adaptive reinforcement rules
- If understanding is high but execution is low: assign easier micro-practice and friction-reduction prompt.
- If quiz is weak but behavior effort is high: resurface theory with clearer examples.
- If both are low: reduce load to one module and one tiny promise.
- If both are stable: increase challenge with more complex scenarios.

### 4.3 Feedback standards
All feedback should be:
- Specific (time/context-trigger linked).
- Actionable (one next step, one fallback).
- Non-shaming (pattern language, not character labels).
- Time-bounded (today/tonight/tomorrow framing).

---

## 5. Unified Learning System: How Features Connect

PSP features should function as one loop, not isolated screens.

### 5.1 System flow
1. **Dive Deeper** (concept building):
   - User learns one key mechanism and sees examples.
2. **Short Quiz** (active recall + discrimination):
   - User selects responses in realistic scenarios.
   - System gives immediate explanation and identifies likely behavior pattern.
3. **Daily Check-in** (micro-practice + reflection):
   - User reports whether assigned micro-actions were done.
   - User tags friction/context and adds one sentence reflection.
4. **Daily Feedback Card** (feedforward):
   - System outputs one "next best action" for the next 24 hours.
5. **Weekly Report** (pattern synthesis + adaptation):
   - System summarizes trends across modules, identifies strongest lever and biggest leak, and sets next week plan.

### 5.2 Role of each feature in the educational architecture
- Dive Deeper:
  - Primary role: comprehension.
  - Secondary role: seed reflection question for later retrieval.
- Short Quiz:
  - Primary role: memory retrieval and error correction.
  - Secondary role: diagnose execution barriers.
- Daily check-ins:
  - Primary role: transfer learning into behavior.
  - Secondary role: collect context for adaptive coaching.
- Reports:
  - Primary role: metacognitive learning and plan adjustment.
  - Secondary role: reinforce identity evidence and self-trust.

### 5.3 Closed-loop design rule
A concept is considered "learned" only when all three conditions are true:
1. User can recall it (quiz performance).
2. User applies it (micro-practice completion).
3. User explains it in personal context (reflection quality).

If any of the three is missing, the app should recycle the concept with reduced complexity and clearer prompts.

---

## 6. Practical Implementation Blueprint (Non-Technical)

### 6.1 At module completion
- Ask 1 retrieval question.
- Ask user to choose 1 micro-action for today.
- Ask "When exactly will you do it?"

### 6.2 In daily flow
- Keep check-in under 60 seconds.
- Use one reflection sentence maximum.
- Return one action recommendation only.

### 6.3 In weekly flow
- Show three sections only:
  - What improved.
  - What repeated.
  - What to do next week (1 primary + 2 support actions).

### 6.4 In failure recovery
- Use a fixed sequence: notice -> normalize -> reduce -> restart -> log evidence.
- Never prescribe punishment or overcorrection.

---

## 7. Success Criteria for the Educational System

The architecture is working when:
- Quiz scores improve and remain stable over weeks.
- Daily micro-practice completion is consistent (not perfect).
- Return-after-miss time gets shorter.
- Users can name their top friction patterns and preferred repair actions.
- Weekly reports show fewer repeated breakdowns in the same context windows.

If users report understanding but no behavior change, the issue is likely one of transfer design, not content depth.

---

## 8. Final Product Principle

PSP should behave like a calm behavior-change coach:
- teach clearly,
- test recall quickly,
- require tiny real-world action,
- help users interpret results,
- guide fast recovery,
- and repeat until self-trust becomes automatic.
