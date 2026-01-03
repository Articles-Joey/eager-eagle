"use client";

import { useEffect, useRef } from "react";
import { useStore } from "./hooks/useStore";

export default function AudioHandler() {

    const audioSettings = useStore((state) => state?.audioSettings);
    const musicRef = useRef(null);

    // Initialize Audio once
    useEffect(() => {
        if (typeof window !== 'undefined' && !musicRef.current) {
            musicRef.current = new Audio(`audio/game-music-loop.mp3`);
            musicRef.current.loop = true;
        }

        return () => {
            if (musicRef.current) {
                musicRef.current.pause();
                musicRef.current = null;
            }
        };
    }, []);

    // Handle Volume Changes independently
    useEffect(() => {
        if (musicRef.current) {
            musicRef.current.volume = audioSettings?.enabled ? (audioSettings?.music_volume / 100) : 0;
        }
    }, [audioSettings?.music_volume, audioSettings?.enabled]);

    // Handle Play/Pause State independently
    useEffect(() => {
        const music = musicRef.current;
        if (!music) return;

        if (audioSettings?.enabled) {
            if (music.paused) {
                music.play().catch((e) => {
                    // Auto-play policies might block this
                    console.warn("Audio play failed:", e);
                });
            }
        } else {
            music.pause();
        }
    }, [audioSettings?.enabled]);

    return null;

}