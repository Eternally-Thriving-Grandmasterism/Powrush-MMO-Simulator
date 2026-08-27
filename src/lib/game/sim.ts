import { factionById } from "./factions";
import {
  harvestMultiplier,
  isHarvestViable,
  shouldPlayConservatively,
  type MercyContext,
} from "./mercy";
import { persistSave, loadSave } from "./save";
import { sfxCouncil, sfxEpiphany, sfxHarvest, sfxRestrict, sfxUi, isMuted } from "./audio";
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
import { sampleActions, setInjectedKeys } from "./input";

export { BIOME_LABEL };

const emptyInv = (): Inventory => ({
  food: 0,
  water: 0,
  energy: 0,
  minerals: 0,
  rare_alloy: 0,
});

const FIRST_PROPOSAL: CouncilProposal = {
  id: 1,
  title: "Rest the stressed nodes",
  body: "PATSAGi asks whether Crystal Spires and Ember Ridges should rest for a cycle so regeneration can outpace harvest.",
  mercyLabel: "Rest the field",
  conserveLabel: "Keep harvesting",
  resolved: "open",
};

type Sim = {
  phase: Phase;
  overlay: Overlay;
  name: string;
  faction: FactionId;
  seed: number;
  player: PlayerState;
  camYaw: number;
  camPitch: number;
  inventory: Inventory;
  grace: number;
  valence: number;
  epiphanies: number;
  harvestCount: number;
  tutorial: TutorialStep;
  tutorialHidden: boolean;
  nodes: ResourceNode[];
  wanderers: Wanderer[];
  proposal: CouncilProposal;
  whisper: Whisper | null;
  juice: JuiceEvent[];
  now: number;
  shake: number;
  muted: boolean;
  moved: boolean;
  accumulator: number;
  lastHud: number;
  whisperSeq: number;
  harvestCd: number;
  sprinting: boolean;
};

function defaultPlayer(): PlayerState {
  return {
    x: 0,
    y: heightAt(0, 0) + 1.05,
    z: 4,
    yaw: 0,
    pitch: 0,
    vx: 0,
    vz: 0,
    vy: 0,
    air: 0,
    speed: 0,
    grounded: true,
  };
}

function makeSim(): Sim {
  const seed = 21_90;
  return {
    phase: "title",
    overlay: "none",
    name: "Wanderer",
    faction: "sovereign",
    seed,
    player: defaultPlayer(),
    camYaw: 0,
    camPitch: 0.38,
    inventory: emptyInv(),
    grace: 0,
    valence: 0.55,
    epiphanies: 0,
    harvestCount: 0,
    tutorial: "move",
    tutorialHidden: false,
    nodes: spawnNodes(seed),
    wanderers: spawnWanderers(seed),
    proposal: { ...FIRST_PROPOSAL },
    whisper: null,
    juice: [],
    now: 0,
    shake: 0,
    muted: false,
    moved: false,
    accumulator: 0,
    lastHud: 0,
    whisperSeq: 1,
    harvestCd: 0,
    sprinting: false,
  };
}

export const sim: Sim = makeSim();

function mercyCtx(): MercyContext {
  const nearby = nearestNode();
  return {
    harvestEffectiveness: nearby && nearby.dist < 8 ? 0.85 : 0.62,
    abundanceRate: Math.min(1, abundanceScore() / 80 + 0.2),
    valence: sim.valence,
    councilEngagement: sim.proposal.resolved === "open" ? 0.7 : 0.85,
    stressNearby: nearby ? nearby.node.stress : 0.1,
  };
}

export function abundanceScore() {
  return Object.values(sim.inventory).reduce((a, b) => a + b, 0);
}

export function nearestNode(): { node: ResourceNode; dist: number } | null {
  let best: ResourceNode | null = null;
  let bestD = Infinity;
  for (const n of sim.nodes) {
    const d = Math.hypot(n.x - sim.player.x, n.z - sim.player.z);
    if (d < bestD) {
      bestD = d;
      best = n;
    }
  }
  return best ? { node: best, dist: bestD } : null;
}

export function nearbySouls(): NearbySoul[] {
  const list: NearbySoul[] = [];
  for (const w of sim.wanderers) {
    const dist = Math.hypot(w.x - sim.player.x, w.z - sim.player.z);
    if (dist <= NEARBY_RANGE) list.push({ id: w.id, faction: w.faction, dist });
  }
  list.sort((a, b) => a.dist - b.dist);
  return list;
}

function pushWhisper(council: string, gate: string, text: string) {
  sim.whisper = {
    id: sim.whisperSeq++,
    council,
    gate,
    text,
    born: sim.now,
  };
}

