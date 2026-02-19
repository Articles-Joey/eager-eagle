import { useFrame } from "@react-three/fiber";
import { Line, Points, PointMaterial } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useStore } from "@/hooks/useStore";
import { useGameStore } from "@/hooks/useGameStore";

const SPEED = 10;
const POINT_COUNT = 50;
const PARTICLE_COUNT = 100;

export default function PlayerTrailFire({ positionRef }) {
    const lineRef = useRef();
    const particlesRef = useRef();
    
    const points = useMemo(() => {
        return new Array(POINT_COUNT).fill(0).map(() => new THREE.Vector3(0, 0, 0));
    }, []);

    const particlePositions = useMemo(() => {
        return new Float32Array(PARTICLE_COUNT * 3);
    }, []);

    const particleLifetimes = useMemo(() => {
        return new Float32Array(PARTICLE_COUNT).map(() => Math.random());
    }, []);

    const vertexColors = useMemo(() => {
        const fireColors = ["#ffff00", "#ff9900", "#ff0000"];
        const colors = [];
        for (let i = 0; i < POINT_COUNT; i++) {
            const t = i / (POINT_COUNT - 1);
            const color = new THREE.Color();
            if (t < 0.5) {
                color.lerpColors(new THREE.Color(fireColors[0]), new THREE.Color(fireColors[1]), t * 2);
            } else {
                color.lerpColors(new THREE.Color(fireColors[1]), new THREE.Color(fireColors[2]), (t - 0.5) * 2);
            }
            colors.push(color);
        }
        return colors;
    }, []);

    const character = useStore((state) => state.character);
    const gameOver = useGameStore((state) => state.gameOver);

    useFrame((state, delta) => {
        if (!positionRef.current || !lineRef.current) return;
        const [x, y, z] = positionRef.current;
        // Shift points back
        for (let i = POINT_COUNT - 1; i > 0; i--) {
            points[i].copy(points[i - 1]);
            points[i].z += SPEED * delta;
        }
        points[0].set(x, y, z);

        if (lineRef.current.geometry) {
            const flatPoints = points.flatMap(p => [p.x, p.y, p.z]);
            lineRef.current.geometry.setPositions(flatPoints);
        }

        // Update particles
        if (particlesRef.current) {
            const positions = particlesRef.current.geometry.attributes.position.array;
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particleLifetimes[i] -= delta * 2; // Particle speed
                
                if (particleLifetimes[i] <= 0) {
                    // Reset particle to current position with some random offset
                    particleLifetimes[i] = 1;
                    positions[i * 3] = x + (Math.random() - 0.5) * 0.5;
                    positions[i * 3 + 1] = y + (Math.random() - 0.5) * 0.5;
                    positions[i * 3 + 2] = z + (Math.random() - 0.5) * 0.5;
                } else {
                    // Move particle backwards and slightly upwards
                    positions[i * 3 + 1] += delta * 0.5; // Float up
                    positions[i * 3 + 2] += SPEED * delta; // Move back with trail
                }
            }
            particlesRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    if (character?.trail === "None" || gameOver) return null;

    return (
        <group>
            <Line
                ref={lineRef}
                points={points}
                lineWidth={2}
                transparent
                opacity={0.7}
                vertexColors={vertexColors}
            />
            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={PARTICLE_COUNT}
                        array={particlePositions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.1}
                    color="#ff6600"
                    transparent
                    opacity={0.8}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </points>
        </group>
    );
}
