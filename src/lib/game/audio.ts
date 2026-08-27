type Bus = {
  ctx: AudioContext;
  master: GainNode;
  music: GainNode;
  sfx: GainNode;
};

let bus: Bus | null = null;
let muted = false;
let padTimer = 0;

function ensure(ctx: AudioContext): Bus {
  if (bus && bus.ctx === ctx) return bus;
  const master = ctx.createGain();
  const music = ctx.createGain();
  const sfx = ctx.createGain();
  music.gain.value = 0.22;
  sfx.gain.value = 0.55;
  master.gain.value = muted ? 0 : 0.7;
  music.connect(master);
  sfx.connect(master);
  master.connect(ctx.destination);
  bus = { ctx, master, music, sfx };
  return bus;
}

export function unlockAudio(): AudioContext | null {
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  const ctx = bus?.ctx ?? new AC({ latencyHint: "interactive" });
  const b = ensure(ctx);
  if (ctx.state === "suspended") void ctx.resume();
  startPad(b);
  return ctx;
}

export function resumeAudio() {
  if (bus && bus.ctx.state === "suspended") void bus.ctx.resume();
}

export function setMuted(next: boolean) {
  muted = next;
  if (bus) bus.master.gain.setTargetAtTime(next ? 0 : 0.7, bus.ctx.currentTime, 0.04);
}

export function isMuted() {
  return muted;
}

function startPad(b: Bus) {
  if (padTimer) return;
  const { ctx, music } = b;
  const now = ctx.currentTime;
  const freqs = [110, 164.8, 196, 246.9];
  freqs.forEach((f, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = i % 2 === 0 ? "sine" : "triangle";
    osc.frequency.value = f;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.045 / (i + 1), now + 1.6);
    osc.connect(g);
    g.connect(music);
    osc.start(now);
  });
  padTimer = 1;
}

function tone(
  freq: number,
  dur: number,
  type: OscillatorType,
  gain = 0.12,
  slide = 0,
) {
  if (!bus || muted) return;
  const { ctx, sfx } = bus;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), now + dur);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(gain, now + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.connect(g);
  g.connect(sfx);
  osc.start(now);
  osc.stop(now + dur + 0.02);
}

export function sfxHarvest() {
  const rate = 1 + (Math.random() * 2 - 1) * 0.08;
  tone(392 * rate, 0.18, "triangle", 0.1);
  tone(588 * rate, 0.28, "sine", 0.06, 40);
}

export function sfxEpiphany() {
  tone(261, 0.5, "sine", 0.09, 80);
  tone(329, 0.7, "triangle", 0.07, 40);
  tone(523, 0.9, "sine", 0.05);
}

export function sfxRestrict() {
  tone(180, 0.25, "sine", 0.08, -60);
}

export function sfxCouncil() {
  tone(220, 0.4, "triangle", 0.08);
  tone(330, 0.55, "sine", 0.05, 20);
}

export function sfxUi() {
  tone(640, 0.08, "sine", 0.04);
}
