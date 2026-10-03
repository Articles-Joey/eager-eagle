"use client";

import { useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PaletteIcon from "@mui/icons-material/Palette";
import RedeemIcon from "@mui/icons-material/Redeem";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoIcon from "@mui/icons-material/Info";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { GamepadKeyboard, PieMenu } from "@articles-media/articles-gamepad-helper";
import PageTemplateLandingPage from "@articles-media/articles-dev-box/PageTemplateLandingPage";
import ArticlesButton from "@/components/UI/Button";
import ScoreCard from "@/components/UI/ScoreCard";
import RotatingMascot from "@/components/UI/RotatingMascot";
import { useControllerStore } from "@/hooks/useControllerStore";
import { useStore } from "@/hooks/useStore";
import { useGameStore } from "@/hooks/useGameStore";
import { useScoreStore } from "@/hooks/useScoreStore";
import { useSocketStore } from "@/hooks/useSocketStore";
import { useLandingNavigation } from "@/hooks/useLandingNavigation";

const LandingBackgroundAnimation = dynamic(
    () => import("@/components/Game/LandingBackgroundAnimation"),
    { ssr: false },
);

export default function LobbyPage() {
    const darkMode = useStore((state) => state.darkMode);
    const lobbyDetails = useStore((state) => state.lobbyDetails);
    const nicknameKeyboard = useStore((state) => state.nicknameKeyboard);
    const setCustomizeModal = useStore((state) => state.setCustomizeModal);
    const setRewardsModal = useStore((state) => state.setRewardsModal);
    const setDistance = useGameStore((state) => state.setDistance);
    const setGameOver = useGameStore((state) => state.setGameOver);
    const maxDistance = useScoreStore((state) => state.maxDistance);
    const controllerState = useControllerStore((state) => state.controllerState);
    const hasController = controllerState?.buttons?.length > 0;
    const elementsRef = useRef([]);
    useLandingNavigation(elementsRef);

    useEffect(() => {
        setGameOver(false);
        setDistance(0);
    }, [setGameOver, setDistance]);

    const pieOptions = [
        { label: "Settings", Icon: SettingsIcon, callback: () => useStore.getState().setShowSettingsModal(true) },
        { label: "Go Back", Icon: ArrowBackIcon, callback: () => window.history.back() },
        { label: "Credits", Icon: InfoIcon, callback: () => useStore.getState().setShowCreditsModal(true) },
        { label: "Game Launcher", Icon: SportsEsportsIcon, callback: () => { window.location.href = "https://games.articles.media"; } },
        { label: `${darkMode ? "Light" : "Dark"} Mode`, Icon: PaletteIcon, callback: () => useStore.getState().toggleDarkMode() },
    ];

    return (
        <Box sx={{
            position: "relative",
            isolation: "isolate",
            "& .landing-page": {
                flexGrow: 1, display: "flex", justifyContent: "stretch", alignItems: "center",
                minHeight: "100vh", flexDirection: "column",
                "@media (min-width: 992px)": { flexDirection: "row" },
                "& h1": { textShadow: "0 0 5px #fff" },
            },
            "& .servers": { display: "grid", gap: "5px", gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
            "& .server": { p: "0.5rem", border: "1px solid rgba(0,0,0,0.25)", display: "flex", flexDirection: "column", alignItems: "center" },
            "& .scoreboard": { width: "100%", mt: "3rem", "@media (min-width: 992px)": { mt: 0 } },
            "& .ad-wrap": {
                mt: "1rem",
                "@media (min-width: 992px)": { mt: 0, mb: 0, display: "block", position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)" },
            },
            "& .game-scoreboard": {
                mt: "1rem",
                "@media (min-width: 992px)": { mt: 0, display: "block", position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" },
            },
            "& .landing-footer.hasController": {
                flexDirection: "column",
                "& > *": { display: "block", width: "100% !important", "& button": { width: "100% !important" } },
            },
            "& .background-wrap": {
                position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: -1,
                "& img": { filter: "blur(5px)", transform: "scale(1.1)" },
            },
        }}>
            <Suspense>
                <Box data-hide-in-screenshot-mode="true">
                    <GamepadKeyboard
                        disableToggle
                        active={nicknameKeyboard}
                        onFinish={(text) => {
                            useStore.getState().setNickname(text);
                            useStore.getState().setNicknameKeyboard(false);
                        }}
                        onCancel={() => useStore.getState().setNicknameKeyboard(false)}
                    />
                    <PieMenu
                        options={pieOptions.map(({ label, Icon, callback }) => ({
                            label: <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}><Icon fontSize="small" />{label}</Box>,
                            callback,
                        }))}
                        onFinish={(event) => event.callback?.()}
                    />
                </Box>
            </Suspense>
            <PageTemplateLandingPage
                useSocketStore={useSocketStore}
                useStore={useStore}
                RotatingMascot={RotatingMascot}
                Link={Link}
                useRouter={useRouter}
                LandingBackgroundAnimation={<LandingBackgroundAnimation />}
                CardBodyOverride={
                    <Box sx={{ p: "1rem" }}>
                        {process.env.NEXT_PUBLIC_ENABLE_ARTICLES === "true" && (
                            <Box sx={{ fontWeight: 700, mb: "0.25rem", fontSize: "0.875em", textAlign: "center" }}>
                                {lobbyDetails?.online_player_count || 0} player{lobbyDetails?.online_player_count !== 1 && "s"} online.
                            </Box>
                        )}
                        <ArticlesButton component={Link} href="/play" prefetch={false} ref={(el) => { elementsRef.current[0] = el; }} sx={{ px: "3rem", width: "100%", mb: "0.5rem" }}>
                            <PlayArrowIcon fontSize="small" sx={{ mr: 1 }} />Play Game
                        </ArticlesButton>
                        <Box sx={{ display: "flex", flexDirection: hasController ? "column" : "row" }}>
                            <ArticlesButton ref={(el) => { elementsRef.current[2] = el; }} sx={{ width: hasController ? "100%" : "50%" }} small onClick={() => setCustomizeModal(true)}>
                                <PaletteIcon fontSize="small" sx={{ mr: 0.5 }} />Customize
                            </ArticlesButton>
                            <ArticlesButton ref={(el) => { elementsRef.current[3] = el; }} sx={{ width: hasController ? "100%" : "50%" }} small onClick={() => setRewardsModal(true)}>
                                <RedeemIcon fontSize="small" sx={{ mr: 0.5 }} />Rewards
                            </ArticlesButton>
                        </Box>
                    </Box>
                }
                PostHeroContent={maxDistance ? <Box sx={{ mb: "1rem", display: "flex", alignItems: "stretch", width: "100%" }}><ScoreCard /></Box> : null}
                heroOverride={
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <Box component="img" src="/img/icon.png" height={200} alt="Logo" />
                        <Typography component="h1" variant="h3" sx={{ fontFamily: '"Metal Mania", system-ui', fontWeight: 400, fontStyle: "normal", mb: "1.5rem", textAlign: "center" }}>
                            {process.env.NEXT_PUBLIC_GAME_NAME}
                        </Typography>
                    </Box>
                }
                backgroundImage={darkMode ? "/img/dark-preview.webp" : "/img/preview.webp"}
                singlePlayerConfig={{}}
                NicknameInputConfig={{ PreComponent: <></> }}
                multiplayerConfig={{}}
                gameScoreboardConfig={{
                    append_score_text: "m",
                    metrics: [
                        { label: "Max Distance", key: "score", format: (value) => `${value} m` },
                        { label: "Distance Traveled", key: "total_distance", format: (value) => `${value} m` },
                    ],
                }}
                disableGameScoreboard={process.env.NEXT_PUBLIC_ENABLE_ARTICLES !== "true"}
                disableAd={process.env.NEXT_PUBLIC_ENABLE_ARTICLES !== "true"}
            />
        </Box>
    );
}
