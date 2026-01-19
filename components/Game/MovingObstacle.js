import { useBox } from "@react-three/cannon"
import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import { useGameStore } from "@/hooks/useGameStore"
import { ModelHelicopter } from "../Models/Helicopter"

const SPAWN_DISTANCE = -50
const DESPAWN_DISTANCE = 20
const SPEED = 10
const BUILDING_COUNT = 5
const GAP = 20
const Y_OFFSET = 3

export default function MovingObstacle({ index }) {
    const { nodes, materials } = useGLTF('models/Building 1-transformed.glb')
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

    // Random height for base (0-3)
    const baseHeight = useMemo(() => Math.random() * 3, [])

    // Main Building Physics
    const [ref, api] = useBox(() => ({
        mass: 0,
        type: 'Kinematic',
        args: args,
        position: [0, baseHeight + (args[1] / 2) - Y_OFFSET, initialZ],
        collisionFilterGroup: 2,
        userData: { type: 'building' }
    }))

    // Base Box Physics
    const [baseRef, baseApi] = useBox(() => ({
        mass: 0,
        type: 'Kinematic',
        args: [args[0], baseHeight, args[2]],
        position: [0, (baseHeight / 2) - Y_OFFSET, initialZ],
        collisionFilterGroup: 2,
        userData: { type: 'building' }
    }))

    // Base Box Physics
    const [helicopterRef, helicopterApi] = useBox(() => ({
        mass: 0,
        type: 'Kinematic',
        args: [args[0], baseHeight, args[2]],
        position: [0, (baseHeight / 2) - Y_OFFSET, initialZ],
        collisionFilterGroup: 2,
        userData: { type: 'helicopter' }
    }))

    // Background buildings (scenery)
    const bgGroupRef = useRef()
    const bgBuildings = useMemo(() => {
        return Array.from({ length: 5 }).map(() => ({
            x: (Math.random() - 0.5) * 80, // Wider spread
            z: -(Math.random() * 50 + 20), // 20 to 70 units behind
            scale: 2 + Math.random() * 3,  // 2x to 5x bigger
            rotY: Math.random() * Math.PI * 2
        }))
    }, [])

    // Reset logic when game restarts
    useEffect(() => {
        if (!gameOver && distance === 0) {
            position.current = [0, 0, initialZ]
            passed.current = false

            // Reset physics positions
            api.position.set(0, baseHeight + (args[1] / 2) - Y_OFFSET, initialZ)
            baseApi.position.set(0, (baseHeight / 2) - Y_OFFSET, initialZ)
        }
    }, [gameOver, distance, initialZ, baseHeight, args, api, baseApi])

    useFrame((state, delta) => {
        if (gameOver) return

        // Update Z position
        position.current[2] += SPEED * delta

        // Check if passed player
        if (!passed.current && position.current[2] > 0) {
            passed.current = true
            addDistance(1)
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

        // Main building is shifted up by baseHeight
        api.position.set(x, baseHeight + (args[1] / 2) - Y_OFFSET, z)

        // Base box is centered relative to its height and building
        baseApi.position.set(x, (baseHeight / 2) - Y_OFFSET, z)

        // Helicopter position (above building)
        helicopterApi.position.set(x, baseHeight + args[1] + 2 - Y_OFFSET, z)

        if (bgGroupRef.current) {
            bgGroupRef.current.position.set(x, 0, z)
        }
    })

    return (
        <group>
            
            {/* Background Scenery Group */}
            <group ref={bgGroupRef}>
                {bgBuildings.map((bg, i) => {
                    const yPos = -Y_OFFSET + (args[1] * bg.scale) / 2 - 5 // Lower them a bit more (-5) to look buried/distant
                    return (
                        <group 
                            key={i} 
                            position={[bg.x, yPos, bg.z]} 
                            scale={[bg.scale, bg.scale, bg.scale]} 
                            rotation={[0, bg.rotY, 0]}
                        >
                            <group position={[-offset.x, -offset.y, -offset.z]}>
                                <mesh geometry={nodes.skyscraper.geometry} material={materials.None} />
                            </group>
                        </group>
                    )
                })}
            </group>

            <group ref={ref} dispose={null}>
                <group position={[-offset.x, -offset.y, -offset.z]}>
                    <mesh geometry={nodes.skyscraper.geometry} material={materials.None} />
                </group>
            </group>
            <mesh ref={baseRef}>
                <boxGeometry args={[args[0], baseHeight, args[2]]} />
                <meshStandardMaterial color="gray" />
            </mesh>
            <group
                ref={helicopterRef}
                dispose={null}
                scale={0.005}
                position={[-offset.x, -offset.y, -offset.z]}
            >
                <ModelHelicopter />
            </group>
        </group>
    )
}