function addJuice(kind: JuiceEvent["kind"], x: number, z: number) {
  sim.juice.push({ kind, x, z, t: sim.now });
  if (sim.juice.length > 24) sim.juice.shift();
}

function tryHarvest() {
  const near = nearestNode();
  if (!near || near.dist > HARVEST_RANGE) return;
  const node = near.node;
  const ctx = mercyCtx();
  if (!isHarvestViable(ctx)) {
    pushWhisper("Mercy-Truth", "Radical Love", "The field is thin. Walk, then try again.");
    sfxRestrict();
    return;
  }
  if (node.restrictedUntil > sim.now) {
    pushWhisper(
      "PATSAGi",
      "Boundless Mercy",
      "This node is under council rest. Let it breathe.",
    );
    sfxRestrict();
    addJuice("restrict", node.x, node.z);
    return;
  }
  if (node.depletion > 0.92) {
    pushWhisper("Guardians", "Service", "Critically depleted. Regeneration is the harvest now.");
    sfxRestrict();
    return;
  }

  const fac = factionById(sim.faction);
  const typeIsFood = node.type === "food" || node.type === "water";
  const m = harvestMultiplier(ctx, fac.bonuses.food, typeIsFood);
  const energyM = node.type === "energy" ? fac.bonuses.energy : 1;
  const stressM = 1 - node.stress * 0.5;
  const yieldAmt = Math.min(
    node.currentYield * 3,
    node.currentYield * Math.min(2.4, 1.15 * m * energyM * stressM),
  );
  if (yieldAmt <= 0.02) return;

  sim.inventory[node.type] += yieldAmt;
  node.depletion = Math.min(1, node.depletion + yieldAmt * 0.01);
  node.currentYield = node.baseYield * (1 - node.depletion * 0.7);
  node.lastHarvest = sim.now;
  if (node.stress > 0.35) node.stress = Math.min(1, node.stress + 0.12);
  else node.stress = Math.min(1, node.stress + 0.04);

  const grace = Math.max(1, Math.round(yieldAmt * 0.8));
  sim.grace += grace;
  sim.valence = Math.min(1, sim.valence + 0.035);
  sim.harvestCount += 1;
  sim.shake = Math.min(1, sim.shake + 0.28);
  addJuice("harvest", node.x, node.z);
  sfxHarvest();

  const line = whisperFor(node.id + sim.harvestCount);
  pushWhisper(line.council, line.gate, `+${yieldAmt.toFixed(1)} ${node.type}. ${line.text}`);

  if (sim.tutorial === "harvest") sim.tutorial = "inventory";

  if (sim.harvestCount === 3 || (sim.harvestCount > 0 && sim.harvestCount % 8 === 0)) {
    triggerEpiphany();
  }

  if (shouldPlayConservatively(ctx) && node.depletion > 0.55) {
    node.restrictedUntil = sim.now + 18;
    pushWhisper("PATSAGi", "Boundless Mercy", "Council rest applied. The node will return.");
  }
  scheduleSave();
}

function triggerEpiphany() {
  sim.epiphanies += 1;
  sim.valence = Math.min(1, sim.valence + 0.12);
  sim.grace += 12;
  sim.shake = Math.min(1, sim.shake + 0.55);
  addJuice("epiphany", sim.player.x, sim.player.z);
  sfxEpiphany();
  const line = EPIPHANY_LINES[(sim.epiphanies - 1) % EPIPHANY_LINES.length];
  pushWhisper("Divine Whispers", "Joy", line);
  if (sim.tutorial === "inventory" || sim.tutorial === "epiphany") sim.tutorial = "council";
}

export function resolveCouncil(choice: "mercy" | "conserve") {
  if (sim.proposal.resolved !== "open") return;
  sim.proposal.resolved = choice;
  if (choice === "mercy") {
    for (const n of sim.nodes) {
      if (n.biome === "crystal" || n.biome === "ember" || n.stress > 0.45) {
        n.restrictedUntil = sim.now + 28;
        n.regen *= 1.35;
        n.stress *= 0.55;
      }
    }
    sim.grace += 24;
    sim.valence = Math.min(1, sim.valence + 0.1);
    pushWhisper(
      "PATSAGi",
      "Cosmic Harmony",
      "Rest granted. Stressed biomes regenerate under council watch.",
    );
  } else {
    for (const n of sim.nodes) n.regen *= 0.92;
    sim.grace += 6;
    pushWhisper(
      "PATSAGi",
      "Truth",
      "Harvest continues. Watch depletion — the lattice will speak if it must.",
    );
  }
  addJuice("council", sim.player.x, sim.player.z);
  sfxCouncil();
  sim.overlay = "none";
  if (sim.tutorial === "council") sim.tutorial = "done";
  scheduleSave();
}

