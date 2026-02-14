import { useMemo } from "react"
import MovingObstacle from "./MovingObstacle"
import { useGameStore } from "@/hooks/useGameStore"
import { useEffect } from "react"
import { useStore } from "@/hooks/useStore"

const BUILDING_COUNT = 10

export default function ObstacleManager() {
    
    const distance = useGameStore((state) => state.distance)

    const maxDistance = useStore((state) => state.maxDistance)
    const setMaxDistance = useStore((state) => state.setMaxDistance)

    useEffect(() => {
        if (distance > maxDistance) {
            setMaxDistance(distance)
        }
    }, [distance, maxDistance, setMaxDistance])

    const buildings = useMemo(() => Array.from({ length: BUILDING_COUNT }).map((_, i) => i), [])

    return (
        <group>
            {buildings.map(i => (
                <MovingObstacle key={i} index={i} />
            ))}
        </group>
    )
}
