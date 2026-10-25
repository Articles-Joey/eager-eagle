import {
    createContext,
    startTransition,
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
export const STAGE_SPEED_MODIFIERS = {
    20: 10,
    40: 20,
    60: 30,
    80: 40,
    100: 50,
    150: 75,
    200: 100,
};
export const TILE_LENGTH = 20;
export const GROUND_Y = -4.75;
export const ROW_X = [0, -12, -24, -36];
export const PHYSICS_STEP = 1 / 60;

const initialTiles = () => Array.from({ length: 20 }, (_, index) => index - 7);
const MotionContext = createContext(null);
const TileContext = createContext(null);

export function WorldMotion({ children, preview = false }) {
    const gameOver = useGameStore((state) => state.gameOver);
    const [tiles, setTiles] = useState(initialTiles);
    const [generation, setGeneration] = useState(0);
    const activeTiles = useRef(tiles);
    const motion = useRef({ distance: 0, time: 0, generation: 0 });
    const wasStopped = useRef(gameOver || preview);
    const visibility = useMemo(
        () => ({
            frustum: new Frustum(),
            matrix: new Matrix4(),
            bounds: new Box3(new Vector3(), new Vector3()),
        }),
        [],
    );
    // Moving bodies subscribe only to this stable value. Streaming a tile must
    // not rerender every existing body and reapply its declarative transform.
    const motionContext = useMemo(() => ({ motion, preview }), [preview]);
    const tileContext = useMemo(
        () => ({ tiles, generation }),
        [tiles, generation],
    );

    useEffect(() => {
        const active = !gameOver && !preview;
        const restarting = active && wasStopped.current;
        wasStopped.current = !active;
        if (!restarting) return;
        const nextGeneration = motion.current.generation + 1;
        motion.current = { distance: 0, time: 0, generation: nextGeneration };
        const nextTiles = initialTiles();
        activeTiles.current = nextTiles;
        setGeneration(nextGeneration);
        setTiles(nextTiles);
    }, [gameOver, preview]);

    useFrame(({ camera }) => {
        if (gameOver && !preview) return;
        const currentTiles = activeTiles.current;
        const distance = motion.current.distance;
        const lastTile = currentTiles[currentTiles.length - 1];
        // Prepare the next chunk halfway between scoring milestones instead of
        // combining its model/geometry construction with the score update.
        const neededTile =
            Math.floor((distance + TILE_LENGTH / 2) / TILE_LENGTH) + 12;
        let nextTiles = currentTiles;
        if (neededTile > lastTile) {
            nextTiles = [
                ...currentTiles,
                ...Array.from(
                    { length: neededTile - lastTile },
                    (_, i) => lastTile + i + 1,
                ),
            ];
        }

        const oldestZ = distance - currentTiles[0] * TILE_LENGTH;
        if (oldestZ - TILE_LENGTH / 2 > Math.max(60, camera.position.z + 20)) {
            camera.updateMatrixWorld();
            visibility.matrix.multiplyMatrices(
                camera.projectionMatrix,
                camera.matrixWorldInverse,
            );
            visibility.frustum.setFromProjectionMatrix(visibility.matrix);
            visibility.bounds.min.set(
                -150,
                GROUND_Y - 2,
                oldestZ - TILE_LENGTH / 2 - 10,
            );
            visibility.bounds.max.set(25, 42, oldestZ + TILE_LENGTH / 2 + 10);
            if (!visibility.frustum.intersectsBox(visibility.bounds))
                nextTiles = nextTiles.slice(1);
        }
        if (nextTiles !== currentTiles) {
            activeTiles.current = nextTiles;
            startTransition(() => setTiles(nextTiles));
        }
    }, -2);

    return (
        <MotionContext.Provider value={motionContext}>
            <TileContext.Provider value={tileContext}>
                {children}
            </TileContext.Provider>
        </MotionContext.Provider>
    );
}

// Mount first inside Physics so every kinematic body samples the same clock on
// every fixed step, including frames containing multiple simulation steps.
export function WorldStepper() {
    const { motion, preview } = useWorldMotion();
    useBeforePhysicsStep(() => {
        const game = useGameStore.getState();
        if (!preview && game.gameOver) return;
        let modifier = 0;
        if (!preview) {
            for (const [stage, percentage] of Object.entries(
                STAGE_SPEED_MODIFIERS,
            )) {
                if (game.distance >= Number(stage)) modifier = percentage;
            }
        }
        motion.current.time += PHYSICS_STEP;
        motion.current.distance +=
            PHYSICS_STEP * WORLD_SPEED * (1 + modifier / 100);
    });
    return null;
}

export function useWorldMotion() {
    return useContext(MotionContext);
}

export function useWorldTiles() {
    return useContext(TileContext);
}

export function useScrollingBody(
    body,
    tile,
    x = 0,
    y = 0,
    zOffset = 0,
    bob = null,
) {
    const { motion } = useWorldMotion();
    const generation = useRef(-1);
    const position = useRef({ x, y, z: 0 });
    useBeforePhysicsStep(() => {
        if (!body.current) return;
        position.current.x = x;
        position.current.y =
            y +
            (bob
                ? Math.sin(motion.current.time * bob.frequency + bob.phase) *
                  bob.amplitude
                : 0);
        position.current.z =
            motion.current.distance - tile * TILE_LENGTH + zOffset;
        if (generation.current !== motion.current.generation) {
            body.current.setTranslation(position.current, true);
            generation.current = motion.current.generation;
        }
        body.current.setNextKinematicTranslation(position.current);
    });
}
