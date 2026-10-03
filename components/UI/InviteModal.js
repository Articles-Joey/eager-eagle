"use client";

import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import ArticlesModal from "./ArticlesModal";
import ArticlesButton from "./Button";
import ViewUserModal from "./ViewUserModal";
import ArticlesDate from "./ArticlesDate";
import useUserFriends from "@/hooks/user/useUserFriends";

function InviteModal({ show, setShow }) {
    const [friendsSearch, setFriendsSearch] = useState("");
    const [sentMessages] = useState([]);
    const { data: userFriends } = useUserFriends();

    return (
        <ArticlesModal show={Boolean(show)} setShow={setShow} title="Invite Players" contentSx={{ p: 0 }}>
            {show.type ? (
                <Box>
                    <Box sx={{ position: "sticky", top: 0, zIndex: 1, bgcolor: "background.paper", borderBottom: 1, borderColor: "divider", display: "flex", justifyContent: "center", p: 1 }}>
                        <TextField label="Friend Search" placeholder="Display name or username" size="small" value={friendsSearch} onChange={(event) => setFriendsSearch(event.target.value)} sx={{ width: "100%", maxWidth: 250 }} />
                    </Box>
                    <Box sx={{ display: "flex" }}>
                        <Box sx={{ width: "50%", p: "0.5rem", display: "flex", flexDirection: "column" }}>
                            <Box>Type</Box><Box sx={{ mb: "0.5rem", fontWeight: 700 }}>{show.type}</Box>
                            <Box>Game Name</Box><Box sx={{ mb: "0.5rem", fontWeight: 700 }}>{show.game_name}</Box>
                            <Box>Server Id</Box><Box sx={{ mb: "0.5rem", fontWeight: 700 }}>{show.server_id}</Box>
                        </Box>
                        <Box sx={{ width: "50%", p: "0.5rem", borderLeft: 1, borderColor: "divider" }}>
                            <Box sx={{ color: "text.secondary" }}>Invited Players</Box>
                            {sentMessages.map((sent) => <ViewUserModal key={sent._id} user_id={sent.populated_user._id} populated_user={sent.populated_user} />)}
                        </Box>
                    </Box>
                    <Box sx={{ borderTop: 1, borderColor: "divider" }}>
                        {userFriends?.filter((friend) => !friendsSearch || friend.populated_user.display_name?.toLowerCase().includes(friendsSearch.toLowerCase())).map((friend) => (
                            <Box key={friend._id} sx={{ borderBottom: 1, borderColor: "divider", p: "0.5rem", display: "flex", alignItems: "center" }}>
                                <Box sx={{ ml: "0.5rem" }}>
                                    <ViewUserModal user_id={friend.populated_user._id} populated_user={friend.populated_user} />
                                    <Box sx={{ fontSize: "0.875em" }}>@{friend.populated_user.username}</Box>
                                    <Box sx={{ fontSize: "0.875em" }}>Added: <ArticlesDate date={friend.date} format="PP" /></Box>
                                </Box>
                                <ArticlesButton small sx={{ ml: "auto" }} disabled={Boolean(sentMessages.find((sent) => sent._id === friend._id))} onClick={() => {}}>
                                    {sentMessages.find((sent) => sent._id === friend._id) ? "Sent" : "Invite"}
                                </ArticlesButton>
                            </Box>
                        ))}
                    </Box>
                </Box>
            ) : <Box sx={{ p: "1rem" }}>Dev Issue</Box>}
        </ArticlesModal>
    );
}

export default function InviteModalMemo({ show, setShow }) {
    return useMemo(() => <InviteModal show={show} setShow={setShow} />, [show, setShow]);
}
