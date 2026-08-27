import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { factionById } from "@/lib/game/factions";
import { sim, tick } from "@/lib/game/sim";
import { useHud } from "@/lib/game/store";
import { WORLD_SIZE } from "@/lib/game/types";
import { biomeAt, heightAt, RESOURCE_META } from "@/lib/game/world";

const _desired = new THREE.Vector3();
const _look = new THREE.Vector3();
const _fwd = new THREE.Vector3();
const _color = new THREE.Color();

const BIOME_HEX: Record<string, string> = {
  sanctuary: "#3d4a3c",
  crystal: "#3a4452",
  abyss: "#24343c",
  algae: "#355044",
  ember: "#4a3d34",
  wilds: "#3a4238",
};

function makeTerrain() {
  const geo = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, 88, 88);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    pos.setY(i, heightAt(x, z));
    _color.set(BIOME_HEX[biomeAt(x, z)] ?? "#3a4238");
    const n = (Math.sin(x * 0.2) + Math.cos(z * 0.17)) * 0.03;
    _color.offsetHSL(0, 0, n);
    colors[i * 3] = _color.r;
    colors[i * 3 + 1] = _color.g;
    colors[i * 3 + 2] = _color.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
}

function scatter(
  count: number,
  pred: (x: number, z: number) => boolean,
  seed: number,
) {
  const mats: THREE.Matrix4[] = [];
  let n = seed;
  const rand = () => {
    n = (n * 16807) % 2147483647;
    return (n & 0x7fffffff) / 2147483647;
  };
  let guard = 0;
  while (mats.length < count && guard++ < count * 20) {
    const x = (rand() * 2 - 1) * (WORLD_SIZE / 2 - 6);
    const z = (rand() * 2 - 1) * (WORLD_SIZE / 2 - 6);
    if (!pred(x, z)) continue;
    if (Math.hypot(x, z) < 8) continue;
    const y = heightAt(x, z);
    const m = new THREE.Matrix4();
    const s = 0.7 + rand() * 0.8;
    m.compose(
      new THREE.Vector3(x, y, z),
      new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rand() * Math.PI * 2),
      new THREE.Vector3(s, s, s),
    );
    mats.push(m);
  }
  return mats;
}

function Terrain() {
  const geo = useMemo(() => makeTerrain(), []);
  useLayoutEffect(() => () => geo.dispose(), [geo]);
  return (
    <mesh geometry={geo} receiveShadow>
      <meshStandardMaterial vertexColors roughness={0.92} metalness={0.04} />
    </mesh>
  );
}

function Forest() {
  const trees = useMemo(
    () =>
      scatter(
        70,
        (x, z) => {
          const b = biomeAt(x, z);
          return b === "wilds" || b === "sanctuary" || b === "algae";
        },
        901,
      ),
    [],
  );
  const mesh = useRef<THREE.InstancedMesh>(null);
  const tops = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!mesh.current || !tops.current) return;
    const tmp = new THREE.Matrix4();
    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    const scl = new THREE.Vector3();
    trees.forEach((m, i) => {
      mesh.current!.setMatrixAt(i, m);
      m.decompose(pos, quat, scl);
      tmp.compose(
        new THREE.Vector3(pos.x, pos.y + 1.6 * scl.y, pos.z),
        quat,
        new THREE.Vector3(scl.x * 1.4, scl.y * 2.1, scl.z * 1.4),
      );
      tops.current!.setMatrixAt(i, tmp);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    tops.current.instanceMatrix.needsUpdate = true;
  }, [trees]);
  return (
    <group>
      <instancedMesh ref={mesh} args={[undefined, undefined, trees.length]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 1.4, 6]} />
        <meshStandardMaterial color="#3a322c" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={tops} args={[undefined, undefined, trees.length]} castShadow>
        <coneGeometry args={[0.85, 2.2, 7]} />
        <meshStandardMaterial color="#4a5c48" roughness={0.85} />
      </instancedMesh>
    </group>
  );
}

