import { useFrame } from "@react-three/fiber"
import { Line } from "@react-three/drei"
import { useRef, useMemo } from "react"
import * as THREE from "three"
import { useStore } from "@/hooks/useStore"
import { useGameStore } from "@/hooks/useGameStore"

const SPEED = 10
const POINT_COUNT = 50

export default function PlayerTrail({ positionRef }) {

    const lineRef = useRef()

    const points = useMemo(() => {
        return new Array(POINT_COUNT).fill(0).map(() => new THREE.Vector3(0, 0, 0))
    }, [])

    const character = useStore((state) => state.character)
    const gameOver = useGameStore((state) => state.gameOver)

    useFrame((state, delta) => {

        if (!character?.trail?.enabled || gameOver) return

        if (!positionRef.current || !lineRef.current) return

        const [x, y, z] = positionRef.current

        // Shift points back
        for (let i = POINT_COUNT - 1; i > 0; i--) {
            points[i].copy(points[i - 1])
            points[i].z += SPEED * delta
        }
        points[0].set(x, y, z)

        if (lineRef.current.geometry) {
            const flatPoints = points.flatMap(p => [p.x, p.y, p.z])
            lineRef.current.geometry.setPositions(flatPoints)
            // lineRef.current.computeLineDistances()
        }
    })

    if (!character?.trail?.enabled || gameOver) return null

    return (
        <Line
            ref={lineRef}
            points={points}
            color="white"
            lineWidth={2}
            transparent
            opacity={0.5}
        />
    )
}
