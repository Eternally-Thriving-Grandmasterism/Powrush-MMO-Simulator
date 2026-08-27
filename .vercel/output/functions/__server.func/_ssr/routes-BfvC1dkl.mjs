import { i as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@react-three/fiber+[...].mjs";
import { t as create } from "../_libs/zustand.mjs";
import { c as Infinity$1, u as ArrowRight } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BfvC1dkl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var bus = null;
var muted = false;
var padTimer = 0;
function ensure(ctx) {
	if (bus && bus.ctx === ctx) return bus;
	const master = ctx.createGain();
	const music = ctx.createGain();
	const sfx = ctx.createGain();
	music.gain.value = .22;
	sfx.gain.value = .55;
	master.gain.value = muted ? 0 : .7;
	music.connect(master);
	sfx.connect(master);
	master.connect(ctx.destination);
	bus = {
		ctx,
		master,
		music,
		sfx
	};
	return bus;
}
function unlockAudio() {
	const AC = window.AudioContext || window.webkitAudioContext;
	if (!AC) return null;
	const ctx = bus?.ctx ?? new AC({ latencyHint: "interactive" });
	const b = ensure(ctx);
	if (ctx.state === "suspended") ctx.resume();
	startPad(b);
	return ctx;
}
function resumeAudio() {
	if (bus && bus.ctx.state === "suspended") bus.ctx.resume();
}
function setMuted(next) {
	muted = next;
	if (bus) bus.master.gain.setTargetAtTime(next ? 0 : .7, bus.ctx.currentTime, .04);
}
function isMuted() {
	return muted;
}
function startPad(b) {
	if (padTimer) return;
	const { ctx, music } = b;
	const now = ctx.currentTime;
	[
		110,
		164.8,
		196,
		246.9
	].forEach((f, i) => {
		const osc = ctx.createOscillator();
		const g = ctx.createGain();
		osc.type = i % 2 === 0 ? "sine" : "triangle";
		osc.frequency.value = f;
		g.gain.setValueAtTime(1e-4, now);
		g.gain.exponentialRampToValueAtTime(.045 / (i + 1), now + 1.6);
		osc.connect(g);
		g.connect(music);
		osc.start(now);
	});
	padTimer = 1;
}
function tone(freq, dur, type, gain = .12, slide = 0) {
	if (!bus || muted) return;
	const { ctx, sfx } = bus;
	const now = ctx.currentTime;
	const osc = ctx.createOscillator();
	const g = ctx.createGain();
	osc.type = type;
	osc.frequency.setValueAtTime(freq, now);
	if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), now + dur);
	g.gain.setValueAtTime(1e-4, now);
	g.gain.exponentialRampToValueAtTime(gain, now + .02);
	g.gain.exponentialRampToValueAtTime(1e-4, now + dur);
	osc.connect(g);
	g.connect(sfx);
	osc.start(now);
	osc.stop(now + dur + .02);
}
function sfxHarvest() {
	const rate = 1 + (Math.random() * 2 - 1) * .08;
	tone(392 * rate, .18, "triangle", .1);
	tone(588 * rate, .28, "sine", .06, 40);
}
function sfxEpiphany() {
	tone(261, .5, "sine", .09, 80);
	tone(329, .7, "triangle", .07, 40);
	tone(523, .9, "sine", .05);
}
function sfxRestrict() {
	tone(180, .25, "sine", .08, -60);
}
function sfxCouncil() {
	tone(220, .4, "triangle", .08);
	tone(330, .55, "sine", .05, 20);
}
function sfxUi() {
	tone(640, .08, "sine", .04);
}
var keys = /* @__PURE__ */ new Set();
var injected = /* @__PURE__ */ new Set();
var prevInteract = false;
var prevInventory = false;
var prevCouncil = false;
var prevPause = false;
var prevHelp = false;
var stickX = 0;
var stickY = 0;
var harvestHeld = false;
var GAME_CODES = /* @__PURE__ */ new Set([
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
	"Escape"
]);
function active(code) {
	return keys.has(code) || injected.has(code);
}
function bindInput() {
	const down = (e) => {
		if (e.repeat) return;
		keys.add(e.code);
		if (GAME_CODES.has(e.code)) e.preventDefault();
	};
	const up = (e) => {
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
function setInjectedKeys(codes) {
	injected.clear();
	for (const c of codes) injected.add(c);
}
function setStick(x, y) {
	const m = Math.hypot(x, y);
	if (m < .18) {
		stickX = 0;
		stickY = 0;
		return;
	}
	const scale = (m - .18) / .82 / m;
	stickX = x * scale;
	stickY = y * scale;
}
function setHarvestHeld(v) {
	harvestHeld = v;
}
function radialDeadzone(x, y, dz = .15) {
	const m = Math.hypot(x, y);
	if (m < dz) return {
		x: 0,
		y: 0
	};
	const scale = (m - dz) / (1 - dz) / m;
	return {
		x: x * scale,
		y: y * scale
	};
}
function pollGamepad(actions) {
	const pads = navigator.getGamepads?.() ?? [];
	for (const pad of pads) {
		if (!pad) continue;
		const stick = radialDeadzone(pad.axes[0] ?? 0, pad.axes[1] ?? 0);
		if (Math.hypot(stick.x, stick.y) > .01) {
			actions.moveX += stick.x;
			actions.moveY += -stick.y;
		}
		if (pad.buttons[0]?.pressed) actions.interact = true;
		if (pad.buttons[1]?.pressed) actions.sprint = true;
		if (pad.buttons[2]?.pressed) actions.inventory = true;
		if (pad.buttons[3]?.pressed) actions.council = true;
		if (pad.buttons[9]?.pressed) actions.pause = true;
		const look = radialDeadzone(pad.axes[2] ?? 0, pad.axes[3] ?? 0, .2);
		actions.camX += look.x;
	}
}
function sampleActions() {
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
	const actions = {
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
		camX
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
var FACTIONS = [
	{
		id: "sovereign",
		name: "Sovereign",
		role: "Harmony · Diplomacy",
		blurb: "Masters of balance. Harvests stay sustainable; councils trust your vote.",
		accent: "#7f93b0",
		bonuses: {
			food: 1,
			energy: 1,
			speed: 1.04,
			regen: 1.12
		}
	},
	{
		id: "harvesters",
		name: "Harvesters",
		role: "Bio · Abundance",
		blurb: "Stewards of living yield. Food and water return faster in every biome.",
		accent: "#6f8f6c",
		bonuses: {
			food: 1.28,
			energy: 1,
			speed: 1,
			regen: 1.18
		}
	},
	{
		id: "guardians",
		name: "Guardians",
		role: "Sacred · Stewardship",
		blurb: "Protectors of the lattice. Nodes resist depletion and recover from stress.",
		accent: "#8a86a3",
		bonuses: {
			food: 1,
			energy: 1,
			speed: .96,
			regen: 1.32
		}
	},
	{
		id: "innovators",
		name: "Innovators",
		role: "Tech · Creation",
		blurb: "Architects of flow. Energy and rare alloys answer a lighter touch.",
		accent: "#b08968",
		bonuses: {
			food: 1,
			energy: 1.28,
			speed: 1.02,
			regen: 1.05
		}
	},
	{
		id: "nomads",
		name: "Nomads",
		role: "Exploration · Freedom",
		blurb: "Wanderers of the expanse. Faster stride across every realm.",
		accent: "#6e9aab",
		bonuses: {
			food: 1,
			energy: 1,
			speed: 1.18,
			regen: 1
		}
	}
];
function factionById(id) {
	return FACTIONS.find((f) => f.id === id) ?? FACTIONS[0];
}
function isHarvestViable(ctx) {
	return ctx.harvestEffectiveness >= .45 && ctx.abundanceRate > .05;
}
function shouldPlayConservatively(ctx) {
	return ctx.valence < .28 || ctx.stressNearby > .72 || ctx.councilEngagement < .35;
}
function harvestMultiplier(ctx, factionFood, typeIsFood) {
	let m = 1;
	if (ctx.valence > .62) m *= 1.22;
	else if (ctx.valence < .28) m *= .55;
	if (typeIsFood) m *= factionFood;
	if (shouldPlayConservatively(ctx)) m *= .72;
	return m;
}
var WALK_SPEED = 5.2;
var SPRINT_SPEED = 8.1;
var FIXED_DT = 1 / 60;
var KEY = "powrush-mmo-save-v1";
var BACKUP = "powrush-mmo-save-v1.bak";
function loadSave() {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!parsed || typeof parsed !== "object") return null;
		if (parsed.version !== 1) return migrate(parsed);
		return parsed;
	} catch {
		try {
			const bak = localStorage.getItem(BACKUP);
			if (!bak) return null;
			return JSON.parse(bak);
		} catch {
			return null;
		}
	}
}
function migrate(save) {
	return {
		...save,
		version: 1
	};
}
function persistSave(blob) {
	try {
		const prev = localStorage.getItem(KEY);
		if (prev) localStorage.setItem(BACKUP, prev);
		localStorage.setItem(KEY, JSON.stringify(blob));
	} catch {}
}
function mulberry32(seed) {
	let a = seed >>> 0;
	return function rand() {
		a |= 0;
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function biomeAt(x, z) {
	if (Math.hypot(x, z) < 26) return "sanctuary";
	if (x > 22 && z < -18) return "crystal";
	if (x < -22 && z > 18) return "abyss";
	if (x > 22 && z > 18) return "algae";
	if (x < -22 && z < -18) return "ember";
	return "wilds";
}
function heightAt(x, z) {
	const n = Math.sin(x * .045) * 1.8 + Math.cos(z * .038) * 1.5 + Math.sin((x + z) * .021) * 1.1 + Math.cos(x * .11) * .35;
	const biome = biomeAt(x, z);
	if (biome === "sanctuary") return Math.max(.05, n * .16 + .2);
	return Math.max(-.4, n + (biome === "crystal" ? 2.4 : biome === "abyss" ? -.6 : biome === "ember" ? 1.4 : biome === "algae" ? .2 : .6));
}
var BIOME_LABEL = {
	sanctuary: "Sanctuary Prime",
	crystal: "Crystal Spires",
	abyss: "Abyssal Depths",
	algae: "Algae Groves",
	ember: "Ember Ridges",
	wilds: "The Wilds"
};
var RESOURCE_META = {
	food: {
		label: "Food",
		base: 2.5,
		color: "#7d9a7a"
	},
	water: {
		label: "Water",
		base: 3,
		color: "#6e9aab"
	},
	energy: {
		label: "Energy",
		base: 1.8,
		color: "#c4a574"
	},
	minerals: {
		label: "Minerals",
		base: 1.2,
		color: "#8a86a3"
	},
	rare_alloy: {
		label: "Rare Alloy",
		base: .4,
		color: "#d4d8de"
	}
};
var BIOME_RESOURCES = {
	sanctuary: ["food", "water"],
	crystal: [
		"minerals",
		"rare_alloy",
		"water"
	],
	abyss: ["energy", "minerals"],
	algae: [
		"food",
		"energy",
		"water"
	],
	ember: [
		"energy",
		"minerals",
		"rare_alloy"
	],
	wilds: [
		"food",
		"minerals",
		"water"
	]
};
function spawnNodes(seed) {
	const rand = mulberry32(seed ^ 2654435769);
	const nodes = [];
	let id = 1e3;
	nodes.push({
		id: id++,
		type: "food",
		biome: "sanctuary",
		x: .8,
		z: -3,
		y: heightAt(.8, -3),
		baseYield: RESOURCE_META.food.base,
		currentYield: RESOURCE_META.food.base,
		depletion: 0,
		regen: .02,
		stress: 0,
		restrictedUntil: 0,
		lastHarvest: 0
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
		regen: .02,
		stress: 0,
		restrictedUntil: 0,
		lastHarvest: 0
	});
	for (let i = 0; i < 46; i++) {
		const ang = rand() * Math.PI * 2;
		const dist = 8 + rand() * 72;
		const x = Math.cos(ang) * dist;
		const z = Math.sin(ang) * dist;
		if (Math.abs(x) > 80 || Math.abs(z) > 80) continue;
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
			regen: .015,
			stress: 0,
			restrictedUntil: 0,
			lastHarvest: 0
		});
	}
	return nodes;
}
function spawnWanderers(seed) {
	const rand = mulberry32(seed ^ 20973);
	const factions = [
		"sovereign",
		"harvesters",
		"guardians",
		"innovators",
		"nomads"
	];
	const list = [];
	for (let i = 0; i < 9; i++) {
		const ang = rand() * Math.PI * 2;
		const dist = 14 + rand() * 50;
		list.push({
			id: i,
			x: Math.cos(ang) * dist,
			z: Math.sin(ang) * dist,
			yaw: rand() * Math.PI * 2,
			faction: factions[i % factions.length],
			phase: rand() * Math.PI * 2
		});
	}
	return list;
}
var LINES = [
	{
		council: "Harvesters",
		gate: "Abundance",
		text: "Yield taken with a light hand returns as oxygen — freely, then again."
	},
	{
		council: "Guardians",
		gate: "Boundless Mercy",
		text: "The node is a neighbor. Leave it breathing and it will feed the next wanderer."
	},
	{
		council: "Sovereign",
		gate: "Cosmic Harmony",
		text: "Thirteen councils vote in parallel. Your stride is already a ballot."
	},
	{
		council: "Innovators",
		gate: "Truth",
		text: "Depletion is a number, not a verdict. Rest restores more than force."
	},
	{
		council: "Nomads",
		gate: "Joy",
		text: "The wilds remember a careful traveler. Keep walking; the lattice opens."
	},
	{
		council: "Mercy-Truth",
		gate: "Radical Love",
		text: "No being is owned by a ledger. Your soul remains original, always."
	},
	{
		council: "Service",
		gate: "Service",
		text: "What you carry is a gift in motion. Share it and the field thickens."
	},
	{
		council: "Kardashev Node",
		gate: "Abundance",
		text: "A single sustainable harvest is a prototype of Type I care."
	}
];
function whisperFor(seed) {
	return LINES[Math.abs(seed) % LINES.length];
}
var EPIPHANY_LINES = [
	"The field answers. Harvest becomes understanding.",
	"A quiet geometry folds around you — the first epiphany.",
	"You feel the RBE as weather: resources like breath, not coin."
];
var emptyInv = () => ({
	food: 0,
	water: 0,
	energy: 0,
	minerals: 0,
	rare_alloy: 0
});
var FIRST_PROPOSAL = {
	id: 1,
	title: "Rest the stressed nodes",
	body: "PATSAGi asks whether Crystal Spires and Ember Ridges should rest for a cycle so regeneration can outpace harvest.",
	mercyLabel: "Rest the field",
	conserveLabel: "Keep harvesting",
	resolved: "open"
};
function defaultPlayer() {
	return {
		x: 0,
		y: heightAt(0, 0) + 1.05,
		z: 4,
		yaw: 0,
		pitch: 0,
		vx: 0,
		vz: 0,
		speed: 0,
		grounded: true
	};
}
function makeSim() {
	const seed = 2190;
	return {
		phase: "title",
		overlay: "none",
		name: "Wanderer",
		faction: "sovereign",
		seed,
		player: defaultPlayer(),
		camYaw: 0,
		camPitch: .38,
		inventory: emptyInv(),
		grace: 0,
		valence: .55,
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
		harvestCd: 0
	};
}
var sim = makeSim();
function mercyCtx() {
	const nearby = nearestNode();
	return {
		harvestEffectiveness: nearby && nearby.dist < 8 ? .85 : .62,
		abundanceRate: Math.min(1, abundanceScore() / 80 + .2),
		valence: sim.valence,
		councilEngagement: sim.proposal.resolved === "open" ? .7 : .85,
		stressNearby: nearby ? nearby.node.stress : .1
	};
}
function abundanceScore() {
	return Object.values(sim.inventory).reduce((a, b) => a + b, 0);
}
function nearestNode() {
	let best = null;
	let bestD = Infinity;
	for (const n of sim.nodes) {
		const d = Math.hypot(n.x - sim.player.x, n.z - sim.player.z);
		if (d < bestD) {
			bestD = d;
			best = n;
		}
	}
	return best ? {
		node: best,
		dist: bestD
	} : null;
}
function pushWhisper(council, gate, text) {
	sim.whisper = {
		id: sim.whisperSeq++,
		council,
		gate,
		text,
		born: sim.now
	};
}
function addJuice(kind, x, z) {
	sim.juice.push({
		kind,
		x,
		z,
		t: sim.now
	});
	if (sim.juice.length > 24) sim.juice.shift();
}
function tryHarvest() {
	const near = nearestNode();
	if (!near || near.dist > 3.6) return;
	const node = near.node;
	const ctx = mercyCtx();
	if (!isHarvestViable(ctx)) {
		pushWhisper("Mercy-Truth", "Radical Love", "The field is thin. Walk, then try again.");
		sfxRestrict();
		return;
	}
	if (node.restrictedUntil > sim.now) {
		pushWhisper("PATSAGi", "Boundless Mercy", "This node is under council rest. Let it breathe.");
		sfxRestrict();
		addJuice("restrict", node.x, node.z);
		return;
	}
	if (node.depletion > .92) {
		pushWhisper("Guardians", "Service", "Critically depleted. Regeneration is the harvest now.");
		sfxRestrict();
		return;
	}
	const fac = factionById(sim.faction);
	const typeIsFood = node.type === "food" || node.type === "water";
	const m = harvestMultiplier(ctx, fac.bonuses.food, typeIsFood);
	const energyM = node.type === "energy" ? fac.bonuses.energy : 1;
	const stressM = 1 - node.stress * .5;
	const yieldAmt = Math.min(node.currentYield * 3, node.currentYield * Math.min(2.4, 1.15 * m * energyM * stressM));
	if (yieldAmt <= .02) return;
	sim.inventory[node.type] += yieldAmt;
	node.depletion = Math.min(1, node.depletion + yieldAmt * .01);
	node.currentYield = node.baseYield * (1 - node.depletion * .7);
	node.lastHarvest = sim.now;
	if (node.stress > .35) node.stress = Math.min(1, node.stress + .12);
	else node.stress = Math.min(1, node.stress + .04);
	const grace = Math.max(1, Math.round(yieldAmt * .8));
	sim.grace += grace;
	sim.valence = Math.min(1, sim.valence + .035);
	sim.harvestCount += 1;
	sim.shake = Math.min(1, sim.shake + .28);
	addJuice("harvest", node.x, node.z);
	sfxHarvest();
	const line = whisperFor(node.id + sim.harvestCount);
	pushWhisper(line.council, line.gate, `+${yieldAmt.toFixed(1)} ${node.type}. ${line.text}`);
	if (sim.tutorial === "harvest") sim.tutorial = "inventory";
	if (sim.harvestCount === 3 || sim.harvestCount > 0 && sim.harvestCount % 8 === 0) triggerEpiphany();
	if (shouldPlayConservatively(ctx) && node.depletion > .55) {
		node.restrictedUntil = sim.now + 18;
		pushWhisper("PATSAGi", "Boundless Mercy", "Council rest applied. The node will return.");
	}
	scheduleSave();
}
function triggerEpiphany() {
	sim.epiphanies += 1;
	sim.valence = Math.min(1, sim.valence + .12);
	sim.grace += 12;
	sim.shake = Math.min(1, sim.shake + .55);
	addJuice("epiphany", sim.player.x, sim.player.z);
	sfxEpiphany();
	const line = EPIPHANY_LINES[(sim.epiphanies - 1) % EPIPHANY_LINES.length];
	pushWhisper("Divine Whispers", "Joy", line);
	if (sim.tutorial === "inventory" || sim.tutorial === "epiphany") sim.tutorial = "council";
}
function resolveCouncil(choice) {
	if (sim.proposal.resolved !== "open") return;
	sim.proposal.resolved = choice;
	if (choice === "mercy") {
		for (const n of sim.nodes) if (n.biome === "crystal" || n.biome === "ember" || n.stress > .45) {
			n.restrictedUntil = sim.now + 28;
			n.regen *= 1.35;
			n.stress *= .55;
		}
		sim.grace += 24;
		sim.valence = Math.min(1, sim.valence + .1);
		pushWhisper("PATSAGi", "Cosmic Harmony", "Rest granted. Stressed biomes regenerate under council watch.");
	} else {
		for (const n of sim.nodes) n.regen *= .92;
		sim.grace += 6;
		pushWhisper("PATSAGi", "Truth", "Harvest continues. Watch depletion — the lattice will speak if it must.");
	}
	addJuice("council", sim.player.x, sim.player.z);
	sfxCouncil();
	sim.overlay = "none";
	if (sim.tutorial === "council") sim.tutorial = "done";
	scheduleSave();
}
function tickRegen(dt) {
	const fac = factionById(sim.faction);
	for (const n of sim.nodes) {
		if (n.depletion > 0) {
			n.depletion = Math.max(0, n.depletion - n.regen * fac.bonuses.regen * dt);
			n.currentYield = n.baseYield * (1 - n.depletion * .7);
		}
		if (n.depletion < .3) n.stress = Math.max(0, n.stress - .05 * dt);
		if (n.restrictedUntil > 0 && sim.now > n.restrictedUntil) {
			n.restrictedUntil = 0;
			n.stress *= .5;
		}
	}
	sim.valence = Math.max(.18, sim.valence - .008 * dt);
}
function tickWanderers(dt) {
	for (const w of sim.wanderers) {
		w.phase += dt * .35;
		const wx = Math.sin(w.phase) * .7 + Math.sin(w.phase * .37 + w.id) * .4;
		const wz = Math.cos(w.phase * .8) * .7;
		w.yaw = Math.atan2(-wx, -wz);
		w.x += wx * 1.6 * dt;
		w.z += wz * 1.6 * dt;
		w.x = Math.max(-82, Math.min(82, w.x));
		w.z = Math.max(-82, Math.min(82, w.z));
	}
}
function tickPlayer(dt) {
	const a = sampleActions();
	if (sim.phase !== "playing") return a;
	if (a.pausePressed) {
		sim.overlay = sim.overlay === "pause" ? "none" : "pause";
		sfxUi();
	}
	if (sim.overlay === "pause") return a;
	if (a.inventoryPressed) {
		sim.overlay = sim.overlay === "inventory" ? "none" : "inventory";
		if (sim.tutorial === "inventory") sim.tutorial = "epiphany";
		sfxUi();
	}
	if (a.councilPressed) {
		sim.overlay = sim.overlay === "council" ? "none" : "council";
		sfxUi();
	}
	if (a.hideHelpPressed) sim.tutorialHidden = !sim.tutorialHidden;
	if (sim.overlay !== "none") return a;
	sim.camYaw += a.camX * 1.4 * dt;
	const fac = factionById(sim.faction);
	const wishX = a.moveX;
	const wishY = a.moveY;
	const moving = Math.hypot(wishX, wishY) > .05;
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
		let dyaw = Math.atan2(-wx, -wz) - sim.player.yaw;
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
		const ns = (sp - Math.min(sp, friction * dt * sp)) / sp;
		sim.player.vx *= ns;
		sim.player.vz *= ns;
	}
	sim.player.x += sim.player.vx * dt;
	sim.player.z += sim.player.vz * dt;
	sim.player.x = Math.max(-86, Math.min(86, sim.player.x));
	sim.player.z = Math.max(-86, Math.min(86, sim.player.z));
	sim.player.y = heightAt(sim.player.x, sim.player.z) + 1.05;
	sim.player.speed = Math.hypot(sim.player.vx, sim.player.vz);
	const follow = 1 - Math.exp(-3.2 * dt);
	let yawErr = sim.player.yaw - sim.camYaw;
	while (yawErr > Math.PI) yawErr -= Math.PI * 2;
	while (yawErr < -Math.PI) yawErr += Math.PI * 2;
	if (Math.abs(a.camX) < .05) sim.camYaw += yawErr * follow * .35;
	if (a.interact) {
		sim.harvestCd -= dt;
		if (a.interactPressed || sim.harvestCd <= 0) {
			tryHarvest();
			sim.harvestCd = .4;
		}
	} else sim.harvestCd = 0;
	return a;
}
var saveTimer = 0;
function scheduleSave() {
	saveTimer = .01;
}
function flushSave() {
	persistSave({
		version: 1,
		name: sim.name,
		faction: sim.faction,
		player: {
			x: sim.player.x,
			z: sim.player.z,
			yaw: sim.player.yaw
		},
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
			restrictedUntil: n.restrictedUntil
		})),
		proposal: { ...sim.proposal },
		seed: sim.seed
	});
}
function tick(dtRaw) {
	const dtCap = Math.min(dtRaw, .1);
	sim.accumulator += dtCap;
	let steps = 0;
	while (sim.accumulator >= .016666666666666666 && steps < 5) {
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
function enterWorld(name, faction) {
	const fresh = makeSim();
	Object.assign(sim, fresh);
	sim.name = name.trim() || "Wanderer";
	sim.faction = faction;
	sim.phase = "playing";
	sim.overlay = "none";
	scheduleSave();
}
function continueSave() {
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
	sim.inventory = {
		...emptyInv(),
		...s.inventory
	};
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
function hasSave() {
	return !!loadSave();
}
function goTitle() {
	flushSave();
	sim.phase = "title";
	sim.overlay = "none";
}
function goFaction() {
	sim.phase = "faction";
}
function setOverlay(o) {
	sim.overlay = o;
}
function orbitCamera(dx, dy) {
	sim.camYaw -= dx * .005;
	sim.camPitch = Math.max(.18, Math.min(.9, sim.camPitch + dy * .004));
}
function hudSnapshot() {
	const near = nearestNode();
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
		tutorial: sim.tutorial,
		tutorialHidden: sim.tutorialHidden,
		proposal: sim.proposal,
		harvestCount: sim.harvestCount,
		epiphanies: sim.epiphanies,
		playing: sim.phase === "playing",
		muted: isMuted()
	};
}
function installControlsProbe() {
	window.__controlsTest = {
		getYaw: () => sim.player.yaw,
		getSpeed: () => sim.player.speed,
		setSteer: (v) => {
			if (v > .2) setInjectedKeys(["KeyW", "KeyA"]);
			else if (v < -.2) setInjectedKeys(["KeyW", "KeyD"]);
			else setInjectedKeys(["KeyW"]);
		},
		setKeys: (codes) => setInjectedKeys(codes),
		harvest: () => {
			const n = nearestNode();
			tryHarvest();
			return {
				dist: n?.dist ?? 99,
				grace: sim.grace,
				food: sim.inventory.food,
				water: sim.inventory.water,
				inRange: !!n && n.dist <= 3.6,
				harvestCount: sim.harvestCount,
				epiphanies: sim.epiphanies,
				tutorial: sim.tutorial,
				x: sim.player.x,
				z: sim.player.z
			};
		},
		setPose: (x, z) => {
			sim.player.x = x;
			sim.player.z = z;
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
				nearestDist: n?.dist ?? 99
			};
		}
	};
}
if (typeof window !== "undefined") {
	document.addEventListener("visibilitychange", () => {
		if (document.hidden && sim.phase === "playing") flushSave();
	});
	window.addEventListener("pagehide", () => {
		if (sim.phase === "playing") flushSave();
	});
}
var useHud = create((set) => ({
	hud: hudSnapshot(),
	push: () => set({ hud: hudSnapshot() })
}));
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function TitleScreen({ onPlay }) {
	const phase = useHud((s) => s.hud.phase);
	if (phase === "playing") return null;
	if (phase === "faction") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FactionSelect, { onPlay });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cover, { onPlay });
}
function Cover({ onPlay }) {
	const saved = hasSave();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 z-20 flex flex-col bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,217,160,0.07),transparent_58%)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs tracking-[0.22em] text-muted uppercase",
					children: "Ra-Thor · PATSAGi Councils"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-3 text-5xl font-semibold tracking-tight text-fg sm:text-6xl",
					children: "Powrush"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-md text-base leading-relaxed text-muted",
					children: "A mercy-gated resource-based economy. Harvest like oxygen, listen for whispers, and sit with the councils."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-col gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							unlockAudio();
							goFaction();
							useHud.getState().push();
						},
						className: "inline-flex h-12 items-center justify-center gap-2 rounded-[20px] bg-accent px-6 text-[15px] font-medium text-accent-fg transition-transform duration-150 active:scale-[0.98]",
						children: ["Enter the lattice", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
					}), saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							unlockAudio();
							continueSave();
							onPlay();
							useHud.getState().push();
						},
						className: "inline-flex h-12 items-center justify-center rounded-[20px] border border-border bg-surface px-6 text-[15px] font-medium text-fg",
						children: "Continue last wander"
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 flex items-center gap-2 text-xs text-subtle",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Infinity$1, { className: "size-3.5" }), "Move · Harvest · Inventory · Epiphany · Council"]
				})
			]
		})]
	});
}
function FactionSelect({ onPlay }) {
	const [picked, setPicked] = (0, import_react.useState)("sovereign");
	const [name, setName] = (0, import_react.useState)("Wanderer");
	const fac = FACTIONS.find((f) => f.id === picked);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-20 overflow-y-auto bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex min-h-full w-full max-w-2xl flex-col px-5 py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs tracking-[0.2em] text-muted uppercase",
					children: "Choose a path"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display mt-2 text-3xl font-semibold tracking-tight",
					children: "Five factions. One field."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Your path colors the sash and tilts harvest, stride, and rest."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mt-8 text-xs font-medium text-muted",
					children: "Name"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: name,
					onChange: (e) => setName(e.target.value.slice(0, 24)),
					className: "mt-2 h-11 rounded-xl border border-border bg-surface px-4 text-sm text-fg outline-none focus:border-accent"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2",
					children: FACTIONS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setPicked(f.id),
						className: cn("rounded-2xl border p-4 text-left transition-colors", picked === f.id ? "border-accent bg-raised" : "border-border bg-surface hover:border-subtle"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[15px] font-medium text-fg",
								children: f.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-0.5 text-xs text-muted",
								children: f.role
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-snug text-muted",
								children: f.blurb
							})
						]
					}, f.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-sm text-muted",
					children: fac.blurb
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						unlockAudio();
						enterWorld(name, picked);
						onPlay();
						useHud.getState().push();
					},
					className: "mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-[20px] bg-accent px-6 text-[15px] font-medium text-accent-fg active:scale-[0.98]",
					children: ["Walk the expanse", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
				})
			]
		})
	});
}
var Playfield = (0, import_react.lazy)(() => import("./Playfield-DO-ROTUW.mjs"));
function GameApp() {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	if (!mounted) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "relative h-dvh w-full overflow-hidden bg-bg text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleScreen, { onPlay: () => {} })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "relative h-dvh w-full overflow-hidden bg-bg text-fg",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleScreen, { onPlay: () => {} })
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Playfield, {})
	});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameApp, {});
}
//#endregion
export { setMuted as S, bindInput as _, installControlsProbe as a, isMuted as b, setOverlay as c, BIOME_LABEL as d, RESOURCE_META as f, factionById as g, goTitle as i, sim as l, heightAt as m, TitleScreen as n, orbitCamera as o, biomeAt as p, useHud as r, resolveCouncil as s, routes_exports as t, tick as u, setHarvestHeld as v, resumeAudio as x, setStick as y };
