import { useEffect, useMemo, useRef } from "react";
import { CuboidCollider, interactionGroups, RigidBody } from "@react-three/rapier";
import { useStore } from "@/hooks/useStore";
import BackgroundObject from "./BackgroundObject";
import GrassBlades, { createGrassGeometry } from "./GrassBlades";
import { CityGrid, TerrainSurface } from "./TerrainSurface";
import { createSurfaceTexture } from "./terrain";
import { GROUND_SURFACE_OFFSET } from "./obstacleLayout";
import { GROUND_Y, TILE_LENGTH, useScrollingBody, useWorldMotion } from "./WorldMotion";

function GroundTile({ index, textures, grassGeometry }) {
    const body = useRef();
    const type = useStore((state) => state.character.groundObject);
    const quality = useStore((state) => state.graphicsQuality);
    const { motion } = useWorldMotion();
    useScrollingBody(body, index, 0, GROUND_Y);

    return (
        <RigidBody
            ref={body}
            type="kinematicPosition"
            colliders={false}
            position={[0, GROUND_Y, motion.current.distance - index * TILE_LENGTH]}
            userData={{ type: "ground" }}
        >
            <CuboidCollider
                args={[33, 0.25, TILE_LENGTH / 2]}
                position={[-9, GROUND_SURFACE_OFFSET - 0.25, 0]}
                collisionGroups={interactionGroups(1, [0])}
                name="ground"
            />
            <TerrainSurface
                type={type}
                index={index}
                centerX={-9}
                width={66}
                texture={type === "Building" ? textures.asphalt : type === "Mountain" ? textures.rock : textures.grass}
                detail={type === "Mountain" ? (quality === "Low" ? 32 : quality === "High" ? 80 : 64) : 24}
            />
            {type === "Building" && <CityGrid />}
            {type === "Tree" && <GrassBlades index={index} geometry={grassGeometry} quality={quality} />}
            <BackgroundObject index={index} textures={textures} />
        </RigidBody>
    );
}

export default function Ground() {
    const { tiles } = useWorldMotion();
    const textures = useMemo(() => ({
        asphalt: createSurfaceTexture("asphalt"),
        grass: createSurfaceTexture("grass"),
        rock: createSurfaceTexture("rock"),
    }), []);
    const grassGeometry = useMemo(createGrassGeometry, []);
    useEffect(() => () => {
        textures.asphalt.dispose();
        textures.grass.dispose();
        textures.rock.dispose();
        grassGeometry.dispose();
    }, [textures, grassGeometry]);

    return <group>{tiles.map((index) => <GroundTile key={index} index={index} textures={textures} grassGeometry={grassGeometry} />)}</group>;
}
