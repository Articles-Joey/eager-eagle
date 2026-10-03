"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ArticlesModal from "./ArticlesModal";
import ArticlesButton from "./Button";
import { defaultCharacter, useStore } from "@/hooks/useStore";
import { useScoreStore } from "@/hooks/useScoreStore";

export default function ScoreCard() {
    const setCharacter = useStore((state) => state.setCharacter);
    const maxDistance = useScoreStore((state) => state.maxDistance);
    const setMaxDistance = useScoreStore((state) => state.setMaxDistance);
    const lifetimeDistance = useScoreStore((state) => state.lifetimeDistance);
    const setLifetimeDistance = useScoreStore((state) => state.setLifetimeDistance);
    const [confirmReset, setConfirmReset] = useState(false);

    return (
        <Card sx={{ width: "100%", bgcolor: "game.card", backgroundImage: "none", border: 1, borderColor: "divider", fontSize: "0.875rem" }}>
            <ArticlesModal
                show={confirmReset}
                setShow={setConfirmReset}
                title="Reset High Score?"
                size="sm"
                footerOverride={(setOpen) => (
                    <>
                        <ArticlesButton onClick={() => setOpen(false)}>Cancel</ArticlesButton>
                        <ArticlesButton variant="danger" onClick={() => {
                            setMaxDistance(0);
                            setLifetimeDistance(0);
                            setCharacter(defaultCharacter);
                            setOpen(false);
                        }}>Confirm</ArticlesButton>
                    </>
                )}
            >
                Are you sure you want to reset your high score? This will also reset your lifetime distance and unlocked rewards.
            </ArticlesModal>
            <Box sx={{ p: 1, borderBottom: 1, borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>High Score</Box>
                <ArticlesButton small aria-label="Reset high score" onClick={() => setConfirmReset(true)}><RestartAltIcon fontSize="small" /></ArticlesButton>
            </Box>
            <CardContent sx={{ p: 1, "&:last-child": { pb: 1 }, display: "flex", justifyContent: "space-between" }}>
                <Box component="span">{maxDistance}</Box>
                <Box component="span" sx={{ color: "text.secondary" }}>(lifetime: {lifetimeDistance})</Box>
            </CardContent>
        </Card>
    );
}
