"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import PaletteIcon from "@mui/icons-material/Palette";
import RedeemIcon from "@mui/icons-material/Redeem";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useHotkeys } from "react-hotkeys-hook";
import A from "@articles-media/articles-gamepad-helper/dist/img/Xbox UI/A.svg";
import B from "@articles-media/articles-gamepad-helper/dist/img/Xbox UI/B.svg";
import ArticlesButton from "./Button";
import { useGameStore } from "@/hooks/useGameStore";
import { useStore } from "@/hooks/useStore";
import { useScoreStore } from "@/hooks/useScoreStore";

export default function GameOverOverlay() {
    const router = useRouter();
    const setGameOver = useGameStore((state) => state.setGameOver);
    const distance = useGameStore((state) => state.distance);
    const setDistance = useGameStore((state) => state.setDistance);
    const maxDistance = useScoreStore((state) => state.maxDistance);
    const setShowMenu = useStore((state) => state.setShowMenu);
    const setCustomizeModal = useStore((state) => state.setCustomizeModal);
    const setRewardsModal = useStore((state) => state.setRewardsModal);

    const handleRestart = () => {
        setDistance(0);
        setGameOver(false);
    };
    useHotkeys("space", handleRestart);

    return (
        <Box sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Card sx={{ width: "100%", maxWidth: 400, bgcolor: "game.card", backgroundImage: "none", border: 1, borderColor: "divider" }}>
                <Box sx={{ p: "0.5rem 1rem", borderBottom: 1, borderColor: "divider" }}><Typography variant="h5" component="h3">You Crashed!</Typography></Box>
                <CardContent sx={{ p: "1rem" }}>
                    <Box sx={{ my: "0.5rem" }}>
                        <Typography variant="h6">Score: {distance}</Typography>
                        <Typography variant="h6" sx={{ color: "text.secondary" }}>Best: {maxDistance}</Typography>
                    </Box>
                    <Box sx={{ my: "1.5rem", display: "flex" }}>
                        <ArticlesButton sx={{ width: "50%", mt: "0.5rem" }} onClick={() => { router.push("/"); setCustomizeModal(true); }}><PaletteIcon fontSize="small" sx={{ mr: 0.5 }} />Customize</ArticlesButton>
                        <ArticlesButton sx={{ width: "50%", mt: "0.5rem" }} onClick={() => { router.push("/"); setRewardsModal(true); }}><RedeemIcon fontSize="small" sx={{ mr: 0.5 }} />View Rewards</ArticlesButton>
                    </Box>
                </CardContent>
                <Box sx={{ p: "0.5rem 1rem", borderTop: 1, borderColor: "divider", display: "flex" }}>
                    <ArticlesButton component={Link} href="/" sx={{ width: "50%" }} onClick={() => { handleRestart(); setShowMenu(false); }}>
                        <CloseIcon className="no-controller-only" fontSize="small" sx={{ mr: 0.5 }} />
                        <Box component="img" className="controller-only" height={20} width={20} src={B.src} alt="Exit" sx={{ mr: 1 }} />Exit
                    </ArticlesButton>
                    <ArticlesButton sx={{ width: "50%" }} onClick={handleRestart}>
                        <RestartAltIcon className="no-controller-only" fontSize="small" sx={{ mr: 0.5 }} />
                        <Box component="img" className="controller-only" height={20} width={20} src={A.src} alt="Play again" sx={{ mr: 1 }} />Play Again (Space)
                    </ArticlesButton>
                </Box>
            </Card>
        </Box>
    );
}
