import type { ReactNode } from "react";
import { BookOpen, Leaf, Pause, Scale, Volume2, VolumeX, X } from "lucide-react";
import { factionById } from "@/lib/game/factions";
import { BIOME_LABEL, RESOURCE_META } from "@/lib/game/world";
import { goTitle, resolveCouncil, setOverlay } from "@/lib/game/sim";
import { isMuted, setMuted } from "@/lib/game/audio";
import { setHarvestHeld, setStick } from "@/lib/game/input";
import { useHud } from "@/lib/game/store";
import { HARVEST_RANGE, type ResourceType, type TutorialStep } from "@/lib/game/types";

const TUTORIAL: Record<TutorialStep, string> = {
  move: "Move — WASD or the left stick. Q / E orbits the camera.",
  harvest: "Harvest — walk to a glowing node and press Space.",
  inventory: "Inventory — press I to see what the field has given.",
  epiphany: "Keep harvesting. An epiphany arrives when the field answers.",
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
      <div className="pointer-events-none absolute inset-0 z-10 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="pointer-events-auto rounded-2xl border border-border bg-surface/90 px-4 py-3 backdrop-blur-sm">
            <div className="font-display text-sm font-semibold tracking-tight text-fg">
              {hud.name}
              <span className="ml-2 font-sans text-xs font-medium text-muted">{fac.name}</span>
            </div>
            <div className="mt-0.5 font-mono text-[11px] tracking-wide text-subtle uppercase">
              {BIOME_LABEL[hud.biome]}
            </div>
          </div>
          <div className="pointer-events-auto flex items-center gap-2">
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

        <div className="mt-3 flex flex-wrap gap-2">
          <Stat label="Grace" value={Math.floor(hud.grace).toString()} />
          <Stat label="Valence" value={`${Math.round(hud.valence * 100)}`} />
          <Stat label="Abundance" value={hud.abundance.toFixed(0)} />
          <Stat label="Epiphanies" value={String(hud.epiphanies)} />
        </div>

        {!hud.tutorialHidden ? (
          <div className="pointer-events-auto mt-3 max-w-md rounded-2xl border border-border bg-surface/90 px-4 py-3 text-sm text-fg backdrop-blur-sm">
            <div className="text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
              First session
            </div>
            <p className="mt-1 leading-snug">{TUTORIAL[hud.tutorial]}</p>
            <p className="mt-1 text-xs text-subtle">Press H to hide</p>
          </div>
        ) : null}

        {hud.whisper ? (
          <div className="pointer-events-none mt-3 max-w-lg rounded-2xl border border-border bg-raised/90 px-4 py-3 backdrop-blur-sm">
            <div className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
              {hud.whisper.council} · {hud.whisper.gate}
            </div>
            <p className="mt-1 text-sm leading-relaxed text-fg">{hud.whisper.text}</p>
          </div>
        ) : null}

        {hud.nearest && hud.nearestDist < HARVEST_RANGE ? (
          <div className="pointer-events-none absolute bottom-28 left-1/2 w-[min(92vw,22rem)] -translate-x-1/2 rounded-2xl border border-border bg-surface/95 px-4 py-3 text-center backdrop-blur-sm sm:bottom-24">
            <div className="flex items-center justify-center gap-2 text-sm text-fg">
              <Leaf className="size-4 text-thrive" />
              {RESOURCE_META[hud.nearest.type].label}
              {hud.nearest.restrictedUntil > 0 ? (
                <span className="text-xs text-warn"> · resting</span>
              ) : (
                <span className="text-xs text-muted"> · Space to harvest</span>
              )}
            </div>
          </div>
        ) : null}
      </div>

      <Hotbar inventory={hud.inventory} />

      {hud.overlay === "inventory" ? <InventoryPanel /> : null}
      {hud.overlay === "council" ? <CouncilPanel /> : null}
      {hud.overlay === "pause" ? <PausePanel /> : null}
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface/90 px-3 py-2 backdrop-blur-sm">
      <div className="text-[10px] font-medium tracking-[0.14em] text-subtle uppercase">{label}</div>
      <div className="font-mono text-sm tabular-nums text-fg">{value}</div>
    </div>
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
      className="flex size-11 items-center justify-center rounded-xl border border-border bg-surface/90 text-fg backdrop-blur-sm"
    >
      {children}
    </button>
  );
}

function Hotbar({ inventory }: { inventory: Record<ResourceType, number> }) {
  return (
    <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 gap-1.5 sm:flex">
      {ORDER.map((k) => (
        <div
          key={k}
          className="flex h-14 w-14 flex-col items-center justify-center rounded-xl border border-border bg-surface/90"
        >
          <span className="text-[10px] text-subtle">{RESOURCE_META[k].label}</span>
          <span className="font-mono text-sm tabular-nums text-fg">{inventory[k].toFixed(0)}</span>
        </div>
      ))}
    </div>
  );
}

function InventoryPanel() {
  const hud = useHud((s) => s.hud);
  return (
    <Modal
      title="Inventory"
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
        <li>WASD / stick — move</li>
        <li>Space / South — harvest</li>
        <li>I — inventory · C — council · H — hide help</li>
        <li>Drag to look · Q / E orbit</li>
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

export function MobileActions() {
  const hud = useHud((s) => s.hud);
  if (hud.phase !== "playing") return null;
  return (
    <div className="pointer-events-auto absolute right-4 bottom-8 z-20 flex flex-col gap-2 sm:hidden">
      <button
        type="button"
        aria-label="Harvest"
        className="flex size-14 items-center justify-center rounded-full border border-border bg-surface/90 text-fg"
        onPointerDown={() => setHarvestHeld(true)}
        onPointerUp={() => setHarvestHeld(false)}
        onPointerCancel={() => setHarvestHeld(false)}
      >
        <Leaf className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Inventory"
        className="flex size-12 items-center justify-center rounded-full border border-border bg-surface/90 text-fg"
        onClick={() => {
          setOverlay(hud.overlay === "inventory" ? "none" : "inventory");
          useHud.getState().push();
        }}
      >
        <BookOpen className="size-4" />
      </button>
      <button
        type="button"
        aria-label="Council"
        className="flex size-12 items-center justify-center rounded-full border border-border bg-surface/90 text-fg"
        onClick={() => {
          setOverlay(hud.overlay === "council" ? "none" : "council");
          useHud.getState().push();
        }}
      >
        <Scale className="size-4" />
      </button>
    </div>
  );
}

export function TouchStick() {
  const hud = useHud((s) => s.hud);
  if (hud.phase !== "playing" || hud.overlay !== "none") return null;
  return (
    <div
      className="absolute bottom-8 left-4 z-20 size-32 touch-none sm:hidden"
      onPointerDown={(e) => handleStick(e)}
      onPointerMove={(e) => {
        if (e.buttons) handleStick(e);
      }}
      onPointerUp={() => setStick(0, 0)}
      onPointerCancel={() => setStick(0, 0)}
    >
      <div className="size-full rounded-full border border-border bg-surface/50" />
    </div>
  );
}

function handleStick(e: React.PointerEvent<HTMLDivElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - r.left) / r.width) * 2 - 1;
  const y = ((e.clientY - r.top) / r.height) * 2 - 1;
  setStick(Math.max(-1, Math.min(1, x)), Math.max(-1, Math.min(1, y)));
}
