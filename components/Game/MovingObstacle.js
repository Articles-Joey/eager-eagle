import { useBox } from "@react-three/cannon"
import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import { useGameStore } from "@/hooks/useGameStore"
import { ModelHelicopter } from "../Models/Helicopter"
import { useStore } from "@/hooks/useStore"
import { degToRad } from "three/src/math/MathUtils"
import { useScoreStore } from "@/hooks/useScoreStore"
import { ModelTree } from "../Models/Tree"
import { ModelBuildingOne } from "../Models/Building 1"
import { ModelMountainGroup } from "../Models/Mountain Group"
// import { useGLTF as useGLTF_DREI } from '@react-three/drei'

import BackgroundObject from "./BackgroundObject"
import { ModelBat } from "../Models/Bat"
import { ModelUFO } from "../Models/UFO"
// import { useStore } from "@/hooks/useStore"

const SPAWN_DISTANCE = -20
const DESPAWN_DISTANCE = 100
const SPEED = 10
const BUILDING_COUNT = 10
const GAP = 20
const Y_OFFSET = 5

export default function MovingObstacle({ index }) {

    const { nodes, materials } = useGLTF('models/Building 1-transformed.glb')

    const darkMode = useStore((state) => state.darkMode)

    const character = useStore((state) => state.character)

    const incrementLifetimeDistance = useScoreStore((state) => state.incrementLifetimeDistance)

    const addDistance = useGameStore((state) => state.addDistance)
    const gameOver = useGameStore((state) => state.gameOver)
    const distance = useGameStore((state) => state.distance)

    // Initial position based on index
    const initialZ = useMemo(() => SPAWN_DISTANCE - (index * GAP), [index])

    // Mutable state for position logic
    const position = useRef([0, 0, initialZ])
    const passed = useRef(false)

    const { args, offset } = useMemo(() => {
        const geometry = nodes.skyscraper.geometry
        geometry.computeBoundingBox()
        const size = new THREE.Vector3()
        geometry.boundingBox.getSize(size)
        const center = new THREE.Vector3()
        geometry.boundingBox.getCenter(center)
        return { args: [size.x, size.y, size.z], offset: center }
    }, [nodes])

    // Random height for building collision box (0-5)
    const buildingHeight = useMemo(() => Math.random() * 5, [])
    const baseHeight = useMemo(() => Math.random() * 3, [])

    // Main Building Physics
    const [ref, api] = useBox(() => ({
        mass: 0,
        type: 'Kinematic',
        args: [args[0], buildingHeight, args[2]],
        position: [
            0,
            (buildingHeight / 2) - Y_OFFSET,
            initialZ
        ],
        collisionFilterGroup: 2,
        userData: { type: 'building' }
    }))

    // Base Box Physics
    // const [baseRef, baseApi] = useBox(() => ({
    //     mass: 0,
    //     type: 'Kinematic',
    //     args: [args[0], baseHeight, args[2]],
    //     position: [0, (baseHeight / 2) - Y_OFFSET, initialZ],
    //     collisionFilterGroup: 2,
    //     userData: { type: 'building' }
    // }))

    // Helicopter Physics
    const [helicopterRef, helicopterApi] = useBox(() => ({
        mass: 0,
        type: 'Kinematic',
        args: [1, 1, 1],
        position: [0, (baseHeight / 2) - Y_OFFSET, initialZ],
        collisionFilterGroup: 2,
        userData: { type: 'helicopter' }
    }))

    // Background buildings (scenery)
    const bgGroupRef = useRef()
    const bgBuildings = useMemo(() => {
        return Array.from({ length: 5 }).map(() => ({
            x: (Math.random() - 0.5) * 20, // Wider spread
            z: -(Math.random() * 50 + -20), // 20 to 70 units behind
            scale: 2 + Math.random() * 3,  // 2x to 5x bigger
            rotY: Math.random() * Math.PI * 2
        }))
    }, [])

    // Background hills (spheres with grass)
    const bgHillsRef = useRef()
    // Store refs for each hill mesh
    const hillMeshRefs = useRef([])
    const bgHills = useMemo(() => {
        const darken = darkMode ? 0.5 : 1;
        const hills = [];
        for (let i = 0; i < 8; i++) {
            const rand = Math.random() + (darkMode ? 1 : 0);
            const topL = (40 + rand * 20) * darken;
            const bottomL = (20 + rand * 15) * darken;
            hills.push({
                x: (Math.random() - 0.5) * 60,
                z: -(Math.random() * 80 + -30),
                scale: 5 + Math.random() * 10,
                colorTop: `hsl(${100 + rand * 40}, 60%, ${topL}%)`,
                colorBottom: `hsl(${80 + rand * 30}, 50%, ${bottomL}%)`
            });
        }
        return hills;
    }, []); // Only generate once

    // Update hill colors on darkMode change
    useEffect(() => {
        const darken = darkMode ? 0.5 : 1;
        hillMeshRefs.current.forEach((mesh, i) => {
            if (mesh && mesh.material && mesh.material.uniforms) {
                const rand = (mesh.userData.rand || (mesh.userData.rand = Math.random() + (darkMode ? 1 : 0)));
                const topL = (40 + rand * 20) * darken;
                const bottomL = (20 + rand * 15) * darken;
                mesh.material.uniforms.colorTop.value = new THREE.Color(`hsl(${100 + rand * 40}, 60%, ${topL}%)`);
                mesh.material.uniforms.colorBottom.value = new THREE.Color(`hsl(${80 + rand * 30}, 50%, ${bottomL}%)`);
            }
        });
    }, [darkMode]);

    // Reset logic when game restarts
    useEffect(() => {
        if (!gameOver && distance === 0) {
            position.current = [0, 0, initialZ]
            passed.current = false

            // Reset physics positions
            api.position.set(0, (buildingHeight / 2) - Y_OFFSET, initialZ)
            // baseApi.position.set(0, (baseHeight / 2) - Y_OFFSET, initialZ)
        }
    }, [gameOver, distance, initialZ, buildingHeight, args, api,
        // baseApi
    ])

    // const distance = useGameStore((state) => state.distance)
    const maxDistance = useScoreStore((state) => state.maxDistance)
    const setMaxDistance = useScoreStore((state) => state.setMaxDistance)

    useEffect(() => {
        if (distance > maxDistance) {
            setMaxDistance(distance)
        }
    }, [distance, maxDistance, setMaxDistance])

    useFrame((state, delta) => {
        if (gameOver) return

        // Update Z position
        position.current[2] += SPEED * delta

        // Check if passed player
        if (!passed.current && position.current[2] > 0) {
            passed.current = true
            addDistance(1)
            incrementLifetimeDistance()
        }

        // Loop logic
        if (position.current[2] > DESPAWN_DISTANCE) {
            // Move to back
            // Current Z is > 20. We want to subtract (COUNT * GAP) = 100.
            // But to keep it perfectly spaced, we should align it relative to the "ideal" grid?
            // Or just subtract exactly 100.
            position.current[2] -= (BUILDING_COUNT * GAP)
            passed.current = false

            // We could also randomize baseHeight here if we wanted dynamic changes!
            // But that would require re-creating the physics body or scaling it.
            // For now, keep same height.
        }

        // Sync physics bodies
        const [x, y, z] = position.current

        // Main building positioned so bottom is at ground
        api.position.set(x, (buildingHeight / 2) - Y_OFFSET, z)

        // Base box is centered relative to its height and building
        // baseApi.position.set(x, (baseHeight / 2) - Y_OFFSET, z)

        // Helicopter position (above building)
        helicopterApi.position.set(x, baseHeight + args[1] + 2 - Y_OFFSET, z)

        if (bgGroupRef.current) {
            bgGroupRef.current.position.set(x, 0, z)
        }
        if (bgHillsRef.current) {
            bgHillsRef.current.position.set(x, 0, z)
        }
    })

    return (
        <group>

            {/* Background Scenery Building Group */}
            <group
                position={[-30, 0, 0]}
            >
                <group
                    ref={bgGroupRef}
                >
                    {bgBuildings.map((bg, i) => {
                        const yPos = -Y_OFFSET + (args[1] * bg.scale) / 2 - 2 // Lower them a bit more (-5) to look buried/distant
                        return (
                            <group
                                key={i}
                                position={[bg.x, yPos, bg.z]}
                                scale={[bg.scale, bg.scale, bg.scale]}
                                rotation={[0, bg.rotY, 0]}
                            >
                                <group position={[-offset.x, -offset.y, -offset.z]}>

                                    {/* <mesh geometry={nodes.skyscraper.geometry} material={materials.None} /> */}

                                    {character.groundObject === "Mountain" &&
                                        <ModelMountainGroup
                                            position={[0, -1.5, 0]}
                                            scale={[1, Math.random() * 0.5 + 1, 1]}
                                        />
                                    }
                                    {character.groundObject === "Tree" &&
                                        <ModelTree
                                            position={[0, -treeMinY * -2, 0]}
                                            scale={[0.1, 0.1, 0.1]}
                                        />
                                    }
                                    {character.groundObject === "Building" &&
                                        <mesh geometry={nodes.skyscraper.geometry} material={materials.None} />
                                    }

                                </group>
                            </group>
                        )
                    })}
                </group>
            </group>

            {/* Background Scenery Hills Group */}
            <group
                position={[-80, -5, 0]}
            >
                <group
                    ref={bgHillsRef}
                >
                    {bgHills.map((hill, i) => {
                        const yPos = -Y_OFFSET - hill.scale * 0.3 // Partially buried
                        return (
                            <Hill
                                hill={hill}
                                key={`hill-${i}-${darkMode}`}
                                yPos={yPos}
                                hillMeshRefs={hillMeshRefs}
                                index={i}
                            />
                        )
                    })}
                </group>
            </group>

            {/* <group position={[-offset.x, 0, -offset.z]}>
                <mesh>
                    <boxGeometry args={[0, 0, 0]} />
                    <meshStandardMaterial color="gray" />
                </mesh>
            </group> */}

            <group ref={ref} dispose={null}>

                <mesh>
                    <boxGeometry args={[args[0], buildingHeight, args[2]]} />
                    <meshStandardMaterial color="red" transparent opacity={0.5} />
                </mesh>

                {character.groundObject === "Mountain" &&
                    <ModelMountainGroup
                        position={[0, (-buildingHeight / 2) - mountainMinY, 0]}
                        scale={[1, (buildingHeight / 2) - 0.1, 1]}
                    />
                }
                {character.groundObject === "Tree" &&
                    <ModelTree
                        position={[0, (-buildingHeight / 2) - treeMinY + 0.5, 0]}
                        scale={[0.1, (buildingHeight / 23), 0.1]}
                    />
                }
                {character.groundObject === "Building" &&
                    <ModelBuildingOne
                        position={[0, (-buildingHeight / 2), 0]}
                        scale={[0.3, (buildingHeight / 2) + 0.5, 0.3]}
                        noPhysics={true}
                    />
                }

                {/* <group rotation={[degToRad(180), degToRad(180), degToRad(180)]}>
                    <mesh>
                        <coneGeometry args={[1, 5, 4]} />
                        <meshStandardMaterial color="yellow" />
                    </mesh>
                </group> */}
            </group>

            {/* <mesh ref={baseRef}>
                <boxGeometry args={[args[0], baseHeight, args[2]]} />
                <meshStandardMaterial color="gray" />
            </mesh> */}

            <group
                ref={helicopterRef}
                dispose={null}
                scale={0.005}
            // position={[0, 0, 0]}
            >

                {/* <ModelHelicopter
                    position={[900, -100, 100]}
                /> */}

                <group>
                    {character.skyObject === "Helicopter" &&
                        // <group
                        //     position={[2, -5, 2]}
                        //     scale={0.01}
                        // >
                        //     <ModelHelicopter />
                        // </group>
                        <ModelHelicopter
                            position={[900, -100, 100]}
                        />
                    }
                    {character.skyObject === "Bat" &&
                        <group
                            position={[0, -2, -1]}
                        >
                            <ModelBat
                                scale={70}
                                position={[0, -150, 0]}
                            />
                        </group>
                    }
                    {character.skyObject === "UFO" &&
                        <group
                            position={[-5, -4, 0]}
                        >
                            <ModelUFO
                                scale={4}
                                position={[0, -100, 0]}
                            />
                        </group>
                    }
                </group>

            </group>

        </group>
    )
}

