import { useStore } from "@/hooks/useStore";
import { GroundObject } from "./SceneObject";
import { CityGrid, TerrainSurface } from "./TerrainSurface";
import { variation } from "./terrain";

export default function BackgroundObject({ index = 0, textures }) {
    const background = useStore((state) => state.character.background);
    const graphicsQuality = useStore((state) => state.graphicsQuality);
    const density =
        graphicsQuality === "Low"
            ? 0.33
            : graphicsQuality === "Medium"
              ? 0.66
              : 1;
    const city = background === "City";
    const forest = background === "Forest";
    const columns = [-48, -60, -72, -84, -96, -108, -120, -132];

    if (background === "Flappy Bird") return null;

    return (
        <group>
            <TerrainSurface
                type={background}
                index={index}
                centerX={-90}
                width={96}
                texture={
                    city ? textures.asphalt : forest ? textures.grass : null
                }
                detail={graphicsQuality === "Low" ? 32 : 64}
                background
            />
            {city && <CityGrid background />}
            {(city || forest) &&
                columns.flatMap((x, column) => {
                    const count = forest ? 3 : 1;
                    return Array.from({ length: count }, (_, item) => {
                        const seed = index * 107 + column * 13 + item * 7;
                        if (variation(seed + 2) > density) return null;
                        return (
                            <GroundObject
                                key={`${column}-${item}`}
                                type={city ? "Building" : "Tree"}
                                treeVariant={
                                    variation(seed + 9) < 0.5
                                        ? "Classic"
                                        : "Quaternius"
                                }
                                position={[
                                    x +
                                        (forest
                                            ? (variation(seed + 4) - 0.5) * 7
                                            : 0),
                                    city ? 0.175 : 0,
                                    forest
                                        ? -6 +
                                          item * 6 +
                                          (variation(seed + 5) - 0.5) * 3
                                        : 0,
                                ]}
                                rotation={[
                                    0,
                                    forest
                                        ? variation(seed + 6) * Math.PI * 2
                                        : 0,
                                    0,
                                ]}
                                scale={
                                    forest ? 0.7 + variation(seed + 3) * 0.9 : 1
                                }
                                height={city ? 6 + variation(seed + 3) * 22 : 8}
                                width={
                                    city
                                        ? 4 + variation(seed + 7) * 3
                                        : undefined
                                }
                                depth={
                                    city
                                        ? 5 + variation(seed + 8) * 4
                                        : undefined
                                }
                            />
                        );
                    });
                })}
        </group>
    );
}
