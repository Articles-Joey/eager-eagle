import { memo, useRef, useState } from "react";
import {
    CuboidCollider,
    interactionGroups,
    RigidBody,
    useBeforePhysicsStep,
} from "@react-three/rapier";
import { useStore } from "@/hooks/useStore";
import { useGameStore } from "@/hooks/useGameStore";
import { useScoreStore } from "@/hooks/useScoreStore";
import { GroundObject, SkyObject } from "./SceneObject";
import { MOUNTAIN_SCENERY_HEIGHT_SCALE, terrainHeight } from "./terrain";
import {
    getGroundHeight,
    getSkyMotion,
    GROUND_OBJECT_DEPTH,
    GROUND_OBJECT_WIDTH,
    GROUND_SURFACE_OFFSET,
    SKY_OBJECT_SIZE,
} from "./obstacleLayout";
import {
    GROUND_Y,
    ROW_X,
    TILE_LENGTH,
    useScrollingBody,
    useWorldMotion,
} from "./WorldMotion";

const obstacleGroups = interactionGroups(1, [0]);
const GROUND_BODY_DATA = { type: "ground-object" };
const SKY_BODY_DATA = { type: "sky-object" };

function MovingObstacle({ index }) {
    const groundType = useStore((state) => state.character.groundObject);
    const skyType = useStore((state) => state.character.skyObject);
    const groundBody = useRef();
    const skyBody = useRef();
    const passed = useRef(false);
    const generation = useRef(-1);
    const skyTarget = useRef({ x: 0, y: 0, z: 0 });
    const { motion, preview } = useWorldMotion();
    const {
        baseY: skyBaseY,
        phase,
        frequency,
        amplitude,
    } = getSkyMotion(index);
    const baseY = GROUND_Y + GROUND_SURFACE_OFFSET;
    // JSX only supplies a body's mount pose. All later movement belongs to
    // Rapier; rerenders must never reapply the sky object's starting phase.
    const [initialPositions] = useState(() => {
        const z = motion.current.distance - index * TILE_LENGTH;
        return {
            ground: [0, 0, z],
            sky: [
                0,
                skyBaseY +
                    Math.sin(motion.current.time * frequency + phase) *
                        amplitude,
                z,
            ],
        };
    });
    useScrollingBody(groundBody, index);

    useBeforePhysicsStep(() => {
        const z = motion.current.distance - index * TILE_LENGTH;
        skyTarget.current.y =
            skyBaseY +
            Math.sin(motion.current.time * frequency + phase) * amplitude;
        skyTarget.current.z = z;
        if (generation.current !== motion.current.generation) {
            passed.current = false;
            skyBody.current?.setTranslation(skyTarget.current, true);
            generation.current = motion.current.generation;
        }
        skyBody.current?.setNextKinematicTranslation(skyTarget.current);

        if (!passed.current && z > 0) {
            passed.current = true;
            if (preview || useGameStore.getState().gameOver) return;
            const game = useGameStore.getState();
            const nextDistance = game.distance + 1;
            game.addDistance(1);
            useScoreStore.getState().recordObstaclePassed(nextDistance);
        }
    });

    return (
        <group>
            <RigidBody
                ref={groundBody}
                type="kinematicPosition"
                position={initialPositions.ground}
                colliders={false}
                userData={GROUND_BODY_DATA}
            >
                {ROW_X.map((x, row) => {
                    const height = getGroundHeight(index, row);
                    const visualY =
                        row === 0 ||
                        groundType === "Building" ||
                        groundType === "Pipe"
                            ? baseY
                            : GROUND_Y +
                              terrainHeight(
                                  groundType,
                                  x,
                                  -index * TILE_LENGTH,
                              );
                    return (
                        <group key={x}>
                            {row === 0 && (
                                <CuboidCollider
                                    args={[
                                        GROUND_OBJECT_WIDTH / 2,
                                        height / 2,
                                        GROUND_OBJECT_DEPTH / 2,
                                    ]}
                                    position={[x, baseY + height / 2, 0]}
                                    collisionGroups={obstacleGroups}
                                    name="ground-object"
                                />
                            )}
                            <GroundObject
                                type={groundType}
                                rockSeed={index * 107 + row * 13}
                                treeVariant={
                                    row === 0 || (index + row) % 2 === 0
                                        ? "Quaternius"
                                        : "Classic"
                                }
                                position={[x, visualY, 0]}
                                height={
                                    groundType === "Mountain" && row > 0
                                        ? height * MOUNTAIN_SCENERY_HEIGHT_SCALE
                                        : height
                                }
                                width={
                                    row === 0 ? GROUND_OBJECT_WIDTH : undefined
                                }
                                depth={
                                    row === 0 ? GROUND_OBJECT_DEPTH : undefined
                                }
                                fitGameplayBox={row === 0}
                            />
                        </group>
                    );
                })}
            </RigidBody>
            <RigidBody
                ref={skyBody}
                type="kinematicPosition"
                position={initialPositions.sky}
                colliders={false}
                userData={SKY_BODY_DATA}
            >
                <SkyObject type={skyType} />
                <CuboidCollider
                    args={[SKY_OBJECT_SIZE[0] / 2, 0.5, SKY_OBJECT_SIZE[2] / 2]}
                    collisionGroups={obstacleGroups}
                    name="sky-side"
                />
                <CuboidCollider
                    args={[
                        SKY_OBJECT_SIZE[0] / 2,
                        0.125,
                        SKY_OBJECT_SIZE[2] / 2,
                    ]}
                    position={[0, 0.625, 0]}
                    collisionGroups={obstacleGroups}
                    name="sky-top"
                />
                <CuboidCollider
                    args={[
                        SKY_OBJECT_SIZE[0] / 2,
                        0.125,
                        SKY_OBJECT_SIZE[2] / 2,
                    ]}
                    position={[0, -0.625, 0]}
                    collisionGroups={obstacleGroups}
                    name="sky-bottom"
                />
            </RigidBody>
        </group>
    );
}

export default memo(MovingObstacle);
