import { factionById } from "./factions";
import {
  harvestMultiplier,
  isHarvestViable,
  shouldPlayConservatively,
  type MercyContext,
} from "./mercy";
import { persistSave, loadSave } from "./save";
import { sfxCouncil, sfxEpiphany, sfxHarvest, sfxRestrict, sfxRest, sfxUi, setBiomePad, isMuted } from "./audio";
import {
  FIXED_DT,
  GRAVITY,
  HARVEST_RANGE,
  JUMP_VEL,
  NEARBY_RANGE,
  SPRINT_SPEED,
  WALK_SPEED,
  WORLD_HALF,
  type CouncilProposal,
  type FactionId,
  type HudSnapshot,
  type Inventory,
  type JuiceEvent,
  type NearbySoul,
  type Overlay,
  type Phase,
  type PlayerState,
  type ResourceNode,
  type SaveBlob,
  type TutorialStep,
  type Wanderer,
  type Whisper,
} from "./types";
import { BIOME_LABEL, biomeAt, heightAt, spawnNodes, spawnWanderers } from "./world";
import { EPIPHANY_LINES, whisperFor } from "./whispers";
import { restWhisper, tickAutonomousRest } from "./patsagi";
import { sampleActions, setInjectedKeys } from "./input";

export { BIOME_LABEL };
