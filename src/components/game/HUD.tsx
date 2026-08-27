import type { ReactNode } from "react";
import { Pause, Volume2, VolumeX, X } from "lucide-react";
import { factionById } from "@/lib/game/factions";
import { BIOME_CLIMATE, BIOME_LABEL, RESOURCE_META } from "@/lib/game/world";
import { goTitle, resolveCouncil, setOverlay } from "@/lib/game/sim";
import { isMuted, setMuted } from "@/lib/game/audio";
import { useHud } from "@/lib/game/store";
import { HARVEST_RANGE, type ResourceType, type TutorialStep } from "@/lib/game/types";

const TUTORIAL: Record<TutorialStep, string> = {
  move: "Move — left stick or WASD. Drag the field or tap Q / E to look.",
  harvest: "Tend — walk to a glow, then hold Tend (Space or F).",
  inventory: "Allocate — open the lattice share from the pad or press I.",
  epiphany: "Keep tending. An epiphany arrives when the field answers.",
  council: "Council — press C to sit with PATSAGi on a living proposal.",
  done: "The expanse is yours. H hides this strip.",
};

const ORDER: ResourceType[] = ["food", "water", "energy", "minerals", "rare_alloy"];

export function HUD() {
  const hud = useHud((s) => s.hud);
  if (hud.phase !== "playing") return null;
  const fac = factionById(hud.faction);

  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-10 p-3 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="pointer-events-auto rounded-2xl border border-white/10 bg-black/40 px-3 py-2 backdrop-blur-md">
            <div className="text-[13px] font-medium tracking-tight text-white">
              {BIOME_LABEL[hud.biome].replace(" Prime", "")}
            </div>
            <div className="font-mono text-[10px] tracking-wide text-white/55 uppercase">
              {fac.name}
            </div>
          </div>
          <div className="pointer-events-auto flex items-center gap-2">
            <div className="hidden rounded-2xl border border-white/10 bg-black/40 px-3 py-2 font-mono text-[10px] tracking-wide text-white/70 sm:block">
              V {hud.valence.toFixed(1)} · H {hud.harvestCount} · J {Math.floor(hud.grace)}
              <span className="mt-0.5 block text-right text-white/45">
                {hud.nearbyCount} nearby
              </span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 px-3 py-2 font-mono text-[10px] text-white/70 sm:hidden">
              {hud.nearbyCount} nearby
            </div>
            <IconBtn
              label={hud.muted ? "Unmute" : "Mute"}
              onClick={() => {
                setMuted(!isMuted());
                useHud.getState().push();
              }}
            >
              {hud.muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </IconBtn>
            <IconBtn
              label="Pause"
              onClick={() => {
                setOverlay(hud.overlay === "pause" ? "none" : "pause");
                useHud.getState().push();
              }}
            >
              <Pause className="size-4" />
            </IconBtn>
          </div>
        </div>

        {!hud.tutorialHidden ? (
          <div className="pointer-events-auto mt-3 max-w-md rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-sm text-white backdrop-blur-md">
            <div className="text-[11px] font-medium tracking-[0.14em] text-white/50 uppercase">
              First session
            </div>
            <p className="mt-1 leading-snug text-white/90">{TUTORIAL[hud.tutorial]}</p>
            <p className="mt-1 text-xs text-white/40">Press H to hide</p>
          </div>
        ) : null}

        {hud.whisper ? (
          <div className="pointer-events-none mt-3 max-w-lg rounded-2xl border border-white/10 bg-black/50 px-4 py-3 backdrop-blur-md">
            <div className="font-mono text-[10px] tracking-[0.16em] text-white/45 uppercase">
              {hud.whisper.council} · {hud.whisper.gate}
            </div>
            <p className="mt-1 text-sm leading-relaxed text-white/90">{hud.whisper.text}</p>
          </div>
        ) : null}

        {hud.nearest && hud.nearestDist < HARVEST_RANGE ? (
          <div className="pointer-events-none absolute top-24 left-1/2 w-[min(92vw,20rem)] -translate-x-1/2 text-center text-[12px] text-white/55">
            {RESOURCE_META[hud.nearest.type].label}
            {hud.nearest.restrictedUntil > 0 ? " · resting" : " · in reach"}
          </div>
        ) : null}
      </div>

      {hud.overlay === "inventory" ? <AllocatePanel /> : null}
      {hud.overlay === "council" ? <CouncilPanel /> : null}
      {hud.overlay === "pause" ? <PausePanel /> : null}
      {hud.overlay === "lineage" ? <LineagePanel /> : null}
      {hud.overlay === "climate" ? <ClimatePanel /> : null}
    </>
  );
}

function IconBtn({
  children,
  onClick,
  label,
}: {
  children: ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-11 items-center justify-center rounded-xl border border-white/12 bg-black/40 text-white backdrop-blur-md"
    >
      {children}
    </button>
  );
}

