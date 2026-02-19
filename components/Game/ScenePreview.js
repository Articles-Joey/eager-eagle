import { createContext, createRef, forwardRef, memo, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Sky, useDetectGPU, useTexture, OrbitControls, Cylinder, QuadraticBezierLine, Text, Outlines, Billboard } from "@react-three/drei";

import { NearestFilter, RepeatWrapping, TextureLoader, Vector3 } from "three";

import { Debug, Physics, useBox, useCylinder, useSphere } from "@react-three/cannon";
import { degToRad } from "three/src/math/MathUtils";
// import FloorPlane from "./FloorPlane";
// import { Model as SpacesuitModel } from "@/components/Games/Assets/Quaternius/men/Spacesuit";
// import { Model as SpacesuitModel } from "./Spacesuit";
import Player from "./Player";
// import { SpotLight } from "three";
// import { useGameStore } from "@/hooks/useGameStore";
// import TilePlane from "./Wall";
// import LavaPlane from "./LavaPlane";
// import LavaBurst from "./LavaBurst";
// import { socket } from "@/components/context/best-socket";
// import { useSocketStore } from "@/hooks/useSocketStore";
import { useStore } from "@/hooks/useStore";
// import { ModelBuildingOne } from "../Models/Building 1";
import ObstacleManager from "./ObstacleManager";
import { useGameStore } from "@/hooks/useGameStore";
import SkyBox from "./SkyBox";
// import Npcs from "./Players";

import { ModelAirplane } from "../Models/Airplane"
import { ModelEagle } from "../Models/Eagle"
import { ModelBuildingOne } from "../Models/Building 1";
import { ModelHelicopter } from "../Models/Helicopter";
import ModelFlappyBird from "../Models/ModelFlappyBird";
import { ModelTree } from "../Models/Tree";
import { ModelMountainGroup } from "../Models/Mountain Group";

const game_name = 'Eager Eagle'
const game_key = 'eager-eagle'

function ScenePreview() {

    const darkMode = useStore((state) => state.darkMode)
    const debug = useStore((state) => state.debug)
    const character = useStore((state) => state.character)

    const setCanvasClicked = useGameStore((state) => state.setCanvasClicked)

    return (
        <Canvas
            camera={{
                position: [5, 0, -2],
                fov: 50
            }}
            onPointerDown={() => {
                setCanvasClicked(true)
            }}
            onPointerUp={() => {
                setCanvasClicked(false)
            }}
        >

            <OrbitControls
            // autoRotate={gameState?.status == 'In Lobby'}
            />

            {/* <Sky
                sunPosition={
                    darkMode ?
                        [0, -100, 0]
                        :
                        [0, 100, 0]
                }
            /> */}

            <SkyBox />

            <ambientLight intensity={darkMode ? 1 : 2.5} />

            {character.model === "Eagle" &&
                <ModelEagle
                    scale={0.02}
                    position={[0, -0.5, -0.7]}
                />
            }
            {character.model === "Airplane" &&
                <ModelAirplane
                    scale={1}
                    rotation={[0, degToRad(90), 0]}
                    position={[0, 0, 0]}
                />
            }
            {character.model === "Flappy Bird" &&
                <ModelFlappyBird
                    scale={0.1}
                    rotation={[0, degToRad(90), 0]}
                    position={[0, -0.5, 0]}
                />
            }


            <Physics>

                <Debug scale={debug ? 1 : 0}>

                    {/* Building */}
                    <group>
                        {character.groundObject === "Building" &&
                            <ModelBuildingOne
                                position={[-2, -2, 4]}
                            />
                        }
                        {character.groundObject === "Tree" &&
                            <ModelTree
                                position={[-2, -3, 4]}
                                scale={0.1}
                                scale-y={0.175}
                            />
                        }
                        {character.groundObject === "Mountain" &&
                            <ModelMountainGroup
                                position={[-2, -3, 3.5]}
                                scale={0.8}
                                scale-y={1.8}
                            />
                        }
                    </group>

                    <group>
                        {character.skyObject === "Helicopter" &&
                            <group
                                position={[2, -5, 2]}
                                scale={0.01}
                            >
                                <ModelHelicopter />
                            </group>
                        }
                        {character.skyObject === "Bird" &&
                            <group></group>
                        }
                        {character.skyObject === "Drone" &&
                            <group></group>
                        }
                    </group>

                </Debug>

            </Physics>

        </Canvas>
    )
}

export default memo(ScenePreview)