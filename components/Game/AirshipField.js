import { useRef, useState } from "react";
import { CuboidCollider, interactionGroups, RigidBody } from "@react-three/rapier";
import { AirshipObject } from "./SceneObject";
import { AIRSHIP_SIZE, getSkyMotion, PLAY_AREA_TOP, SKY_OBJECT_SIZE } from "./obstacleLayout";
import { TILE_LENGTH, useScrollingBody, useWorldMotion } from "./WorldMotion";

function Airship({ index, y, zOffset, scale, yaw }) {
    const body = useRef();
    const { motion } = useWorldMotion();
    useScrollingBody(body, index, 0, y, zOffset);

    return (
        <RigidBody
            ref={body}
            type="kinematicPosition"
            colliders={false}
            position={[0, y, motion.current.distance - index * TILE_LENGTH + zOffset]}
            rotation={[0, yaw, 0]}
            scale={scale}
            lockRotations
            userData={{ type: "airship" }}
        >
            <CuboidCollider
                args={AIRSHIP_SIZE.map((value) => value / 2)}
                collisionGroups={interactionGroups(1, [0])}
                name="airship"
            />
            <AirshipObject />
        </RigidBody>
    );
}

function AirshipCluster({ index }) {
    const [airships] = useState(() => {
        if (Math.random() < 0.42) return [];
        // Keep every ship inside its tile with space between ships on the lane.
        const count = 1 + Math.floor(Math.random() * 2);
        const cellLength = TILE_LENGTH / count;
        const sky = getSkyMotion(index);
        const aboveSky = sky.baseY + sky.amplitude + SKY_OBJECT_SIZE[1] / 2;
        return Array.from({ length: count }, (_, slot) => {
            const scale = 0.7 + Math.random() * 0.45;
            const halfHeight = AIRSHIP_SIZE[1] * scale / 2;
            const minY = aboveSky + halfHeight + 1.25;
            const maxY = PLAY_AREA_TOP - halfHeight - 0.15;
            if (minY > maxY) return null;
            const jitter = Math.max(0, cellLength - AIRSHIP_SIZE[2] * scale - 1);
            return {
                y: minY + Math.random() * (maxY - minY),
                zOffset: -TILE_LENGTH / 2 + cellLength * (slot + 0.5) + (Math.random() - 0.5) * jitter,
                scale,
                yaw: Math.random() < 0.5 ? 0 : Math.PI,
            };
        }).filter(Boolean);
    });

    return <group>{airships.map((airship, slot) => <Airship key={slot} index={index} {...airship} />)}</group>;
}

export default function AirshipField() {
    const { tiles, motion } = useWorldMotion();
    return (
        <group>
            {tiles.filter((index) => index > 0).map((index) => (
                <AirshipCluster key={`${motion.current.generation}-${index}`} index={index} />
            ))}
        </group>
    );
}
