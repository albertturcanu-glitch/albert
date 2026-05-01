# Product Component Roadmap - The Professional Sleeper Protocol

This roadmap translates the PSP theory, feedback loops, quiz design, and current app direction into shippable product components.

Complexity scale used below:
- Low: straightforward UI + local state.
- Medium: structured data, conditional UI, and simple rule logic.
- High: multi-step logic, cross-component dependencies, and persistence/reporting.

## 1) Landing / Core Idea Page

Purpose:
- Frame PSP as a behavior system (not a sleep tips page).
- Reduce confusion and increase motivation to start the quiz.

Required data:
- Core thesis copy.
- 8-pillar summary labels.
- Primary CTA targets (Start Quiz, Explore Theory).

User interaction:
- Scroll/read hero and core idea.
- Tap CTA to enter quiz or pillar/theory area.

UI behavior:
- Clear visual hierarchy: headline, short explanation, 1-2 CTAs.
- Optional quick preview of “what you get” (snapshot + 7-day plan).

Copy requirements:
- Calm, non-judgmental framing.
- Emphasize: calibration, not evaluation.
- One-sentence promise: “Small actions, repeated, build self-trust and better sleep outcomes.”

Implementation complexity:
- Low.

Priority:
- MVP.

## 2) Pillar Cards

Purpose:
- Present the 8-pillars model as navigable mental map.
- Help users identify likely weak links before deep reading.

Required data:
- Pillar title, subtitle, short thesis.
- Optional status flags from quiz/snapshot (strong/watch/vulnerable).

User interaction:
- Browse/select pillar cards.
- Open pillar detail/theory layers.

UI behavior:
- Grid/list of 8 cards.
- Active selection highlight.
- Optional badges after quiz (“Your current focus”).

Copy requirements:
- One sharp plain-language thesis per pillar.
- Avoid technical overload on card face.

Implementation complexity:
- Low to Medium.

Priority:
- MVP.

## 3) Theory / Manual Cards

Purpose:
- Teach mechanism + common traps + repair actions for each pillar.
- Convert concepts into executable behavior.

Required data:
- Two-layer content per pillar:
  - Core idea (short).
  - Dive deeper (mechanisms, traps, repair).
- Example behaviors and tiny actions.

User interaction:
- Toggle short/deep layer.
- Read examples and repair prompts.

UI behavior:
- Expand/collapse or tabbed two-layer presentation.
- Keep scan-friendly sections: Why it matters, Failure mode, Repair.

Copy requirements:
- Educational but concise.
- Action-first ending (“Try this today”).

Implementation complexity:
- Medium (content modeling + rendering).

Priority:
- MVP.

## 4) Short Quiz Full-Screen Item

Purpose:
- Run active recall/self-check and produce pillar scores.
- Gather baseline for snapshot + protocol personalization.

Required data:
- Quiz bank items mapped to pillar and polarity (normal/reversed).
- Item prompt, optional context hint.
- Answer scale mapping (1-5).

User interaction:
- Answer one full-screen item at a time.
- Navigate next/back, submit completion.

UI behavior:
- Single-item focus to reduce cognitive load.
- Progress indicator.
- Save in-progress state.

Copy requirements:
- Frame as mirror, not exam.
- Reinforce “honest answer > ideal answer.”

Implementation complexity:
- Medium.

Priority:
- MVP.

## 5) Slider Scale

Purpose:
- Standardize response input for reflective items.
- Produce consistent numeric data for scoring.

Required data:
- Scale definition (1-5).
- Anchors/labels per edge (rarely/consistently etc.).

User interaction:
- Drag/tap slider value.

UI behavior:
- Mobile-friendly large hit area.
- Snap to integer steps.
- Immediate visual feedback.

Copy requirements:
- Stable anchor language reused across quiz/check-ins.
- Optional short helper text for interpretation consistency.

Implementation complexity:
- Low.

Priority:
- MVP.

## 6) Snapshot Report

Purpose:
- Return immediate interpretation after quiz.
- Identify strongest pillar, vulnerable pillar, and weekly focus.

Required data:
- Pillar scores (normalized 0-100).
- Confidence signal (input completeness/quality).
- Priority-selection logic.

User interaction:
- Review strengths and vulnerabilities.
- Accept suggested focus or continue to protocol.

UI behavior:
- Compact summary with plain-language interpretation.
- Show strongest + weakest + “focus this week.”
- Include confidence warning when sparse data.

Copy requirements:
- Neutral, precise, non-punitive tone.
- Balance strengths + next action.

Implementation complexity:
- Medium to High (scoring + interpretation rules).

