export const SAVE_VERSION = 1;
export const WORLD_SIZE = 176;
export const WORLD_HALF = WORLD_SIZE / 2;
export const HARVEST_RANGE = 3.6;
export const WALK_SPEED = 5.2;
export const SPRINT_SPEED = 8.1;
export const FIXED_DT = 1 / 60;

export type Phase = "title" | "faction" | "playing";
export type Overlay = "none" | "inventory" | "council" | "pause";

export type FactionId =
  | "sovereign"
  | "harvesters"
  | "guardians"
  | "innovators"
  | "nomads";

export type BiomeId =
  | "sanctuary"
  | "crystal"
  | "abyss"
  | "algae"
  | "ember"
  | "wilds";

export type ResourceType =
  | "food"
  | "water"
  | "energy"
  | "minerals"
  | "rare_alloy";

export type TutorialStep =
  | "move"
  | "harvest"
  | "inventory"
  | "epiphany"
  | "council"
  | "done";

export type Faction = {
  id: FactionId;
  name: string;
  role: string;
  blurb: string;
  accent: string;
  bonuses: { food: number; energy: number; speed: number; regen: number };
};

export type ResourceNode = {
  id: number;
  type: ResourceType;
  biome: BiomeId;
  x: number;
  z: number;
  y: number;
  baseYield: number;
  currentYield: number;
  depletion: number;
  regen: number;
  stress: number;
  restrictedUntil: number;
  lastHarvest: number;
};

export type Wanderer = {
  id: number;
  x: number;
  z: number;
  yaw: number;
  faction: FactionId;
  phase: number;
};

export type Inventory = Record<ResourceType, number>;

export type Whisper = {
  id: number;
  council: string;
  text: string;
  gate: string;
  born: number;
};

export type CouncilProposal = {
  id: number;
  title: string;
  body: string;
  mercyLabel: string;
  conserveLabel: string;
  resolved: "open" | "mercy" | "conserve";
};

export type JuiceEvent = {
  kind: "harvest" | "epiphany" | "restrict" | "council";
  x: number;
  z: number;
  t: number;
};

export type PlayerState = {
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
  vx: number;
  vz: number;
  speed: number;
  grounded: boolean;
};

export type SaveBlob = {
  version: number;
  name: string;
  faction: FactionId;
  player: Pick<PlayerState, "x" | "z" | "yaw">;
  inventory: Inventory;
  grace: number;
  valence: number;
  epiphanies: number;
  harvestCount: number;
  tutorial: TutorialStep;
  tutorialHidden: boolean;
  nodes: Array<
    Pick<
      ResourceNode,
      "id" | "depletion" | "currentYield" | "stress" | "restrictedUntil"
    >
  >;
  proposal: CouncilProposal;
  seed: number;
};

export type HudSnapshot = {
  phase: Phase;
  overlay: Overlay;
  name: string;
  faction: FactionId;
  biome: BiomeId;
  grace: number;
  valence: number;
  abundance: number;
  inventory: Inventory;
  whisper: Whisper | null;
  nearest: ResourceNode | null;
  nearestDist: number;
  tutorial: TutorialStep;
  tutorialHidden: boolean;
  proposal: CouncilProposal;
  harvestCount: number;
  epiphanies: number;
  playing: boolean;
  muted: boolean;
};
