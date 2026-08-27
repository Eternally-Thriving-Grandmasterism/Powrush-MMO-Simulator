import { create } from "zustand";
import { hudSnapshot } from "./sim";
import type { HudSnapshot } from "./types";

type HudStore = {
  hud: HudSnapshot;
  push: () => void;
};

export const useHud = create<HudStore>((set) => ({
  hud: hudSnapshot(),
  push: () => set({ hud: hudSnapshot() }),
}));
