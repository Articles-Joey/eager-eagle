import { useRef } from "react";
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
import { terrainHeight } from "./terrain";
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

export default function MovingObstacle({ index }) {
    const character = useStore((state) => state.character);
    const groundBody = useRef();
    const skyBody = useRef();
    const passed = useRef(false);
    const generation = useRef(-1);
    const { motion, preview } = useWorldMotion();
    const groundType = character.groundObject;
    const {
        baseY: skyBaseY,
        phase,
        frequency,
        amplitude,
    } = getSkyMotion(index);
    const baseY = GROUND_Y + GROUND_SURFACE_OFFSET;
    useScrollingBody(groundBody, index);

    useBeforePhysicsStep(() => {
        const z = motion.current.distance - index * TILE_LENGTH;
        const y =
            skyBaseY +
            Math.sin(motion.current.time * frequency + phase) * amplitude;
        if (generation.current !== motion.current.generation) {
            passed.current = false;
            skyBody.current?.setTranslation({ x: 0, y, z }, true);
            generation.current = motion.current.generation;
        }
        skyBody.current?.setNextKinematicTranslation({ x: 0, y, z });

        if (!passed.current && z > 0) {
            passed.current = true;
            if (preview || useGameStore.getState().gameOver) return;
            const game = useGameStore.getState();
            const score = useScoreStore.getState();
            game.addDistance(1);
            score.incrementLifetimeDistance();
            if (game.distance + 1 > score.maxDistance)
                score.setMaxDistance(game.distance + 1);
        }
    });

    return (
        <group>
            <RigidBody
                ref={groundBody}
                type="kinematicPosition"
                position={[0, 0, motion.current.distance - index * TILE_LENGTH]}
                colliders={false}
                userData={{ type: "ground-object" }}
            >
                {ROW_X.map((x, row) => {
                    const height = getGroundHeight(index, row);
                    const visualY =
                        row === 0 || groundType === "Building"
                            ? baseY
                            : GROUND_Y +
                              terrainHeight(
                                  groundType,
                                  x,
                                  -index * TILE_LENGTH,
                              );
                    return (
                        <group key={x}>
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
                            <GroundObject
                                type={groundType}
                                treeVariant={
                                    row === 0 || (index + row) % 2 === 0
                                        ? "Quaternius"
                                        : "Classic"
                                }
                                position={[x, visualY, 0]}
                                height={height}
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
                position={[
                    0,
                    skyBaseY + Math.sin(phase) * amplitude,
                    motion.current.distance - index * TILE_LENGTH,
                ]}
                colliders={false}
                userData={{ type: "sky-object" }}
            >
                <SkyObject type={character.skyObject} />
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
