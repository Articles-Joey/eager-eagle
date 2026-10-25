import { memo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { degToRad } from "three/src/math/MathUtils";
import { useStore } from "@/hooks/useStore";
import { ModelAirplane } from "../Models/Airplane";
import { ModelEagle } from "../Models/Eagle";
import ModelFlappyBird from "../Models/ModelFlappyBird";
import PlayerTrail from "./PlayerTrail";
import PlayerTrailFire from "./PlayerTrailFire";
import PlayerTrailBubbles from "./PlayerTrailBubbles";
import PlayerTrailRainbow from "./PlayerTrailRainbow";
import ObstacleManager from "./ObstacleManager";
import Ground from "./Ground";
import SkyBox from "./SkyBox";
import { PlayerVehicleObject } from "./SceneObject";
import { PHYSICS_STEP, WorldMotion, WorldStepper } from "./WorldMotion";

const PREVIEW_CAMERA = { position: [28, 10, 16], fov: 50 };
const PREVIEW_TARGET = [0, 0, -8];

function ScenePreview() {
    const darkMode = useStore((state) => state.darkMode);
    const debug = useStore((state) => state.debug);
    const showPhysicsDebug = useStore(
        (state) => state?.debugConfig?.showPhysicsDebug,
    );
    const character = useStore((state) => state.character);

    return (
        <Canvas camera={PREVIEW_CAMERA}>
            <OrbitControls target={PREVIEW_TARGET} />
            <SkyBox />
            <ambientLight intensity={darkMode ? 0.5 : 2.5} />
            <directionalLight
                position={[20, 35, -20]}
                intensity={darkMode ? 0.6 : 2}
            />
            <Suspense fallback={null}>
                {(character.model === "Helicopter" ||
                    character.model === "UFO") && (
                    <PlayerVehicleObject type={character.model} />
                )}
                {character.model === "Eagle" && (
                    <ModelEagle
                        scale={0.02}
                        position={[0, -0.5, -0.7]}
                    />
                )}
                {character.model === "Airplane" && (
                    <ModelAirplane rotation={[0, degToRad(90), 0]} />
                )}
                {character.model === "Flappy Bird" && (
                    <ModelFlappyBird
                        scale={0.1}
                        rotation={[0, degToRad(90), 0]}
                        position={[0, -0.5, 0]}
                    />
                )}
                {character.trail === "Fire" ? (
                    <PlayerTrailFire demoMode />
                ) : character.trail === "Bubbles" ? (
                    <PlayerTrailBubbles demoMode />
                ) : character.trail === "Rainbow" ? (
                    <PlayerTrailRainbow demoMode />
                ) : (
                    <PlayerTrail demoMode />
                )}
                <WorldMotion preview>
                    <Physics
                        debug={showPhysicsDebug}
                        gravity={[0, 0, 0]}
                        timeStep={PHYSICS_STEP}
                        interpolate
                    >
                        <WorldStepper />
                        <ObstacleManager />
                        <Ground />
                    </Physics>
                </WorldMotion>
            </Suspense>
        </Canvas>
    );
}

export default memo(ScenePreview);
