import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* ------------------------------------------------------------------ *
 * PRIME AUTOMATION — cinematic AI infrastructure scene.
 * INPUT -> AI CORE -> AUTOMATION -> INTEGRATIONS -> OUTPUT
 * Cursor drives camera parallax + lighting; scroll drives camera depth.
 * ------------------------------------------------------------------ */

const SIGNAL = "#4fd8e8";
const COMPUTE = "#8b5cf6";

function useLayerCount() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(max-width: 768px)");
    const on = () => setMobile(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return mobile;
}

function AICore() {
  const inner = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (inner.current) {
      inner.current.rotation.y += delta * 0.5;
      inner.current.rotation.x += delta * 0.18;
      const s = 1 + Math.sin(t * 1.6) * 0.05;
      inner.current.scale.setScalar(s);
    }
    if (shell.current) {
      shell.current.rotation.y -= delta * 0.22;
      shell.current.rotation.z += delta * 0.1;
    }
    if (halo.current) halo.current.rotation.z += delta * 0.4;
  });

  return (
    <group>
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.85, 1]} />
        <meshStandardMaterial
          color={SIGNAL}
          emissive={SIGNAL}
          emissiveIntensity={1.4}
          roughness={0.25}
          metalness={0.8}
          flatShading
        />
      </mesh>
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.55, 1]} />
        <meshBasicMaterial color={COMPUTE} wireframe transparent opacity={0.35} />
      </mesh>
      <mesh ref={halo} rotation-x={Math.PI / 2}>
        <torusGeometry args={[2.3, 0.015, 8, 120]} />
        <meshBasicMaterial color={SIGNAL} transparent opacity={0.5} />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={9} distance={14} color={SIGNAL} />
    </group>
  );
}

type NodeDef = { pos: THREE.Vector3; ring: number };

function SystemNodes({ nodes }: { nodes: NodeDef[] }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { pointer } = useThree();

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    nodes.forEach((n, i) => {
      const phase = i * 0.7;
      const px = pointer.x * 4;
      const py = pointer.y * 2.5;
      // nodes near the cursor lift toward it (activation)
      const d = Math.hypot(n.pos.x - px, n.pos.y - py);
      const activation = Math.max(0, 1 - d / 3);
      dummy.position.set(
        n.pos.x + Math.sin(t * 0.5 + phase) * 0.12 + (px - n.pos.x) * 0.03 * activation,
        n.pos.y + Math.cos(t * 0.4 + phase) * 0.14 + (py - n.pos.y) * 0.03 * activation,
        n.pos.z + Math.sin(t * 0.35 + phase) * 0.12,
      );
      const s = 0.07 + activation * 0.08 + Math.sin(t * 2 + phase) * 0.008;
      dummy.scale.setScalar(s);
      dummy.rotation.set(t * 0.3 + phase, t * 0.25, 0);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, nodes.length]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={COMPUTE}
        emissive={COMPUTE}
        emissiveIntensity={1.1}
        roughness={0.3}
        metalness={0.7}
      />
    </instancedMesh>
  );
}

function Connections({ nodes }: { nodes: NodeDef[] }) {
  const geometry = useMemo(() => {
    const pts: number[] = [];
    nodes.forEach((n, i) => {
      pts.push(0, 0, 0, n.pos.x, n.pos.y, n.pos.z);
      const next = nodes[(i + 3) % nodes.length]!;
      if (n.ring === next.ring) {
        pts.push(n.pos.x, n.pos.y, n.pos.z, next.pos.x, next.pos.y, next.pos.z);
      }
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [nodes]);

  const mat = useRef<THREE.LineBasicMaterial>(null);
  useFrame((s) => {
    if (mat.current) mat.current.opacity = 0.14 + Math.sin(s.clock.elapsedTime * 1.2) * 0.05;
  });

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial ref={mat} color={SIGNAL} transparent opacity={0.16} />
    </lineSegments>
  );
}

/* Data packets travelling core -> node -> back, the "automation" layer */
function DataStreams({ nodes }: { nodes: NodeDef[] }) {
  const ref = useRef<THREE.Points>(null);
  const count = nodes.length;
  const speeds = useMemo(() => nodes.map(() => 0.25 + Math.random() * 0.5), [nodes]);
  const offsets = useMemo(() => nodes.map(() => Math.random()), [nodes]);
  const positions = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const p = (offsets[i]! + t * speeds[i]!) % 1;
      const n = nodes[i]!.pos;
      positions[i * 3] = n.x * p;
      positions[i * 3 + 1] = n.y * p;
      positions[i * 3 + 2] = n.z * p;
    }
    const attr = ref.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    attr.array = positions;
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={SIGNAL}
        size={0.09}
        sizeAttenuation
        transparent
        opacity={0.95}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Dust({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * 22;
      a[i * 3 + 1] = (Math.random() - 0.5) * 12;
      a[i * 3 + 2] = (Math.random() - 0.5) * 16 - 3;
    }
    return a;
  }, [count]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02;
      ref.current.position.x = state.pointer.x * -0.6;
      ref.current.position.y = state.pointer.y * -0.35;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#7f9ad6" size={0.035} transparent opacity={0.5} depthWrite={false} />
    </points>
  );
}

/* Infrastructure floor grid — the "integration" plane */
function Floor() {
  const ref = useRef<THREE.GridHelper>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.position.z = ((ref.current.position.z + delta * 0.8) % 4) - 2;
    (ref.current.material as THREE.Material).opacity = 0.22;
  });
  return (
    <gridHelper
      ref={ref}
      args={[60, 60, new THREE.Color(SIGNAL), new THREE.Color("#33406b")]}
      position={[0, -3.4, 0]}
    />
  );
}

function CameraRig({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  const { camera, pointer } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const s = scrollRef.current ?? 0;
    target.set(pointer.x * 1.8, 0.4 + pointer.y * 1.1 - s * 1.2, 9 - s * 4.2);
    camera.position.lerp(target, 0.05);
    camera.lookAt(0, -s * 0.6, 0);
  });
  return null;
}

function SceneContents({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  const mobile = useLayerCount();
  const nodes = useMemo<NodeDef[]>(() => {
    const list: NodeDef[] = [];
    const rings = mobile ? [2] : [1, 2, 3];
    const counts = mobile ? [10] : [8, 12, 14];
    rings.forEach((ring, ri) => {
      const radius = 2.6 + ring * 1.35;
      const c = counts[ri]!;
      for (let i = 0; i < c; i++) {
        const a = (i / c) * Math.PI * 2 + ri * 0.4;
        list.push({
          ring,
          pos: new THREE.Vector3(
            Math.cos(a) * radius,
            Math.sin(a) * radius * 0.5 + (ri - 1) * 0.6,
            Math.sin(a * 1.7) * 1.8 - ri * 0.7,
          ),
        });
      }
    });
    return list;
  }, [mobile]);

  return (
    <>
      <color attach="background" args={["#07090f"]} />
      <fog attach="fog" args={["#07090f", 12, 30]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 8, 6]} intensity={1.1} color={COMPUTE} />
      <CameraRig scrollRef={scrollRef} />
      <AICore />
      <Connections nodes={nodes} />
      <SystemNodes nodes={nodes} />
      <DataStreams nodes={nodes} />
      <Dust count={mobile ? 200 : 700} />
      <Floor />
    </>
  );
}

export default function HeroScene() {
  const scrollRef = useRef(0);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const h = window.innerHeight;
      scrollRef.current = Math.min(window.scrollY / (h * 1.6), 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0.4, 9], fov: 55 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <SceneContents scrollRef={scrollRef} />
      </Canvas>
    </div>
  );
}
