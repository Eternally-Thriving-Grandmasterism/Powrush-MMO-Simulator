import { useRef, useState, type PointerEvent } from "react";
import {
  setAllocateHeld,
  setClimateHeld,
  setHarvestHeld,
  setJumpHeld,
  setLineageHeld,
  setSprintHeld,
  setStick,
} from "@/lib/game/input";
import { setOverlay } from "@/lib/game/sim";
import { useHud } from "@/lib/game/store";
import { cn } from "@/lib/utils";

export function ControlsPad() {
  const hud = useHud((s) => s.hud);
  if (hud.phase !== "playing") return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <p className="pointer-events-none absolute bottom-[9.75rem] left-1/2 -translate-x-1/2 text-center text-[11px] tracking-wide text-white/45 sm:bottom-[10.5rem]">
        {hud.tendReady ? "Tend the glow" : "Walk to a glow"}
      </p>

      <FloatingStick locked={hud.overlay !== "none"} />

      <div
        data-control="pad"
        className="pointer-events-auto absolute right-[max(0.75rem,env(safe-area-inset-right))] bottom-[max(1.1rem,env(safe-area-inset-bottom))] flex flex-col gap-2"
      >
        <div className="grid grid-cols-3 gap-1.5">
          <PadBtn
            label="Lineage"
            active={hud.overlay === "lineage"}
            onPress={() => {
              setLineageHeld(true);
              setOverlay(hud.overlay === "lineage" ? "none" : "lineage");
              useHud.getState().push();
            }}
            onRelease={() => setLineageHeld(false)}
          />
          <PadBtn
            label="Climate"
            active={hud.overlay === "climate"}
            onPress={() => {
              setClimateHeld(true);
              setOverlay(hud.overlay === "climate" ? "none" : "climate");
              useHud.getState().push();
            }}
            onRelease={() => setClimateHeld(false)}
          />
          <PadBtn
            label="Allocate"
            active={hud.overlay === "inventory"}
            onPress={() => {
              setAllocateHeld(true);
              setOverlay(hud.overlay === "inventory" ? "none" : "inventory");
              useHud.getState().push();
            }}
            onRelease={() => setAllocateHeld(false)}
          />
          <PadBtn
            label="Jump"
            hold
            onPress={() => setJumpHeld(true)}
            onRelease={() => setJumpHeld(false)}
          />
          <PadBtn
            label="Tend"
            hold
            lit={hud.tendReady}
            onPress={() => setHarvestHeld(true)}
            onRelease={() => setHarvestHeld(false)}
          />
          <PadBtn
            label="Sprint"
            hold
            lit={hud.sprinting}
            onPress={() => setSprintHeld(true)}
            onRelease={() => setSprintHeld(false)}
          />
        </div>
      </div>
    </div>
  );
}

function PadBtn({
  label,
  onPress,
  onRelease,
  hold,
  active,
  lit,
}: {
  label: string;
  onPress: () => void;
  onRelease: () => void;
  hold?: boolean;
  active?: boolean;
  lit?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      data-control="pad"
      className={cn(
        "h-11 min-w-[4.4rem] rounded-xl border px-2 text-[11px] font-medium tracking-wide text-fg backdrop-blur-md sm:h-12 sm:min-w-[5rem] sm:text-xs",
        lit || active
          ? "border-white/35 bg-white/18 text-white"
          : "border-white/12 bg-black/45 text-white/90",
      )}
      onPointerDown={(e) => {
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        onPress();
      }}
      onPointerUp={onRelease}
      onPointerCancel={onRelease}
      onClick={() => {
        if (!hold) return;
      }}
    >
      {label}
    </button>
  );
}

function FloatingStick({ locked }: { locked: boolean }) {
  const base = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const origin = useRef<{ x: number; y: number } | null>(null);

  const end = () => {
    origin.current = null;
    setKnob({ x: 0, y: 0 });
    setStick(0, 0);
  };

  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (locked) return;
    const el = base.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const ox = origin.current?.x ?? r.left + r.width / 2;
    const oy = origin.current?.y ?? r.top + r.height / 2;
    const nx = (e.clientX - ox) / (r.width * 0.42);
    const ny = (e.clientY - oy) / (r.height * 0.42);
    const m = Math.hypot(nx, ny);
    const k = m > 1 ? 1 / m : 1;
    const x = nx * k;
    const y = ny * k;
    setKnob({ x, y });
    setStick(x, y);
  };

  return (
    <div
      ref={base}
      data-control="stick"
      className={cn(
        "pointer-events-auto absolute left-[max(0.75rem,env(safe-area-inset-left))] bottom-[max(1.1rem,env(safe-area-inset-bottom))] size-[7.25rem] touch-none sm:size-32",
        locked && "opacity-40",
      )}
      onPointerDown={(e) => {
        if (locked) return;
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        origin.current = { x: e.clientX, y: e.clientY };
        move(e);
      }}
      onPointerMove={(e) => {
        if (!origin.current) return;
        move(e);
      }}
      onPointerUp={end}
      onPointerCancel={end}
    >
      <div className="relative size-full rounded-full border border-white/18 bg-black/30 backdrop-blur-sm">
        <div
          className="absolute top-1/2 left-1/2 size-11 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-white/20 shadow-lg sm:size-12"
          style={{
            transform: `translate(calc(-50% + ${knob.x * 34}px), calc(-50% + ${knob.y * 34}px))`,
          }}
        />
      </div>
    </div>
  );
}
