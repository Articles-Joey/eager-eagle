import { useMemo } from "react"
import MovingObstacle from "./MovingObstacle"

const BUILDING_COUNT = 10

export default function ObstacleManager() {

    const buildings = useMemo(() => Array.from({ length: BUILDING_COUNT }).map((_, i) => i), [])

    return (
        <group>
            {buildings.map(i => (
                <MovingObstacle key={i} index={i} />
            ))}
        </group>
    )
}
