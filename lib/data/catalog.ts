import { PoolTendency, Room, TrainingModule, VillainArchetype } from "@/lib/types/domain";

export const rooms: Room[] = [
  { id: "gate", name: "Gate / Identity", focus: "Profile + leaks + training intent", order: 1 },
  { id: "outer-walls", name: "Outer Walls", focus: "Preflop architecture and defense", order: 2 },
  { id: "chamber-shadows", name: "Chamber of Shadows", focus: "Medium-strength decisions", order: 3 },
  { id: "war-room", name: "War Room", focus: "Reg pressure and pattern attacks", order: 4 },
  { id: "icm-hall", name: "ICM Hall", focus: "Bubble / FT risk pressure", order: 5 },
  { id: "future-tower", name: "Future Tower", focus: "Meta-game and pool evolution", order: 6 }
];

export const modules: TrainingModule[] = [
  {
    id: "m1-late-opens-vs-blind-leaks",
    roomId: "outer-walls",
    title: "Late opens vs blind leaks",
    focus: "Steal wider vs overfolding blinds; tighten vs sticky defenders.",
    family: "Preflop Foundations",
    defaultNodeTypes: ["rfi", "vs-open"]
  },
  {
    id: "m2-respect-tight-ep-mp",
    roomId: "outer-walls",
    title: "Respect tighter EP/MP opens",
    focus: "Avoid dominated flats and ego 3-bets versus tight opens.",
    family: "Preflop Foundations",
    defaultNodeTypes: ["vs-open", "squeeze"]
  },
  {
    id: "m3-oop-vs-3bet-discipline",
    roomId: "outer-walls",
    title: "OOP vs 3-bet discipline",
    focus: "Cut low-EV calls, simplify around robust 4-bet/jam/fold trees.",
    family: "Preflop Foundations",
    defaultNodeTypes: ["vs-3bet"]
  },
  {
    id: "m4-20-30bb-clarity",
    roomId: "outer-walls",
    title: "20–30bb shove / flat / fold clarity",
    focus: "Reduce mixed errors and preserve stack utility under pressure.",
    family: "Preflop Foundations",
    defaultNodeTypes: ["jam-decision", "vs-open"]
  },
  {
    id: "m5-pko-cover-short-aggressor",
    roomId: "outer-walls",
    title: "PKO when covering a shorter aggressor",
    focus: "Use bounty leverage without punting tournament life.",
    family: "Preflop Foundations",
    defaultNodeTypes: ["pko-iso", "jam-decision"]
  }
];

export const tendencies: PoolTendency[] = [
  {
    id: "pool-1-incomplete-preflop",
    title: "Incomplete preflop integration",
    summary: "Pool misbuilds ranges and defends inconsistently.",
    practicalDefault: "Print EV with clean structural opens/3-bets and avoid marginal vanity lines."
  },
  {
    id: "pool-2-rec-overcall-value",
    title: "Recs overcall value nodes",
    summary: "Sticky calls make thicker value higher EV.",
    practicalDefault: "Prefer value-dense routes and avoid spewy bluff additions."
  },
  {
    id: "pool-3-underbluff-polar",
    title: "Underbluff in expensive polarized nodes",
    summary: "Large turn/river aggression is underbluffed on average.",
    practicalDefault: "Default overfold versus big expensive lines unless strong reads."
  },
  {
    id: "pool-4-overbluff-wide",
    title: "Overbluff in wide noisy nodes",
    summary: "Autopilot barrels appear when ranges stay wide.",
    practicalDefault: "Do not auto-overfold medium bluff-catchers in wide structures."
  },
  {
    id: "pool-5-regs-standard-over-chaos",
    title: "Regs better in standard than chaos",
    summary: "Multitablers execute standard spots, leak in complex relational nodes.",
    practicalDefault: "Apply pressure in awkward branches that resist autopilot."
  },
  {
    id: "pool-6-non-homogeneous",
    title: "Pool softness varies by context",
    summary: "Satellite windows, PKO, stage, and late reg alter behavior.",
    practicalDefault: "Anchor defaults, then re-weight by format/stage quickly."
  }
];

