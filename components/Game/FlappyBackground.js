import { memo, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
    BufferGeometry,
    Color,
    DoubleSide,
    Float32BufferAttribute,
} from "three";
import { variation } from "./terrain";
import { GROUND_Y, useWorldMotion } from "./WorldMotion";
import { useStore } from "@/hooks/useStore";
import { FLAPPY_PALETTES } from "./flappyPalette";

const REPEAT_LENGTH = 160;
const LAYERS = [
    { name: "clouds", x: -116, speed: 0.12 },
    { name: "city", x: -94, speed: 0.22 },
    { name: "bushes", x: -72, speed: 0.38 },
];

function createLayerGeometry(kind, palette) {
    const positions = [];
    const colors = [];
    const shade = new Color();
    function triangle(a, b, c, color) {
        shade.set(color);
        for (const vertex of [a, b, c]) {
            positions.push(...vertex);
            colors.push(shade.r, shade.g, shade.b);
        }
    }
    function rectangle(x, y, z, width, height, color) {
        const a = [x, y, z - width / 2];
        const b = [x, y, z + width / 2];
        const c = [x, y + height, z + width / 2];
        const d = [x, y + height, z - width / 2];
        triangle(a, b, c, color);
        triangle(a, c, d, color);
    }
    function circle(x, y, z, radius, color) {
        for (let step = 0; step < 16; step++) {
            const a = (step / 16) * Math.PI * 2;
            const b = ((step + 1) / 16) * Math.PI * 2;
            triangle(
                [x, y, z],
                [x, y + Math.sin(a) * radius, z + Math.cos(a) * radius],
                [x, y + Math.sin(b) * radius, z + Math.cos(b) * radius],
                color,
            );
        }
    }

    if (kind === "clouds") {
        rectangle(0, -18, 0, REPEAT_LENGTH, 27, palette.clouds);
        for (let cloud = 0; cloud < 32; cloud++) {
            const z = -REPEAT_LENGTH / 2 + cloud * 5;
            circle(
                0.01,
                8 + variation(cloud * 13) * 3,
                z,
                3 + variation(cloud * 17) * 2.5,
                palette.clouds,
            );
        }
    } else if (kind === "city") {
        for (let building = 0; building < 32; building++) {
            const seed = building * 37;
            const z = -REPEAT_LENGTH / 2 + building * 5 + 2.5;
            const width = 3.2 + variation(seed) * 1.6;
            const height = 5 + variation(seed + 1) * 8;
            rectangle(0, -12, z, width, height + 12, palette.cityOutline);
            rectangle(
                0.02,
                -12,
                z,
                width - 0.35,
                height + 11.7,
                palette.cityFill,
            );
            for (let y = 0.9; y < height - 0.6; y += 1.35) {
                for (const offset of [-0.85, 0.35]) {
                    rectangle(
                        0.04,
                        y,
                        z + offset,
                        0.55,
                        0.8,
                        palette.windowOutline,
                    );
                    rectangle(
                        0.05,
                        y + 0.12,
                        z + offset - 0.07,
                        0.3,
                        0.5,
                        palette.windowFill,
                    );
                }
            }
        }
    } else {
        rectangle(0, -18, 0, REPEAT_LENGTH, 21, palette.bushesBase);
        for (let bush = 0; bush < 50; bush++) {
            const seed = bush * 29;
            const z = -REPEAT_LENGTH / 2 + (bush * REPEAT_LENGTH) / 50;
            const radius = 1.7 + variation(seed + 1) * 1.4;
            const y = 2 + variation(seed + 2) * 1.8;
            circle(0.01, y, z, radius, palette.bushesOutline);
            circle(0.03, y - 0.2, z, radius - 0.16, palette.bushesFill);
        }
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
    geometry.computeBoundingSphere();
    return geometry;
}

const ScrollingLayer = memo(function ScrollingLayer({
    name,
    x,
    speed,
    palette,
}) {
    const root = useRef();
    const { motion } = useWorldMotion();
    const geometry = useMemo(
        () => createLayerGeometry(name, palette),
        [name, palette],
    );
    useEffect(() => () => geometry.dispose(), [geometry]);
    useFrame(() => {
        root.current.position.z =
            ((motion.current.distance * speed + REPEAT_LENGTH / 2) %
                REPEAT_LENGTH) -
            REPEAT_LENGTH / 2;
    });

    return (
        <group
            ref={root}
            name={`flappy-${name}`}
            position={[x, 0, 0]}
        >
            {[-1, 0, 1].map((repeat) => (
                <mesh
                    key={repeat}
                    geometry={geometry}
                    position={[0, 0, repeat * REPEAT_LENGTH]}
                >
                    <meshBasicMaterial
                        vertexColors
                        side={DoubleSide}
                        toneMapped={false}
                    />
                </mesh>
            ))}
        </group>
    );
});

export default memo(function FlappyBackground() {
    const darkMode = useStore((state) => state.darkMode);
    const palette = FLAPPY_PALETTES[darkMode ? "dark" : "light"];
    return (
        <group
            name="flappy-background"
            position={[0, GROUND_Y, 0]}
        >
            <mesh
                name="flappy-sky"
                position={[-148, 50, 0]}
                rotation={[0, Math.PI / 2, 0]}
            >
                <planeGeometry args={[640, 240]} />
                <meshBasicMaterial
                    color={palette.sky}
                    side={DoubleSide}
                    toneMapped={false}
                />
            </mesh>
            {LAYERS.map((layer) => (
                <ScrollingLayer
                    key={layer.name}
                    {...layer}
                    palette={palette}
                />
            ))}
        </group>
    );
});
