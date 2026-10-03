"use client";

import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";
import LockIcon from "@mui/icons-material/Lock";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CloseIcon from "@mui/icons-material/Close";
import B from "@articles-media/articles-gamepad-helper/dist/img/Xbox UI/B.svg";
import Y from "@articles-media/articles-gamepad-helper/dist/img/Xbox UI/Y.svg";
import ArticlesModal from "./ArticlesModal";
import ArticlesButton from "./Button";
import ScenePreview from "../Game/ScenePreview";
import { useModalNavigation } from "@/hooks/useModalNavigation";
import { defaultCharacter, useStore } from "@/hooks/useStore";
import { useScoreStore } from "@/hooks/useScoreStore";

const customizationOptions = [
    { label: "Player", keyName: "model", rewardsKey: "models" },
    { label: "Trail", keyName: "trail", rewardsKey: "trails" },
    { label: "Ground Object", keyName: "groundObject", rewardsKey: "groundObjects" },
    { label: "Sky Object", keyName: "skyObject", rewardsKey: "skyObjects" },
    { label: "Background", keyName: "background", rewardsKey: "backgrounds" },
];

export default function CustomizeModal({ show, setShow }) {
    const [showModal, setShowModal] = useState(true);
    const [openSelect, setOpenSelect] = useState(null);
    const elementsRef = useRef([]);
    const menuElementsRef = useRef([]);
    useModalNavigation(openSelect ? menuElementsRef : elementsRef, () => {
        if (openSelect) setOpenSelect(null);
        else setShowModal(false);
    });
    const character = useStore((state) => state.character);
    const setCharacter = useStore((state) => state.setCharacter);
    const maxDistance = useScoreStore((state) => state.maxDistance);
    const lifetimeDistance = useScoreStore((state) => state.lifetimeDistance);

    return (
        <ArticlesModal
            show={Boolean(show) && showModal}
            setShow={setShow}
            title="Customize Game"
            size="lg"
            contentSx={{
                minHeight: 500, display: "flex", flexDirection: "column", p: "1rem",
                "@media (min-width: 992px)": { flexDirection: "row" },
            }}
            footerOverride={(setOpen) => (
                <>
                    <ArticlesButton ref={(el) => { elementsRef.current[5] = el; }} variant="danger" onClick={() => setCharacter(defaultCharacter)}>
                        <RestartAltIcon className="no-controller-only" fontSize="small" sx={{ mr: 0.5 }} />
                        <Box component="img" src={Y.src} className="controller-only" height={20} width={20} alt="Reset" sx={{ mr: 0.5 }} />Reset
                    </ArticlesButton>
                    <ArticlesButton ref={(el) => { elementsRef.current[6] = el; }} variant="outline-dark" onClick={() => setOpen(false)}>
                        <CloseIcon className="no-controller-only" fontSize="small" sx={{ mr: 0.5 }} />
                        <Box component="img" src={B.src} className="controller-only" height={20} width={20} alt="Close" sx={{ mr: 0.5 }} />Close
                    </ArticlesButton>
                </>
            )}
        >
            <Box sx={{
                bgcolor: "#000", aspectRatio: "1 / 1", width: "100%", mb: "1rem", flexShrink: 0,
                "@media (min-width: 992px)": { width: 300, height: 300, mb: 0 },
            }}><ScenePreview /></Box>
            <Box sx={{ display: "flex", flexDirection: "column", width: "100%", minWidth: 0, "@media (min-width: 992px)": { ml: "1rem" } }}>
                <Box sx={{ display: "flex", justifyContent: "center", textAlign: "center", mb: "1rem" }}>
                    <Box sx={{ px: "1rem" }}><Typography variant="h5">{maxDistance}</Typography><Box>max distance</Box></Box>
                    <Box sx={{ px: "1rem" }}><Typography variant="h5">{lifetimeDistance}</Typography><Box>lifetime distance</Box></Box>
                </Box>
                {customizationOptions.map(({ label, keyName, rewardsKey }, index) => (
                    <FormControl key={keyName} fullWidth size="small" sx={{ mb: "1rem" }}>
                        <InputLabel id={`customize-${keyName}-label`}>{label}</InputLabel>
                        <Select
                            labelId={`customize-${keyName}-label`}
                            label={label}
                            value={character[keyName]}
                            open={openSelect === keyName}
                            onOpen={() => setOpenSelect(keyName)}
                            onClose={() => setOpenSelect(null)}
                            SelectDisplayProps={{ onClick: () => setOpenSelect(keyName) }}
                            inputRef={(el) => {
                                elementsRef.current[index] = el?.node?.parentElement?.querySelector('[role="combobox"]') || null;
                            }}
                            onChange={(event) => {
                                setCharacter({ ...character, [keyName]: event.target.value });
                                setOpenSelect(null);
                            }}
                            renderValue={(value) => `${label}: ${value}`}
                            MenuProps={{ slotProps: { paper: { sx: { maxHeight: 600 } } } }}
                        >
                            {defaultCharacter[rewardsKey].map((reward, rewardIndex) => {
                                const isUnlocked = maxDistance >= reward.distance || lifetimeDistance >= reward.lifetimeDistance || reward.distance === 0;
                                return (
                                    <MenuItem key={reward.name} value={reward.name} disabled={!isUnlocked} ref={(el) => { menuElementsRef.current[rewardIndex] = el; }} sx={{ display: "flex", justifyContent: "space-between", gap: 2, "&.Mui-disabled": { opacity: 0.5 } }}>
                                        {isUnlocked ? <CheckIcon fontSize="small" /> : <LockIcon fontSize="small" />}
                                        <Box sx={{ textAlign: "right" }}>
                                            <Box>{reward.name}</Box>
                                            <Box sx={{ color: "text.secondary", fontSize: "0.875em" }}>
                                                {reward.distance > 0 && <Box>{reward.distance} Distance</Box>}
                                                {reward.lifetimeDistance > 0 && <Box>{reward.lifetimeDistance} Lifetime</Box>}
                                            </Box>
                                        </Box>
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                ))}
            </Box>
        </ArticlesModal>
    );
}
