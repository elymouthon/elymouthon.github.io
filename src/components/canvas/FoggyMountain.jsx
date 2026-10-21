import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function terrainHeight(x, y) {
  const ridge = Math.sin(x * 0.72 + y * 0.18) * 0.55;
  const layers =
    Math.sin(x * 1.6 + y * 0.45) * 0.2 +
    Math.cos(y * 1.25 - x * 0.3) * 0.17 +
    Math.sin((x + y) * 3.1) * 0.06;
  const peak = Math.exp(-((x - 1.2) ** 2 + (y + 0.7) ** 2) * 0.22) * 1.8;

  return ridge + layers + peak;
}

function FoggyMountain() {
  const mountainRef = useRef(null);
  const geometry = useMemo(() => {
    const plane = new THREE.PlaneGeometry(22, 22, 110, 110);
    const positions = plane.attributes.position;

    for (let index = 0; index < positions.count; index += 1) {
      const x = positions.getX(index);
      const y = positions.getY(index);
      positions.setZ(index, terrainHeight(x, y));
    }

    positions.needsUpdate = true;
    plane.computeVertexNormals();
    return plane;
  }, []);

  useFrame(({ camera, clock }) => {
    const time = clock.getElapsedTime();
    camera.position.x = Math.sin(time * 0.16) * 0.35;
    camera.position.y = 2.8 + Math.sin(time * 0.22) * 0.12;
    camera.lookAt(0, 0.1, 0);

    if (mountainRef.current) {
      mountainRef.current.rotation.z = Math.sin(time * 0.08) * 0.012;
    }
  });

  return (
    <>
      <color attach="background" args={['#030504']} />
      <fog attach="fog" args={['#030504', 5, 15]} />
      <ambientLight intensity={0.25} color="#0b6d4c" />
      <directionalLight position={[-4, 7, 3]} intensity={1.4} color="#167957" />
      <mesh
        ref={mountainRef}
        geometry={geometry}
        rotation={[-Math.PI / 2.25, 0, 0]}
        position={[0, -1.25, -2.2]}
      >
        <meshBasicMaterial color="#0b5a3d" wireframe transparent opacity={0.72} />
      </mesh>
    </>
  );
}

export default FoggyMountain;