function tickRegen(dt: number) {
  const fac = factionById(sim.faction);
  for (const n of sim.nodes) {
    if (n.depletion > 0) {
      n.depletion = Math.max(0, n.depletion - n.regen * fac.bonuses.regen * dt);
      n.currentYield = n.baseYield * (1 - n.depletion * 0.7);
    }
    if (n.depletion < 0.3) n.stress = Math.max(0, n.stress - 0.05 * dt);
    if (n.restrictedUntil > 0 && sim.now > n.restrictedUntil) {
      n.restrictedUntil = 0;
      n.stress *= 0.5;
    }
  }
  sim.valence = Math.max(0.18, sim.valence - 0.008 * dt);
}

function tickWanderers(dt: number) {
  for (const w of sim.wanderers) {
    w.phase += dt * 0.35;
    const wx = Math.sin(w.phase) * 0.7 + Math.sin(w.phase * 0.37 + w.id) * 0.4;
    const wz = Math.cos(w.phase * 0.8) * 0.7;
    w.yaw = Math.atan2(-wx, -wz);
    w.x += wx * 1.6 * dt;
    w.z += wz * 1.6 * dt;
    w.x = Math.max(-WORLD_HALF + 6, Math.min(WORLD_HALF - 6, w.x));
    w.z = Math.max(-WORLD_HALF + 6, Math.min(WORLD_HALF - 6, w.z));
  }
}

function toggleOverlay(next: Overlay) {
  sim.overlay = sim.overlay === next ? "none" : next;
  sfxUi();
}

function tickPlayer(dt: number) {
  const a = sampleActions();
  if (sim.phase !== "playing") return a;

  if (a.pausePressed) toggleOverlay("pause");
  if (sim.overlay === "pause") return a;

  if (a.inventoryPressed || a.allocatePressed) {
    toggleOverlay("inventory");
    if (sim.tutorial === "inventory") sim.tutorial = "epiphany";
  }
  if (a.councilPressed) toggleOverlay("council");
  if (a.lineagePressed) toggleOverlay("lineage");
  if (a.climatePressed) toggleOverlay("climate");
  if (a.hideHelpPressed) sim.tutorialHidden = !sim.tutorialHidden;

  if (sim.overlay !== "none") return a;

  sim.camYaw += a.camX * 1.4 * dt;
  const fac = factionById(sim.faction);
  const wishX = a.moveX;
  const wishY = a.moveY;
  const moving = Math.hypot(wishX, wishY) > 0.05;
  sim.sprinting = a.sprint && moving;
  const target = (a.sprint ? SPRINT_SPEED : WALK_SPEED) * fac.bonuses.speed;
  const fx = -Math.sin(sim.camYaw);
  const fz = -Math.cos(sim.camYaw);
  const rx = Math.cos(sim.camYaw);
  const rz = -Math.sin(sim.camYaw);
  let wx = 0;
  let wz = 0;
  if (moving) {
    wx = fx * wishY + rx * wishX;
    wz = fz * wishY + rz * wishX;
    const len = Math.hypot(wx, wz) || 1;
    wx /= len;
    wz /= len;
    const heading = Math.atan2(-wx, -wz);
    let dyaw = heading - sim.player.yaw;
    while (dyaw > Math.PI) dyaw -= Math.PI * 2;
    while (dyaw < -Math.PI) dyaw += Math.PI * 2;
    sim.player.yaw += dyaw * Math.min(1, 10 * dt);
    sim.moved = true;
    if (sim.tutorial === "move") sim.tutorial = "harvest";
  }

  const accel = 38;
  const friction = 9;
  sim.player.vx += wx * accel * dt;
  sim.player.vz += wz * accel * dt;
  const sp = Math.hypot(sim.player.vx, sim.player.vz);
  const max = moving ? target : 0;
  if (sp > max) {
    const s = max / (sp || 1);
    sim.player.vx *= s;
    sim.player.vz *= s;
  }
  if (!moving && sp > 0) {
    const drop = Math.min(sp, friction * dt * sp);
    const ns = (sp - drop) / sp;
    sim.player.vx *= ns;
    sim.player.vz *= ns;
  }

  sim.player.x += sim.player.vx * dt;
  sim.player.z += sim.player.vz * dt;
  sim.player.x = Math.max(-WORLD_HALF + 2, Math.min(WORLD_HALF - 2, sim.player.x));
  sim.player.z = Math.max(-WORLD_HALF + 2, Math.min(WORLD_HALF - 2, sim.player.z));

  if (a.jumpPressed && sim.player.grounded) {
    sim.player.vy = JUMP_VEL;
    sim.player.grounded = false;
  }
  sim.player.vy -= GRAVITY * dt;
  sim.player.air += sim.player.vy * dt;
  if (sim.player.air <= 0) {
    sim.player.air = 0;
    sim.player.vy = 0;
    sim.player.grounded = true;
  }
  sim.player.y = heightAt(sim.player.x, sim.player.z) + 1.05 + sim.player.air;
  sim.player.speed = Math.hypot(sim.player.vx, sim.player.vz);

  const follow = 1 - Math.exp(-3.2 * dt);
  let yawErr = sim.player.yaw - sim.camYaw;
  while (yawErr > Math.PI) yawErr -= Math.PI * 2;
  while (yawErr < -Math.PI) yawErr += Math.PI * 2;
  if (Math.abs(a.camX) < 0.05) sim.camYaw += yawErr * follow * 0.35;

  if (a.interact) {
    sim.harvestCd -= dt;
    if (a.interactPressed || sim.harvestCd <= 0) {
      tryHarvest();
      sim.harvestCd = 0.4;
    }
  } else {
    sim.harvestCd = 0;
  }
  return a;
}

