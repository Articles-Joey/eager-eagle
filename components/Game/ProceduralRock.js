import { memo, useEffect, useMemo } from "react";
import {
    BufferGeometry,
    Color,
    Float32BufferAttribute,
    IcosahedronGeometry,
} from "three";
import { variation } from "./terrain";

function createRockGeometry(seed) {
    const positions = [];
    const colors = [];
    const stone = new Color("#858781");
    const earth = new Color("#776d60");
    const shade = new Color();
    const spreadX = 0.35 + variation(seed + 1) * 0.65;
    const spreadZ = 0.35 + variation(seed + 2) * 0.65;
    const cornerCount = 12;
    const levels = [0, 0.2, 0.38, 0.5, 0.69, 0.87, 1];
    const rings = levels.map((y, level) => {
        const bevels = Array.from({ length: 4 }, (_, corner) =>
            y === 1
                ? 0.025 + variation(seed + corner * 19) * 0.055
                : 0.07 + variation(seed + level * 13 + corner * 19) * 0.19,
        );
        const outline = [
            [-0.5, -0.5 + bevels[0]],
            [-0.5 + bevels[0], -0.5],
            [0, -0.5],
            [0.5 - bevels[1], -0.5],
            [0.5, -0.5 + bevels[1]],
            [0.5, 0],
            [0.5, 0.5 - bevels[2]],
            [0.5 - bevels[2], 0.5],
            [0, 0.5],
            [-0.5 + bevels[3], 0.5],
            [-0.5, 0.5 - bevels[3]],
            [-0.5, 0],
        ];
        return outline.map(([x, z], corner) => {
            const vertexSeed = seed + level * 131 + corner * 17;
            // Break up horizontal bands into uneven ledges and sharp facets.
            // Keep the base, midpoint, and collider-aligned top at fixed heights.
            const vertexY =
                y === 0 || y === 0.5 || y === 1
                    ? y
                    : y + (variation(vertexSeed + 3) - 0.5) * 0.11;
            const lowerHalf = Math.max(0, 1 - vertexY * 2);
            const width = 1 + lowerHalf * spreadX;
            const depth = 1 + lowerHalf * spreadZ;
            // Top edges remain on the collider; upper-side chips only cut inward.
            const inset = y === 1 ? 1 : 0.76 + variation(vertexSeed + 5) * 0.24;
            const foot = 1 + lowerHalf * variation(vertexSeed + 7) * 0.22;
            return [
                x * width * inset * foot,
                vertexY,
                z * depth * inset * foot,
            ];
        });
    });

    function triangle(a, b, c) {
        const face = positions.length / 9;
        const height = (a[1] + b[1] + c[1]) / 3;
        shade.copy(stone).lerp(earth, variation(seed + face * 11) * 0.35);
        shade.multiplyScalar(
            0.8 + height * 0.16 + variation(seed + face * 17) * 0.16,
        );
        for (const vertex of [a, b, c]) {
            positions.push(...vertex);
            colors.push(shade.r, shade.g, shade.b);
        }
    }

    for (let level = 0; level < rings.length - 1; level++) {
        for (let corner = 0; corner < cornerCount; corner++) {
            const next = (corner + 1) % cornerCount;
            if (variation(seed + level * 41 + corner * 23) < 0.5) {
                triangle(
                    rings[level][corner],
                    rings[level + 1][corner],
                    rings[level + 1][next],
                );
                triangle(
                    rings[level][corner],
                    rings[level + 1][next],
                    rings[level][next],
                );
            } else {
                triangle(
                    rings[level][corner],
                    rings[level + 1][corner],
                    rings[level][next],
                );
                triangle(
                    rings[level][next],
                    rings[level + 1][corner],
                    rings[level + 1][next],
                );
            }
        }
    }
    for (let corner = 0; corner < cornerCount; corner++) {
        const next = (corner + 1) % cornerCount;
        triangle(
            [0, 1, 0],
            rings[rings.length - 1][next],
            rings[rings.length - 1][corner],
        );
        triangle([0, 0, 0], rings[0][corner], rings[0][next]);
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    return geometry;
}

function createSceneryRockGeometry(seed) {
    const geometry = new IcosahedronGeometry(0.5, 2);
    const positions = geometry.attributes.position;
    const phase = variation(seed + 3) * Math.PI * 2;
    // Deform by position so duplicated triangle vertices stay joined.
    for (let vertex = 0; vertex < positions.count; vertex++) {
        const x = positions.getX(vertex);
        const y = positions.getY(vertex);
        const z = positions.getZ(vertex);
        const bulge =
            1 +
            Math.sin(x * 7 + y * 4 + phase) * 0.13 +
            Math.cos(z * 8 - y * 5 + phase) * 0.09;
        positions.setXYZ(vertex, x * bulge, y * bulge, z * bulge);
    }

    // Normalize to the requested dimensions before burying the lower half.
    geometry.computeBoundingBox();
    const { min, max } = geometry.boundingBox;
    const centerX = (min.x + max.x) / 2;
    const centerZ = (min.z + max.z) / 2;
    for (let vertex = 0; vertex < positions.count; vertex++) {
        positions.setXYZ(
            vertex,
            (positions.getX(vertex) - centerX) / (max.x - min.x),
            (positions.getY(vertex) - min.y) / (max.y - min.y),
            (positions.getZ(vertex) - centerZ) / (max.z - min.z),
        );
    }

    const colors = [];
    const stone = new Color("#858781");
    const earth = new Color("#776d60");
    const shade = new Color();
    for (let face = 0; face < positions.count / 3; face++) {
        shade.copy(stone).lerp(earth, variation(seed + face * 11) * 0.35);
        shade.multiplyScalar(0.85 + variation(seed + face * 17) * 0.25);
        for (let corner = 0; corner < 3; corner++)
            colors.push(shade.r, shade.g, shade.b);
    }
    geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    return geometry;
}

export default memo(function ProceduralRock({
    width,
    height,
    depth,
    seed = 0,
    fitGameplayBox = false,
}) {
    const geometry = useMemo(
        () =>
            fitGameplayBox
                ? createRockGeometry(seed)
                : createSceneryRockGeometry(seed),
        [seed, fitGameplayBox],
    );
    useEffect(() => () => geometry.dispose(), [geometry]);

    return (
        <mesh
            geometry={geometry}
            scale={[width, height, depth]}
            position={[0, fitGameplayBox ? 0 : -height * 0.5, 0]}
            rotation={[
                0,
                fitGameplayBox ? 0 : variation(seed + 5) * Math.PI * 2,
                0,
            ]}
            receiveShadow
            castShadow
        >
            <meshStandardMaterial
                vertexColors
                flatShading
                roughness={1}
            />
        </mesh>
    );
});