function AllocatePanel() {
  const hud = useHud((s) => s.hud);
  return (
    <Modal
      title="Allocate"
      onClose={() => {
        setOverlay("none");
        useHud.getState().push();
      }}
    >
      <p className="text-sm text-muted">
        Resources remain globally usable. Origin is observation, never ownership of a soul.
      </p>
      <ul className="mt-4 space-y-2">
        {ORDER.map((k) => (
          <li
            key={k}
            className="flex items-center justify-between rounded-xl border border-border bg-raised px-4 py-3"
          >
            <span className="text-sm text-fg">{RESOURCE_META[k].label}</span>
            <span className="font-mono tabular-nums text-fg">{hud.inventory[k].toFixed(1)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-subtle">
        Grace {Math.floor(hud.grace)} · Abundance {hud.abundance.toFixed(1)}
      </p>
    </Modal>
  );
}

function LineagePanel() {
  const hud = useHud((s) => s.hud);
  const self = factionById(hud.faction);
  return (
    <Modal
      title="Lineage"
      onClose={() => {
        setOverlay("none");
        useHud.getState().push();
      }}
    >
      <p className="text-sm text-muted">
        You walk as <span className="text-fg">{hud.name}</span> of the {self.name}. Sash {self.role}.
      </p>
      <ul className="mt-4 space-y-2">
        {hud.nearby.length === 0 ? (
          <li className="rounded-xl border border-border bg-raised px-4 py-3 text-sm text-muted">
            No other wanderers in this clearing.
          </li>
        ) : (
          hud.nearby.map((n) => {
            const f = factionById(n.faction);
            return (
              <li
                key={n.id}
                className="flex items-center justify-between rounded-xl border border-border bg-raised px-4 py-3"
              >
                <span className="text-sm text-fg">{f.name}</span>
                <span className="font-mono text-xs text-muted">{n.dist.toFixed(1)} u</span>
              </li>
            );
          })
        )}
      </ul>
    </Modal>
  );
}

function ClimatePanel() {
  const hud = useHud((s) => s.hud);
  const climate = BIOME_CLIMATE[hud.biome];
  return (
    <Modal
      title="Climate"
      onClose={() => {
        setOverlay("none");
        useHud.getState().push();
      }}
    >
      <p className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
        {BIOME_LABEL[hud.biome]}
      </p>
      <h3 className="font-display mt-2 text-xl font-semibold tracking-tight">{climate.sky}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{climate.read}</p>
    </Modal>
  );
}

function CouncilPanel() {
  const hud = useHud((s) => s.hud);
  const p = hud.proposal;
  return (
    <Modal
      title="PATSAGi Council"
      onClose={() => {
        setOverlay("none");
        useHud.getState().push();
      }}
    >
      <p className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">Mercy trial</p>
      <h3 className="font-display mt-2 text-xl font-semibold tracking-tight">{p.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
      {p.resolved === "open" ? (
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              resolveCouncil("mercy");
              useHud.getState().push();
            }}
            className="h-11 flex-1 rounded-xl bg-accent text-sm font-medium text-accent-fg"
          >
            {p.mercyLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              resolveCouncil("conserve");
              useHud.getState().push();
            }}
            className="h-11 flex-1 rounded-xl border border-border bg-raised text-sm font-medium text-fg"
          >
            {p.conserveLabel}
          </button>
        </div>
      ) : (
        <p className="mt-5 text-sm text-fg">
          Resolved: {p.resolved === "mercy" ? "the field rests" : "harvest continues"}.
        </p>
      )}
    </Modal>
  );
}

function PausePanel() {
  return (
    <Modal
      title="Paused"
      onClose={() => {
        setOverlay("none");
        useHud.getState().push();
      }}
    >
      <ul className="space-y-1 text-sm text-muted">
        <li>Stick / WASD — walk (A left, D right)</li>
        <li>Tend / Space / F — harvest a glow</li>
        <li>Jump / J — leave the ground</li>
        <li>Sprint / Shift — longer stride</li>
        <li>Lineage L · Climate K · Allocate I</li>
        <li>Drag to look · Q / E orbit · gamepad welcome</li>
      </ul>
      <div className="mt-6 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => {
            setOverlay("none");
            useHud.getState().push();
          }}
          className="h-11 rounded-xl bg-accent text-sm font-medium text-accent-fg"
        >
          Resume
        </button>
        <button
          type="button"
          onClick={() => {
            goTitle();
            useHud.getState().push();
          }}
          className="h-11 rounded-xl border border-border text-sm font-medium text-fg"
        >
          Return to title
        </button>
      </div>
    </Modal>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="absolute inset-0 z-30 flex items-end justify-center bg-bg/60 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-[28px] border border-border bg-surface p-5 shadow-2xl sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold tracking-tight">{title}</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-xl text-muted hover:text-fg"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
