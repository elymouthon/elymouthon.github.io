import { useEffect, useMemo, useRef } from 'react';
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
  const pointer = useRef({ x: 0.5, y: 0.5 });
  const pointerTarget = useRef({ x: 0.5, y: 0.5 });
  const scrollProgress = useRef(0);
  const scrollTarget = useRef(0);
  const geometry = useMemo(() => {
    const plane = new THREE.PlaneGeometry(22, 22, 110, 110);
    const positions = plane.attributes.position;

    for (let index = 0; index < positions.count; index += 1) {
      const x = positions.getX(index);
      const y = positions.getY(index);
      positions.setZ(index, terrainHeight(x, y));
    }

    plane.userData.baseHeights = Float32Array.from({ length: positions.count }, (_, index) => positions.getZ(index));
    plane.computeVertexNormals();
    return plane;
  }, []);

  useEffect(() => {
    const updatePointer = (event) => {
      pointerTarget.current.x = event.clientX / window.innerWidth;
      pointerTarget.current.y = event.clientY / window.innerHeight;
    };

    window.addEventListener('pointermove', updatePointer, { passive: true });
    return () => window.removeEventListener('pointermove', updatePointer);
  }, []);

  useEffect(() => {
    const updateScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollTarget.current = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    };

    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  useFrame(({ camera, clock }) => {
    const time = clock.getElapsedTime();
    pointer.current.x = THREE.MathUtils.lerp(pointer.current.x, pointerTarget.current.x, 0.045);
    pointer.current.y = THREE.MathUtils.lerp(pointer.current.y, pointerTarget.current.y, 0.045);
    scrollProgress.current = THREE.MathUtils.lerp(scrollProgress.current, scrollTarget.current, 0.04);
    const forceX = (pointer.current.x - 0.5) * 2;
    const forceY = (0.5 - pointer.current.y) * 2;
    const journey = scrollProgress.current;

    camera.position.x = Math.sin(time * 0.16) * 0.18 + forceX * 0.28;
    camera.position.y = 2.8 + Math.sin(time * 0.22) * 0.08 + forceY * 0.18 + journey * 0.55;
    camera.position.z = 8 + journey * 7;
    camera.lookAt(0, 0.1, -journey * 2.8);

    if (mountainRef.current) {
      const positions = mountainRef.current.geometry.attributes.position;
      const baseHeights = mountainRef.current.geometry.userData.baseHeights;

      for (let index = 0; index < positions.count; index += 1) {
        const x = positions.getX(index);
        const y = positions.getY(index);
        const distance = Math.hypot(x - forceX * 4.5, y - forceY * 4.5);
        const influence = Math.exp(-(distance * distance) * 0.12);
        const ripple = Math.sin(distance * 2.5 - time * 2.2) * 0.12 * influence;
        positions.setZ(index, baseHeights[index] + influence * (0.42 + forceY * 0.2) + ripple);
      }
      positions.needsUpdate = true;
      mountainRef.current.geometry.computeVertexNormals();
      mountainRef.current.rotation.z = forceX * 0.018 + Math.sin(time * 0.08) * 0.008;
    }
  });

  return (
    <>
      <color attach="background" args={['#17151b']} />
      <fog attach="fog" args={['#17151b', 5, 15]} />
      <ambientLight intensity={0.3} color="#ffb38a" />
      <directionalLight position={[-4, 7, 3]} intensity={1.5} color="#b6a1ff" />
      <mesh
        ref={mountainRef}
        geometry={geometry}
        rotation={[-Math.PI / 2.25, 0, 0]}
        position={[0, -1.25, -2.2]}
      >
        <meshBasicMaterial color="#ff8a5b" wireframe transparent opacity={0.78} />
      </mesh>
    </>
  );
}

export default FoggyMountain;