export const archetypes: VillainArchetype[] = [
  {
    id: "rec-sticky-overcaller",
    label: "Recreational sticky overcaller",
    summary: "Calls too much pre and post; hates folding pairs and broadways.",
    tendencies: {
      preflop: "Overcalls opens and 3-bets in-position too wide.",
      aggression: "Low raise frequency, mostly call-heavy.",
      callDown: "Station tendencies in bluff-catch zones.",
      pkoBehavior: "Overchases bounties with dominated holdings.",
      icmSensitivity: "Low, especially away from FT."
    }
  },
  {
    id: "rec-passive-value",
    label: "Recreational passive value-heavy bettor",
    summary: "Passive until strong value; aggression skews honest.",
    tendencies: {
      preflop: "Limp/call and call-open patterns dominate.",
      aggression: "Bets big mainly with made strength.",
      callDown: "Calls small often, folds to sustained heat.",
      pkoBehavior: "Bounty-aware but not balanced.",
      icmSensitivity: "Moderate late, low early."
    }
  },
  {
    id: "rec-aggro-spewy",
    label: "Recreational aggro / spewy pressure",
    summary: "Presses buttons aggressively with weak filtering.",
    tendencies: {
      preflop: "Loose opens, random 3-bets and jams.",
      aggression: "High frequency without range discipline.",
      callDown: "Can punt stacks in ego battles.",
      pkoBehavior: "Massive bounty overreach.",
      icmSensitivity: "Very low."
    }
  },
  {
    id: "std-multi-reg",
    label: "Standard multitabling reg",
    summary: "Solid templates, simplified under time pressure.",
    tendencies: {
      preflop: "Reasonable charts, occasional overfold blind defense.",
      aggression: "Predictable in high-volume nodes.",
      callDown: "Disciplined but avoids marginal hero spots.",
      pkoBehavior: "Structured and risk-managed.",
      icmSensitivity: "Moderate-high near bubbles/FT."
    }
  },
  {
    id: "pressure-reg",
    label: "Pressure reg / stack-aware reg",
    summary: "Uses stack leverage aggressively in key phases.",
    tendencies: {
      preflop: "Targets capped ranges effectively.",
      aggression: "Well-timed pressure spikes.",
      callDown: "More accurate than average reg.",
      pkoBehavior: "Balanced with bounty incentives.",
      icmSensitivity: "High."
    }
  },
  {
    id: "semi-reg-incomplete",
    label: "Semi-reg simplified incomplete",
    summary: "Understands core ideas, misses mixed-depth detail.",
    tendencies: {
      preflop: "Uses generic charts without stage adjustment.",
      aggression: "One-size c-bet and delayed pressure frequencies.",
      callDown: "Too linear in bluff-catch logic.",
      pkoBehavior: "Often too passive with cover.",
      icmSensitivity: "Inconsistent."
    }
  },
  {
    id: "soft-blind-overfolder",
    label: "Soft blind overfolder",
    summary: "Defends blinds too tight; gives up steal EV.",
    tendencies: {
      preflop: "Folds BB/SB excessively versus LP opens.",
      aggression: "Rare 3-bets without premiums.",
      callDown: "Not sticky postflop OOP.",
      pkoBehavior: "Still overfolds despite bounty.",
      icmSensitivity: "Average."
    }
  },
  {
    id: "tight-ep-reg",
    label: "Tight EP reg",
    summary: "Constructs disciplined early-position opening ranges.",
    tendencies: {
      preflop: "Narrow EP/MP opens with low trash frequency.",
      aggression: "Linear, value-forward from early seats.",
      callDown: "Fewer weak showdown punts.",
      pkoBehavior: "Conservative early-position posture.",
      icmSensitivity: "High when payouts matter."
    }
  },
  {
    id: "shortstack-pko-reg",
    label: "Short-stack PKO pressure reg",
    summary: "Uses bounty-adjusted reshove ranges well.",
    tendencies: {
      preflop: "Aggressive 15-25bb reshove decisions.",
      aggression: "Polar spikes around bounty coverage.",
      callDown: "Selective but aware of KO odds.",
      pkoBehavior: "Strong bounty EV integration.",
      icmSensitivity: "Moderate-high."
    }
  }
];
