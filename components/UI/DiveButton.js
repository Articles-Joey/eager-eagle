"use client";

import IconButton from "@mui/material/IconButton";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useScoreStore } from "@/hooks/useScoreStore";
import { useStore } from "@/hooks/useStore";
import useTouchControlsStore from "@/hooks/useTouchControlsStore";

export default function DiveButton() {
    const hasHydrated = useStore((state) => state._hasHydrated);
    const enabled = useTouchControlsStore((state) => state.enabled);
    const setIsDiving = useStore((state) => state.setIsDiving);
    const lifetimeDistance = useScoreStore((state) => state.lifetimeDistance);
    const maxDistance = useScoreStore((state) => state.maxDistance);

    if (!hasHydrated || !enabled || !(lifetimeDistance > 40 || maxDistance > 10)) return null;

    return (
        <IconButton
            aria-label="Dive"
            onMouseDown={() => setIsDiving(true)}
            onMouseUp={() => setIsDiving(false)}
            onMouseLeave={() => setIsDiving(false)}
            onTouchStart={() => setIsDiving(true)}
            onTouchEnd={() => setIsDiving(false)}
            onTouchCancel={() => setIsDiving(false)}
            sx={{
                position: "absolute", right: "calc(50px + 1rem)", bottom: "calc(50px + 1rem)", zIndex: 1,
                bgcolor: "rgba(0,0,0,0.75)", border: "none", color: "#fff", width: 100, height: 100,
                opacity: 0.8, borderRadius: "25px", display: "flex", justifyContent: "center", alignItems: "center",
                "&:hover": { opacity: 1, bgcolor: "rgba(0,0,0,0.75)" },
            }}
        >
            <ArrowDownwardIcon />
        </IconButton>
    );
}
