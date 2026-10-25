import { memo, useEffect, useMemo, useRef, useState } from "react";
import {
    CuboidCollider,
    interactionGroups,
    RigidBody,
} from "@react-three/rapier";
import { useStore } from "@/hooks/useStore";
import BackgroundObject from "./BackgroundObject";
import GrassBlades, { createGrassGeometry } from "./GrassBlades";
import { CityGrid, TerrainSurface } from "./TerrainSurface";
import { createSurfaceTexture } from "./terrain";
import PipeGround, {
    PIPE_GROUND_CENTER_X,
    PIPE_GROUND_WIDTH,
} from "./PipeGround";
import FlappyBackground from "./FlappyBackground";
import { GROUND_SURFACE_OFFSET } from "./obstacleLayout";
import {
    GROUND_Y,
    TILE_LENGTH,
    useScrollingBody,
    useWorldMotion,
    useWorldTiles,
} from "./WorldMotion";

const GROUND_BODY_DATA = { type: "ground" };

const GroundTile = memo(function GroundTile({
    index,
    textures,
    grassGeometry,
}) {
    const body = useRef();
    const type = useStore((state) => state.character.groundObject);
    const quality = useStore((state) => state.graphicsQuality);
    const { motion } = useWorldMotion();
    const [initialPosition] = useState(() => [
        0,
        GROUND_Y,
        motion.current.distance - index * TILE_LENGTH,
    ]);
    useScrollingBody(body, index, 0, GROUND_Y);

    return (
        <RigidBody
            ref={body}
            type="kinematicPosition"
            colliders={false}
            position={initialPosition}
            userData={GROUND_BODY_DATA}
        >
            <CuboidCollider
                args={[
                    type === "Pipe" ? PIPE_GROUND_WIDTH / 2 : 33,
                    0.25,
                    TILE_LENGTH / 2,
                ]}
                position={[
                    type === "Pipe" ? PIPE_GROUND_CENTER_X : -9,
                    GROUND_SURFACE_OFFSET - 0.25,
                    0,
                ]}
                collisionGroups={interactionGroups(1, [0])}
                name="ground"
            />
            {type === "Pipe" ? (
                <PipeGround />
            ) : (
                <TerrainSurface
                    type={type}
                    index={index}
                    centerX={-9}
                    width={66}
                    texture={
                        type === "Building"
                            ? textures.asphalt
                            : type === "Mountain"
                              ? textures.rock
                              : textures.grass
                    }
                    detail={
                        type === "Mountain"
                            ? quality === "Low"
                                ? 32
                                : quality === "High"
                                  ? 80
                                  : 64
                            : 24
                    }
                />
            )}
            {type === "Building" && <CityGrid />}
            {type === "Tree" && (
                <GrassBlades
                    index={index}
                    geometry={grassGeometry}
                    quality={quality}
                />
            )}
            <BackgroundObject
                index={index}
                textures={textures}
            />
        </RigidBody>
    );
});

function Ground() {
    const { tiles } = useWorldTiles();
    const background = useStore((state) => state.character.background);
    const textures = useMemo(
        () => ({
            asphalt: createSurfaceTexture("asphalt"),
            grass: createSurfaceTexture("grass"),
            rock: createSurfaceTexture("rock"),
        }),
        [],
    );
    const grassGeometry = useMemo(createGrassGeometry, []);
    useEffect(
        () => () => {
            textures.asphalt.dispose();
            textures.grass.dispose();
            textures.rock.dispose();
            grassGeometry.dispose();
        },
        [textures, grassGeometry],
    );

    return (
        <group>
            {background === "Flappy Bird" && <FlappyBackground />}
            {tiles.map((index) => (
                <GroundTile
                    key={index}
                    index={index}
                    textures={textures}
                    grassGeometry={grassGeometry}
                />
            ))}
        </group>
    );
}

export default memo(Ground);
