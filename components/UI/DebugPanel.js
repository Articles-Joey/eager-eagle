"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import BugReportIcon from "@mui/icons-material/BugReport";
import ArticlesButton from "./Button";
import { useStore } from "@/hooks/useStore";
import { useScoreStore } from "@/hooks/useScoreStore";

export default function DebugPanel({ reloadScene }) {
    const debug = useStore((state) => state.debug);
    const toggleDebug = useStore((state) => state.toggleDebug);
    const toggleDisableDeath = useStore((state) => state.toggleDisableDeath);
    const disableDeath = useStore((state) => state.disableDeath);
    const setMaxDistance = useScoreStore((state) => state.setMaxDistance);
    const setLifetimeDistance = useScoreStore((state) => state.setLifetimeDistance);

    return (
        <Card sx={{ bgcolor: "game.card", backgroundImage: "none", border: 1, borderColor: "divider", borderRadius: 0 }}>
            <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                <Box sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Debug Controls</Box>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
                    <ArticlesButton small onClick={reloadScene}><RestartAltIcon fontSize="small" sx={{ mr: 0.5 }} />Reload Game</ArticlesButton>
                    <ArticlesButton small onClick={reloadScene}><RestartAltIcon fontSize="small" sx={{ mr: 0.5 }} />Reset Camera</ArticlesButton>
                    <ArticlesButton small onClick={toggleDisableDeath}><RestartAltIcon fontSize="small" sx={{ mr: 0.5 }} />{disableDeath ? "Enable" : "Disable"} Death</ArticlesButton>
                    <ArticlesButton small disabled><CameraAltIcon fontSize="small" sx={{ mr: 0.5 }} />Camera</ArticlesButton>
                    <ArticlesButton small onClick={toggleDebug}><BugReportIcon fontSize="small" sx={{ mr: 0.5 }} />Debug: {debug ? "True" : "Disable"}</ArticlesButton>
                    <ArticlesButton small onClick={() => { setMaxDistance(9999); setLifetimeDistance(9999); }}><BugReportIcon fontSize="small" sx={{ mr: 0.5 }} />Give Max</ArticlesButton>
                </Box>
            </CardContent>
        </Card>
    );
}