function Hill({
    hill,
    yPos,
    hillMeshRefs,
    index: i
}) {

    const character = useStore((state) => state.character)

    return (
        <group position={[hill.x, yPos, hill.z]}>
            <mesh
                ref={el => hillMeshRefs.current[i] = el}
                scale={[hill.scale, hill.scale, hill.scale]}
                userData={{ rand: undefined }}
            >
                <sphereGeometry args={[1, 16, 16]} />
                <shaderMaterial
                    vertexShader={`
                        varying vec3 vPosition;
                        varying vec3 vNormal;
                        void main() {
                            vPosition = position;
                            vNormal = normalize(normalMatrix * normal);
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        }
                    `}
                    fragmentShader={`
                        uniform vec3 colorTop;
                        uniform vec3 colorBottom;
                        varying vec3 vPosition;
                        varying vec3 vNormal;
                        void main() {
                            float mixValue = (vPosition.y + 1.0) * 0.5;
                            vec3 color = mix(colorBottom, colorTop, mixValue);
                            gl_FragColor = vec4(color, 1.0);
                        }
                    `}
                    uniforms={{
                        colorTop: { value: new THREE.Color(hill.colorTop) },
                        colorBottom: { value: new THREE.Color(hill.colorBottom) }
                    }}
                />

                <BackgroundObject />

            </mesh>
        </group>
    );
}