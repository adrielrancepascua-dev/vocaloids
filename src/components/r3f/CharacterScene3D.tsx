"use client";
import { useMemo, useRef, type RefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';
import type { CharacterTheme } from '../../constants/theme';
import { getEffectsForTheme } from '../../config/characterEffects';
import type { AudioLevels } from '../../hooks/useAudioLevels';
import { useReducedMotion } from '../../hooks/useReducedMotion';

type SceneProps = {
  theme: CharacterTheme;
  color: string;
  levelsRef: RefObject<AudioLevels>;
  isLowEnd: boolean;
};

function MikuWaveField({ color, levelsRef, isLowEnd }: Omit<SceneProps, 'theme'>) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = isLowEnd ? 800 : 2400;
  const { positions, baseY } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const base = new Float32Array(count);
    const spread = 14;
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * spread;
      const z = (Math.random() - 0.5) * spread;
      const y = (Math.random() - 0.5) * 2;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      base[i] = y;
    }
    return { positions: pos, baseY: base };
  }, [count]);

  useFrame((state) => {
    const pts = pointsRef.current;
    if (!pts) return;
    const attr = pts.geometry.attributes.position as THREE.BufferAttribute;
    const { bass, mid } = levelsRef.current;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const wave = Math.sin(t * 1.5 + i * 0.08) * (0.15 + mid / 600);
      attr.setY(i, baseY[i] + wave + bass / 400);
    }
    attr.needsUpdate = true;
    pts.rotation.y = t * 0.04;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color={color} transparent opacity={0.75} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function TetoBurstField({ color, levelsRef, isLowEnd }: Omit<SceneProps, 'theme'>) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = isLowEnd ? 40 : 150;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const velocities = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: 0,
      y: 0,
      z: 0,
      bx: (Math.random() - 0.5) * 3,
      by: (Math.random() - 0.5) * 3,
      bz: (Math.random() - 0.5) * 3,
    }));
  }, [count]);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const { bass, bassKick } = levelsRef.current;
    for (let i = 0; i < count; i++) {
      const v = velocities[i];
      if (bassKick) {
        const force = (bass / 255) * 0.35;
        v.x += (Math.random() - 0.5) * force;
        v.y += (Math.random() - 0.5) * force;
        v.z += (Math.random() - 0.5) * force;
      }
      v.bx += v.x;
      v.by += v.y;
      v.bz += v.z;
      v.x *= 0.85;
      v.y *= 0.85;
      v.z *= 0.85;
      v.bx += (0 - v.bx) * 0.05;
      v.by += (0 - v.by) * 0.05;
      v.bz += (0 - v.bz) * 0.05;
      dummy.position.set(v.bx, v.by, v.bz);
      const s = 0.04 + bass / 2000;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={color} transparent opacity={0.85} />
    </instancedMesh>
  );
}

function NeruBarField({ color, levelsRef, isLowEnd }: Omit<SceneProps, 'theme'>) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = isLowEnd ? 32 : 64;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const { treble, trebleClip } = levelsRef.current;
    const glitch = trebleClip ? (Math.random() - 0.5) * 0.3 : 0;
    for (let i = 0; i < count; i++) {
      const h = 0.2 + (treble / 255) * (1.5 + Math.sin(i * 0.5) * 0.4);
      const x = (i - count / 2) * 0.22 + glitch;
      dummy.position.set(x, h / 2 - 1, 0);
      dummy.scale.set(0.14, h, 0.14);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </instancedMesh>
  );
}

function ThemeScene({ theme, color, levelsRef, isLowEnd }: SceneProps) {
  const fx = getEffectsForTheme(theme);
  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[4, 4, 4]} intensity={0.6} color={color} />
      <Stars radius={40} depth={30} count={isLowEnd ? 400 : 1200} factor={3} saturation={0} fade speed={0.4} />
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
        {fx.r3fScene === 'wave-field' && <MikuWaveField color={color} levelsRef={levelsRef} isLowEnd={isLowEnd} />}
        {fx.r3fScene === 'burst-field' && <TetoBurstField color={color} levelsRef={levelsRef} isLowEnd={isLowEnd} />}
        {fx.r3fScene === 'bar-field' && <NeruBarField color={color} levelsRef={levelsRef} isLowEnd={isLowEnd} />}
      </Float>
    </>
  );
}

export type CharacterScene3DProps = {
  theme: CharacterTheme;
  color: string;
  levelsRef: RefObject<AudioLevels>;
  isLowEnd: boolean;
  className?: string;
};

export function CharacterScene3D({ theme, color, levelsRef, isLowEnd, className }: CharacterScene3DProps) {
  const reducedMotion = useReducedMotion();
  const dpr = isLowEnd ? 1 : [1, 1.5] as [number, number];

  return (
    <div data-gsap="scene3d" className={className ?? 'absolute inset-0 z-0 pointer-events-none'} aria-hidden="true">
      <Canvas
        dpr={reducedMotion ? 1 : dpr}
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: !isLowEnd, alpha: true, powerPreference: isLowEnd ? 'low-power' : 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <ThemeScene theme={theme} color={color} levelsRef={levelsRef} isLowEnd={isLowEnd || reducedMotion} />
      </Canvas>
    </div>
  );
}
