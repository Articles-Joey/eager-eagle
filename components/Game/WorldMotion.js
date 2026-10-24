import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useFrame } from "@react-three/fiber";
import { useBeforePhysicsStep } from "@react-three/rapier";
import { Box3, Frustum, Matrix4, Vector3 } from "three";
import { useGameStore } from "@/hooks/useGameStore";

export const WORLD_SPEED = 10;
export const TILE_LENGTH = 20;
export const GROUND_Y = -4.75;
export const ROW_X = [0, -12, -24, -36];

const initialTiles = () => Array.from({ length: 20 }, (_, index) => index - 7);
const WorldContext = createContext(null);

export function WorldMotion({ children, preview = false }) {
    const gameOver = useGameStore((state) => state.gameOver);
    const [tiles, setTiles] = useState(initialTiles);
    const motion = useRef({ distance: 0, time: 0, generation: 0 });
    const visibility = useMemo(
        () => ({
            frustum: new Frustum(),
            matrix: new Matrix4(),
            bounds: new Box3(new Vector3(), new Vector3()),
        }),
        [],
    );

    useEffect(() => {
        if (gameOver || preview) return;
        motion.current = {
            distance: 0,
            time: 0,
            generation: motion.current.generation + 1,
        };
        setTiles(initialTiles());
    }, [gameOver, preview]);

    useFrame(({ camera }, delta) => {
        if (gameOver && !preview) return;
        const step = Math.min(delta, 0.05);
        motion.current.distance += WORLD_SPEED * step;
        motion.current.time += step;

        // Keep spawning ahead even when OrbitControls looks back at an older
        // tile. Removing visible rear scenery must not create a hole ahead.
        const lastTile = tiles[tiles.length - 1];
        const neededTile =
            Math.floor(motion.current.distance / TILE_LENGTH) + 12;
        let nextTiles = tiles;
        if (neededTile > lastTile) {
            nextTiles = [
                ...tiles,
                ...Array.from(
                    { length: neededTile - lastTile },
                    (_, i) => lastTile + i + 1,
                ),
            ];
        }

        const oldestZ = motion.current.distance - tiles[0] * TILE_LENGTH;
        if (oldestZ - TILE_LENGTH / 2 > Math.max(60, camera.position.z + 20)) {
            camera.updateMatrixWorld();
            visibility.matrix.multiplyMatrices(
                camera.projectionMatrix,
                camera.matrixWorldInverse,
            );
            visibility.frustum.setFromProjectionMatrix(visibility.matrix);
            // Include spreading tree crowns and blades extending over tile edges.
            visibility.bounds.min.set(
                -150,
                GROUND_Y - 2,
                oldestZ - TILE_LENGTH / 2 - 10,
            );
            visibility.bounds.max.set(25, 42, oldestZ + TILE_LENGTH / 2 + 10);
            // Unmount the tile's meshes, colliders, and scenery together only
            // once the entire tile is behind the player and outside the view.
            if (!visibility.frustum.intersectsBox(visibility.bounds))
                nextTiles = nextTiles.slice(1);
        }
        if (nextTiles !== tiles) setTiles(nextTiles);
    }, -2);

    return (
        <WorldContext.Provider value={{ motion, tiles, preview }}>
            {children}
        </WorldContext.Provider>
    );
}

export function useWorldMotion() {
    return useContext(WorldContext);
}

export function useScrollingBody(body, tile, x = 0, y = 0, zOffset = 0) {
    const { motion } = useWorldMotion();
    const generation = useRef(-1);
    useBeforePhysicsStep(() => {
        if (!body.current) return;
        const position = {
            x,
            y,
            z: motion.current.distance - tile * TILE_LENGTH + zOffset,
        };
        if (generation.current !== motion.current.generation) {
            body.current.setTranslation(position, true);
            generation.current = motion.current.generation;
        }
        body.current.setNextKinematicTranslation(position);
    });
}
