"use client";

import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import B from "@articles-media/articles-gamepad-helper/dist/img/Xbox UI/B.svg";
import ArticlesModal from "./ArticlesModal";
import ArticlesButton from "./Button";
import { useModalNavigation } from "@/hooks/useModalNavigation";
import { defaultCharacter } from "@/hooks/useStore";
import { useScoreStore } from "@/hooks/useScoreStore";

const rewards = [
    { name: "Diving", description: "Unlock the ability to dive swiftly and navigate through tight spaces with precision.", distance: 20, lifetimeDistance: 20 * 5 },
    { name: "Armor Plating", description: "No longer die from collisions on the top and bottom of ground and sky obstacles. Watch out because you will bounce off!", distance: 200 },
    ...defaultCharacter.models.map((reward) => ({ ...reward, name: `${reward.name} Player Model` })),
    ...defaultCharacter.trails.map((reward) => ({ ...reward, name: `${reward.name} Trail` })),
    ...defaultCharacter.backgrounds.map((reward) => ({ ...reward, name: `${reward.name} Background` })),
    ...defaultCharacter.skyObjects.map((reward) => ({ ...reward, name: `${reward.name} Sky Object` })),
    ...defaultCharacter.groundObjects.map((reward) => ({ ...reward, name: `${reward.name} Ground Object` })),
];

export default function RewardsModal({ show, setShow }) {
    const maxDistance = useScoreStore((state) => state.maxDistance);
    const lifetimeDistance = useScoreStore((state) => state.lifetimeDistance);
    const [showModal, setShowModal] = useState(true);
    const elementsRef = useRef([]);
    useModalNavigation(elementsRef, () => setShowModal(false));

    return (
        <ArticlesModal
            show={Boolean(show) && showModal}
            setShow={setShow}
            title="Distance Rewards"
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
            <Box sx={{ display: "flex", justifyContent: "center", textAlign: "center", mb: "1rem" }}>
                <Box sx={{ px: "1rem" }}><Typography variant="h5">{maxDistance}</Typography><Box>max distance</Box></Box>
                <Box sx={{ px: "1rem" }}><Typography variant="h5">{lifetimeDistance}</Typography><Box>lifetime distance</Box></Box>
            </Box>
            {rewards.filter((reward) => reward.distance).sort((a, b) => a.distance - b.distance).map((reward) => {
                const unlocked = maxDistance >= reward.distance;
                return (
                    <Box key={reward.name} sx={{
                        mb: "1rem", p: "1rem", border: 1, borderColor: "divider", borderRadius: "0.375rem",
                        borderLeft: `5px solid ${unlocked ? "green" : "gray"}`, borderBottomLeftRadius: 0,
                        opacity: unlocked ? 1 : 0.5, transitionDuration: "200ms", "&:hover": { opacity: 1 },
                    }}>
                        <Typography variant="h6">{reward.name}</Typography>
                        <Typography component="p" sx={{ mb: "1rem" }}>{reward.description}</Typography>
                        <Typography component="p"><strong>Distance Required:</strong> {reward.distance} meters</Typography>
                        {reward.lifetimeDistance && <Typography component="p"><strong>Lifetime Distance Required:</strong> {reward.lifetimeDistance} meters</Typography>}
                    </Box>
                );
            })}
        </ArticlesModal>
    );
}

export { rewards };
