"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArticlesButton from "@/components/UI/Button";

export default function NotFound() {
    return (
        <Box sx={{ height: "100svh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <Box component="img" src="/img/icon.png" height={200} alt="Logo" />
            <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>404 - Page Not Found</Typography>
            <Typography component="p" sx={{ mb: 2 }}>Sorry, the page you are looking for does not exist.</Typography>
            <ArticlesButton component={Link} href="/">Return to Home</ArticlesButton>
        </Box>
    );
}
