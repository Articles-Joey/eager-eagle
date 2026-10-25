import { memo, useMemo, useRef, useState } from "react";
import {
    CuboidCollider,
    interactionGroups,
    RigidBody,
} from "@react-three/rapier";
import { AirshipObject, HotAirBalloonObject } from "./SceneObject";
import {
    AIRSHIP_SIZE,
    HOT_AIR_BALLOON_SIZE,
    getSkyMotion,
    PLAY_AREA_TOP,
    SKY_OBJECT_SIZE,
} from "./obstacleLayout";
import {
    TILE_LENGTH,
    useScrollingBody,
    useWorldMotion,
    useWorldTiles,
} from "./WorldMotion";

const AIRSHIP_BODY_DATA = { type: "airship" };
const BALLOON_BODY_DATA = { type: "hot-air-balloon" };
const BALLOON_SPAWN_CHANCE = 0.5;
const BALLOON_CLEARANCE = 0.75;

const Airship = memo(function Airship({ index, y, zOffset, scale, yaw }) {
    const body = useRef();
    const { motion } = useWorldMotion();
    const [initialPosition] = useState(() => [
        0,
        y,
        motion.current.distance - index * TILE_LENGTH + zOffset,
    ]);
    const rotation = useMemo(() => [0, yaw, 0], [yaw]);
    useScrollingBody(body, index, 0, y, zOffset);

    return (
        <RigidBody
            ref={body}
            type="kinematicPosition"
            colliders={false}
            position={initialPosition}
            rotation={rotation}
            scale={scale}
            lockRotations
            userData={AIRSHIP_BODY_DATA}
        >
            <CuboidCollider
                args={AIRSHIP_SIZE.map((value) => value / 2)}
                collisionGroups={interactionGroups(1, [0])}
                name="airship"
            />
            <AirshipObject />
        </RigidBody>
    );
});

const HotAirBalloon = memo(function HotAirBalloon({
    index,
    y,
    zOffset,
    scale,
    bob,
}) {
    const body = useRef();
    const { motion } = useWorldMotion();
    const [initialPosition] = useState(() => [
        0,
        y +
            Math.sin(motion.current.time * bob.frequency + bob.phase) *
                bob.amplitude,
        motion.current.distance - index * TILE_LENGTH + zOffset,
    ]);
    useScrollingBody(body, index, 0, y, zOffset, bob);

    return (
        <RigidBody
            ref={body}
            type="kinematicPosition"
            position={initialPosition}
            scale={scale}
            colliders={false}
            lockRotations
            userData={BALLOON_BODY_DATA}
        >
            <CuboidCollider
                args={HOT_AIR_BALLOON_SIZE.map((value) => value / 2)}
                collisionGroups={interactionGroups(1, [0])}
                name="hot-air-balloon"
            />
            <HotAirBalloonObject />
        </RigidBody>
    );
});

const AirshipCluster = memo(function AirshipCluster({ index }) {
    const [airships] = useState(() => {
        if (Math.random() < 0.42) return [];
        // Keep every ship inside its tile with space between ships on the lane.
        const count = 1 + Math.floor(Math.random() * 2);
        const cellLength = TILE_LENGTH / count;
        const sky = getSkyMotion(index);
        const aboveSky = sky.baseY + sky.amplitude + SKY_OBJECT_SIZE[1] / 2;
        return Array.from({ length: count }, (_, slot) => {
            const scale = 0.7 + Math.random() * 0.45;
            const halfHeight = (AIRSHIP_SIZE[1] * scale) / 2;
            const minY = aboveSky + halfHeight + 1.25;
            const maxY = PLAY_AREA_TOP - halfHeight - 0.15;
            if (minY > maxY) return null;
            const jitter = Math.max(
                0,
                cellLength - AIRSHIP_SIZE[2] * scale - 1,
            );
            return {
                y: minY + Math.random() * (maxY - minY),
                zOffset:
                    -TILE_LENGTH / 2 +
                    cellLength * (slot + 0.5) +
                    (Math.random() - 0.5) * jitter,
                scale,
                yaw: Math.random() < 0.5 ? 0 : Math.PI,
            };
        }).filter(Boolean);
    });

    const [balloon] = useState(() => {
        if (Math.random() >= BALLOON_SPAWN_CHANCE) return null;
        const sky = getSkyMotion(index);
        const aboveSky = sky.baseY + sky.amplitude + SKY_OBJECT_SIZE[1] / 2;
        const scale = 0.7 + Math.random() * 0.25;
        const bob = {
            amplitude: 0.3,
            frequency: 0.8,
            phase: Math.random() * Math.PI * 2,
        };
        const halfHeight = (HOT_AIR_BALLOON_SIZE[1] * scale) / 2;
        const halfDepth = (HOT_AIR_BALLOON_SIZE[2] * scale) / 2;
        const minY = aboveSky + halfHeight + bob.amplitude + BALLOON_CLEARANCE;
        const maxY = PLAY_AREA_TOP - halfHeight - bob.amplitude - 0.15;
        if (minY > maxY) return null;
        // Confine each balloon to its tile so neighboring tiles cannot overlap.
        const zLimit = TILE_LENGTH / 2 - halfDepth - BALLOON_CLEARANCE;
        for (let attempt = 0; attempt < 20; attempt++) {
            const y = minY + Math.random() * (maxY - minY);
            const zOffset = (Math.random() * 2 - 1) * zLimit;
            // Reserve the entire bobbing envelope, not just the initial pose.
            const hasRoom = airships.every(
                (airship) =>
                    Math.abs(zOffset - airship.zOffset) >=
                        halfDepth +
                            (AIRSHIP_SIZE[2] * airship.scale) / 2 +
                            BALLOON_CLEARANCE ||
                    Math.abs(y - airship.y) >=
                        halfHeight +
                            bob.amplitude +
                            (AIRSHIP_SIZE[1] * airship.scale) / 2 +
                            BALLOON_CLEARANCE,
            );
            if (hasRoom) return { y, zOffset, scale, bob };
        }
        return null;
    });

    return (
        <group>
            {airships.map((airship, slot) => (
                <Airship
                    key={slot}
                    index={index}
                    {...airship}
                />
            ))}
            {balloon && (
                <HotAirBalloon
                    index={index}
                    {...balloon}
                />
            )}
        </group>
    );
});

function AirshipField() {
    const { tiles, generation } = useWorldTiles();
    return (
        <group>
            {tiles
                .filter((index) => index > 0)
                .map((index) => (
                    <AirshipCluster
                        key={`${generation}-${index}`}
                        index={index}
                    />
                ))}
        </group>
    );
}

export default memo(AirshipField);
