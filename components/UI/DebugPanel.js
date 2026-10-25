"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FlightIcon from "@mui/icons-material/Flight";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import BugReportIcon from "@mui/icons-material/BugReport";
import PaletteIcon from "@mui/icons-material/Palette";
import ArticlesButton from "./Button";
import { useStore } from "@/hooks/useStore";
import { useScoreStore } from "@/hooks/useScoreStore";
import { useGameStore } from "@/hooks/useGameStore";

export default function DebugPanel({ reloadScene }) {
    const [teleportAnchor, setTeleportAnchor] = useState(null);
    const setDistance = useGameStore((state) => state.setDistance);
    const debug = useStore((state) => state.debug);
    const toggleDebug = useStore((state) => state.toggleDebug);
    const toggleDisableDeath = useStore((state) => state.toggleDisableDeath);
    const disableDeath = useStore((state) => state.disableDeath);
    const setCustomizeModal = useStore((state) => state.setCustomizeModal);
    const setMaxDistance = useScoreStore((state) => state.setMaxDistance);
    const setLifetimeDistance = useScoreStore(
        (state) => state.setLifetimeDistance,
    );

    return (
        <Card
            sx={{
                bgcolor: "game.card",
                backgroundImage: "none",
                border: 1,
                borderColor: "divider",
                borderRadius: 0,
            }}
        >
            <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                <Box sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
                    Debug Controls
                </Box>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    }}
                >
                    <ArticlesButton
                        small
                        onClick={reloadScene}
                    >
                        <RestartAltIcon
                            fontSize="small"
                            sx={{ mr: 0.5 }}
                        />
                        Reload Game
                    </ArticlesButton>
                    <ArticlesButton
                        small
                        onClick={reloadScene}
                    >
                        <RestartAltIcon
                            fontSize="small"
                            sx={{ mr: 0.5 }}
                        />
                        Reset Camera
                    </ArticlesButton>
                    <ArticlesButton
                        small
                        onClick={toggleDisableDeath}
                    >
                        <RestartAltIcon
                            fontSize="small"
                            sx={{ mr: 0.5 }}
                        />
                        {disableDeath ? "Enable" : "Disable"} Death
                    </ArticlesButton>
                    <ArticlesButton
                        small
                        disabled
                    >
                        <CameraAltIcon
                            fontSize="small"
                            sx={{ mr: 0.5 }}
                        />
                        Camera
                    </ArticlesButton>
                    <ArticlesButton
                        small
                        onClick={toggleDebug}
                    >
                        <BugReportIcon
                            fontSize="small"
                            sx={{ mr: 0.5 }}
                        />
                        Debug: {debug ? "True" : "Disable"}
                    </ArticlesButton>
                    <ArticlesButton
                        small
                        onClick={() => {
                            setMaxDistance(9999);
                            setLifetimeDistance(9999);
                        }}
                    >
                        <BugReportIcon
                            fontSize="small"
                            sx={{ mr: 0.5 }}
                        />
                        Give Max
                    </ArticlesButton>
                    <ArticlesButton
                        small
                        id="teleport-button"
                        aria-controls={
                            teleportAnchor ? "teleport-menu" : undefined
                        }
                        aria-haspopup="menu"
                        aria-expanded={teleportAnchor ? "true" : undefined}
                        onClick={(event) =>
                            setTeleportAnchor(event.currentTarget)
                        }
                    >
                        <FlightIcon
                            fontSize="small"
                            sx={{ mr: 0.5 }}
                        />
                        Teleport
                        <ArrowDropDownIcon fontSize="small" />
                    </ArticlesButton>
                    <Menu
                        id="teleport-menu"
                        anchorEl={teleportAnchor}
                        open={Boolean(teleportAnchor)}
                        onClose={() => setTeleportAnchor(null)}
                        MenuListProps={{ "aria-labelledby": "teleport-button" }}
                    >
                        {[20, 40, 60, 80, 100, 150, 200].map((distance) => (
                            <MenuItem
                                key={distance}
                                onClick={() => {
                                    setDistance(distance);
                                    setTeleportAnchor(null);
                                }}
                            >
                                {distance}
                            </MenuItem>
                        ))}
                    </Menu>
                    <ArticlesButton
                        small
                        onClick={() => setCustomizeModal(true)}
                    >
                        <PaletteIcon
                            fontSize="small"
                            sx={{ mr: 0.5 }}
                        />
                        Customize
                    </ArticlesButton>
                </Box>
            </CardContent>
        </Card>
    );
}
