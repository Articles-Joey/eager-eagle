"use client";

import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import GameMenuPrimaryButtonGroup from "@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup";
import { useGameStore } from "@/hooks/useGameStore";
import { useStore } from "@/hooks/useStore";
import { useScoreStore } from "@/hooks/useScoreStore";
import DebugPanel from "./DebugPanel";

const cardSx = { bgcolor: "game.card", backgroundImage: "none", fontSize: "0.875rem", border: 1, borderColor: "divider", borderRadius: 0 };

export default function LeftPanelContent() {
    const reloadScene = useStore((state) => state.reloadScene);
    const debug = useStore((state) => state.debug);

    return (
        <Box sx={{ width: "100%" }}>
            <Card sx={cardSx}>
                <CardContent sx={{ p: 1, "&:last-child": { pb: 1 }, display: "flex", flexWrap: "wrap" }}>
                    <GameMenuPrimaryButtonGroup useStore={useStore} type="GameMenu" useRouter={useRouter} />
                </CardContent>
            </Card>
            <DistanceCard />
            {debug && <DebugPanel reloadScene={reloadScene} />}
        </Box>
    );
}

function DistanceCard() {
    const distance = useGameStore((state) => state.distance);
    const maxDistance = useScoreStore((state) => state.maxDistance);
    const lifetimeDistance = useScoreStore((state) => state.lifetimeDistance);

    return (
        <Card sx={cardSx}>
            <CardContent sx={{ p: 1, "&:last-child": { pb: 1 }, display: "flex", justifyContent: "space-between", alignItems: "center", color: "text.secondary" }}>
                <Box>Distance: {distance}</Box>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", mr: "0.5rem" }}>
                    <Box>Max Distance: {maxDistance}</Box>
                    <Box>Lifetime Distance: {lifetimeDistance}</Box>
                </Box>
            </CardContent>
        </Card>
    );
}
