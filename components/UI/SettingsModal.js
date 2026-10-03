"use client";

import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import B from "@articles-media/articles-gamepad-helper/dist/img/Xbox UI/B.svg";
import Y from "@articles-media/articles-gamepad-helper/dist/img/Xbox UI/Y.svg";
import ArticlesModal from "./ArticlesModal";
import ArticlesButton from "./Button";
import { useStore } from "@/hooks/useStore";
import { useAudioStore } from "@/hooks/useAudioStore";
import { useModalNavigation } from "@/hooks/useModalNavigation";

export default function SettingsModal({ show, setShow }) {
    const [showModal, setShowModal] = useState(true);
    const [tab, setTab] = useState("Graphics");
    const elementsRef = useRef([]);
    useModalNavigation(elementsRef, () => setShowModal(false));

    return (
        <ArticlesModal
            show={Boolean(show) && showModal}
            setShow={setShow}
            title="Game Settings"
            centered={false}
            contentSx={{ p: 0 }}
            footerOverride={(setOpen) => (
                <>
                    <ArticlesButton variant="outline-danger" onClick={() => setOpen(false)}>
                        <RestartAltIcon className="no-controller-only" fontSize="small" sx={{ mr: 0.5 }} />
                        <Box component="img" src={Y.src} className="controller-only" height={20} width={20} alt="Reset" sx={{ mr: 0.5 }} />Reset
                    </ArticlesButton>
                    <ArticlesButton variant="outline-dark" onClick={() => setOpen(false)}>
                        <CloseIcon className="no-controller-only" fontSize="small" sx={{ mr: 0.5 }} />
                        <Box component="img" src={B.src} className="controller-only" height={20} width={20} alt="Close" sx={{ mr: 0.5 }} />Close
                    </ArticlesButton>
                </>
            )}
        >
            <Box sx={{ p: "0.5rem" }}>
                {["Graphics", "Controls", "Audio"].map((item, index) => (
                    <ArticlesButton key={item} ref={(el) => { elementsRef.current[index] = el; }} active={tab === item} onClick={() => setTab(item)}>{item}</ArticlesButton>
                ))}
            </Box>
            <Divider />
            <Box sx={{ p: "0.5rem" }}>
                {tab === "Graphics" && <GraphicsSettings />}
                {tab === "Controls" && <ControlsSettings />}
                {tab === "Audio" && <AudioSettings />}
            </Box>
        </ArticlesModal>
    );
}

function GraphicsSettings() {
    const darkMode = useStore((state) => state.darkMode);
    const setDarkMode = useStore((state) => state.setDarkMode);
    const debug = useStore((state) => state.debug);
    const setDebug = useStore((state) => state.setDebug);
    const graphicsQuality = useStore((state) => state.graphicsQuality);
    const setGraphicsQuality = useStore((state) => state.setGraphicsQuality);

    return (
        <>
            <Box>Color Mode</Box>
            <Box sx={{ mb: "1rem" }}>
                <ArticlesButton active={darkMode} onClick={() => setDarkMode(true)}>Dark Mode</ArticlesButton>
                <ArticlesButton active={!darkMode} onClick={() => setDarkMode(false)}>Light Mode</ArticlesButton>
            </Box>
            <Box>Debug Mode</Box>
            <Box sx={{ mb: "1rem" }}>
                <ArticlesButton active={!debug} onClick={() => setDebug(false)}>Disabled</ArticlesButton>
                <ArticlesButton active={debug} onClick={() => setDebug(true)}>Enabled</ArticlesButton>
            </Box>
            <Box sx={{ mb: "1rem" }}>
                <Box>Graphics Quality</Box>
                {["Low", "Medium", "High"].map((level) => <ArticlesButton key={level} active={graphicsQuality === level} onClick={() => setGraphicsQuality(level)}>{level}</ArticlesButton>)}
            </Box>
        </>
    );
}

function AudioSettings() {
    const setAudioSettings = useAudioStore((state) => state.setAudioSettings);
    const audioSettings = useAudioStore((state) => state.audioSettings);

    return (
        <>
            <Box>Game Audio</Box>
            <Box sx={{ mb: "1rem" }}>
                <ArticlesButton active={!audioSettings.enabled} onClick={() => setAudioSettings({ ...audioSettings, enabled: false })}>Disabled</ArticlesButton>
                <ArticlesButton active={audioSettings.enabled} onClick={() => setAudioSettings({ ...audioSettings, enabled: true })}>Enabled</ArticlesButton>
            </Box>
            {[
                { key: "game_volume", label: "Game Volume" },
                { key: "music_volume", label: "Music Volume" },
            ].map(({ key, label }) => (
                <Box key={key}>
                    <Typography id={`audio-${key}-label`}>{label} - {audioSettings?.[key]}</Typography>
                    <Slider aria-labelledby={`audio-${key}-label`} min={0} max={100} value={audioSettings?.[key] ?? 0} onChange={(_, value) => setAudioSettings({ ...audioSettings, [key]: value })} />
                </Box>
            ))}
        </>
    );
}

function ControlsSettings() {
    return (
        <Box>
            {[
                { action: "Jump", defaultKeyboardKey: "Space" },
                { action: "Dive", defaultKeyboardKey: "Shift" },
                { action: "Use Item", defaultKeyboardKey: "Enter" },
            ].map(({ action, defaultKeyboardKey }) => (
                <Box key={action} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: 1, borderColor: "divider", pb: "0.25rem", mb: "0.25rem" }}>
                    <Box>{action}</Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box component="span" sx={{ border: 1, borderColor: "divider", bgcolor: "primary.main", color: "primary.contrastText", mr: "0.25rem", px: "0.65em", py: "0.35em", fontSize: "0.75em", fontWeight: 700, borderRadius: "0.375rem" }}>{defaultKeyboardKey}</Box>
                        <ArticlesButton small>Change Key</ArticlesButton>
                    </Box>
                </Box>
            ))}
        </Box>
    );
}
