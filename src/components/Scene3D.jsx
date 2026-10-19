import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Preload } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const GRID_WIDTH = 15;
const GRID_DEPTH = 17;
const COLUMNS = 108;
const ROWS = 72;
const PARTICLE_COUNT = COLUMNS * ROWS;

function elevationAt(x, z) {
  const mainRidge = Math.exp(-((x * x) / 7 + ((z + 2.6) ** 2) / 21));
  const leftPeak = Math.exp(-(((x + 3.9) ** 2) / 3.2 + ((z + 1.8) ** 2) / 13));
  const rightPeak = Math.exp(-(((x - 4.2) ** 2) / 4.2 + ((z + 5.2) ** 2) / 12));
  const folds = Math.sin(x * 2.1 + z * 0.58) * 0.12;

  return mainRidge * 3.4 + leftPeak * 1.8 + rightPeak * 2.1 + folds;
}

function Terrain() {
  const pointsRef = useRef(null);
  const { pointer } = useThree();

  const { positions, basePositions } = useMemo(() => {
    const nextPositions = new Float32Array(PARTICLE_COUNT * 3);
    const nextBasePositions = new Float32Array(PARTICLE_COUNT * 3);

    for (let row = 0; row < ROWS; row += 1) {
      for (let column = 0; column < COLUMNS; column += 1) {
        const index = (row * COLUMNS + column) * 3;
        const x = (column / (COLUMNS - 1) - 0.5) * GRID_WIDTH;
        const z = (row / (ROWS - 1) - 0.5) * GRID_DEPTH - 2;
        const y = elevationAt(x, z) - 2.1;

        nextPositions[index] = x;
        nextPositions[index + 1] = y;
        nextPositions[index + 2] = z;
        nextBasePositions[index] = x;
        nextBasePositions[index + 1] = y;
        nextBasePositions[index + 2] = z;
      }
    }

    return { positions: nextPositions, basePositions: nextBasePositions };
  }, []);

  useFrame(({ clock }) => {
    const positionAttribute = pointsRef.current?.geometry.attributes.position;
    if (!positionAttribute) return;

    const positionArray = positionAttribute.array;
    const time = clock.getElapsedTime();
    const windX = pointer.x * 4.2;
    const windZ = pointer.y * 3.4;

    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
      const offset = index * 3;
      const distanceX = basePositions[offset] - windX;
      const distanceZ = basePositions[offset + 2] - windZ;
      const distance = Math.sqrt(distanceX ** 2 + distanceZ ** 2);
      const influence = Math.max(0, 1 - distance / 3.2);
      const ripple = Math.sin(distance * 4.2 - time * 2.2) * influence * 0.08;

      positionArray[offset] += (basePositions[offset] - positionArray[offset]) * 0.035;
      positionArray[offset + 1] +=
        (basePositions[offset + 1] + ripple - positionArray[offset + 1]) * 0.06;
      positionArray[offset + 2] += (basePositions[offset + 2] - positionArray[offset + 2]) * 0.035;
    }

    positionAttribute.needsUpdate = true;
    pointsRef.current.rotation.y = Math.sin(time * 0.08) * 0.018;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={PARTICLE_COUNT}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00ff66"
        size={0.026}
        transparent
        opacity={0.58}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

export default function Scene3D() {
  return (
    <div className="scene3d" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ fov: 52, near: 0.1, far: 80, position: [0, 2.4, 8] }}
        onCreated={({ scene }) => {
          scene.background = new THREE.Color('#050505');
          scene.fog = new THREE.FogExp2('#050505', 0.045);
        }}
      >
        <PerspectiveCamera makeDefault fov={52} near={0.1} far={80} position={[0, 2.4, 8]} />
        <Terrain />
        <Preload all />
      </Canvas>
    </div>
  );
}
