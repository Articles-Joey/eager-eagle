"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import classNames from "classnames";
import useFullscreen from "@articles-media/articles-dev-box/useFullscreen";
import GameMenu from "@articles-media/articles-dev-box/GameMenu";
import LeftPanelContent from "@/components/UI/LeftPanel";
import { useGameStore } from "@/hooks/useGameStore";
import { useStore } from "@/hooks/useStore";
import AudioHandler from "@/components/Game/AudioHandler";
import DiveButton from "@/components/UI/DiveButton";

const GameCanvas = dynamic(() => import("@/components/Game/GameCanvas"), { ssr: false });
const GameOverOverlay = dynamic(() => import("@/components/UI/GameOverOverlay"), { ssr: false });

export default function GamePage() {
    const distance = useGameStore((state) => state.distance);
    const sidebar = useStore((state) => state.sidebar);
    const showMenu = useStore((state) => state.showMenu);
    const sceneKey = useStore((state) => state.sceneKey);
    const gameOver = useGameStore((state) => state.gameOver);
    const { isFullscreen } = useFullscreen();

    return (
        <Box
            className={classNames("eager-eagle-game-page", { fullscreen: isFullscreen, "show-sidebar": sidebar, "menu-open": showMenu })}
            sx={{ position: "relative", display: "flex" }}
        >
            <AudioHandler />
            <GameMenu
                useStore={useStore}
                LeftPanelContent={LeftPanelContent}
                menuBarConfig={{ style: "Bar", menuBarButtonPosition: "Left" }}
                sidebarConfig={{ style: "Static Panel" }}
            />
            <Box className="canvas-wrap" sx={{
                position: "relative", width: "100vw", height: "100vh",
                "& canvas": { position: "absolute", width: "100%", height: "100%", left: 0, top: 0 },
            }}>
                {gameOver && <GameOverOverlay />}
                <Suspense><DiveButton /></Suspense>
                {!sidebar && (
                    <Box sx={{
                        position: "absolute", left: "50%", bottom: "calc(50px + 1rem)", transform: "translateX(-50%)", zIndex: 1,
                        bgcolor: "#000", color: "#fff", border: 1, borderColor: "divider", borderRadius: "0.375rem",
                        px: "0.65em", py: "0.35em", fontSize: "0.75em", fontWeight: 700, lineHeight: 1,
                    }}>Distance: {distance}</Box>
                )}
                <GameCanvas key={sceneKey} />
            </Box>
        </Box>
    );
}
