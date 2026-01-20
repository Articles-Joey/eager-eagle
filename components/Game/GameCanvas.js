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
// import Npcs from "./Players";

const game_name = 'Eager Eagle'
const game_key = 'eager-eagle'

// const texture = new TextureLoader().load(`${process.env.NEXT_PUBLIC_CDN}games/Race Game/grass.jpg`)

// const GrassPlane = () => {

//     const width = 110; // Set the width of the plane
//     const height = 170; // Set the height of the plane

//     texture.magFilter = NearestFilter;
//     texture.wrapS = RepeatWrapping
//     texture.wrapT = RepeatWrapping
//     texture.repeat.set(5, 5)

//     return (
//         <>
//             <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
//                 <planeGeometry attach="geometry" args={[width, height]} />
//                 <meshStandardMaterial attach="material" map={texture} />
//             </mesh>
//         </>
//     );
// };

// TODO Create a collision item that fips the camera 90deg at a time

function GameCanvas(props) {

    const darkMode = useStore((state) => state.darkMode)
    const debug = useStore((state) => state.debug)
    const setCanvasClicked = useGameStore((state) => state.setCanvasClicked)

    return (
        <Canvas
            camera={{
                position: [30, 3, 0],
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

            <Sky
                sunPosition={
                    darkMode ?
                        [0, -100, 0]
                        :
                        [0, 100, 0]
                }
            />

            <ambientLight intensity={2.5} />
            {/* <spotLight intensity={30000} position={[-50, 100, 50]} angle={5} penumbra={1} /> */}

            {/* <TilePlane
                args={[150, 75]}
                position={[
                    0,
                    (75 / 2),
                    -25
                ]}
            // rotation={[degToRad(-90), 0, 0]}
            /> */}



            {/* <LavaPlane
                args={[150, 150]}
                position={[
                    0,
                    -0.2,
                    0
                ]}
                rotation={[degToRad(-90), 0, 0]}
            /> */}

            {/* <LavaBurst /> */}

            <Physics>

                <Debug scale={debug ? 1 : 0}>

                    <Player />

                    <group>
                        <ObstacleManager />
                    </group>

                    {/* <Npc /> */}
                    {/* <Npcs /> */}

                    <Ground />

                </Debug>

            </Physics>

        </Canvas>
    )
}

export default memo(GameCanvas)

function Ground() {

    // const {
    //     socket,
    // } = useSocketStore(state => ({
    //     socket: state.socket,
    // }));

    const [ref, api] = useBox(() => ({
        mass: 0,
        type: 'Static',
        args: [100, 0.5, 100],
        position: [0, -5, 0],
        collisionFilterGroup: 2, // Rocks are in group 2
        collisionFilterMask: 1,  // Rocks collide with players
        userData: { type: 'ground' }
    }))

    const base_link = `${process.env.NEXT_PUBLIC_CDN}games/Assassin/`

    const texture = useTexture({
        map: `${base_link}rock.webp`,
        // displacementMap: `${base_link}GroundSand005_DISP_1K.jpg`,
        // normalMap: `${base_link}GroundSand005_NRM_1K.jpg`,
        // roughnessMap: `${base_link}GroundSand005_BUMP_1K.jpg`,
        // aoMap: `${base_link}GroundSand005_AO_1K.jpg`,
    })

    texture.map.repeat.set(20, 20);
    texture.map.wrapS = texture.map.wrapT = RepeatWrapping;

    return (
        <group>

            <mesh
                ref={ref}
                castShadow
            // onPointerMove={e => handlePointerMove(e, socket)} // Listen for pointer move
            // onPointerOut={handlePointerOut} // Handle when the pointer leaves
            // onClick={handleOnClick}
            >
                <boxGeometry args={[100, 0.5, 100]} />
                {/* <BeachBall /> */}
                {/* <meshStandardMaterial opacity={0} transparent={true} color="#08e8de" /> */}
                <meshStandardMaterial {...texture} />
            </mesh>

            {/* <FloorPlane
                args={[50, 50]}
                position={[
                    0,
                    0,
                    0
                ]}
                rotation={[degToRad(-90), 0, 0]}
            /> */}

        </group>
    )

}