function Spires() {
  const mats = useMemo(
    () => scatter(28, (x, z) => biomeAt(x, z) === "crystal", 404),
    [],
  );
  const mesh = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!mesh.current) return;
    mats.forEach((m, i) => mesh.current!.setMatrixAt(i, m));
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [mats]);
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, mats.length]} castShadow>
      <octahedronGeometry args={[0.7, 0]} />
      <meshStandardMaterial
        color="#9aa7b8"
        roughness={0.28}
        metalness={0.45}
        emissive="#6d7c90"
        emissiveIntensity={0.18}
      />
    </instancedMesh>
  );
}

function Rocks() {
  const mats = useMemo(
    () =>
      scatter(
        36,
        (x, z) => biomeAt(x, z) === "ember" || biomeAt(x, z) === "abyss" || biomeAt(x, z) === "wilds",
        77,
      ),
    [],
  );
  const mesh = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!mesh.current) return;
    mats.forEach((m, i) => mesh.current!.setMatrixAt(i, m));
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [mats]);
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, mats.length]} castShadow>
      <dodecahedronGeometry args={[0.55, 0]} />
      <meshStandardMaterial color="#4a4742" roughness={0.95} />
    </instancedMesh>
  );
}

function Nodes() {
  return (
    <group>
      {sim.nodes.map((n) => (
        <NodeMesh key={n.id} id={n.id} />
      ))}
    </group>
  );
}

function NodeMesh({ id }: { id: number }) {
  const ref = useRef<THREE.Group>(null);
  const n0 = sim.nodes.find((x) => x.id === id);
  const color = n0 ? RESOURCE_META[n0.type].color : "#d4d8de";
  useFrame((state) => {
    const n = sim.nodes.find((x) => x.id === id);
    if (!n || !ref.current) return;
    const restricted = n.restrictedUntil > sim.now;
    const s = 0.85 + Math.sin(state.clock.elapsedTime * 2 + id) * 0.08;
    const deplete = 1 - n.depletion * 0.45;
    ref.current.position.set(
      n.x,
      n.y + 0.85 + Math.sin(state.clock.elapsedTime * 1.4 + id) * 0.12,
      n.z,
    );
    ref.current.rotation.y = state.clock.elapsedTime * 0.35 + id;
    ref.current.scale.setScalar(s * deplete * (restricted ? 0.7 : 1));
  });
  return (
    <group ref={ref} position={[n0?.x ?? 0, (n0?.y ?? 0) + 0.9, n0?.z ?? 0]}>
      <mesh castShadow>
        <icosahedronGeometry args={[0.48, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.55}
          roughness={0.35}
          metalness={0.2}
        />
      </mesh>
      <mesh>
        <torusGeometry args={[0.72, 0.03, 8, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.45} />
      </mesh>
    </group>
  );
}

function Wanderers() {
  return (
    <group>
      {sim.wanderers.map((w) => (
        <WandererMesh key={w.id} id={w.id} />
      ))}
    </group>
  );
}

function WandererMesh({ id }: { id: number }) {
  const ref = useRef<THREE.Group>(null);
  const w = sim.wanderers[id];
  const accent = factionById(w.faction).accent;
  useFrame(() => {
    const ww = sim.wanderers[id];
    if (!ref.current || !ww) return;
    ref.current.position.set(ww.x, heightAt(ww.x, ww.z) + 0.95, ww.z);
    ref.current.rotation.y = Math.PI + ww.yaw;
  });
  return (
    <group ref={ref}>
      <mesh castShadow position={[0, 0.2, 0]}>
        <capsuleGeometry args={[0.28, 0.7, 4, 8]} />
        <meshStandardMaterial color="#c8c4bb" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.15, 0.05]}>
        <torusGeometry args={[0.3, 0.05, 6, 12]} />
        <meshStandardMaterial color={accent} roughness={0.5} />
      </mesh>
    </group>
  );
}

