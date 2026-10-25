import { memo, useEffect, useMemo } from "react";
import {
    BufferGeometry,
    Color,
    DoubleSide,
    Float32BufferAttribute,
} from "three";
import { GROUND_SURFACE_OFFSET } from "./obstacleLayout";
import { TILE_LENGTH } from "./WorldMotion";

const FRONT_X = 4;
export const PIPE_GROUND_WIDTH = 46;
export const PIPE_GROUND_CENTER_X = FRONT_X - PIPE_GROUND_WIDTH / 2;

function createEdgeGeometry() {
    const positions = [];
    const colors = [];
    const shade = new Color();
    function quad(y, z, width, height, slant, color) {
        const points = [
            [FRONT_X + 0.005, y, z],
            [FRONT_X + 0.005, y, z + width],
            [FRONT_X + 0.005, y + height, z + width + slant],
            [FRONT_X + 0.005, y + height, z + slant],
        ];
        shade.set(color);
        for (const corner of [0, 1, 2, 0, 2, 3]) {
            positions.push(...points[corner]);
            colors.push(shade.r, shade.g, shade.b);
        }
    }
    for (let stripe = 0; stripe < 20; stripe++) {
        const z = -TILE_LENGTH / 2 + stripe;
        quad(GROUND_SURFACE_OFFSET - 0.25, z, 0.45, 0.25, 0.25, "#ddf48a");
        quad(-0.65 - (stripe % 3) * 0.43, z + 0.2, 0.22, 0.09, 0, "#c7b978");
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
    geometry.computeBoundingSphere();
    return geometry;
}

export default memo(function PipeGround() {
    const edge = useMemo(createEdgeGeometry, []);
    useEffect(() => () => edge.dispose(), [edge]);

    return (
        <group name="pipe-grass-and-soil">
            <mesh
                position={[
                    PIPE_GROUND_CENTER_X,
                    GROUND_SURFACE_OFFSET - 0.25 - 0.08 - 2,
                    0,
                ]}
            >
                <boxGeometry args={[PIPE_GROUND_WIDTH, 4, TILE_LENGTH]} />
                <meshBasicMaterial
                    color="#dedb9b"
                    toneMapped={false}
                />
            </mesh>
            <mesh
                position={[
                    PIPE_GROUND_CENTER_X,
                    GROUND_SURFACE_OFFSET - 0.25 - 0.04,
                    0,
                ]}
            >
                <boxGeometry args={[PIPE_GROUND_WIDTH, 0.08, TILE_LENGTH]} />
                <meshBasicMaterial
                    color="#8f842b"
                    toneMapped={false}
                />
            </mesh>
            <mesh
                position={[
                    PIPE_GROUND_CENTER_X,
                    GROUND_SURFACE_OFFSET - 0.125,
                    0,
                ]}
            >
                <boxGeometry args={[PIPE_GROUND_WIDTH, 0.25, TILE_LENGTH]} />
                <meshBasicMaterial
                    color="#75bd19"
                    toneMapped={false}
                />
            </mesh>
            <mesh geometry={edge}>
                <meshBasicMaterial
                    vertexColors
                    side={DoubleSide}
                    toneMapped={false}
                />
            </mesh>
        </group>
    );
});
