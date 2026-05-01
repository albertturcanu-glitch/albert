# Scoring and Interpretation Model

## Purpose and Scope
The Professional Sleeper Protocol Short quiz is a **reflective self-check**, not a diagnostic instrument. It helps users notice patterns in sleep-supporting behaviors and constraints so they can choose practical next steps.

This model is designed to be:
- Simple enough for everyday use.
- Structured enough to support repeat tracking.
- Clear about uncertainty and limits.

## Core Scale (1-5)
Each item uses a 1-5 response scale.

Recommended anchor set:
- `1 = Almost never true for me`
- `2 = Rarely true for me`
- `3 = Sometimes true for me`
- `4 = Often true for me`
- `5 = Almost always true for me`

Interpretation principles:
- Higher scores should consistently mean a more sleep-supportive state **after reverse scoring is applied**.
- A 1-point difference should be treated as directional (small), not absolute.

## Reverse Scoring Logic
Some items are phrased in a risk or friction direction (example: "My mind races at bedtime"). These must be reverse-scored so that higher adjusted values always indicate a better state.

Reverse scoring transform:
- `adjusted = 6 - raw`

Examples:
- Raw `1` -> Adjusted `5`
- Raw `2` -> Adjusted `4`
- Raw `3` -> Adjusted `3`
- Raw `4` -> Adjusted `2`
- Raw `5` -> Adjusted `1`

Implementation rule:
- Maintain an explicit `reverse_scored: true/false` flag per item in the item bank.
- Never infer reversal from wording at runtime.

## Pillar Scores
Group items into defined pillars (for example, Rhythm, Downshift, Environment, Boundaries, Recovery Agency). Each item belongs to exactly one pillar.

Pillar score calculation:
1. Apply reverse scoring where required.
2. Compute the arithmetic mean of answered items in that pillar.
3. Keep internal precision for computation (at least 2 decimals).
4. Display with low precision:
- one decimal for user-facing UI, or
- nearest whole category band.

Formula:
- `pillar_mean = sum(adjusted_item_scores_in_pillar) / number_of_answered_items_in_pillar`

Optional normalized form (if needed for charts):
- `pillar_pct = ((pillar_mean - 1) / 4) * 100`

## Overall Score
Overall score is the mean of all adjusted item scores (not the mean of pillar means unless each pillar has equal item count by design).

Formula:
- `overall_mean = sum(all_adjusted_answered_items) / total_answered_items`

Display guidance:
- Show as `x.x / 5`.
- Optionally show a broad band label (for example: "Developing", "Steadier", "Strong").

## Strongest and Weakest Pillars
Identify strongest and weakest pillars from pillar means.

Rules:
- Strongest pillar = highest pillar mean.
- Weakest pillar = lowest pillar mean.
- If tie difference is `< 0.2`, report co-strong or co-weak (avoid forced rank).
- If a pillar has insufficient answered items (see stability rules), exclude it from strongest/weakest selection and mark as "insufficient data".

## Pattern Tags
Pattern tags are heuristic descriptors, not labels of disorder.

Recommended generation approach:
1. Define tag rules based on pillar profiles and spread.
2. Require minimum data quality before assigning tags.
3. Cap tags to 1-3 per report.

Example tag rules (illustrative):
- `rhythm-drift`: Rhythm <= 2.8 and at least 3 Rhythm items answered.
- `high-effort-low-return`: Recovery Agency >= 3.8 and Overall <= 3.0.
- `wind-down-friction`: Downshift <= 2.8.
- `context-pressure`: Boundaries <= 2.8 and Environment <= 3.0.
- `stable-foundation`: All pillars >= 3.6 with no pillar below 3.3.

Tag safety constraints:
- Use behavioral/context language.
- Avoid medicalized names.
- Show tags as "current pattern signals," not identity statements.

## Confidence Thresholds
Confidence should reflect completeness and consistency, not certainty about health status.