Priority:
- MVP.

## 7) 7-Day Micro-Protocol Card

Purpose:
- Convert report insight into a concrete 7-day plan.
- Keep plan small enough to execute under stress.

Required data:
- Weakest pillar + supporting pillar selection.
- Action templates with cue, tiny action, fallback.
- Current user context (energy/time pattern if available).

User interaction:
- Review/adopt plan.
- Mark actions complete daily.
- Regenerate or adjust protocol.

UI behavior:
- Three tiny actions for 7 days.
- Day-by-day checklist and completion state.
- Regenerate option with guardrails (avoid over-switching).

Copy requirements:
- Specific, low-friction, shame-free wording.
- Include fallback version for hard days.

Implementation complexity:
- High.

Priority:
- MVP (minimum version), deeper adaptation in v1.

## 8) Daily Check-In

Purpose:
- Capture daily signals in under 60 seconds.
- Power adaptive feedback and reinforce consistency.

Required data:
- Core daily items (energy, completion, key context tags).
- Optional behavioral context (late meal, caffeine timing, stress flags).
- Timestamp and completion state.

User interaction:
- Fast one-minute logging.
- Minimum viable check-in on hard days.

UI behavior:
- One-tap defaults.
- Smart reminders by preferred time.
- “Done for today” confirmation.

Copy requirements:
- Friction-reducing prompts.
- Recovery language after misses (“return fast” framing).

Implementation complexity:
- Medium.

Priority:
- MVP.

## 9) Weekly Mirror

Purpose:
- Synthesize weekly trends and adherence patterns.
- Translate data into one adjustment for next week.

Required data:
- 7-day check-in history.
- Pillar trend changes.
- Adherence/return latency metrics.

User interaction:
- Review week summary.
- Choose next week adjustment.

UI behavior:
- Weekly trend view (stable/watch/vulnerable).
- Highlights: what improved, what drifted, what to try next.

Copy requirements:
- Interpretive and grounded, not data-dump.
- Emphasize momentum over perfection.

Implementation complexity:
- High.

Priority:
- v1.

## 10) Self-Trust Evidence Log

Purpose:
- Build identity-level reinforcement through kept promises.
- Track return after misses as success signal.

Required data:
- Evidence moments (promise kept, miss repaired, return time).
- Linked pillar/context metadata.

User interaction:
- Log evidence in one tap or quick note.
- Review personal proof history.

UI behavior:
- Lightweight timeline/cards.
- Optional filter by pillar or week.

Copy requirements:
- Identity-building language (“proof you can rely on yourself”).
- No perfection framing.

Implementation complexity:
- Medium.

Priority:
- v1.

## 11) Copy-to-ChatGPT Report

Purpose:
- Let users export structured self-check context for coaching/reflection.
- Extend value outside app without full account complexity.

Required data:
- Snapshot summary.
- Current 7-day protocol.
- Recent check-in patterns (brief).

User interaction:
- Tap copy button.
- Paste into ChatGPT or notes.

UI behavior:
- Preformatted plain-text block.
- Confirmation toast after copy.

Copy requirements:
- Clear section labels.
- Privacy-conscious language (“review before sharing”).

Implementation complexity:
- Low.

Priority:
- MVP.

## 12) Settings / Reset / Export

Purpose:
- Give users control over reminders, data, and recovery actions.
- Support trust via transparency and reversibility.

Required data:
- Reminder preferences.
- Local data storage references.
- Export schema (JSON/text).

User interaction:
- Edit preferences.
- Reset protocol or full app data.
- Export personal data/report.

UI behavior:
- Clear separation: safe changes vs destructive actions.
- Confirmation dialogs for reset.
- Simple export flow.

Copy requirements:
- Explicit consequence language for reset.
- Reassuring control-oriented tone.

Implementation complexity:
- Medium.

Priority:
- v1 (minimum settings may ship in MVP if reminders are included).

## Priority Rollup

MVP:
- Landing/Core Idea Page
- Pillar Cards
- Theory/Manual Cards
- Short Quiz Full-Screen Item
- Slider Scale
- Snapshot Report
- 7-Day Micro-Protocol Card (minimum generator)
- Daily Check-In
- Copy-to-ChatGPT Report

v1:
- Weekly Mirror
- Self-Trust Evidence Log
- Settings/Reset/Export (full)
- 7-Day Micro-Protocol adaptive improvements

Later:
- Advanced trend visuals and cohort comparisons
- Deeper adaptive sequencing across pillars
- Multi-week protocol auto-tuning based on adherence patterns
