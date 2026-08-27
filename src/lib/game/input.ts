export type Actions = {
  moveX: number;
  moveY: number;
  interact: boolean;
  interactPressed: boolean;
  jump: boolean;
  jumpPressed: boolean;
  sprint: boolean;
  inventory: boolean;
  inventoryPressed: boolean;
  council: boolean;
  councilPressed: boolean;
  lineage: boolean;
  lineagePressed: boolean;
  climate: boolean;
  climatePressed: boolean;
  allocate: boolean;
  allocatePressed: boolean;
  pause: boolean;
  pausePressed: boolean;
  hideHelp: boolean;
  hideHelpPressed: boolean;
  camX: number;
};

const keys = new Set<string>();
const injected = new Set<string>();
let prevInteract = false;
let prevJump = false;
let prevInventory = false;
let prevCouncil = false;
let prevLineage = false;
let prevClimate = false;
let prevAllocate = false;
let prevPause = false;
let prevHelp = false;
let stickX = 0;
let stickY = 0;
let harvestHeld = false;
let sprintHeld = false;
let jumpHeld = false;
let lineageHeld = false;
let climateHeld = false;
let allocateHeld = false;

export type StickVisual = { x: number; y: number; active: boolean };

export function getStickVisual(): StickVisual {
  return { x: stickX, y: stickY, active: Math.hypot(stickX, stickY) > 0.02 };
}

const GAME_CODES = new Set([
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Space",
  "KeyE",
  "KeyF",
  "KeyI",
  "KeyC",
  "KeyH",
  "KeyQ",
  "KeyJ",
  "KeyK",
  "KeyL",
  "KeyR",
  "ShiftLeft",
  "ShiftRight",
  "Escape",
]);

function active(code: string) {
  return keys.has(code) || injected.has(code);
}

export function bindInput() {
  const down = (e: KeyboardEvent) => {
    if (e.repeat) return;
    keys.add(e.code);
    if (GAME_CODES.has(e.code)) e.preventDefault();
  };
  const up = (e: KeyboardEvent) => {
    keys.delete(e.code);
  };
  const clear = () => keys.clear();
  window.addEventListener("keydown", down);
  window.addEventListener("keyup", up);
  window.addEventListener("blur", clear);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) keys.clear();
  });
  return () => {
    window.removeEventListener("keydown", down);
    window.removeEventListener("keyup", up);
    window.removeEventListener("blur", clear);
  };
}

export function setInjectedKeys(codes: string[]) {
  injected.clear();
  for (const c of codes) injected.add(c);
}

export function setStick(x: number, y: number) {
  const m = Math.hypot(x, y);
  if (m < 0.18) {
    stickX = 0;
    stickY = 0;
    return;
  }
  const capped = m > 1 ? 1 / m : 1;
  const scale = ((Math.min(m, 1) - 0.18) / 0.82) * capped;
  stickX = x * scale;
  stickY = y * scale;
}

export function setHarvestHeld(v: boolean) {
  harvestHeld = v;
}
export function setSprintHeld(v: boolean) {
  sprintHeld = v;
}
export function setJumpHeld(v: boolean) {
  jumpHeld = v;
}
export function setLineageHeld(v: boolean) {
  lineageHeld = v;
}
export function setClimateHeld(v: boolean) {
  climateHeld = v;
}
export function setAllocateHeld(v: boolean) {
  allocateHeld = v;
}

function radialDeadzone(x: number, y: number, dz = 0.15) {
  const m = Math.hypot(x, y);
  if (m < dz) return { x: 0, y: 0 };
  const scale = ((m - dz) / (1 - dz)) / m;
  return { x: x * scale, y: y * scale };
}

function pollGamepad(actions: Actions) {
  const pads = navigator.getGamepads?.() ?? [];
  for (const pad of pads) {
    if (!pad) continue;
    const lx = pad.axes[0] ?? 0;
    const ly = pad.axes[1] ?? 0;
    const stick = radialDeadzone(lx, ly);
    if (Math.hypot(stick.x, stick.y) > 0.01) {
      actions.moveX += stick.x;
      actions.moveY += -stick.y;
    }
    if (pad.buttons[0]?.pressed) actions.interact = true;
    if (pad.buttons[1]?.pressed) actions.sprint = true;
    if (pad.buttons[2]?.pressed) actions.jump = true;
    if (pad.buttons[3]?.pressed) actions.lineage = true;
    if (pad.buttons[4]?.pressed) actions.climate = true;
    if (pad.buttons[5]?.pressed) actions.allocate = true;
    if (pad.buttons[9]?.pressed) actions.pause = true;
    const look = radialDeadzone(pad.axes[2] ?? 0, pad.axes[3] ?? 0, 0.2);
    actions.camX += look.x;
  }
}

export function sampleActions(): Actions {
  let moveX = 0;
  let moveY = 0;
  if (active("KeyW") || active("ArrowUp")) moveY += 1;
  if (active("KeyS") || active("ArrowDown")) moveY -= 1;
  if (active("KeyA") || active("ArrowLeft")) moveX -= 1;
  if (active("KeyD") || active("ArrowRight")) moveX += 1;
  moveX += stickX;
  moveY += -stickY;

  const len = Math.hypot(moveX, moveY);
  if (len > 1) {
    moveX /= len;
    moveY /= len;
  }

  const interact = active("Space") || active("KeyF") || harvestHeld;
  const jump = active("KeyJ") || jumpHeld;
  const inventory = active("KeyI") || active("KeyR") || allocateHeld;
  const council = active("KeyC");
  const lineage = active("KeyL") || lineageHeld;
  const climate = active("KeyK") || climateHeld;
  const pause = active("Escape");
  const hideHelp = active("KeyH");
  let camX = 0;
  if (active("KeyQ")) camX -= 1;
  if (active("KeyE")) camX += 1;

  const actions: Actions = {
    moveX,
    moveY,
    interact,
    interactPressed: interact && !prevInteract,
    jump,
    jumpPressed: jump && !prevJump,
    sprint: active("ShiftLeft") || active("ShiftRight") || sprintHeld,
    inventory,
    inventoryPressed: inventory && !prevInventory,
    council,
    councilPressed: council && !prevCouncil,
    lineage,
    lineagePressed: lineage && !prevLineage,
    climate,
    climatePressed: climate && !prevClimate,
    allocate: inventory,
    allocatePressed: inventory && !prevAllocate,
    pause,
    pausePressed: pause && !prevPause,
    hideHelp,
    hideHelpPressed: hideHelp && !prevHelp,
    camX,
  };
  pollGamepad(actions);
  const m = Math.hypot(actions.moveX, actions.moveY);
  if (m > 1) {
    actions.moveX /= m;
    actions.moveY /= m;
  }
  prevInteract = actions.interact;
  prevJump = actions.jump;
  prevInventory = actions.inventory;
  prevCouncil = actions.council;
  prevLineage = actions.lineage;
  prevClimate = actions.climate;
  prevAllocate = actions.allocate;
  prevPause = actions.pause;
  prevHelp = actions.hideHelp;
  return actions;
}
