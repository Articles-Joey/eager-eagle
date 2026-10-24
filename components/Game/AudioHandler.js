"use client";

import { useAudioStore } from "@/hooks/useAudioStore";
import { useEffect } from "react";

export default function AudioHandler() {
    useEffect(() => {
        const { playSound, stopSound, resumeAudio } = useAudioStore.getState();
        const music = playSound("/audio/game-music-loop.mp3", {
            channel: "music",
            loop: true,
            volume: 0.5,
        });
        const events = ["click", "keydown", "touchstart", "pointerdown"];
        events.forEach((event) =>
            document.addEventListener(event, resumeAudio),
        );

        return () => {
            events.forEach((event) =>
                document.removeEventListener(event, resumeAudio),
            );
            stopSound(music);
        };
    }, []);

    return null;
}
