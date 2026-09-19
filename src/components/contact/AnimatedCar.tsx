"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, PresentationControls } from "@react-three/drei";
import * as THREE from "three";

function CarModel() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <group ref={group}>
      {/* Car Body (Bottom) */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[3, 0.8, 1.4]} />
        <meshPhysicalMaterial 
          color="#0F4C81" 
          metalness={0.6}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Car Cabin (Top) */}
      <mesh position={[-0.2, 0.7, 0]} castShadow>
        <boxGeometry args={[1.5, 0.6, 1.2]} />
        <meshPhysicalMaterial 
          color="#FAF9F6" 
          metalness={0.1}
          roughness={0.1}
          transmission={0.9}
          thickness={0.5}
        />
      </mesh>

      {/* Wheels */}
      <mesh position={[-1, -0.4, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
        <meshStandardMaterial color="#333" roughness={0.8} />
      </mesh>
      <mesh position={[1, -0.4, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
        <meshStandardMaterial color="#333" roughness={0.8} />
      </mesh>
      <mesh position={[-1, -0.4, -0.8]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
        <meshStandardMaterial color="#333" roughness={0.8} />
      </mesh>
      <mesh position={[1, -0.4, -0.8]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
        <meshStandardMaterial color="#333" roughness={0.8} />
      </mesh>
    </group>
  );
}

export function AnimatedCar() {
  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center">
      <Canvas camera={{ position: [0, 2, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <PresentationControls 
          global 
          rotation={[0.13, 0.1, 0]} 
          polar={[-0.4, 0.2]} 
          azimuth={[-1, 0.75]}
        >
          <Float rotationIntensity={0.4} floatIntensity={2} speed={2}>
            <CarModel />
          </Float>
        </PresentationControls>
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
