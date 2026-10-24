import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import {
    CuboidCollider,
    interactionGroups,
    RigidBody,
} from "@react-three/rapier";
import { Vector3 } from "three";

export function ModelBuildingOne({ noPhysics = false, ...props }) {
    const { nodes, materials } = useGLTF("/models/Building 1-transformed.glb");
    const { size, offset } = useMemo(() => {
        const geometry = nodes.skyscraper.geometry;
        geometry.computeBoundingBox();
        const size = geometry.boundingBox.getSize(new Vector3());
        const center = geometry.boundingBox.getCenter(new Vector3());
        return {
            size,
            offset: [-center.x, -geometry.boundingBox.min.y, -center.z],
        };
    }, [nodes]);
    const visual = (
        <mesh
            position={offset}
            geometry={nodes.skyscraper.geometry}
            material={materials.None}
            dispose={null}
        />
    );

    if (noPhysics) return <group {...props}>{visual}</group>;

    return (
        <RigidBody
            type="fixed"
            colliders={false}
            userData={{ type: "building" }}
            {...props}
        >
            <CuboidCollider
                args={[size.x / 2, size.y / 2, size.z / 2]}
                position={[0, size.y / 2, 0]}
                collisionGroups={interactionGroups(1, [0])}
            />
            {visual}
        </RigidBody>
    );
}

useGLTF.preload("/models/Building 1-transformed.glb");
