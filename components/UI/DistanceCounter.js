import Box from "@mui/material/Box";
import { useGameStore } from "@/hooks/useGameStore";

export default function DistanceCounter() {
    const distance = useGameStore((state) => state.distance);
    return (
        <Box
            sx={{
                position: "absolute",
                left: "50%",
                bottom: "calc(50px + 1rem)",
                transform: "translateX(-50%)",
                zIndex: 1,
                bgcolor: "#000",
                color: "#fff",
                border: 1,
                borderColor: "divider",
                borderRadius: "0.375rem",
                px: "0.65em",
                py: "0.35em",
                fontSize: "0.75em",
                fontWeight: 700,
                lineHeight: 1,
            }}
        >
            Distance: {distance}
        </Box>
    );
}
