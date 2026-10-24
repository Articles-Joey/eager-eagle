import { useThree } from "@react-three/fiber";
import { memo, useEffect, useRef } from "react";
import { CubeTextureLoader } from "three";
import defaultSkyboxes from "@/components/defaultSkyboxes";
import { useStore } from "@/hooks/useStore";

const SkyBox = memo(() => {
    const { scene } = useThree();
    const loader = useRef(new CubeTextureLoader()).current;
    const darkMode = useStore((state) => state.darkMode);

    useEffect(() => {
        const skyboxName = darkMode ? "Cold Night" : "Cartoon Base BlueSky";
        const skybox = defaultSkyboxes.find(({ name }) => name === skyboxName);
        const texture = loader.load(skybox.images);

        scene.background = texture;

        return () => {
            scene.background = null;
            texture.dispose();
        };
    }, [darkMode, loader, scene]);

    return null;
});

SkyBox.displayName = "SkyBox";

export default SkyBox;
