const LINES: Array<{ council: string; gate: string; text: string }> = [
  {
    council: "Harvesters",
    gate: "Abundance",
    text: "Yield taken with a light hand returns as oxygen — freely, then again.",
  },
  {
    council: "Guardians",
    gate: "Boundless Mercy",
    text: "The node is a neighbor. Leave it breathing and it will feed the next wanderer.",
  },
  {
    council: "Sovereign",
    gate: "Cosmic Harmony",
    text: "Thirteen councils vote in parallel. Your stride is already a ballot.",
  },
  {
    council: "Innovators",
    gate: "Truth",
    text: "Depletion is a number, not a verdict. Rest restores more than force.",
  },
  {
    council: "Nomads",
    gate: "Joy",
    text: "The wilds remember a careful traveler. Keep walking; the lattice opens.",
  },
  {
    council: "Mercy-Truth",
    gate: "Radical Love",
    text: "No being is owned by a ledger. Your soul remains original, always.",
  },
  {
    council: "Service",
    gate: "Service",
    text: "What you carry is a gift in motion. Share it and the field thickens.",
  },
  {
    council: "Kardashev Node",
    gate: "Abundance",
    text: "A single sustainable harvest is a prototype of Type I care.",
  },
];

export function whisperFor(seed: number) {
  return LINES[Math.abs(seed) % LINES.length];
}

export const EPIPHANY_LINES = [
  "The field answers. Harvest becomes understanding.",
  "A quiet geometry folds around you — the first epiphany.",
  "You feel the RBE as weather: resources like breath, not coin.",
];
