import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';

function GlowingBook({ position }: { position: [number, number, number] }) {
    const mesh = useRef<THREE.Group>(null!);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (mesh.current) {
            mesh.current.rotation.y = Math.sin(t / 2) * 0.3;
            mesh.current.rotation.z = Math.cos(t / 3) * 0.1;
            mesh.current.position.y = position[1] + Math.sin(t) * 0.2;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <group ref={mesh} position={position}>
                {/* Book Body */}
                <mesh>
                    <boxGeometry args={[3, 4, 0.5]} />
                    <meshStandardMaterial
                        color="#1e293b"
                        roughness={0.2}
                        metalness={0.8}
                        emissive="#3b82f6"
                        emissiveIntensity={0.2}
                    />
                </mesh>
                {/* Pages */}
                <mesh position={[0.1, 0, 0]} scale={[0.95, 0.95, 1.05]}>
                    <boxGeometry args={[2.8, 3.8, 0.4]} />
                    <meshStandardMaterial color="#f8fafc" />
                </mesh>
            </group>
        </Float>
    );
}

function ParticleField() {
    const count = 200;
    const mesh = useRef<THREE.InstancedMesh>(null!);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Create random initial positions
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const x = (Math.random() - 0.5) * 50;
            const y = (Math.random() - 0.5) * 50;
            const z = (Math.random() - 0.5) * 50;
            temp.push({ t, factor, speed, x, y, z });
        }
        return temp;
    }, [count]);

    useFrame(() => {
        particles.forEach((particle, i) => {
            let { t, factor, speed, x, y, z } = particle;
            t = particle.t += speed / 2;
            const s = Math.cos(t);

            dummy.position.set(
                x + Math.cos(t / 10) * factor + (Math.sin(t * 1) * factor) / 10,
                y + Math.sin(t / 10) * factor + (Math.cos(t * 2) * factor) / 10,
                z + Math.cos(t / 10) * factor + (Math.sin(t * 3) * factor) / 10
            );
            dummy.scale.set(s, s, s);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();
            if (mesh.current) mesh.current.setMatrixAt(i, dummy.matrix);
        })
        if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <dodecahedronGeometry args={[0.2, 0]} />
            <meshPhongMaterial color="#60a5fa" emissive="#3b82f6" />
        </instancedMesh>
    )
}

export default function ThreeHero() {
    return (
        <div className="h-[500px] w-full relative rounded-3xl overflow-hidden shadow-2xl border border-white/5 bg-black/50 backdrop-blur-sm">
            <div className="absolute top-1/2 left-10 transform -translate-y-1/2 z-10 max-w-lg pointer-events-none">
                <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-lg filter mb-4">
                    LUMINA
                </h1>
                <p className="text-xl text-blue-100/80 font-light leading-relaxed">
                    Step into the void of infinite knowledge. <br />
                    A premium digital experience for the modern reader.
                </p>
            </div>
            <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 15], fov: 35 }}>
                <fog attach="fog" args={['#050505', 10, 30]} />
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#60a5fa" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Sparkles count={500} scale={12} size={4} speed={0.4} opacity={0.5} color="#60a5fa" />

                <GlowingBook position={[4, 0, 0]} />
                <ParticleField />
            </Canvas>
        </div>
    );
}
