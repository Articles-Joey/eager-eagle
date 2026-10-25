import { useThree } from "@react-three/fiber";
import { memo, useEffect, useRef } from "react";
import { Color, CubeTextureLoader } from "three";
import defaultSkyboxes from "@/components/defaultSkyboxes";
import { useStore } from "@/hooks/useStore";
import getAssetSource from "@articles-media/articles-dev-box/getAssetSource";
import { FLAPPY_PALETTES } from "./flappyPalette";

const SkyBox = memo(() => {
    const { scene } = useThree();
    const loader = useRef(new CubeTextureLoader()).current;
    const darkMode = useStore((state) => state.darkMode);
    const background = useStore((state) => state.character.background);

    useEffect(() => {
        if (background === "Flappy Bird") {
            scene.background = new Color(
                FLAPPY_PALETTES[darkMode ? "dark" : "light"].sky,
            );
            return () => {
                scene.background = null;
            };
        }
        const skyboxName = darkMode ? "Cold Night" : "Cartoon Base BlueSky";
        const skybox = defaultSkyboxes.find(({ name }) => name === skyboxName);
        const images = skybox.images.map((src) =>
            /^https?:\/\//.test(src)
                ? src
                : getAssetSource(src.replace(/^\/+/, "")),
        );
        const texture = loader.load(images);

        scene.background = texture;

        return () => {
            scene.background = null;
            texture.dispose();
        };
    }, [darkMode, background, loader, scene]);

    return null;
});

SkyBox.displayName = "SkyBox";

export default SkyBox;
