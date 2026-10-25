"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArticlesButton from "./Button";
import { useScoreStore } from "@/hooks/useScoreStore";

const views = {
    recentDistances: "Recent Scores",
    maxDistances: "Max Distances",
};

export default function LocalScoreboard() {
    const [view, setView] = useState("recentDistances");
    const [anchor, setAnchor] = useState(null);
    const [mounted, setMounted] = useState(false);
    const hasHydrated = useScoreStore((state) => state._hasHydrated);
    const scores = useScoreStore((state) => state[view]);
    const ready = mounted && hasHydrated;

    useEffect(() => setMounted(true), []);

    return (
        <Box>
            <Box sx={{ p: 1 }}>
                <ArticlesButton
                    small
                    id="score-history-button"
                    sx={{ width: "100%" }}
                    aria-controls={anchor ? "score-history-menu" : undefined}
                    aria-haspopup="menu"
                    aria-expanded={anchor ? "true" : undefined}
                    onClick={(event) => setAnchor(event.currentTarget)}
                >
                    {views[view]}
                    <ArrowDropDownIcon fontSize="small" />
                </ArticlesButton>
                <Menu
                    id="score-history-menu"
                    anchorEl={anchor}
                    open={Boolean(anchor)}
                    onClose={() => setAnchor(null)}
                    MenuListProps={{
                        "aria-labelledby": "score-history-button",
                    }}
                >
                    {Object.entries(views).map(([key, label]) => (
                        <MenuItem
                            key={key}
                            selected={view === key}
                            onClick={() => {
                                setView(key);
                                setAnchor(null);
                            }}
                        >
                            {label}
                        </MenuItem>
                    ))}
                </Menu>
            </Box>
            {!ready || scores.length === 0 ? (
                <Typography
                    variant="body2"
                    sx={{ p: 2, color: "text.secondary" }}
                >
                    {ready ? "No completed runs yet." : "Loading scores..."}
                </Typography>
            ) : (
                <TableContainer sx={{ maxHeight: 340 }}>
                    <Table
                        stickyHeader
                        size="small"
                        aria-label={views[view]}
                        sx={{
                            tableLayout: "fixed",
                            "& th, & td": { px: 1, fontSize: "0.75rem" },
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: "36%" }}>
                                    Nickname
                                </TableCell>
                                <TableCell sx={{ width: "38%" }}>
                                    Date
                                </TableCell>
                                <TableCell
                                    align="right"
                                    sx={{ width: "26%" }}
                                >
                                    Distance
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {scores.map((score, index) => (
                                <TableRow key={`${score.date}-${index}`}>
                                    <TableCell
                                        sx={{ overflowWrap: "anywhere" }}
                                    >
                                        {score.nickname}
                                    </TableCell>
                                    <TableCell sx={{ color: "text.secondary" }}>
                                        <Box
                                            component="time"
                                            dateTime={score.date}
                                            title={new Date(
                                                score.date,
                                            ).toLocaleString()}
                                            sx={{
                                                display: "block",
                                                fontSize: "0.6875rem",
                                                lineHeight: 1.15,
                                            }}
                                        >
                                            <Box
                                                component="span"
                                                sx={{ display: "block" }}
                                            >
                                                {new Date(
                                                    score.date,
                                                ).toLocaleDateString(
                                                    undefined,
                                                    {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    },
                                                )}
                                            </Box>
                                            <Box
                                                component="span"
                                                sx={{ display: "block" }}
                                            >
                                                {new Date(
                                                    score.date,
                                                ).toLocaleTimeString(
                                                    undefined,
                                                    {
                                                        hour: "numeric",
                                                        minute: "2-digit",
                                                    },
                                                )}
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        {score.distance}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}
