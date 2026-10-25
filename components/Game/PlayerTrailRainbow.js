import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
    BufferGeometry,
    Color,
    DoubleSide,
    DynamicDrawUsage,
    Float32BufferAttribute,
} from "three";
import { useStore } from "@/hooks/useStore";
import { useGameStore } from "@/hooks/useGameStore";
import { STAGE_SPEED_MODIFIERS, WORLD_SPEED } from "./WorldMotion";

const COLORS = [
    "#ff4646",
    "#ff982f",
    "#ffe348",
    "#62e367",
    "#42cfff",
    "#6579ff",
    "#ce75ff",
];
const DURATION = 1.2;
const speedStages = Object.entries(STAGE_SPEED_MODIFIERS);
const vertexShader = `
    attribute vec3 color;
    attribute float trailAge;
    varying vec3 vColor;
    varying float vAge;
    void main() {
        vColor = color;
        vAge = trailAge;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;
const fragmentShader = `
    uniform float time;
    varying vec3 vColor;
    varying float vAge;
    void main() {
        float shimmer = 0.94 + 0.06 * sin(vAge * 24.0 - time * 4.0);
        float fade = 1.0 - smoothstep(0.45, 1.0, vAge);
        gl_FragColor = vec4(vColor * shimmer, fade * 0.85);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
    }
`;

function createRibbonGeometry(count) {
    const geometry = new BufferGeometry();
    const positions = new Float32Array(COLORS.length * count * 2 * 3);
    const colors = [];
    const ages = [];
    const indices = [];
    COLORS.forEach((hex, band) => {
        const color = new Color(hex);
        for (let point = 0; point < count; point++) {
            for (let edge = 0; edge < 2; edge++) {
                colors.push(color.r, color.g, color.b);
                ages.push(point / (count - 1));
            }
            if (point === count - 1) continue;
            const start = (band * count + point) * 2;
            indices.push(
                start,
                start + 1,
                start + 2,
                start + 1,
                start + 3,
                start + 2,
            );
        }
    });
    geometry.setAttribute(
        "position",
        new Float32BufferAttribute(positions, 3).setUsage(DynamicDrawUsage),
    );
    geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
    geometry.setAttribute("trailAge", new Float32BufferAttribute(ages, 1));
    geometry.setIndex(indices);
    return geometry;
}

export default function PlayerTrailRainbow({ positionRef, demoMode = false }) {
    const quality = useStore((state) => state.graphicsQuality);
    const gameOver = useGameStore((state) => state.gameOver);
    const count = quality === "High" ? 64 : quality === "Medium" ? 48 : 32;
    const history = useMemo(() => new Float32Array(count * 3), [count]);
    const geometry = useMemo(() => createRibbonGeometry(count), [count]);
    const uniforms = useMemo(() => ({ time: { value: 0 } }), []);
    const tracking = useRef({ elapsed: 0, active: 0, time: 0 });
    useEffect(() => () => geometry.dispose(), [geometry]);
    useLayoutEffect(() => {
        tracking.current = { elapsed: 0, active: 0, time: 0 };
        geometry.attributes.position.array.fill(0);
        geometry.attributes.position.needsUpdate = true;
    }, [geometry, gameOver, demoMode]);

    useFrame((_, delta) => {
        const game = useGameStore.getState();
        if (
            (!demoMode && game.gameOver) ||
            (!demoMode && !positionRef?.current)
        )
            return;
        const step = Math.min(delta, 0.05);
        const [x, y, z] = positionRef?.current || [0, 0, 0];
        const state = tracking.current;
        state.time += step;
        let modifier = 0;
        if (!demoMode) {
            for (const [distance, percentage] of speedStages) {
                if (game.distance >= Number(distance)) modifier = percentage;
            }
        }
        const travel = WORLD_SPEED * (1 + modifier / 100) * step;
        if (state.active === 0) {
            history.set([x, y, z + 0.35]);
            state.active = 1;
        }
        for (let point = 0; point < state.active; point++)
            history[point * 3 + 2] += travel;
        // Sample at a fixed interval so trail length stays consistent across
        // frame rates and graphics quality settings.
        const interval = DURATION / (count - 1);
        state.elapsed += step;
        while (state.elapsed >= interval) {
            state.elapsed -= interval;
            history.copyWithin(3, 0, (count - 1) * 3);
            state.active = Math.min(count, state.active + 1);
        }
        history.set([x, y, z + 0.35]);

        const positions = geometry.attributes.position;
        for (let band = 0; band < COLORS.length; band++) {
            for (let point = 0; point < count; point++) {
                const source = Math.min(point, state.active - 1) * 3;
                const age = point / (count - 1);
                const width = 0.075 * (1 - age * 0.8);
                const wave = Math.sin(state.time * 3 - age * 10) * age * 0.15;
                for (let edge = 0; edge < 2; edge++) {
                    positions.setXYZ(
                        (band * count + point) * 2 + edge,
                        history[source],
                        history[source + 1] +
                            wave +
                            (COLORS.length / 2 - band - edge) * width,
                        history[source + 2],
                    );
                }
            }
        }
        positions.needsUpdate = true;
        uniforms.time.value = state.time;
    });

    if (!demoMode && gameOver) return null;
    return (
        <mesh
            geometry={geometry}
            frustumCulled={false}
        >
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                side={DoubleSide}
                transparent
                depthWrite={false}
                toneMapped={false}
            />
        </mesh>
    );
}
