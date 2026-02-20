import { useStore } from "@/hooks/useStore"
import { ModelBuildingOne } from "../Models/Building 1"
import { ModelMountainGroup } from "../Models/Mountain Group"
import { ModelTree } from "../Models/Tree"
import { useMemo, useRef } from "react"

export default function BackgroundObject({ type, position, rotation, scale }) {
    const graphicsQuality = useStore((state) => state.graphicsQuality)
    const character = useStore((state) => state.character)
    // Only randomize Y axis rotation
    const randomRotation = useMemo(() => [
        0,
        Math.random() * Math.PI * 2,
        0
    ], [])


    // Stable random value per instance
    const randomValueRef = useRef(Math.random());
    
    const shouldRender = useMemo(() => {
        if (graphicsQuality === "High") return true;
        if (graphicsQuality === "Medium") return randomValueRef.current < 0.66;
        if (graphicsQuality === "Low") return randomValueRef.current < 0.33;
        return true;
    }, [graphicsQuality]);

    if (!shouldRender) return null;

    return (
        <group position={position} rotation={randomRotation}>
            {character?.background == "City" &&
                <group position={[0, 1, 0]}>
                    <ModelBuildingOne scale={0.3} noPhysics={true} />
                </group>
            }
            {character?.background == "Mountains" &&
                <ModelMountainGroup position={[0, 0, 0]} scale={1} />
            }
            {character?.background == "Forest" &&
                <ModelTree position={[0, 0, 0]} scale={0.15} />
            }
        </group>
    )
}