/**
 * PATSAGi soft-care pulse for the human-playable Sanctuary field.
 *
 * Autonomous rest is durable care, never a stolen harvest.
 * A node the wanderer is already tending is left alone.
 *
 * Contact: info@Rathor.ai
 * License: AG-SML v1.1
 */

import type { ResourceNode } from "./types";

export type RestReason = "stress" | "depletion" | "biome-watch";

export type RestPulse = {
  nodeId: number;
  until: number;
  reason: RestReason;
};

const SWEEP_GAP = 4.2;
let lastSweep = -999;

function reasonFor(n: ResourceNode): RestReason | null {
  if (n.depletion > 0.84) return "depletion";
  if (n.stress > 0.78) return "stress";
  if ((n.biome === "crystal" || n.biome === "ember") && n.stress > 0.52) {
    return "biome-watch";
  }
  return null;
}

export function tickAutonomousRest(
  nodes: ResourceNode[],
  now: number,
  playerX: number,
  playerZ: number,
  harvestRange: number,
): RestPulse[] {
  if (now - lastSweep < SWEEP_GAP) return [];
  lastSweep = now;

  const pulses: RestPulse[] = [];
  for (const n of nodes) {
    if (n.restrictedUntil > now) continue;
    const reason = reasonFor(n);
    if (!reason) continue;

    const dist = Math.hypot(n.x - playerX, n.z - playerZ);
    if (dist <= harvestRange + 0.4) continue;

    const dur = reason === "depletion" ? 18 : reason === "stress" ? 14 : 10;
    n.restrictedUntil = now + dur;
    n.regen = Math.min(n.regen * 1.14, n.regen + 0.08);
    n.stress *= 0.86;
    pulses.push({ nodeId: n.id, until: n.restrictedUntil, reason });
    if (pulses.length >= 2) break;
  }
  return pulses;
}

export function restWhisper(reason: RestReason): {
  council: string;
  gate: string;
  text: string;
} {
  if (reason === "depletion") {
    return {
      council: "PATSAGi",
      gate: "Boundless Mercy",
      text: "A distant node was placed under rest. Yield will return as breath.",
    };
  }
  if (reason === "stress") {
    return {
      council: "Guardians",
      gate: "Service",
      text: "Council rest on a stressed neighbor. You keep your stride.",
    };
  }
  return {
    council: "Kardashev Node",
    gate: "Abundance",
    text: "Biome watch applied. Crystal and ember recover under council light.",
  };
}

export function resetAutonomousRest() {
  lastSweep = -999;
}
