import type { Faction, FactionId } from "./types";

export const FACTIONS: Faction[] = [
  {
    id: "sovereign",
    name: "Sovereign",
    role: "Harmony · Diplomacy",
    blurb: "Masters of balance. Harvests stay sustainable; councils trust your vote.",
    accent: "#7f93b0",
    bonuses: { food: 1, energy: 1, speed: 1.04, regen: 1.12 },
  },
  {
    id: "harvesters",
    name: "Harvesters",
    role: "Bio · Abundance",
    blurb: "Stewards of living yield. Food and water return faster in every biome.",
    accent: "#6f8f6c",
    bonuses: { food: 1.28, energy: 1, speed: 1, regen: 1.18 },
  },
  {
    id: "guardians",
    name: "Guardians",
    role: "Sacred · Stewardship",
    blurb: "Protectors of the lattice. Nodes resist depletion and recover from stress.",
    accent: "#8a86a3",
    bonuses: { food: 1, energy: 1, speed: 0.96, regen: 1.32 },
  },
  {
    id: "innovators",
    name: "Innovators",
    role: "Tech · Creation",
    blurb: "Architects of flow. Energy and rare alloys answer a lighter touch.",
    accent: "#b08968",
    bonuses: { food: 1, energy: 1.28, speed: 1.02, regen: 1.05 },
  },
  {
    id: "nomads",
    name: "Nomads",
    role: "Exploration · Freedom",
    blurb: "Wanderers of the expanse. Faster stride across every realm.",
    accent: "#6e9aab",
    bonuses: { food: 1, energy: 1, speed: 1.18, regen: 1 },
  },
];

export function factionById(id: FactionId): Faction {
  return FACTIONS.find((f) => f.id === id) ?? FACTIONS[0];
}
