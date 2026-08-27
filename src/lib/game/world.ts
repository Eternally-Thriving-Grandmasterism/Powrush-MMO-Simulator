import type { BiomeId, ResourceNode, ResourceType, Wanderer } from "./types";
import { WORLD_HALF } from "./types";

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function biomeAt(x: number, z: number): BiomeId {
  const r = Math.hypot(x, z);
  if (r < 26) return "sanctuary";
  if (x > 22 && z < -18) return "crystal";
  if (x < -22 && z > 18) return "abyss";
  if (x > 22 && z > 18) return "algae";
  if (x < -22 && z < -18) return "ember";
  return "wilds";
}

export function heightAt(x: number, z: number): number {
  const n =
    Math.sin(x * 0.045) * 1.8 +
    Math.cos(z * 0.038) * 1.5 +
    Math.sin((x + z) * 0.021) * 1.1 +
    Math.cos(x * 0.11) * 0.35;
  const biome = biomeAt(x, z);
  if (biome === "sanctuary") return Math.max(0.05, n * 0.16 + 0.2);
  const extra =
    biome === "crystal"
      ? 2.4
      : biome === "abyss"
        ? -0.6
        : biome === "ember"
          ? 1.4
          : biome === "algae"
            ? 0.2
            : 0.6;
  return Math.max(-0.4, n + extra);
}

export const BIOME_LABEL: Record<BiomeId, string> = {
  sanctuary: "Sanctuary Prime",
  crystal: "Crystal Spires",
  abyss: "Abyssal Depths",
  algae: "Algae Groves",
  ember: "Ember Ridges",
  wilds: "The Wilds",
};

export const RESOURCE_META: Record<
  ResourceType,
  { label: string; base: number; color: string }
> = {
  food: { label: "Food", base: 2.5, color: "#7d9a7a" },
  water: { label: "Water", base: 3.0, color: "#6e9aab" },
  energy: { label: "Energy", base: 1.8, color: "#c4a574" },
  minerals: { label: "Minerals", base: 1.2, color: "#8a86a3" },
  rare_alloy: { label: "Rare Alloy", base: 0.4, color: "#d4d8de" },
};

const BIOME_RESOURCES: Record<BiomeId, ResourceType[]> = {
  sanctuary: ["food", "water"],
  crystal: ["minerals", "rare_alloy", "water"],
  abyss: ["energy", "minerals"],
  algae: ["food", "energy", "water"],
  ember: ["energy", "minerals", "rare_alloy"],
  wilds: ["food", "minerals", "water"],
};

export function spawnNodes(seed: number): ResourceNode[] {
  const rand = mulberry32(seed ^ 0x9e3779b9);
  const nodes: ResourceNode[] = [];
  let id = 1000;
  nodes.push({
    id: id++,
    type: "food",
    biome: "sanctuary",
    x: 0.8,
    z: -3.0,
    y: heightAt(0.8, -3.0),
    baseYield: RESOURCE_META.food.base,
    currentYield: RESOURCE_META.food.base,
    depletion: 0,
    regen: 0.02,
    stress: 0,
    restrictedUntil: 0,
    lastHarvest: 0,
  });
  nodes.push({
    id: id++,
    type: "water",
    biome: "sanctuary",
    x: -2.2,
    z: -2.4,
    y: heightAt(-2.2, -2.4),
    baseYield: RESOURCE_META.water.base,
    currentYield: RESOURCE_META.water.base,
    depletion: 0,
    regen: 0.02,
    stress: 0,
    restrictedUntil: 0,
    lastHarvest: 0,
  });
  for (let i = 0; i < 46; i++) {
    const ang = rand() * Math.PI * 2;
    const dist = 8 + rand() * (WORLD_HALF - 16);
    const x = Math.cos(ang) * dist;
    const z = Math.sin(ang) * dist;
    if (Math.abs(x) > WORLD_HALF - 8 || Math.abs(z) > WORLD_HALF - 8) continue;
    const biome = biomeAt(x, z);
    const pool = BIOME_RESOURCES[biome];
    const type = pool[Math.floor(rand() * pool.length)] ?? "food";
    const base = RESOURCE_META[type].base;
    nodes.push({
      id: id++,
      type,
      biome,
      x,
      z,
      y: heightAt(x, z),
      baseYield: base,
      currentYield: base,
      depletion: 0,
      regen: 0.015,
      stress: 0,
      restrictedUntil: 0,
      lastHarvest: 0,
    });
  }
  return nodes;
}

export function spawnWanderers(seed: number): Wanderer[] {
  const rand = mulberry32(seed ^ 0x51ed);
  const factions: Wanderer["faction"][] = [
    "sovereign",
    "harvesters",
    "guardians",
    "innovators",
    "nomads",
  ];
  const list: Wanderer[] = [];
  for (let i = 0; i < 9; i++) {
    const ang = rand() * Math.PI * 2;
    const dist = 14 + rand() * 50;
    list.push({
      id: i,
      x: Math.cos(ang) * dist,
      z: Math.sin(ang) * dist,
      yaw: rand() * Math.PI * 2,
      faction: factions[i % factions.length],
      phase: rand() * Math.PI * 2,
    });
  }
  return list;
}
