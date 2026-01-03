import { useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef, useState } from "react"
import { ModelBuildingOne } from "../Models/Building 1"
import { useGameStore } from "@/hooks/useGameStore"

const SPAWN_DISTANCE = -50
const DESPAWN_DISTANCE = 20
const SPEED = 10
const BUILDING_COUNT = 5
const GAP = 20

export default function ObstacleManager() {
    const { addDistance, distance, maxDistance, setMaxDistance, gameOver } = useGameStore()
    
    // Initialize buildings with staggered positions
    const [buildings, setBuildings] = useState(() => {
        return Array.from({ length: BUILDING_COUNT }).map((_, i) => ({
            id: i,
            position: [0, 0, SPAWN_DISTANCE - (i * GAP)],
            passed: false
        }))
    })

    useFrame((state, delta) => {
        if (gameOver) return

        // Move buildings
        setBuildings(prev => prev.map(building => {
            let newZ = building.position[2] + (SPEED * delta)
            let passed = building.passed

            // Check if passed player (player is at 0)
            if (!passed && newZ > 0) {
                passed = true
                addDistance(1)
            }

            // Loop logic
            if (newZ > DESPAWN_DISTANCE) {
                // Find the furthest back building to place behind
                // Actually, we can just reset to SPAWN_DISTANCE relative to the last spawned one?
                // Or just reset to a fixed distance behind the current "furthest" one.
                // Simple approach: Reset to SPAWN_DISTANCE - (GAP * (BUILDING_COUNT - 1)) ?
                // No, that might overlap if speed varies.
                // Better: Reset to the minimum Z in the array - GAP.
                
                // Let's just reset to a fixed spawn point if we assume constant speed and spacing.
                // But to be safe, let's find the min Z.
                const minZ = Math.min(...prev.map(b => b.position[2]))
                newZ = minZ - GAP
                passed = false
            }

            return {
                ...building,
                position: [0, 0, newZ],
                passed
            }
        }))
    })

    useEffect(() => {
        if (distance > maxDistance) {
            setMaxDistance(distance)
        }
    }, [distance, maxDistance, setMaxDistance])

    useEffect(() => {
        if (!gameOver && distance === 0) {
            // Reset buildings when game restarts
             setBuildings(Array.from({ length: BUILDING_COUNT }).map((_, i) => ({
                id: i,
                position: [0, 0, SPAWN_DISTANCE - (i * GAP)],
                passed: false
            })))
        }
    }, [gameOver, distance])

    return (
        <group>
            {buildings.map(building => (
                <MovingBuilding 
                    key={building.id} 
                    position={building.position} 
                />
            ))}
        </group>
    )
}

function MovingBuilding({ position }) {
    // We need to pass the position to the physics body.
    // Since ModelBuildingOne uses useBox with a position prop, 
    // we need to make sure it updates when the prop changes.
    // However, useBox only sets initial position.
    // We need to access the api to update it.
    // But ModelBuildingOne owns the api.
    // So we should modify ModelBuildingOne to accept an external ref or expose the api?
    // Or, we can just make ModelBuildingOne accept the position and update its own api.
    
    return <ModelBuildingOne position={position} />
}
