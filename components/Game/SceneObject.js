import { useEffect, useMemo, useRef } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { Box3, Vector3 } from "three";
import { SkeletonUtils } from "three-stdlib";
import { ModelTree } from "../Models/Tree";
import { ModelQuaterniusTree } from "@/public/models/Quaternius/Tree by Quaternius - qZtx0AHhcy";
import { ModelGoogleAirship } from "@/public/models/Google/Airship by Poly by Google - dRpj4_t2keh";
import { AIRSHIP_SIZE, SKY_OBJECT_SIZE } from "./obstacleLayout";

const groundModels = {
    Building: "/models/Building 1-transformed.glb",
    Tree: "/models/Tree-transformed.glb",
    Mountain: "/models/Mountain Group-transformed.glb",
};
const treeModels = {
    Classic: { url: groundModels.Tree, Model: ModelTree },
    Quaternius: {
        url: "/models/Quaternius/Tree by Quaternius - qZtx0AHhcy-transformed.glb",
        Model: ModelQuaterniusTree,
    },
};
const skyModels = {
    Helicopter: "/models/Helicopter-transformed.glb",
    Bat: "/models/Bat-transformed.glb",
    UFO: "/models/Flying saucer-transformed.glb",
};

// Models only render cosmetics. Gameplay owns all collision shapes separately.
function SceneModel({
    url,
    size,
    bottom = false,
    preserveAspect = false,
    Model,
}) {
    const group = useRef();
    const { scene, animations } = useGLTF(url);
    const [width, height, depth] = size;
    const { clone, scale, offset } = useMemo(() => {
        const clone = Model ? null : SkeletonUtils.clone(scene);
        const bounds = new Box3().setFromObject(clone || scene);
        const extent = bounds.getSize(new Vector3());
        const center = bounds.getCenter(new Vector3());
        const uniformScale = height / Math.max(extent.y, 0.001);
        const scale = preserveAspect
            ? [uniformScale, uniformScale, uniformScale]
            : [width, height, depth].map(
                  (value, axis) =>
                      value / Math.max(extent.getComponent(axis), 0.001),
              );
        return {
            clone,
            scale,
            offset: [-center.x, bottom ? -bounds.min.y : -center.y, -center.z],
        };
    }, [scene, width, height, depth, bottom, preserveAspect, Model]);
    const { actions } = useAnimations(animations, group);

    useEffect(() => {
        const action = actions["BatArmature|Bat_Flying"];
        action?.play();
        return () => {
            action?.stop();
        };
    }, [actions]);

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
            <group
                position={offset}
                ref={group}
            >
                {Model ? <Model /> : <primitive object={clone} />}
            </group>
        </group>
    );
}

export function GroundObject({
    type,
    height = 4,
    width,
    depth,
    treeVariant = "Quaternius",
    fitGameplayBox = false,
    ...props
}) {
    const span = type === "Mountain" ? 5 : type === "Tree" ? 3.5 : 2.8;
    const tree =
        type === "Tree"
            ? treeModels[treeVariant] || treeModels.Quaternius
            : null;
    return (
        <group {...props}>
            <SceneModel
                url={tree?.url || groundModels[type] || groundModels.Building}
                size={[width ?? span, height, depth ?? span]}
                Model={tree?.Model}
                preserveAspect={Boolean(tree) && !fitGameplayBox}
                bottom
            />
        </group>
    );
}

export function SkyObject({ type, ...props }) {
    return (
        <group {...props}>
            <SceneModel
                url={skyModels[type] || skyModels.Helicopter}
                size={SKY_OBJECT_SIZE}
            />
        </group>
    );
}

export function AirshipObject(props) {
    return (
        <group {...props}>
            <SceneModel
                url="/models/Google/Airship by Poly by Google - dRpj4_t2keh-transformed.glb"
                size={AIRSHIP_SIZE}
                Model={ModelGoogleAirship}
            />
        </group>
    );
}
