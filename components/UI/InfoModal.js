"use client";

import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import B from "@articles-media/articles-gamepad-helper/dist/img/Xbox UI/B.svg";
import packageInfo from "@/package.json";
import { useModalNavigation } from "@/hooks/useModalNavigation";
import ArticlesModal from "./ArticlesModal";
import ArticlesButton from "./Button";

export default function GameInfoModal({ show, setShow }) {
    const [showModal, setShowModal] = useState(true);
    const elementsRef = useRef([]);
    useModalNavigation(elementsRef, () => setShowModal(false));

    return (
        <ArticlesModal
            show={Boolean(show) && showModal}
            setShow={setShow}
            title="Game Info"
            contentSx={{ p: "1rem" }}
            footerOverride={(setOpen) => (
                <>
                    <Box />
                    <ArticlesButton ref={(el) => { elementsRef.current[0] = el; }} variant="outline-dark" onClick={() => setOpen(false)}>
                        <CloseIcon className="no-controller-only" fontSize="small" sx={{ mr: 0.5 }} />
                        <Box component="img" src={B.src} className="controller-only" height={20} width={20} alt="Close" sx={{ mr: 0.5 }} />Close
                    </ArticlesButton>
                </>
            )}
        >
            <Box component="img" src="/img/preview.webp" alt="Eager Eagle preview" sx={{ width: "100%", aspectRatio: "16 / 9", border: 2, borderColor: "divider", mb: "1rem", objectFit: "cover" }} />
            <Box sx={{ mb: "1rem" }}>{packageInfo.description}</Box>
            <Box sx={{ fontSize: "0.875em", color: "text.secondary" }}>Version: {packageInfo.version}</Box>
        </ArticlesModal>
    );
}
