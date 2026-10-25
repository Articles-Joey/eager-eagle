import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { DynamicDrawUsage, Object3D } from "three";
import { useStore } from "@/hooks/useStore";
import { useGameStore } from "@/hooks/useGameStore";
import { STAGE_SPEED_MODIFIERS, WORLD_SPEED } from "./WorldMotion";

const speedStages = Object.entries(STAGE_SPEED_MODIFIERS);
const vertexShader = `
    attribute float bubbleLife;
    varying float vLife;
    varying vec3 vNormal;
    varying vec3 vView;
    void main() {
        vec4 viewPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * mat3(instanceMatrix) * normal);
        vView = -viewPosition.xyz;
        vLife = bubbleLife;
        gl_Position = projectionMatrix * viewPosition;
    }
`;
const fragmentShader = `
    varying float vLife;
    varying vec3 vNormal;
    varying vec3 vView;
    void main() {
        vec3 normal = normalize(vNormal);
        float rim = pow(1.0 - abs(dot(normal, normalize(vView))), 2.2);
        float shine = pow(max(dot(normal, normalize(vec3(0.5, 0.8, 1.0))), 0.0), 36.0);
        float fade = smoothstep(0.0, 0.08, vLife) * (1.0 - smoothstep(0.7, 1.0, vLife));
        vec3 color = mix(vec3(0.08, 0.4, 1.0), vec3(0.25, 0.72, 1.0), rim * 0.5 + vLife * 0.3);
        color = mix(color, vec3(0.78, 0.92, 1.0), shine);
        gl_FragColor = vec4(color, (0.045 + rim * 0.6 + shine * 0.5) * fade);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
    }
`;

export default function PlayerTrailBubbles({ positionRef, demoMode = false }) {
    const quality = useStore((state) => state.graphicsQuality);
    const gameOver = useGameStore((state) => state.gameOver);
    const count = quality === "High" ? 40 : quality === "Medium" ? 28 : 16;
    const mesh = useRef();
    const lifeAttribute = useRef();
    const emission = useRef({ elapsed: 0, next: 0 });
    const transform = useMemo(() => new Object3D(), []);
    const lives = useMemo(() => new Float32Array(count), [count]);
    const bubbles = useMemo(
        () => Array.from({ length: count }, () => ({ age: -1 })),
        [count],
    );

    useLayoutEffect(() => {
        emission.current = { elapsed: 0, next: 0 };
        lives.fill(0);
        bubbles.forEach((bubble) => {
            bubble.age = -1;
        });
        if (!mesh.current) return;
        mesh.current.instanceMatrix.setUsage(DynamicDrawUsage);
        transform.position.set(0, 0, 0);
        transform.scale.setScalar(0);
        transform.updateMatrix();
        for (let index = 0; index < count; index++)
            mesh.current.setMatrixAt(index, transform.matrix);
        mesh.current.instanceMatrix.needsUpdate = true;
        lifeAttribute.current.needsUpdate = true;
    }, [count, bubbles, lives, transform, gameOver, demoMode]);

    useFrame((_, delta) => {
        if (!mesh.current || (!demoMode && !positionRef?.current)) return;
        const game = useGameStore.getState();
        if (!demoMode && game.gameOver) return;
        const step = Math.min(delta, 0.05);
        const [x, y, z] = positionRef?.current || [0, 0, 0];
        let modifier = 0;
        if (!demoMode) {
            for (const [distance, percentage] of speedStages) {
                if (game.distance >= Number(distance)) modifier = percentage;
            }
        }
        const speed = WORLD_SPEED * (1 + modifier / 100);
        const interval = 1.8 / count;
        emission.current.elapsed += step;
        while (emission.current.elapsed >= interval) {
            emission.current.elapsed -= interval;
            const bubble = bubbles[emission.current.next];
            Object.assign(bubble, {
                age: 0,
                life: 1.2 + Math.random() * 0.6,
                x: x + (Math.random() - 0.5) * 0.25,
                y: y + (Math.random() - 0.5) * 0.3,
                z: z + 0.4,
                radius: 0.18 + Math.random() * 0.3,
                rise: 0.35 + Math.random() * 0.5,
                phase: Math.random() * Math.PI * 2,
            });
            emission.current.next = (emission.current.next + 1) % count;
        }

        bubbles.forEach((bubble, index) => {
            if (bubble.age >= 0) {
                bubble.age += step;
                if (bubble.age >= bubble.life) bubble.age = -1;
            }
            if (bubble.age < 0) {
                lives[index] = 0;
                transform.position.set(0, 0, 0);
                transform.scale.setScalar(0);
            } else {
                const progress = bubble.age / bubble.life;
                bubble.x +=
                    Math.sin(bubble.age * 4 + bubble.phase) * step * 0.25;
                bubble.y +=
                    (bubble.rise +
                        Math.cos(bubble.age * 3 + bubble.phase) * 0.15) *
                    step;
                bubble.z += speed * step;
                const pop = 1 + Math.max(0, (progress - 0.86) / 0.14) * 0.6;
                transform.position.set(bubble.x, bubble.y, bubble.z);
                transform.scale.setScalar(
                    bubble.radius * (0.6 + progress * 0.7) * pop,
                );
                lives[index] = progress;
            }
            transform.updateMatrix();
            mesh.current.setMatrixAt(index, transform.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
        lifeAttribute.current.needsUpdate = true;
    });

    if (!demoMode && gameOver) return null;

    return (
        <instancedMesh
            key={count}
            ref={mesh}
            args={[null, null, count]}
            frustumCulled={false}
        >
            <sphereGeometry args={[1, 16, 12]}>
                <instancedBufferAttribute
                    ref={lifeAttribute}
                    attach="attributes-bubbleLife"
                    args={[lives, 1]}
                    usage={DynamicDrawUsage}
                />
            </sphereGeometry>
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                transparent
                depthWrite={false}
                toneMapped={false}
            />
        </instancedMesh>
    );
}
