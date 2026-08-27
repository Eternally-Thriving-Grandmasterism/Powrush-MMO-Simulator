import { useState } from "react";
import { ArrowRight, Infinity } from "lucide-react";
import { FACTIONS } from "@/lib/game/factions";
import { continueSave, enterWorld, goFaction, hasSave } from "@/lib/game/sim";
import { useHud } from "@/lib/game/store";
import type { FactionId } from "@/lib/game/types";
import { unlockAudio } from "@/lib/game/audio";
import { cn } from "@/lib/utils";

export function TitleScreen({ onPlay }: { onPlay: () => void }) {
  const phase = useHud((s) => s.hud.phase);
  if (phase === "playing") return null;
  if (phase === "faction") return <FactionSelect onPlay={onPlay} />;
  return <Cover onPlay={onPlay} />;
}

function Cover({ onPlay }: { onPlay: () => void }) {
  const saved = hasSave();
  return (
    <div className="absolute inset-0 z-20 flex flex-col bg-bg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,217,160,0.07),transparent_58%)]" />
      <div className="relative mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-12">
        <p className="font-mono text-xs tracking-[0.22em] text-muted uppercase">
          Ra-Thor · PATSAGi Councils
        </p>
        <h1 className="font-display mt-3 text-5xl font-semibold tracking-tight text-fg sm:text-6xl">
          Powrush
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
          A mercy-gated resource-based economy. Harvest like oxygen, listen for
          whispers, and sit with the councils.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => {
              unlockAudio();
              goFaction();
              useHud.getState().push();
            }}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[20px] bg-accent px-6 text-[15px] font-medium text-accent-fg transition-transform duration-150 active:scale-[0.98]"
          >
            Enter the lattice
            <ArrowRight className="size-4" />
          </button>
          {saved ? (
            <button
              type="button"
              onClick={() => {
                unlockAudio();
                continueSave();
                onPlay();
                useHud.getState().push();
              }}
              className="inline-flex h-12 items-center justify-center rounded-[20px] border border-border bg-surface px-6 text-[15px] font-medium text-fg"
            >
              Continue last wander
            </button>
          ) : null}
        </div>
        <p className="mt-6 flex items-center gap-2 text-xs text-subtle">
          <Infinity className="size-3.5" />
          Move · Harvest · Inventory · Epiphany · Council
        </p>
      </div>
    </div>
  );
}

function FactionSelect({ onPlay }: { onPlay: () => void }) {
  const [picked, setPicked] = useState<FactionId>("sovereign");
  const [name, setName] = useState("Wanderer");
  const fac = FACTIONS.find((f) => f.id === picked)!;

  return (
    <div className="absolute inset-0 z-20 overflow-y-auto bg-bg">
      <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col px-5 py-10">
        <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase">Choose a path</p>
        <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight">Five factions. One field.</h2>
        <p className="mt-2 text-sm text-muted">Your path colors the sash and tilts harvest, stride, and rest.</p>

        <label className="mt-8 text-xs font-medium text-muted">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 24))}
          className="mt-2 h-11 rounded-xl border border-border bg-surface px-4 text-sm text-fg outline-none focus:border-accent"
        />

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {FACTIONS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setPicked(f.id)}
              className={cn(
                "rounded-2xl border p-4 text-left transition-colors",
                picked === f.id
                  ? "border-accent bg-raised"
                  : "border-border bg-surface hover:border-subtle",
              )}
            >
              <div className="text-[15px] font-medium text-fg">{f.name}</div>
              <div className="mt-0.5 text-xs text-muted">{f.role}</div>
              <p className="mt-2 text-sm leading-snug text-muted">{f.blurb}</p>
            </button>
          ))}
        </div>

        <p className="mt-5 text-sm text-muted">{fac.blurb}</p>

        <button
          type="button"
          onClick={() => {
            unlockAudio();
            enterWorld(name, picked);
            onPlay();
            useHud.getState().push();
          }}
          className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-[20px] bg-accent px-6 text-[15px] font-medium text-accent-fg active:scale-[0.98]"
        >
          Walk the expanse
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
