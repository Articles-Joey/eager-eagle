import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Object3D } from "three";
import { createTerrainGeometry } from "./terrain";
import { TILE_LENGTH } from "./WorldMotion";

export function TerrainSurface({
    type,
    index,
    centerX,
    width,
    texture,
    detail = 32,
    background = false,
}) {
    const geometry = useMemo(
        () =>
            createTerrainGeometry(
                type,
                width,
                centerX,
                index,
                TILE_LENGTH,
                detail,
                background,
            ),
        [type, width, centerX, index, detail, background],
    );
    useEffect(() => () => geometry.dispose(), [geometry]);
    const hilly = type === "Mountain" || type === "Mountains";
    return (
        <group position={[centerX, 0, 0]}>
            <mesh
                geometry={geometry}
                receiveShadow
            >
                <meshStandardMaterial
                    map={texture}
                    vertexColors
                    roughness={1}
                    flatShading={hilly}
                />
            </mesh>
        </group>
    );
}

function BoxInstances({ boxes, color }) {
    const ref = useRef();
    useLayoutEffect(() => {
        const object = new Object3D();
        boxes.forEach(({ position, size }, index) => {
            object.position.set(...position);
            object.scale.set(...size);
            object.updateMatrix();
            ref.current.setMatrixAt(index, object.matrix);
        });
        ref.current.instanceMatrix.needsUpdate = true;
        ref.current.computeBoundingSphere();
    }, [boxes]);
    return (
        <instancedMesh
            ref={ref}
            args={[null, null, boxes.length]}
            receiveShadow
        >
            <boxGeometry />
            <meshStandardMaterial
                color={color}
                roughness={0.95}
            />
        </instancedMesh>
    );
}

export function CityGrid({ background = false }) {
    const columns = useMemo(
        () =>
            background
                ? [-48, -60, -72, -84, -96, -108, -120, -132]
                : [12, 0, -12, -24, -36],
        [background],
    );
    const boxes = useMemo(() => {
        const curbs = [],
            paving = [],
            markings = [];
        columns.forEach((x) => {
            curbs.push({ position: [x, 0.08, 0], size: [8.8, 0.16, 15.8] });
            paving.push({ position: [x, 0.165, 0], size: [8.2, 0.015, 15.2] });
            // Longitudinal lanes and a cross street repeat at every tile edge.
            for (const z of [-6, -2, 2, 6]) {
                markings.push({
                    position: [x - 6, 0.015, z],
                    size: [0.12, 0.02, 1.6],
                });
            }
            markings.push({ position: [x, 0.015, -10], size: [3, 0.02, 0.1] });
            for (let stripe = 0; stripe < 5; stripe++) {
                markings.push({
                    position: [x - 6, 0.02, 6 + stripe * 0.48],
                    size: [2.8, 0.02, 0.23],
                });
            }
        });
        return { curbs, paving, markings };
    }, [columns]);
    return (
        <group>
            <BoxInstances
                boxes={boxes.curbs}
                color="#a2a39b"
            />
            <BoxInstances
                boxes={boxes.paving}
                color="#737971"
            />
            <BoxInstances
                boxes={boxes.markings}
                color="#eadcaa"
            />
        </group>
    );
}
