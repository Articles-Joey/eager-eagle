"use client";

import { useSearchParams } from "next/navigation";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import ArticlesButton from "./Button";

export default function ReturnToLauncherButton() {
    const searchParams = useSearchParams();
    if (searchParams.get("launcher_mode") !== "1") return null;

    return (
        <ArticlesButton small sx={{ width: "100%", zIndex: 10, position: "relative" }} onClick={() => { window.location.href = "https://games.articles.media"; }}>
            <SportsEsportsIcon fontSize="small" sx={{ mr: 0.5 }} />Return to Games
        </ArticlesButton>
    );
}
