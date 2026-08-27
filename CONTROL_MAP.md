# Powrush-MMO Simulator — Universal Control Map

Human-playable input for every device class. Signs follow the Sanctuary pad
(left stick + right action cluster) and the original Powrush-MMO client.

Canonical contact: info@Rathor.ai

## Device classes

| Class | Move | Look | Actions |
| --- | --- | --- | --- |
| Phone / tablet (touch) | Left analog stick | Drag empty canvas | Right cluster |
| Desktop / laptop | WASD or arrows | Mouse drag + Q / E | Keys below |
| Gamepad | Left stick | Right stick | Face + bumpers |
| Mixed (touch laptop) | Both stick and WASD | Drag or Q / E | Cluster + keys |

All four streams merge into one `Actions` sample each tick. Nothing is
exclusive: a keyboard sprint still works while a thumb holds the stick.

## On-screen pad (Sanctuary iteration)

```
[ analog stick ]                 Lineage   Climate   Allocate
                                 Jump      Tend      Sprint
              Walk to a glow
```

- **Stick** — camera-relative walk. Deadzone 0.18. Floating origin on first
  contact so thumbs are not glued to a painted circle.
- **Lineage** — nearby wanderers and your faction sash.
- **Climate** — current biome weather / field read.
- **Allocate** — inventory / lattice allocation (same store as `I`).
- **Jump** — leave the ground. Does not harvest.
- **Tend** — harvest a glow in range (hold or tap). Highlights when a node is
  inside `HARVEST_RANGE`.
- **Sprint** — hold for the sprint gait.

## Keyboard

| Key | Action |
| --- | --- |
| W A S D / arrows | Move (A left, D right, camera-relative strafe) |
| Shift | Sprint |
| Space or F | Tend / harvest |
| J | Jump |
| I or R | Allocate / inventory |
| C | PATSAGi council |
| L | Lineage |
| K | Climate |
| Q / E | Orbit camera |
| H | Hide tutorial strip |
| Esc | Pause |

## Gamepad

| Control | Action |
| --- | --- |
| Left stick | Move |
| Right stick | Orbit yaw |
| A / South | Tend |
| B / East | Sprint |
| X / West | Jump |
| Y / North | Lineage |
| LB | Climate |
| RB | Allocate |
| Start | Pause |

## Movement signs (controls skill)

On-foot FPS map, chase camera behind the capsule:

- W / stick-up = world forward along camera yaw
- S = back
- A = strafe left on screen
- D = strafe right on screen

`window.__controlsTest` remains installed in play for QA (`setKeys`, `getYaw`,
`getSpeed`).
