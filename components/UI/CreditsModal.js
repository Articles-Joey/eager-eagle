"use client";

import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import GitHubIcon from "@mui/icons-material/GitHub";
import CloseIcon from "@mui/icons-material/Close";
import B from "@articles-media/articles-gamepad-helper/dist/img/Xbox UI/B.svg";
import { useModalNavigation } from "@/hooks/useModalNavigation";
import ArticlesModal from "./ArticlesModal";
import ArticlesButton from "./Button";

export default function CreditsModal({ show, setShow }) {
    const [showModal, setShowModal] = useState(true);
    const elementsRef = useRef([]);
    useModalNavigation(elementsRef, () => setShowModal(false));

    return (
        <ArticlesModal
            show={Boolean(show) && showModal}
            setShow={setShow}
            title="Credits"
            contentSx={{ p: "1rem" }}
            footerOverride={(setOpen) => (
                <>
                    <Box />
                    <ArticlesButton ref={(el) => { elementsRef.current[3] = el; }} variant="outline-dark" onClick={() => setOpen(false)}>
                        <CloseIcon className="no-controller-only" fontSize="small" sx={{ mr: 0.5 }} />
                        <Box component="img" src={B.src} className="controller-only" height={20} width={20} alt="Close" sx={{ mr: 0.5 }} />Close
                    </ArticlesButton>
                </>
            )}
        >
            <Box>Developed by: ArticlesJoey</Box>
            <Box>Published by: Articles Media</Box>
            <Box sx={{ mt: "1rem" }}>Attributions:</Box>
            <ArticlesButton component="a" href="https://github.com/Articles-Joey/race-game/blob/main/README.md" target="_blank" rel="noopener noreferrer" ref={(el) => { elementsRef.current[0] = el; }}>
                <GitHubIcon fontSize="small" sx={{ mr: 0.5 }} />View on GitHub
            </ArticlesButton>
        </ArticlesModal>
    );
}
