import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const COLUMNS = 110;
const ROWS = 78;
const PARTICLES = COLUMNS * ROWS;

function elevationAt(x, z) {
  const centralPeak = Math.exp(-((x * x) / 7 + ((z + 4) ** 2) / 19));
  const westernRidge = Math.exp(-(((x + 4.6) ** 2) / 3.5 + ((z + 1) ** 2) / 14));
  const easternRidge = Math.exp(-(((x - 4) ** 2) / 4 + ((z + 6) ** 2) / 10));
  const noise = Math.sin(x * 2.5 + z * 0.5) * 0.12;

  return centralPeak * 3.8 + westernRidge * 2 + easternRidge * 2.4 + noise;
}

function Terrain({ rigRef }) {
  const pointsRef = useRef(null);
  const { pointer } = useThree();
  const { positions, origin } = useMemo(() => {
    const nextPositions = new Float32Array(PARTICLES * 3);
    const nextOrigin = new Float32Array(PARTICLES * 3);

    for (let row = 0; row < ROWS; row += 1) {
      for (let column = 0; column < COLUMNS; column += 1) {
        const offset = (row * COLUMNS + column) * 3;
        const x = (column / (COLUMNS - 1) - 0.5) * 16;
        const z = (row / (ROWS - 1) - 0.5) * 21 - 2;
        const y = elevationAt(x, z) - 2.2;

        nextPositions[offset] = x;
        nextPositions[offset + 1] = y;
        nextPositions[offset + 2] = z;
        nextOrigin.set(nextPositions.slice(offset, offset + 3), offset);
      }
    }

    return { positions: nextPositions, origin: nextOrigin };
  }, []);

  useFrame(({ clock }) => {
    const attribute = pointsRef.current?.geometry.attributes.position;
    if (!attribute) return;

    const time = clock.getElapsedTime();
    const array = attribute.array;
    const cursorX = pointer.x * 4;
    const cursorZ = pointer.y * 3;
    const energy = rigRef.current.energy;

    for (let index = 0; index < PARTICLES; index += 1) {
      const offset = index * 3;
      const distance = Math.hypot(origin[offset] - cursorX, origin[offset + 2] - cursorZ);
      const influence = Math.max(0, 1 - distance / 3.4);
      const ripple = Math.sin(distance * 4 - time * (2.5 + energy * 3)) * influence * (0.11 + energy * 0.16);

      array[offset] += (origin[offset] - array[offset]) * 0.035;
      array[offset + 1] += (origin[offset + 1] + ripple - array[offset + 1]) * 0.06;
      array[offset + 2] += (origin[offset + 2] - array[offset + 2]) * 0.035;
    }

    attribute.needsUpdate = true;
    pointsRef.current.rotation.y = Math.sin(time * (0.08 + energy * 0.14)) * (0.018 + energy * 0.025);
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#00ff66"
        size={0.032}
        transparent
        opacity={0.62}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function CameraRig({ rigRef }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());

  useFrame(({ clock }) => {
    const progress = rigRef.current.progress;
    const drift = Math.sin(clock.getElapsedTime() * 0.2) * 0.08;
    const nextPosition = target.current.set(
      Math.sin(progress * Math.PI * 1.5) * 2.2 + drift,
      2.3 + progress * 6.4,
      7.6 - progress * 22,
    );

    camera.position.lerp(nextPosition, 0.045);
    camera.lookAt(
      Math.sin(progress * Math.PI) * 0.4,
      0.2 + progress * 2.1,
      -4 - progress * 8,
    );
  });

  return null;
}

export default function Experience({ rigRef }) {
  return (
    <div className="scene" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ fov: 52, near: 0.1, far: 80, position: [0, 2.3, 7.6] }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ scene }) => {
          scene.background = new THREE.Color('#050505');
          scene.fog = new THREE.FogExp2('#050505', 0.048);
        }}
      >
        <CameraRig rigRef={rigRef} />
        <Terrain rigRef={rigRef} />
        <Preload all />
      </Canvas>
    </div>
  );
}