Suggested confidence bands:
- `Low confidence`: < 60% of total items answered, or any scored pillar below minimum item count.
- `Moderate confidence`: 60-84% answered and all scored pillars meet minimum count.
- `Higher confidence`: >= 85% answered, all pillars meet minimum count, and no straight-lining pattern detected.

Optional response-quality checks:
- Straight-lining flag: same response on >= 80% of items.
- Completion speed flag: abnormally fast completion relative to expected read time.

When flagged, downgrade confidence by one band.

## Minimum Items for Stable Interpretation
For a short reflective quiz, use conservative minimums:
- Per pillar minimum: `>= 2` answered items (hard minimum), `>= 3` preferred.
- Overall minimum for directional summary: `>= 8` total answered items.
- Overall preferred for stable profile: `>= 12` answered items.

If minimums are not met:
- Suppress strongest/weakest claims.
- Suppress pattern tags.
- Provide only a brief "not enough data yet" reflection.

## Avoiding False Precision
To prevent over-interpretation:
- Do not display more than 1 decimal place.
- Do not imply rank when pillar differences are small (`< 0.2`).
- Use score bands, not micro-differences, for guidance.
- Include uncertainty language tied to confidence band.
- Prefer "current snapshot" wording over stable-trait wording.

Recommended 1-5 score bands:
- `1.0-2.4`: Friction-heavy right now
- `2.5-3.4`: Mixed / variable
- `3.5-4.2`: Generally supportive
- `4.3-5.0`: Strongly supportive

## Writing Non-Clinical Interpretations
Interpretations should be:
- Behavioral, contextual, and actionable.
- Time-bound ("right now", "this period").
- Non-pathologizing.

Template structure:
1. Snapshot statement (overall + confidence).
2. Strength statement (strongest pillar).
3. Constraint statement (weakest pillar).
4. One-step experiment suggestion.
5. Gentle reminder of non-diagnostic scope.

Example template:
"Your current sleep-support profile is **Mixed / variable** (`3.1/5`, moderate confidence). Your strongest area is **Environment**, which suggests you already have some reliable foundations. **Downshift** looks like the biggest friction point right now. A useful next experiment is a 20-minute pre-sleep transition routine for 7 nights. This check-in reflects current patterns and is not a medical diagnosis."

## Ethical Cautions
- This tool must not diagnose, screen, or rule out medical or psychiatric conditions.
- Avoid deterministic claims ("you have", "you are").
- Avoid fear-based messaging.
- Avoid normative pressure or shame language.
- Be careful with vulnerable users (fatigue, burnout, anxiety): keep language supportive and non-alarming.
- Include referral guidance for safety-critical situations (for example, severe insomnia symptoms, daytime safety risk, self-harm thoughts): encourage licensed professional support or emergency services where appropriate.

## Safe vs Unsafe Report Language
Safe language examples:
- "Your responses suggest a current pattern of wind-down friction."
- "This looks like a mixed week rather than a fixed trait."
- "Confidence is low because several items were skipped."
- "Consider this a starting point for small experiments."
- "If sleep difficulties are persistent or worsening, consider speaking with a licensed clinician."

Unsafe language examples:
- "You have chronic insomnia."
- "Your nervous system is dysregulated."
- "You are a poor sleeper by type."
- "This score proves your sleep is unhealthy."
- "You should fix this immediately or your health will decline."

## Reflective vs Diagnostic Distinction (Required Product Copy)
Use a visible disclaimer near results:

"The Professional Sleeper Protocol Short quiz is a reflective self-assessment designed for personal insight and behavior change experiments. It is not a diagnostic or medical tool, and it does not diagnose sleep disorders or mental health conditions."

Optional secondary line:

"If your sleep problems are persistent, distressing, or affecting daytime safety, seek evaluation from a qualified healthcare professional."

## Implementation Checklist
- Item bank includes pillar mapping and reverse-score flags.
- Scoring engine applies reverse transform before any aggregates.
- Minimum-data gates control which outputs are shown.
- Confidence band shown with every interpretation.
- Output language filter prevents diagnostic wording.
- UI shows reflective-not-diagnostic disclaimer on quiz and results screens.
