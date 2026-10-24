import MovingObstacle from "./MovingObstacle";
import AirshipField from "./AirshipField";
import { useWorldMotion } from "./WorldMotion";

export default function ObstacleManager() {
    const { tiles } = useWorldMotion();
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
