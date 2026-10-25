import { memo } from "react";
import MovingObstacle from "./MovingObstacle";
import AirshipField from "./AirshipField";
import { useWorldTiles } from "./WorldMotion";

function ObstacleManager() {
    const { tiles } = useWorldTiles();
    return (
        <group>
            <AirshipField />
            {tiles
                .filter((index) => index > 0)
                .map((index) => (
                    <MovingObstacle
                        key={index}
                        index={index}
                    />
                ))}
        </group>
    );
}
export default memo(ObstacleManager);