function PlayerMesh() {
  const ref = useRef<THREE.Group>(null);
  const band = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    if (!ref.current) return;
    const p = sim.player;
    ref.current.position.set(p.x, p.y, p.z);
    ref.current.rotation.y = Math.PI + p.yaw;
    const accent = factionById(sim.faction).accent;
    if (band.current) band.current.color.set(accent);
  });
  return (
    <group ref={ref}>
      <mesh castShadow position={[0, 0.15, 0]}>
        <capsuleGeometry args={[0.32, 0.85, 6, 10]} />
        <meshStandardMaterial color="#e8e4dc" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.85, 0.02]}>
        <sphereGeometry args={[0.26, 12, 12]} />
        <meshStandardMaterial color="#f2eee6" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.22, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.34, 0.055, 8, 16]} />
        <meshStandardMaterial ref={band} color="#7f93b0" roughness={0.4} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.05, -0.22]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.7, 0.9, 0.12]} />
        <meshStandardMaterial color="#2a2a30" roughness={0.85} />
      </mesh>
    </group>
  );
}

function JuiceBursts() {
  const ref = useRef<THREE.Group>(null);
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
      const s = 0.4 + age * 2.4;
      child.position.set(ev.x, heightAt(ev.x, ev.z) + 1.2, ev.z);
      child.scale.setScalar(s);
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 0.55 - age * 0.4);
    });
  });
  return (
    <group ref={ref}>
      {Array.from({ length: 16 }).map((_, i) => (
        <mesh key={i} visible={false}>
          <sphereGeometry args={[0.4, 10, 10]} />
          <meshBasicMaterial color="#e8d9a0" transparent opacity={0.4} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function CameraRig() {
  const { camera } = useThree();
  useFrame((_, delta) => {
    const d = Math.min(delta, 0.1);
    const p = sim.player;
    _fwd.set(-Math.sin(sim.camYaw), 0, -Math.cos(sim.camYaw));
    const dist = 10.8;
    const height = 4.6 + sim.camPitch * 3.2;
    _desired.set(
      p.x - _fwd.x * dist,
      p.y + height,
      p.z - _fwd.z * dist,
    );
    const k = 1 - Math.exp(-5.2 * d);
    camera.position.lerp(_desired, k);
    const minY = heightAt(camera.position.x, camera.position.z) + 1.8;
    if (camera.position.y < minY) camera.position.y = minY;
    const trauma = sim.shake * sim.shake;
    if (trauma > 0.01) {
      camera.position.x += (Math.random() * 2 - 1) * trauma * 0.28;
      camera.position.y += (Math.random() * 2 - 1) * trauma * 0.18;
    }
    _look.set(p.x, p.y + 1.35, p.z);
    camera.lookAt(_look);
  });
  return null;
}

function SimLoop() {
  const acc = useRef(0);
  const last = useRef({ overlay: sim.overlay, harvest: -1, whisper: 0, phase: sim.phase });
  useFrame((_, delta) => {
    tick(delta);
    acc.current += delta;
    const whisperId = sim.whisper?.id ?? 0;
    const changed =
      last.current.overlay !== sim.overlay ||
      last.current.harvest !== sim.harvestCount ||
      last.current.whisper !== whisperId ||
      last.current.phase !== sim.phase;
    if (changed || acc.current > 0.1) {
      last.current = {
        overlay: sim.overlay,
        harvest: sim.harvestCount,
        whisper: whisperId,
        phase: sim.phase,
      };
      acc.current = 0;
      useHud.getState().push();
    }
  });
  return null;
}

export function WorldScene() {
  return (
    <>
      <SimLoop />
      <CameraRig />
      <color attach="background" args={["#0c1016"]} />
      <fog attach="fog" args={["#0c1016", 28, 92]} />
      <hemisphereLight args={["#c9d2dc", "#2a2a24", 0.72]} />
      <directionalLight
        position={[28, 42, 16]}
        intensity={1.15}
        color="#f2efe6"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={120}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <Terrain />
      <Forest />
      <Spires />
      <Rocks />
      <Nodes />
      <Wanderers />
      <PlayerMesh />
      <JuiceBursts />
    </>
  );
}