let saveTimer = 0;
function scheduleSave() {
  saveTimer = 0.01;
}

function flushSave() {
  const blob: SaveBlob = {
    version: 1,
    name: sim.name,
    faction: sim.faction,
    player: { x: sim.player.x, z: sim.player.z, yaw: sim.player.yaw },
    inventory: { ...sim.inventory },
    grace: sim.grace,
    valence: sim.valence,
    epiphanies: sim.epiphanies,
    harvestCount: sim.harvestCount,
    tutorial: sim.tutorial,
    tutorialHidden: sim.tutorialHidden,
    nodes: sim.nodes.map((n) => ({
      id: n.id,
      depletion: n.depletion,
      currentYield: n.currentYield,
      stress: n.stress,
      restrictedUntil: n.restrictedUntil,
    })),
    proposal: { ...sim.proposal },
    seed: sim.seed,
  };
  persistSave(blob);
}

export function tick(dtRaw: number) {
  const dtCap = Math.min(dtRaw, 0.1);
  sim.accumulator += dtCap;
  let steps = 0;
  while (sim.accumulator >= FIXED_DT && steps < 5) {
    sim.now += FIXED_DT;
    tickPlayer(FIXED_DT);
    if (sim.phase === "playing" && sim.overlay !== "pause") {
      tickRegen(FIXED_DT);
      tickWanderers(FIXED_DT);
    }
    sim.shake = Math.max(0, sim.shake - FIXED_DT * 1.8);
    if (sim.whisper && sim.now - sim.whisper.born > 7) sim.whisper = null;
    sim.juice = sim.juice.filter((j) => sim.now - j.t < 1.6);
    sim.accumulator -= FIXED_DT;
    steps++;
  }
  if (saveTimer > 0) {
    saveTimer -= dtCap;
    if (saveTimer <= 0) flushSave();
  }
}

export function enterWorld(name: string, faction: FactionId) {
  const fresh = makeSim();
  Object.assign(sim, fresh);
  sim.name = name.trim() || "Wanderer";
  sim.faction = faction;
  sim.phase = "playing";
  sim.overlay = "none";
  scheduleSave();
}

export function continueSave() {
  const s = loadSave();
  if (!s) return false;
  sim.name = s.name;
  sim.faction = s.faction;
  sim.seed = s.seed;
  sim.player = defaultPlayer();
  sim.player.x = s.player.x;
  sim.player.z = s.player.z;
  sim.player.yaw = s.player.yaw;
  sim.player.y = heightAt(s.player.x, s.player.z) + 1.05;
  sim.camYaw = s.player.yaw;
  sim.inventory = { ...emptyInv(), ...s.inventory };
  sim.grace = s.grace;
  sim.valence = s.valence;
  sim.epiphanies = s.epiphanies;
  sim.harvestCount = s.harvestCount;
  sim.tutorial = s.tutorial;
  sim.tutorialHidden = s.tutorialHidden;
  sim.nodes = spawnNodes(s.seed);
  const byId = new Map(s.nodes.map((n) => [n.id, n]));
  for (const n of sim.nodes) {
    const prev = byId.get(n.id);
    if (prev) {
      n.depletion = prev.depletion;
      n.currentYield = prev.currentYield;
      n.stress = prev.stress;
      n.restrictedUntil = prev.restrictedUntil;
    }
  }
  sim.wanderers = spawnWanderers(s.seed);
  sim.proposal = s.proposal;
  sim.phase = "playing";
  return true;
}

