"use client";

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';

function LiquidSphere() {
  const sphereRef = useRef<any>(null);
  
  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.distort = 0.4 + Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <Sphere args={[1, 64, 64]} scale={2}>
      <MeshDistortMaterial
        ref={sphereRef}
        color="#ff0000"
        attach="material"
        distort={0.5}
        speed={2}
        roughness={0.2}
        metalness={0.8}
        emissive="#c90000"
        emissiveIntensity={0.5}
      />
    </Sphere>
  );
}

export default function ExperimentalPage() {
  return (
    <main className="relative h-screen w-full bg-background overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
          <directionalLight position={[-10, -10, -5]} intensity={2} color="#c90000" />
          <LiquidSphere />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
        </Canvas>
      </div>
      
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-between py-24 px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-blood-red text-xs tracking-[0.3em] uppercase mb-4 font-bold">Interactive WebGL</p>
          <h1 className="text-4xl md:text-[6vw] font-black uppercase tracking-tighter text-foreground drop-shadow-2xl leading-none">
            Liquid <span className="text-transparent bg-clip-text bg-gradient-to-r from-blood-red to-foreground">State</span>
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="glass-panel px-6 py-3 rounded-full text-xs tracking-[0.2em] uppercase text-foreground border border-border shadow-[0_0_20px_rgba(201,0,0,0.5)]"
        >
          Drag to Interact
        </motion.div>
      </div>
    </main>
  );
}
