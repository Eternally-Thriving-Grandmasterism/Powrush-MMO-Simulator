import { lazy, Suspense, useEffect, useState } from "react";
import { TitleScreen } from "./TitleScreen";

const Playfield = lazy(() => import("./Playfield"));

export function GameApp() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <main className="relative h-dvh w-full overflow-hidden bg-bg text-fg">
        <TitleScreen onPlay={() => {}} />
      </main>
    );
  }

  return (
    <Suspense
      fallback={
        <main className="relative h-dvh w-full overflow-hidden bg-bg text-fg">
          <TitleScreen onPlay={() => {}} />
        </main>
      }
    >
      <Playfield />
    </Suspense>
  );
}
