export type RoomId =
  | "gate"
  | "outer-walls"
  | "chamber-shadows"
  | "war-room"
  | "icm-hall"
  | "future-tower";

export type Phase = "early" | "middle" | "late" | "bubble" | "final-table";

export type NodeType =
  | "rfi"
  | "vs-open"
  | "vs-3bet"
  | "squeeze"
  | "jam-decision"
  | "pko-iso"
  | "postflop-pressure";

export type PKOContext = "non-pko" | "pko";

export type VillainId =
  | "rec-sticky-overcaller"
  | "rec-passive-value"
  | "rec-aggro-spewy"
  | "std-multi-reg"
  | "pressure-reg"
  | "semi-reg-incomplete"
  | "soft-blind-overfolder"
  | "tight-ep-reg"
  | "shortstack-pko-reg";

export type FeedbackTag = "clar_ev_plus" | "exploit_ok" | "prea_fin_pentru_field";

export type LeakCategory =
  | "overrespecting-aggression"
  | "overfolding-wide-nodes"
  | "overcalling-curiosity"
  | "fancy-lines-bad-field"
  | "broadway-domination-preflop"
  | "river-heroism-underbluffed"
  | "thin-value-missed-vs-recs"
  | "oos-shove-flat-fold-confusion"
  | "oovs3bet-discipline";

export interface Room {
  id: RoomId;
  name: string;
  focus: string;
  order: number;
}

export interface TrainingModule {
  id: string;
  roomId: RoomId;
  title: string;
  focus: string;
  family: string;
  defaultNodeTypes: NodeType[];
}

export interface PoolTendency {
  id: string;
  title: string;
  summary: string;
  practicalDefault: string;
}

export interface VillainArchetype {
  id: VillainId;
  label: string;
  summary: string;
  tendencies: {
    preflop: string;
    aggression: string;
    callDown: string;
    pkoBehavior: string;
    icmSensitivity: string;
  };
}

export interface ScenarioOption {
  id: string;
  label: string;
  action: string;
}

export interface Scenario {
  id: string;
  theme: string;
  roomId: RoomId;
  moduleId: string;
  family: string;
  phase: Phase;
  nodeType: NodeType;
  villainId: VillainId;
  title: string;
  context: string;
  heroHand: string;
  positions: string;
  stackSizes: string;
  actionHistory: string;
  boardRunout?: string;
  pkoContext: PKOContext;
  bountyRelevant: boolean;
  question: string;
  options: ScenarioOption[];
  correctOptionId: string;
  tag: FeedbackTag;
  relevantPoolTendencyId: string;
  exploitExplanation: string;
  whyAlternativesWrong: string[];
  typicalThinkingError: string;
  memorableInscription: string;
  difficulty: 1 | 2 | 3;
  leakCategories: LeakCategory[];
  stackBand: "10-15bb" | "16-20bb" | "21-30bb" | "31-45bb" | "46bb+";
}

export interface ScenarioFilter {
  roomId?: RoomId;
  moduleId?: string;
  family?: string;
  villainId?: VillainId;
  phase?: Phase;
  pkoContext?: PKOContext;
  stackBand?: Scenario["stackBand"];
  nodeType?: NodeType;
}
