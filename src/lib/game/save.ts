import type { SaveBlob } from "./types";
import { SAVE_VERSION } from "./types";

const KEY = "powrush-mmo-save-v1";
const BACKUP = "powrush-mmo-save-v1.bak";

export function loadSave(): SaveBlob | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SaveBlob;
    if (!parsed || typeof parsed !== "object") return null;
    if (parsed.version !== SAVE_VERSION) return migrate(parsed);
    return parsed;
  } catch {
    try {
      const bak = localStorage.getItem(BACKUP);
      if (!bak) return null;
      return JSON.parse(bak) as SaveBlob;
    } catch {
      return null;
    }
  }
}

function migrate(save: SaveBlob): SaveBlob {
  return { ...save, version: SAVE_VERSION };
}

export function persistSave(blob: SaveBlob) {
  try {
    const prev = localStorage.getItem(KEY);
    if (prev) localStorage.setItem(BACKUP, prev);
    localStorage.setItem(KEY, JSON.stringify(blob));
  } catch {
    /* private mode / quota */
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(BACKUP);
  } catch {
    /* ignore */
  }
}
