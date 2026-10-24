import { useLayoutEffect, useRef } from "react";
import {
    BufferAttribute,
    BufferGeometry,
    Color,
    DoubleSide,
    Object3D,
} from "three";
import { TILE_LENGTH } from "./WorldMotion";
import { variation } from "./terrain";
import { GROUND_SURFACE_OFFSET } from "./obstacleLayout";

export function createGrassGeometry() {
    const geometry = new BufferGeometry();
    // A tapered blade with a bent tip, shared by every grass instance.
    geometry.setAttribute(
        "position",
        new BufferAttribute(
            new Float32Array([
                -0.045, 0, 0, 0.045, 0, 0, -0.026, 0.55, 0.055, 0.026, 0.55,
                0.055, 0.03, 1, 0.2,
            ]),
            3,
        ),
    );
    geometry.setAttribute(
        "color",
        new BufferAttribute(
            new Float32Array([
                0.28, 0.4, 0.16, 0.28, 0.4, 0.16, 0.75, 0.9, 0.5, 0.75, 0.9,
                0.5, 1, 1, 0.75,
            ]),
            3,
        ),
    );
    geometry.setIndex([0, 1, 2, 2, 1, 3, 2, 3, 4]);
    geometry.computeVertexNormals();
    return geometry;
}

export default function GrassBlades({ index, geometry, quality }) {
    const mesh = useRef();
    const count = quality === "Low" ? 1000 : quality === "High" ? 4000 : 2400;
    useLayoutEffect(() => {
        const object = new Object3D();
        const color = new Color();
        for (let blade = 0; blade < count; blade++) {
            const seed = index * 7919 + blade * 17;
            const x = -42 + variation(seed + 1) * 66;
            const z = (variation(seed + 2) - 0.5) * TILE_LENGTH;
            const height = 0.25 + variation(seed + 3) * 0.6;
            const width = 0.65 + variation(seed + 4) * 0.85;
            object.position.set(x, GROUND_SURFACE_OFFSET + 0.006, z);
            object.rotation.set(
                0,
                variation(seed + 5) * Math.PI * 2,
                (variation(seed + 6) - 0.5) * 0.2,
            );
            object.scale.set(width, height, width);
            object.updateMatrix();
            mesh.current.setMatrixAt(blade, object.matrix);
            color.setHSL(
                0.22 + variation(seed + 7) * 0.06,
                0.45,
                0.3 + variation(seed + 8) * 0.15,
            );
            mesh.current.setColorAt(blade, color);
        }
        mesh.current.instanceMatrix.needsUpdate = true;
        mesh.current.instanceColor.needsUpdate = true;
        mesh.current.computeBoundingSphere();
    }, [index, count]);

    return (
        <instancedMesh
            ref={mesh}
            args={[geometry, null, count]}
            receiveShadow
        >
            <meshStandardMaterial
                vertexColors
                side={DoubleSide}
                roughness={1}
            />
        </instancedMesh>
    );
}
