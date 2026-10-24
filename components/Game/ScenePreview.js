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
import ObstacleManager from "./ObstacleManager";
import Ground from "./Ground";
import SkyBox from "./SkyBox";
import { WorldMotion } from "./WorldMotion";

function ScenePreview() {
    const darkMode = useStore((state) => state.darkMode);
    const debug = useStore((state) => state.debug);
    const showPhysicsDebug = useStore(
        (state) => state?.debugConfig?.showPhysicsDebug,
    );
    const character = useStore((state) => state.character);

    return (
        <Canvas camera={{ position: [28, 10, 16], fov: 50 }}>
            <OrbitControls target={[0, 0, -8]} />
            <SkyBox />
            <ambientLight intensity={darkMode ? 0.5 : 2.5} />
            <directionalLight
                position={[20, 35, -20]}
                intensity={darkMode ? 0.6 : 2}
            />
            <Suspense fallback={null}>
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
                ) : (
                    <PlayerTrail demoMode />
                )}
                <WorldMotion preview>
                    <Physics
                        debug={showPhysicsDebug}
                        gravity={[0, 0, 0]}
                        interpolation={false}
                    >
                        <ObstacleManager />
                        <Ground />
                    </Physics>
                </WorldMotion>
            </Suspense>
        </Canvas>
    );
}

export default memo(ScenePreview);
