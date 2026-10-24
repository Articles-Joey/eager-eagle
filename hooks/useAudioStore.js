"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialAudioSettings = {
    enabled: true,
    game_volume: 50,
    music_volume: 50,
};

// Playback handles are transient and never belong in persisted settings.
const activeSounds = new Map();

function soundVolume(sound, settings) {
    if (!settings.enabled) return 0;
    const percent = Number(
        settings[sound.channel === "music" ? "music_volume" : "game_volume"],
    );
    return Number.isFinite(percent)
        ? Math.max(0, Math.min(1, percent / 100)) * sound.gain
        : 0;
}

function stopSound(audio) {
    const sound = activeSounds.get(audio);
    if (!sound) return;
    activeSounds.delete(audio);
    audio.removeEventListener("ended", sound.release);
    audio.removeEventListener("error", sound.release);
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
}

function startSound(audio) {
    const sound = activeSounds.get(audio);
    if (
        !sound ||
        sound.pending ||
        !audio.paused ||
        soundVolume(sound, useAudioStore.getState().audioSettings) === 0
    )
        return;
    sound.pending = true;
    try {
        Promise.resolve(audio.play())
            .catch((error) => {
                if (
                    sound.loop &&
                    ["NotAllowedError", "AbortError"].includes(error?.name)
                )
                    return;
                stopSound(audio);
            })
            .finally(() => {
                sound.pending = false;
                if (
                    !activeSounds.has(audio) ||
                    soundVolume(
                        sound,
                        useAudioStore.getState().audioSettings,
                    ) === 0
                )
                    audio.pause();
            });
    } catch {
        sound.pending = false;
        stopSound(audio);
    }
}

function applySoundSettings(audio, sound, settings) {
    audio.volume = soundVolume(sound, settings);
    if (audio.volume === 0) {
        if (sound.loop) audio.pause();
        else stopSound(audio);
    } else if (sound.loop) {
        startSound(audio);
    }
}

export const useAudioStore = create()(
    persist(
        (set, get) => ({
            _hasHydrated: false,
            setHasHydrated: (state) => {
                set({
                    _hasHydrated: state,
                });
            },

            audioSettings: initialAudioSettings,
            setAudioSettings: (newValue) =>
                set((state) => ({
                    audioSettings: { ...state.audioSettings, ...newValue },
                })),
            toggleAudio: () =>
                set((state) => ({
                    audioSettings: {
                        ...state.audioSettings,
                        enabled: !state.audioSettings.enabled,
                    },
                })),
            resetAudioSettings: () =>
                set({
                    audioSettings: initialAudioSettings,
                }),

            playSound: (src, options = {}) => {
                if (typeof Audio === "undefined") return null;
                const sound = {
                    channel: options.channel === "music" ? "music" : "game",
                    gain: Number.isFinite(options.volume)
                        ? Math.max(0, Math.min(1, options.volume))
                        : 1,
                    loop: Boolean(options.loop),
                    pending: false,
                    release: null,
                };
                const volume = soundVolume(sound, get().audioSettings);
                if (volume === 0 && !sound.loop) return null;
                const audio = new Audio(src);
                audio.volume = volume;
                audio.loop = sound.loop;
                audio.preload = "auto";
                sound.release = () => stopSound(audio);
                activeSounds.set(audio, sound);
                audio.addEventListener("ended", sound.release);
                audio.addEventListener("error", sound.release);
                startSound(audio);
                return audio;
            },
            setSoundVolume: (audio, volume) => {
                const sound = activeSounds.get(audio);
                if (!sound) return;
                sound.gain = Number.isFinite(volume)
                    ? Math.max(0, Math.min(1, volume))
                    : 0;
                applySoundSettings(audio, sound, get().audioSettings);
            },
            stopSound,
            stopAllSounds: () => {
                for (const audio of activeSounds.keys()) stopSound(audio);
            },
            resumeAudio: () => {
                for (const [audio, sound] of activeSounds) {
                    if (sound.loop) startSound(audio);
                }
            },
        }),
        {
            name: "audio-store", // name of the item in the storage (must be unique)
            version: 3,
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
            partialize: (state) => ({
                audioSettings: state.audioSettings,
            }),
        },
    ),
);

// Keep active effects and music in sync with toggles, sliders, and hydration.
useAudioStore.subscribe((state, previous) => {
    if (state.audioSettings === previous.audioSettings) return;
    for (const [audio, sound] of activeSounds) {
        applySoundSettings(audio, sound, state.audioSettings);
    }
});
