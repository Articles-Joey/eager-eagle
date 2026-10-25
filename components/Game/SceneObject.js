import { memo, useEffect, useMemo, useRef } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { Box3, Vector3 } from "three";
import { SkeletonUtils } from "three-stdlib";
import { ModelTree } from "../Models/Tree";
import { ModelHelicopter } from "../Models/Helicopter";
import { ModelUFO } from "../Models/UFO";
import { ModelQuaterniusTree } from "@/public/models/Quaternius/Tree by Quaternius - qZtx0AHhcy";
import { ModelGoogleAirship } from "@/public/models/Google/Airship/Airship by Poly by Google - dRpj4_t2keh";
import { ModelGoogleHotAirBalloon } from "@/public/models/Google/Hot Air Balloon/Hot air balloon by Poly by Google - 7Fej0Jd3_Di";
import {
    AIRSHIP_SIZE,
    HOT_AIR_BALLOON_SIZE,
    SKY_OBJECT_SIZE,
} from "./obstacleLayout";
import ProceduralRock from "./ProceduralRock";
import PipeObject from "./PipeObject";
import getAssetSource from "@articles-media/articles-dev-box/getAssetSource";

const groundModels = {
    Building: "models/Building 1-transformed.glb",
    Tree: "models/Tree-transformed.glb",
};
const treeModels = {
    Classic: { url: groundModels.Tree, Model: ModelTree },
    Quaternius: {
        url: "models/Quaternius/Tree by Quaternius - qZtx0AHhcy-transformed.glb",
        Model: ModelQuaterniusTree,
    },
};
const skyModels = {
    Helicopter: "models/Helicopter-transformed.glb",
    Bat: "models/Bat-transformed.glb",
    UFO: "models/Flying saucer-transformed.glb",
};
const playerVehicles = {
    Helicopter: {
        url: skyModels.Helicopter,
        Model: ModelHelicopter,
        size: [1, 1, 1],
    },
    UFO: { url: skyModels.UFO, Model: ModelUFO, size: [1, 0.65, 1] },
};
const sceneMetrics = new WeakMap();

function measureScene(scene) {
    if (!sceneMetrics.has(scene)) {
        const bounds = new Box3().setFromObject(scene);
        const center = bounds.getCenter(new Vector3());
        sceneMetrics.set(scene, {
            extent: bounds.getSize(new Vector3()),
            bottom: [-center.x, -bounds.min.y, -center.z],
            center: [-center.x, -center.y, -center.z],
        });
    }
    return sceneMetrics.get(scene);
}

// Static scenery does not need an AnimationMixer or a per-frame subscription.
const AnimatedScene = memo(function AnimatedScene({ object, animations }) {
    const root = useRef();
    const { actions } = useAnimations(animations, root);
    useEffect(() => {
        const action = actions["BatArmature|Bat_Flying"];
        action?.play();
        return () => {
            action?.stop();
        };
    }, [actions]);
    return (
        <group ref={root}>
            <primitive object={object} />
        </group>
    );
});

const SceneModel = memo(function SceneModel({
    url,
    size,
    bottom = false,
    preserveAspect = false,
    Model,
}) {
    const { scene, animations } = useGLTF(getAssetSource(url));
    const [width, height, depth] = size;
    const metrics = measureScene(scene);
    // Keep the model instance and animation skeleton for its whole lifetime.
    // Resizing or a parent render must not construct another scene instance.
    const clone = useMemo(
        () =>
            Model
                ? null
                : animations.length > 0
                  ? SkeletonUtils.clone(scene)
                  : scene.clone(true),
        [scene, animations, Model],
    );
    const scale = useMemo(() => {
        const uniformScale = height / Math.max(metrics.extent.y, 0.001);
        return preserveAspect
            ? [uniformScale, uniformScale, uniformScale]
            : [width, height, depth].map(
                  (value, axis) =>
                      value /
                      Math.max(metrics.extent.getComponent(axis), 0.001),
              );
    }, [metrics, width, height, depth, preserveAspect]);

    useEffect(
        () => () => {
            clone?.traverse((object) => {
                if (object.isSkinnedMesh) object.skeleton.dispose();
            });
        },
        [clone],
    );

    return (
        <group scale={scale}>
            <group position={bottom ? metrics.bottom : metrics.center}>
                {Model ? (
                    <Model />
                ) : animations.length > 0 ? (
                    <AnimatedScene
                        object={clone}
                        animations={animations}
                    />
                ) : (
                    <primitive object={clone} />
                )}
            </group>
        </group>
    );
});

export const PlayerVehicleObject = memo(function PlayerVehicleObject({ type }) {
    const vehicle = playerVehicles[type];
    if (!vehicle) return null;
    return (
        <SceneModel
            url={vehicle.url}
            size={vehicle.size}
            Model={vehicle.Model}
            preserveAspect
        />
    );
});

export const GroundObject = memo(function GroundObject({
    type,
    height = 4,
    width,
    depth,
    treeVariant = "Quaternius",
    fitGameplayBox = false,
    rockSeed = 0,
    ...props
}) {
    const span = type === "Mountain" ? 5 : type === "Tree" ? 3.5 : 2.8;
    const tree =
        type === "Tree"
            ? treeModels[treeVariant] || treeModels.Quaternius
            : null;
    const size = useMemo(
        () => [width ?? span, height, depth ?? span],
        [width, span, height, depth],
    );
    return (
        <group {...props}>
            {type === "Mountain" ? (
                <ProceduralRock
                    width={size[0]}
                    height={height}
                    depth={size[2]}
                    seed={rockSeed}
                    fitGameplayBox={fitGameplayBox}
                />
            ) : type === "Pipe" ? (
                <PipeObject
                    width={size[0]}
                    height={height}
                    depth={size[2]}
                />
            ) : (
                <SceneModel
                    url={
                        tree?.url || groundModels[type] || groundModels.Building
                    }
                    size={size}
                    Model={tree?.Model}
                    preserveAspect={Boolean(tree) && !fitGameplayBox}
                    bottom
                />
            )}
        </group>
    );
});

export const SkyObject = memo(function SkyObject({ type, ...props }) {
    return (
        <group {...props}>
            {type === "Pipe" ? (
                <group
                    position={[0, SKY_OBJECT_SIZE[1] / 2, 0]}
                    rotation={[Math.PI, 0, 0]}
                >
                    <PipeObject
                        width={SKY_OBJECT_SIZE[0]}
                        height={SKY_OBJECT_SIZE[1]}
                        depth={SKY_OBJECT_SIZE[2]}
                    />
                </group>
            ) : (
                <SceneModel
                    url={skyModels[type] || skyModels.Helicopter}
                    size={SKY_OBJECT_SIZE}
                />
            )}
        </group>
    );
});

export const AirshipObject = memo(function AirshipObject(props) {
    return (
        <group {...props}>
            <SceneModel
                url="models/Google/Airship/Airship by Poly by Google - dRpj4_t2keh-transformed.glb"
                size={AIRSHIP_SIZE}
                Model={ModelGoogleAirship}
            />
        </group>
    );
});

export const HotAirBalloonObject = memo(function HotAirBalloonObject(props) {
    return (
        <group {...props}>
            <SceneModel
                url="models/Google/Hot Air Balloon/Hot air balloon by Poly by Google - 7Fej0Jd3_Di-transformed.glb"
                size={HOT_AIR_BALLOON_SIZE}
                Model={ModelGoogleHotAirBalloon}
            />
        </group>
    );
});
