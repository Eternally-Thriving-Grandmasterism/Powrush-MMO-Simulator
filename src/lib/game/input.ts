export type Actions = {
  moveX: number;
  moveY: number;
  interact: boolean;
  interactPressed: boolean;
  sprint: boolean;
  inventory: boolean;
  inventoryPressed: boolean;
  council: boolean;
  councilPressed: boolean;
  pause: boolean;
  pausePressed: boolean;
  hideHelp: boolean;
  hideHelpPressed: boolean;
  camX: number;
};

const keys = new Set<string>();
const injected = new Set<string>();
let prevInteract = false;
let prevInventory = false;
let prevCouncil = false;
let prevPause = false;
let prevHelp = false;
let stickX = 0;
let stickY = 0;
let harvestHeld = false;

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
  "KeyI",
  "KeyC",
  "KeyH",
  "KeyQ",
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
  const scale = ((m - 0.18) / 0.82) / m;
  stickX = x * scale;
  stickY = y * scale;
}

export function setHarvestHeld(v: boolean) {
  harvestHeld = v;
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
    const south = pad.buttons[0]?.pressed;
    if (south) actions.interact = true;
    if (pad.buttons[1]?.pressed) actions.sprint = true;
    if (pad.buttons[2]?.pressed) actions.inventory = true;
    if (pad.buttons[3]?.pressed) actions.council = true;
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

  const interact = active("Space") || harvestHeld;
  const inventory = active("KeyI");
  const council = active("KeyC");
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
    sprint: active("ShiftLeft") || active("ShiftRight"),
    inventory,
    inventoryPressed: inventory && !prevInventory,
    council,
    councilPressed: council && !prevCouncil,
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
  prevInventory = actions.inventory;
  prevCouncil = actions.council;
  prevPause = actions.pause;
  prevHelp = actions.hideHelp;
  return actions;
}
