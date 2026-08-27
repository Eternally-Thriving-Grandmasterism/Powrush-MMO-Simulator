import { i as __toESM } from "../_runtime.mjs";
import { a as BufferAttribute, c as PlaneGeometry, f as require_jsx_runtime, l as Quaternion, n as useFrame, o as Color, p as require_react, r as useThree, s as Matrix4, t as Canvas, u as Vector3 } from "../_libs/@react-three/fiber+[...].mjs";
import { a as Scale, l as BookOpen, n as VolumeX, o as Pause, r as Volume2, s as Leaf, t as X } from "../_libs/lucide-react.mjs";
import { S as setMuted, _ as bindInput, a as installControlsProbe, b as isMuted, c as setOverlay, d as BIOME_LABEL, f as RESOURCE_META, g as factionById, i as goTitle, l as sim, m as heightAt, n as TitleScreen, o as orbitCamera, p as biomeAt, r as useHud, s as resolveCouncil, u as tick, v as setHarvestHeld, x as resumeAudio, y as setStick } from "./routes-BfvC1dkl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Playfield-DO-ROTUW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TUTORIAL = {
	move: "Move — WASD or the left stick. Q / E orbits the camera.",
	harvest: "Harvest — walk to a glowing node and press Space.",
	inventory: "Inventory — press I to see what the field has given.",
	epiphany: "Keep harvesting. An epiphany arrives when the field answers.",
	council: "Council — press C to sit with PATSAGi on a living proposal.",
	done: "The expanse is yours. H hides this strip."
};
var ORDER = [
	"food",
	"water",
	"energy",
	"minerals",
	"rare_alloy"
];
function HUD() {
	const hud = useHud((s) => s.hud);
	if (hud.phase !== "playing") return null;
	const fac = factionById(hud.faction);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none absolute inset-0 z-10 p-4 sm:p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-auto rounded-2xl border border-border bg-surface/90 px-4 py-3 backdrop-blur-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-display text-sm font-semibold tracking-tight text-fg",
							children: [hud.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2 font-sans text-xs font-medium text-muted",
								children: fac.name
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 font-mono text-[11px] tracking-wide text-subtle uppercase",
							children: BIOME_LABEL[hud.biome]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-auto flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
							label: hud.muted ? "Unmute" : "Mute",
							onClick: () => {
								setMuted(!isMuted());
								useHud.getState().push();
							},
							children: hud.muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
							label: "Pause",
							onClick: () => {
								setOverlay(hud.overlay === "pause" ? "none" : "pause");
								useHud.getState().push();
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Grace",
							value: Math.floor(hud.grace).toString()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Valence",
							value: `${Math.round(hud.valence * 100)}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Abundance",
							value: hud.abundance.toFixed(0)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Epiphanies",
							value: String(hud.epiphanies)
						})
					]
				}),
				!hud.tutorialHidden ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-auto mt-3 max-w-md rounded-2xl border border-border bg-surface/90 px-4 py-3 text-sm text-fg backdrop-blur-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] font-medium tracking-[0.14em] text-muted uppercase",
							children: "First session"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 leading-snug",
							children: TUTORIAL[hud.tutorial]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-subtle",
							children: "Press H to hide"
						})
					]
				}) : null,
				hud.whisper ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-none mt-3 max-w-lg rounded-2xl border border-border bg-raised/90 px-4 py-3 backdrop-blur-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-mono text-[10px] tracking-[0.16em] text-muted uppercase",
						children: [
							hud.whisper.council,
							" · ",
							hud.whisper.gate
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm leading-relaxed text-fg",
						children: hud.whisper.text
					})]
				}) : null,
				hud.nearest && hud.nearestDist < 3.6 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute bottom-28 left-1/2 w-[min(92vw,22rem)] -translate-x-1/2 rounded-2xl border border-border bg-surface/95 px-4 py-3 text-center backdrop-blur-sm sm:bottom-24",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-center gap-2 text-sm text-fg",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "size-4 text-thrive" }),
							RESOURCE_META[hud.nearest.type].label,
							hud.nearest.restrictedUntil > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-warn",
								children: " · resting"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: " · Space to harvest"
							})
						]
					})
				}) : null
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hotbar, { inventory: hud.inventory }),
		hud.overlay === "inventory" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InventoryPanel, {}) : null,
		hud.overlay === "council" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CouncilPanel, {}) : null,
		hud.overlay === "pause" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PausePanel, {}) : null
	] });
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-surface/90 px-3 py-2 backdrop-blur-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] font-medium tracking-[0.14em] text-subtle uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-mono text-sm tabular-nums text-fg",
			children: value
		})]
	});
}
function IconBtn({ children, onClick, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": label,
		onClick,
		className: "flex size-11 items-center justify-center rounded-xl border border-border bg-surface/90 text-fg backdrop-blur-sm",
		children
	});
}
function Hotbar({ inventory }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 gap-1.5 sm:flex",
		children: ORDER.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-14 w-14 flex-col items-center justify-center rounded-xl border border-border bg-surface/90",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10px] text-subtle",
				children: RESOURCE_META[k].label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-sm tabular-nums text-fg",
				children: inventory[k].toFixed(0)
			})]
		}, k))
	});
}
function InventoryPanel() {
	const hud = useHud((s) => s.hud);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		title: "Inventory",
		onClose: () => {
			setOverlay("none");
			useHud.getState().push();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Resources remain globally usable. Origin is observation, never ownership of a soul."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-2",
				children: ORDER.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between rounded-xl border border-border bg-raised px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-fg",
						children: RESOURCE_META[k].label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono tabular-nums text-fg",
						children: hud.inventory[k].toFixed(1)
					})]
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-xs text-subtle",
				children: [
					"Grace ",
					Math.floor(hud.grace),
					" · Abundance ",
					hud.abundance.toFixed(1)
				]
			})
		]
	});
}
function CouncilPanel() {
	const p = useHud((s) => s.hud).proposal;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		title: "PATSAGi Council",
		onClose: () => {
			setOverlay("none");
			useHud.getState().push();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[11px] tracking-[0.14em] text-muted uppercase",
				children: "Mercy trial"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display mt-2 text-xl font-semibold tracking-tight",
				children: p.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed text-muted",
				children: p.body
			}),
			p.resolved === "open" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-col gap-2 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						resolveCouncil("mercy");
						useHud.getState().push();
					},
					className: "h-11 flex-1 rounded-xl bg-accent text-sm font-medium text-accent-fg",
					children: p.mercyLabel
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						resolveCouncil("conserve");
						useHud.getState().push();
					},
					className: "h-11 flex-1 rounded-xl border border-border bg-raised text-sm font-medium text-fg",
					children: p.conserveLabel
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-5 text-sm text-fg",
				children: [
					"Resolved: ",
					p.resolved === "mercy" ? "the field rests" : "harvest continues",
					"."
				]
			})
		]
	});
}
function PausePanel() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		title: "Paused",
		onClose: () => {
			setOverlay("none");
			useHud.getState().push();
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "space-y-1 text-sm text-muted",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "WASD / stick — move" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Space / South — harvest" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "I — inventory · C — council · H — hide help" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Drag to look · Q / E orbit" })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 flex flex-col gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					setOverlay("none");
					useHud.getState().push();
				},
				className: "h-11 rounded-xl bg-accent text-sm font-medium text-accent-fg",
				children: "Resume"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					goTitle();
					useHud.getState().push();
				},
				className: "h-11 rounded-xl border border-border text-sm font-medium text-fg",
				children: "Return to title"
			})]
		})]
	});
}
function Modal({ title, onClose, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-30 flex items-end justify-center bg-bg/60 p-4 sm:items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-[28px] border border-border bg-surface p-5 shadow-2xl sm:p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-semibold tracking-tight",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Close",
					onClick: onClose,
					className: "flex size-10 items-center justify-center rounded-xl text-muted hover:text-fg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children
			})]
		})
	});
}
function MobileActions() {
	const hud = useHud((s) => s.hud);
	if (hud.phase !== "playing") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-auto absolute right-4 bottom-8 z-20 flex flex-col gap-2 sm:hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Harvest",
				className: "flex size-14 items-center justify-center rounded-full border border-border bg-surface/90 text-fg",
				onPointerDown: () => setHarvestHeld(true),
				onPointerUp: () => setHarvestHeld(false),
				onPointerCancel: () => setHarvestHeld(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "size-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Inventory",
				className: "flex size-12 items-center justify-center rounded-full border border-border bg-surface/90 text-fg",
				onClick: () => {
					setOverlay(hud.overlay === "inventory" ? "none" : "inventory");
					useHud.getState().push();
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Council",
				className: "flex size-12 items-center justify-center rounded-full border border-border bg-surface/90 text-fg",
				onClick: () => {
					setOverlay(hud.overlay === "council" ? "none" : "council");
					useHud.getState().push();
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-4" })
			})
		]
	});
}
function TouchStick() {
	const hud = useHud((s) => s.hud);
	if (hud.phase !== "playing" || hud.overlay !== "none") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute bottom-8 left-4 z-20 size-32 touch-none sm:hidden",
		onPointerDown: (e) => handleStick(e),
		onPointerMove: (e) => {
			if (e.buttons) handleStick(e);
		},
		onPointerUp: () => setStick(0, 0),
		onPointerCancel: () => setStick(0, 0),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-full rounded-full border border-border bg-surface/50" })
	});
}
function handleStick(e) {
	const r = e.currentTarget.getBoundingClientRect();
	const x = (e.clientX - r.left) / r.width * 2 - 1;
	const y = (e.clientY - r.top) / r.height * 2 - 1;
	setStick(Math.max(-1, Math.min(1, x)), Math.max(-1, Math.min(1, y)));
}
var _desired = new Vector3();
var _look = new Vector3();
var _fwd = new Vector3();
var _color = new Color();
var BIOME_HEX = {
	sanctuary: "#3d4a3c",
	crystal: "#3a4452",
	abyss: "#24343c",
	algae: "#355044",
	ember: "#4a3d34",
	wilds: "#3a4238"
};
function makeTerrain() {
	const geo = new PlaneGeometry(176, 176, 88, 88);
	geo.rotateX(-Math.PI / 2);
	const pos = geo.attributes.position;
	const colors = new Float32Array(pos.count * 3);
	for (let i = 0; i < pos.count; i++) {
		const x = pos.getX(i);
		const z = pos.getZ(i);
		pos.setY(i, heightAt(x, z));
		_color.set(BIOME_HEX[biomeAt(x, z)] ?? "#3a4238");
		const n = (Math.sin(x * .2) + Math.cos(z * .17)) * .03;
		_color.offsetHSL(0, 0, n);
		colors[i * 3] = _color.r;
		colors[i * 3 + 1] = _color.g;
		colors[i * 3 + 2] = _color.b;
	}
	geo.setAttribute("color", new BufferAttribute(colors, 3));
	geo.computeVertexNormals();
	return geo;
}
function scatter(count, pred, seed) {
	const mats = [];
	let n = seed;
	const rand = () => {
		n = n * 16807 % 2147483647;
		return (n & 2147483647) / 2147483647;
	};
	let guard = 0;
	while (mats.length < count && guard++ < count * 20) {
		const x = (rand() * 2 - 1) * 82;
		const z = (rand() * 2 - 1) * 82;
		if (!pred(x, z)) continue;
		if (Math.hypot(x, z) < 8) continue;
		const y = heightAt(x, z);
		const m = new Matrix4();
		const s = .7 + rand() * .8;
		m.compose(new Vector3(x, y, z), new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), rand() * Math.PI * 2), new Vector3(s, s, s));
		mats.push(m);
	}
	return mats;
}
function Terrain() {
	const geo = (0, import_react.useMemo)(() => makeTerrain(), []);
	(0, import_react.useLayoutEffect)(() => () => geo.dispose(), [geo]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
		geometry: geo,
		receiveShadow: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			vertexColors: true,
			roughness: .92,
			metalness: .04
		})
	});
}
function Forest() {
	const trees = (0, import_react.useMemo)(() => scatter(70, (x, z) => {
		const b = biomeAt(x, z);
		return b === "wilds" || b === "sanctuary" || b === "algae";
	}, 901), []);
	const mesh = (0, import_react.useRef)(null);
	const tops = (0, import_react.useRef)(null);
	(0, import_react.useLayoutEffect)(() => {
		if (!mesh.current || !tops.current) return;
		const tmp = new Matrix4();
		const pos = new Vector3();
		const quat = new Quaternion();
		const scl = new Vector3();
		trees.forEach((m, i) => {
			mesh.current.setMatrixAt(i, m);
			m.decompose(pos, quat, scl);
			tmp.compose(new Vector3(pos.x, pos.y + 1.6 * scl.y, pos.z), quat, new Vector3(scl.x * 1.4, scl.y * 2.1, scl.z * 1.4));
			tops.current.setMatrixAt(i, tmp);
		});
		mesh.current.instanceMatrix.needsUpdate = true;
		tops.current.instanceMatrix.needsUpdate = true;
	}, [trees]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("instancedMesh", {
		ref: mesh,
		args: [
			void 0,
			void 0,
			trees.length
		],
		castShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
			.12,
			.18,
			1.4,
			6
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: "#3a322c",
			roughness: .9
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("instancedMesh", {
		ref: tops,
		args: [
			void 0,
			void 0,
			trees.length
		],
		castShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
			.85,
			2.2,
			7
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: "#4a5c48",
			roughness: .85
		})]
	})] });
}
function Spires() {
	const mats = (0, import_react.useMemo)(() => scatter(28, (x, z) => biomeAt(x, z) === "crystal", 404), []);
	const mesh = (0, import_react.useRef)(null);
	(0, import_react.useLayoutEffect)(() => {
		if (!mesh.current) return;
		mats.forEach((m, i) => mesh.current.setMatrixAt(i, m));
		mesh.current.instanceMatrix.needsUpdate = true;
	}, [mats]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("instancedMesh", {
		ref: mesh,
		args: [
			void 0,
			void 0,
			mats.length
		],
		castShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("octahedronGeometry", { args: [.7, 0] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: "#9aa7b8",
			roughness: .28,
			metalness: .45,
			emissive: "#6d7c90",
			emissiveIntensity: .18
		})]
	});
}
function Rocks() {
	const mats = (0, import_react.useMemo)(() => scatter(36, (x, z) => biomeAt(x, z) === "ember" || biomeAt(x, z) === "abyss" || biomeAt(x, z) === "wilds", 77), []);
	const mesh = (0, import_react.useRef)(null);
	(0, import_react.useLayoutEffect)(() => {
		if (!mesh.current) return;
		mats.forEach((m, i) => mesh.current.setMatrixAt(i, m));
		mesh.current.instanceMatrix.needsUpdate = true;
	}, [mats]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("instancedMesh", {
		ref: mesh,
		args: [
			void 0,
			void 0,
			mats.length
		],
		castShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dodecahedronGeometry", { args: [.55, 0] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: "#4a4742",
			roughness: .95
		})]
	});
}
function Nodes() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", { children: sim.nodes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NodeMesh, { id: n.id }, n.id)) });
}
function NodeMesh({ id }) {
	const ref = (0, import_react.useRef)(null);
	const n0 = sim.nodes.find((x) => x.id === id);
	const color = n0 ? RESOURCE_META[n0.type].color : "#d4d8de";
	useFrame((state) => {
		const n = sim.nodes.find((x) => x.id === id);
		if (!n || !ref.current) return;
		const restricted = n.restrictedUntil > sim.now;
		const s = .85 + Math.sin(state.clock.elapsedTime * 2 + id) * .08;
		const deplete = 1 - n.depletion * .45;
		ref.current.position.set(n.x, n.y + .85 + Math.sin(state.clock.elapsedTime * 1.4 + id) * .12, n.z);
		ref.current.rotation.y = state.clock.elapsedTime * .35 + id;
		ref.current.scale.setScalar(s * deplete * (restricted ? .7 : 1));
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref,
		position: [
			n0?.x ?? 0,
			(n0?.y ?? 0) + .9,
			n0?.z ?? 0
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("icosahedronGeometry", { args: [.48, 0] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color,
				emissive: color,
				emissiveIntensity: .55,
				roughness: .35,
				metalness: .2
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
			.72,
			.03,
			8,
			24
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
			color,
			transparent: true,
			opacity: .45
		})] })]
	});
}
function Wanderers() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", { children: sim.wanderers.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandererMesh, { id: w.id }, w.id)) });
}
function WandererMesh({ id }) {
	const ref = (0, import_react.useRef)(null);
	const w = sim.wanderers[id];
	const accent = factionById(w.faction).accent;
	useFrame(() => {
		const ww = sim.wanderers[id];
		if (!ref.current || !ww) return;
		ref.current.position.set(ww.x, heightAt(ww.x, ww.z) + .95, ww.z);
		ref.current.rotation.y = Math.PI + ww.yaw;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			castShadow: true,
			position: [
				0,
				.2,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [
				.28,
				.7,
				4,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#c8c4bb",
				roughness: .7
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.15,
				.05
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
				.3,
				.05,
				6,
				12
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: accent,
				roughness: .5
			})]
		})]
	});
}
function PlayerMesh() {
	const ref = (0, import_react.useRef)(null);
	const band = (0, import_react.useRef)(null);
	useFrame(() => {
		if (!ref.current) return;
		const p = sim.player;
		ref.current.position.set(p.x, p.y, p.z);
		ref.current.rotation.y = Math.PI + p.yaw;
		const accent = factionById(sim.faction).accent;
		if (band.current) band.current.color.set(accent);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				castShadow: true,
				position: [
					0,
					.15,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [
					.32,
					.85,
					6,
					10
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#e8e4dc",
					roughness: .55
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.85,
					.02
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.26,
					12,
					12
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#f2eee6",
					roughness: .5
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.22,
					.06
				],
				rotation: [
					Math.PI / 2,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
					.34,
					.055,
					8,
					16
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					ref: band,
					color: "#7f93b0",
					roughness: .4,
					metalness: .15
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.05,
					-.22
				],
				rotation: [
					.4,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.7,
					.9,
					.12
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#2a2a30",
					roughness: .85
				})]
			})
		]
	});
}
function JuiceBursts() {
	const ref = (0, import_react.useRef)(null);
	useFrame(() => {
		if (!ref.current) return;
		ref.current.children.forEach((child, i) => {
			const ev = sim.juice[i];
			if (!ev) {
				child.visible = false;
				return;
			}
			child.visible = true;
			const age = sim.now - ev.t;
			const s = .4 + age * 2.4;
			child.position.set(ev.x, heightAt(ev.x, ev.z) + 1.2, ev.z);
			child.scale.setScalar(s);
			const mat = child.material;
			mat.opacity = Math.max(0, .55 - age * .4);
		});
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		ref,
		children: Array.from({ length: 16 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			visible: false,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.4,
				10,
				10
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
				color: "#e8d9a0",
				transparent: true,
				opacity: .4,
				depthWrite: false
			})]
		}, i))
	});
}
function CameraRig() {
	const { camera } = useThree();
	useFrame((_, delta) => {
		const d = Math.min(delta, .1);
		const p = sim.player;
		_fwd.set(-Math.sin(sim.camYaw), 0, -Math.cos(sim.camYaw));
		const dist = 10.8;
		const height = 4.6 + sim.camPitch * 3.2;
		_desired.set(p.x - _fwd.x * dist, p.y + height, p.z - _fwd.z * dist);
		const k = 1 - Math.exp(-5.2 * d);
		camera.position.lerp(_desired, k);
		const minY = heightAt(camera.position.x, camera.position.z) + 1.8;
		if (camera.position.y < minY) camera.position.y = minY;
		const trauma = sim.shake * sim.shake;
		if (trauma > .01) {
			camera.position.x += (Math.random() * 2 - 1) * trauma * .28;
			camera.position.y += (Math.random() * 2 - 1) * trauma * .18;
		}
		_look.set(p.x, p.y + 1.35, p.z);
		camera.lookAt(_look);
	});
	return null;
}
function SimLoop() {
	const acc = (0, import_react.useRef)(0);
	const last = (0, import_react.useRef)({
		overlay: sim.overlay,
		harvest: -1,
		whisper: 0,
		phase: sim.phase
	});
	useFrame((_, delta) => {
		tick(delta);
		acc.current += delta;
		const whisperId = sim.whisper?.id ?? 0;
		if (last.current.overlay !== sim.overlay || last.current.harvest !== sim.harvestCount || last.current.whisper !== whisperId || last.current.phase !== sim.phase || acc.current > .1) {
			last.current = {
				overlay: sim.overlay,
				harvest: sim.harvestCount,
				whisper: whisperId,
				phase: sim.phase
			};
			acc.current = 0;
			useHud.getState().push();
		}
	});
	return null;
}
function WorldScene() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimLoop, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraRig, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
			attach: "background",
			args: ["#0c1016"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("fog", {
			attach: "fog",
			args: [
				"#0c1016",
				28,
				92
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hemisphereLight", { args: [
			"#c9d2dc",
			"#2a2a24",
			.72
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			position: [
				28,
				42,
				16
			],
			intensity: 1.15,
			color: "#f2efe6",
			castShadow: true,
			"shadow-mapSize-width": 1024,
			"shadow-mapSize-height": 1024,
			"shadow-camera-far": 120,
			"shadow-camera-left": -50,
			"shadow-camera-right": 50,
			"shadow-camera-top": 50,
			"shadow-camera-bottom": -50
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terrain, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forest, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spires, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rocks, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nodes, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wanderers, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerMesh, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JuiceBursts, {})
	] });
}
function Playfield() {
	const drag = (0, import_react.useRef)(null);
	const playing = useHud((s) => s.hud.phase === "playing");
	(0, import_react.useEffect)(() => {
		installControlsProbe();
		const unbind = bindInput();
		const vis = () => {
			if (!document.hidden) resumeAudio();
		};
		document.addEventListener("visibilitychange", vis);
		return () => {
			unbind();
			document.removeEventListener("visibilitychange", vis);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative h-dvh w-full overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 touch-none",
				onPointerDown: (e) => {
					if (e.target.closest("button, input, a")) return;
					drag.current = {
						id: e.pointerId,
						x: e.clientX,
						y: e.clientY
					};
					e.currentTarget.setPointerCapture(e.pointerId);
				},
				onPointerMove: (e) => {
					if (!drag.current || drag.current.id !== e.pointerId) return;
					const dx = e.clientX - drag.current.x;
					const dy = e.clientY - drag.current.y;
					drag.current.x = e.clientX;
					drag.current.y = e.clientY;
					orbitCamera(dx, dy);
				},
				onPointerUp: () => {
					drag.current = null;
				},
				onPointerCancel: () => {
					drag.current = null;
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
					camera: {
						position: [
							0,
							8,
							14
						],
						fov: 50,
						near: .1,
						far: 160
					},
					dpr: [1, 1.5],
					shadows: true,
					gl: {
						antialias: true,
						powerPreference: "high-performance"
					},
					onCreated: ({ gl }) => {
						gl.shadowMap.type = 1;
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorldScene, {})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleScreen, { onPlay: () => useHud.getState().push() }),
			playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HUD, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TouchStick, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileActions, {})
			] }) : null
		]
	});
}
//#endregion
export { Playfield as default };