export function hasSave() {
  return !!loadSave();
}

export function goTitle() {
  flushSave();
  sim.phase = "title";
  sim.overlay = "none";
}

export function goFaction() {
  sim.phase = "faction";
}

export function setOverlay(o: Overlay) {
  sim.overlay = o;
}

export function orbitCamera(dx: number, dy: number) {
  sim.camYaw -= dx * 0.005;
  sim.camPitch = Math.max(0.18, Math.min(0.9, sim.camPitch + dy * 0.004));
}

export function hudSnapshot(): HudSnapshot {
  const near = nearestNode();
  const souls = nearbySouls();
  const tendReady = !!near && near.dist < HARVEST_RANGE && near.node.restrictedUntil <= sim.now;
  return {
    phase: sim.phase,
    overlay: sim.overlay,
    name: sim.name,
    faction: sim.faction,
    biome: biomeAt(sim.player.x, sim.player.z),
    grace: sim.grace,
    valence: sim.valence,
    abundance: abundanceScore(),
    inventory: { ...sim.inventory },
    whisper: sim.whisper,
    nearest: near && near.dist < 10 ? near.node : null,
    nearestDist: near ? near.dist : 999,
    nearbyCount: souls.length,
    nearby: souls.slice(0, 6),
    tutorial: sim.tutorial,
    tutorialHidden: sim.tutorialHidden,
    proposal: sim.proposal,
    harvestCount: sim.harvestCount,
    epiphanies: sim.epiphanies,
    playing: sim.phase === "playing",
    muted: isMuted(),
    tendReady,
    grounded: sim.player.grounded,
    sprinting: sim.sprinting,
  };
}

export function installControlsProbe() {
  window.__controlsTest = {
    getYaw: () => sim.player.yaw,
    getSpeed: () => sim.player.speed,
    setSteer: (v: number) => {
      if (v > 0.2) setInjectedKeys(["KeyW", "KeyA"]);
      else if (v < -0.2) setInjectedKeys(["KeyW", "KeyD"]);
      else setInjectedKeys(["KeyW"]);
    },
    setKeys: (codes: string[]) => setInjectedKeys(codes),
    harvest: () => {
      const n = nearestNode();
      tryHarvest();
      return {
        dist: n?.dist ?? 99,
        grace: sim.grace,
        food: sim.inventory.food,
        water: sim.inventory.water,
        inRange: !!n && n.dist <= HARVEST_RANGE,
        harvestCount: sim.harvestCount,
        epiphanies: sim.epiphanies,
        tutorial: sim.tutorial,
        x: sim.player.x,
        z: sim.player.z,
      };
    },
    setPose: (x: number, z: number) => {
      sim.player.x = x;
      sim.player.z = z;
      sim.player.air = 0;
      sim.player.vy = 0;
      sim.player.y = heightAt(x, z) + 1.05;
      sim.player.vx = 0;
      sim.player.vz = 0;
      sim.camYaw = sim.player.yaw;
    },
    getState: () => {
      const n = nearestNode();
      return {
        x: sim.player.x,
        z: sim.player.z,
        yaw: sim.player.yaw,
        camYaw: sim.camYaw,
        speed: sim.player.speed,
        phase: sim.phase,
        overlay: sim.overlay,
        grace: sim.grace,
        harvestCount: sim.harvestCount,
        epiphanies: sim.epiphanies,
        tutorial: sim.tutorial,
        nearestDist: n?.dist ?? 99,
      };
    },
  };
}

declare global {
  interface Window {
    __controlsTest?: {
      getYaw: () => number;
      getSpeed: () => number;
      setSteer?: (v: number) => void;
      setKeys?: (codes: string[]) => void;
      harvest?: () => {
        dist: number;
        grace: number;
        food: number;
        water: number;
        inRange: boolean;
        harvestCount: number;
        epiphanies: number;
        tutorial: string;
        x: number;
        z: number;
      };
      setPose?: (x: number, z: number) => void;
      getState?: () => {
        x: number;
        z: number;
        yaw: number;
        camYaw: number;
        speed: number;
        phase: string;
        overlay: string;
        grace: number;
        harvestCount: number;
        epiphanies: number;
        tutorial: string;
        nearestDist: number;
      };
    };
  }
}

if (typeof window !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && sim.phase === "playing") flushSave();
  });
  window.addEventListener("pagehide", () => {
    if (sim.phase === "playing") flushSave();
  });
}
