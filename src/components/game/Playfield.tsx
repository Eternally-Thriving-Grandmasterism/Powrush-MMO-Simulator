import { Canvas } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { resumeAudio } from "@/lib/game/audio";
import { bindInput } from "@/lib/game/input";
import { installControlsProbe, orbitCamera } from "@/lib/game/sim";
import { useHud } from "@/lib/game/store";
import { ControlsPad } from "./ControlsPad";
import { HUD } from "./HUD";
import { TitleScreen } from "./TitleScreen";
import { WorldScene } from "./WorldScene";

export default function Playfield() {
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);
  const playing = useHud((s) => s.hud.phase === "playing");

  useEffect(() => {
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

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-bg text-fg">
      <div
        className="absolute inset-0 touch-none"
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest("button, input, a, [data-control]")) return;
          drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drag.current || drag.current.id !== e.pointerId) return;
          const dx = e.clientX - drag.current.x;
          const dy = e.clientY - drag.current.y;
          drag.current.x = e.clientX;
          drag.current.y = e.clientY;
          orbitCamera(dx, dy);
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        <Canvas
          camera={{ position: [0, 8, 14], fov: 50, near: 0.1, far: 160 }}
          dpr={[1, 1.5]}
          shadows
          gl={{ antialias: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.shadowMap.type = THREE.PCFShadowMap;
          }}
        >
          <WorldScene />
        </Canvas>
      </div>
      <TitleScreen onPlay={() => useHud.getState().push()} />
      {playing ? (
        <>
          <HUD />
          <ControlsPad />
        </>
      ) : null}
    </main>
  );
}
