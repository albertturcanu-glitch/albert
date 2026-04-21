# MTT Exploit Dojo v2

A serious browser-based exploit training environment for small-stakes online MTT players ($5-$30 focus) who multitables heavily.

## Architecture (V2)

- **Framework**: Next.js App Router + TypeScript + Tailwind.
- **Domain-first model** in `lib/types/domain.ts`.
- **Content/data layer** in `lib/data/` (`catalog.ts`, `scenarios.ts`).
- **Scenario engine** in `lib/engine/scenario-engine.ts`.
- **Progress and leak analytics** in `lib/engine/progress.ts`.
- **UI** assembled in `app/page.tsx` with modular sections for:
  - Dojo / Scenario Training
  - Dashboard / Progress
  - Pool Tendencies Library
  - Module Browser
  - Room Browser
  - Manual / Principles

## Expansion strategy

1. Add scenarios by appending objects to `lib/data/scenarios.ts` using the typed schema.
2. Add new training modules in `lib/data/catalog.ts` and reference module IDs in scenarios.
3. Add new rooms, villain archetypes, tendencies, and leak categories in the domain model.
4. Replace localStorage with API/db persistence by preserving `Attempt` shape in `lib/engine/progress.ts`.

## Implemented in this milestone

- Strong typed schema for rooms/modules/tendencies/archetypes/scenarios/leaks.
- Room-aware and module-aware scenario filtering.
- Compression mode with timer and fast action loop.
- Feedback engine with EV tags, tendency references, exploit explanations, and error framing.
- Progress dashboard with accuracy, speed, leak patterns, and next module suggestions.
- Seeded preflop-heavy content:
  - 5 preflop modules
  - 25 scenarios total
  - PKO + non-PKO coverage
  - bubble/ICM-ready structure

## V2.1 upgrades

- Added 7-day and 30-day accuracy/speed trend metrics.
- Added a day-by-day trend strip for recent study consistency.
- Added leak heatmap severity (green/amber/red) for quick pattern recognition.
- Added recommendation engine that maps recurring leak categories to next best module.
- Expanded preflop scenario seed pack to 25 total scenarios.

## Run

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.
