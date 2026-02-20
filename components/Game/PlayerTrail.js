import { useFrame } from "@react-three/fiber"
import { Line } from "@react-three/drei"
import { useRef, useMemo, useState, useEffect } from "react"
import * as THREE from "three"
import { useStore } from "@/hooks/useStore"
import { useGameStore } from "@/hooks/useGameStore"

const SPEED = 10
// const POINT_COUNT = 150

export default function PlayerTrail({ positionRef, demoMode }) {

    const graphicsQuality = useStore((state) => state.graphicsQuality)
    const pointCount = useMemo(() => {
        if (graphicsQuality === "Low") return 50
        if (graphicsQuality === "Medium") return 100
        if (graphicsQuality === "High") return 150
        return 50
    }, [graphicsQuality])

    const lineRef = useRef()

    const points = useMemo(() => {
        return new Array(pointCount).fill(0).map(() => new THREE.Vector3(0, 0, 0))
    }, [pointCount])

    const character = useStore((state) => state.character)
    const gameOver = useGameStore((state) => state.gameOver)

    useFrame((state, delta) => {

        // if (character?.trail === "None" || gameOver) return

        if (!lineRef.current) return
        if (!demoMode && !positionRef?.current) return

        let x = 0, y = 0, z = 0;
        if (positionRef?.current) {
            [x, y, z] = positionRef.current;
        }

        if (demoMode) {
            x += Math.sin(state.clock.elapsedTime * 4) * 0.3;
            y += Math.cos(state.clock.elapsedTime * 5) * 0.3;
        }

        // Shift points back
        for (let i = pointCount - 1; i > 0; i--) {
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

    // Neon color cycling logic with state
    const neonColors = ["#00ffff", "#ff00ff", "#ffff00"];
    const [neonIndex, setNeonIndex] = useState(0);

    useEffect(() => {

        // if (character?.trail === "None" || gameOver) return null

        if (character?.trail !== "Neon") return;

        const interval = setInterval(() => {
            setNeonIndex((prev) => (prev + 1) % neonColors.length);
        }, 300);

        return () => clearInterval(interval);

    }, [character?.trail]);

    let color = "white";
    if (character?.trail === "Neon") {
        color = neonColors[neonIndex];
    }

    if (character?.trail === "None" || (!demoMode && gameOver)) return null

    return (
        <Line
            ref={lineRef}
            points={points}
            color={color}
            lineWidth={character?.trail === "Neon" ? 5 : 2}
            transparent
            opacity={0.5}
        />
    )
}
