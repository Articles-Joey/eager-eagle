import { useEffect, useRef } from 'react';
import { useGameStore } from '@/hooks/useGameStore';
import { useGameControllerKeyboardStore, usePieMenuStore } from '@articles-media/articles-gamepad-helper';
import { useStore } from './useStore';

export const useLandingNavigation = (elementsRef) => {

    const nicknameKeyboard = useStore((state) => state.nicknameKeyboard);
    const setNicknameKeyboard = useStore((state) => state.setNicknameKeyboard);

    const lastClosedTime = useGameControllerKeyboardStore((state) => state.lastClosedTime);
    const setStoreVisible = useGameControllerKeyboardStore((state) => state.setVisible);

    const visible = usePieMenuStore((state) => state.visible);

    const showInfoModal = useGameStore((state) => state.showInfoModal)
    const showSettingsModal = useGameStore((state) => state.showSettingsModal)
    const showCreditsModal = useGameStore((state) => state.showCreditsModal)

    const lastInputTime = useRef(0);
    const currentFocusIndex = useRef(-1);

    useEffect(() => {
        if (showInfoModal || showSettingsModal || showCreditsModal || visible || nicknameKeyboard) return;

        let animationFrameId;

        const loop = () => {
            const gamepads = navigator.getGamepads();
            const gp = gamepads[0];

            if (gp) {
                const now = performance.now();

                // Only process input every 150ms
                if (now - lastInputTime.current > 150) {

                    const axes = gp.axes;
                    const buttons = gp.buttons;
                    const threshold = 0.5;

                    const activeElement = document.activeElement;
                    if (activeElement && activeElement.tagName === 'INPUT') {
                        for (let i = 0; i < buttons.length; i++) {
                            if (buttons[i].pressed) {
                                console.log(activeElement.id);

                                if (activeElement.id == "nickname") {
                                    if (now - lastClosedTime < 1000) break;
                                    console.log("SHOW KEYBOARD");
                                    setNicknameKeyboard(true);
                                    setStoreVisible(true);
                                }
                                break;
                            }
                        }
                    }

                    let dx = 0;
                    let dy = 0;

                    // D-Pad
                    if (buttons[12].pressed) dy = -1; // Up
                    if (buttons[13].pressed) dy = 1;  // Down
                    if (buttons[14].pressed) dx = -1; // Left
                    if (buttons[15].pressed) dx = 1;  // Right

                    // Left Stick
                    if (axes[1] < -threshold) dy = -1;
                    if (axes[1] > threshold) dy = 1;
                    if (axes[0] < -threshold) dx = -1;
                    if (axes[0] > threshold) dx = 1;

                    if (dx !== 0 || dy !== 0) {
                        lastInputTime.current = now;
                        navigate(dx, dy);
                    }

                    // A Button (Select)
                    if (buttons[0].pressed) {
                        lastInputTime.current = now; // Debounce click too
                        const active = document.activeElement;
                        // Check if active element is one of ours
                        if (active && elementsRef.current.includes(active)) {
                            active.click();
                        }
                    }
                }
            }
            animationFrameId = requestAnimationFrame(loop);
        };

        const navigate = (dx, dy) => {
            const els = elementsRef.current;
            const len = els.length;

            // If nothing focused, focus first available
            if (currentFocusIndex.current === -1 || !els[currentFocusIndex.current]) {
                const first = els.findIndex(e => e);
                if (first !== -1) focus(first);
                return;
            }

            const direction = (dx > 0 || dy > 0) ? 1 : -1;
            let next = currentFocusIndex.current + direction;
            let count = 0;

            // Simple loop: +1 goes next, -1 goes prev
            // Wrap around start/end
            while (count < len) {
                if (next >= len) next = 0;
                if (next < 0) next = len - 1;

                if (els[next]) {
                    focus(next);
                    return;
                }

                next += direction;
                count++;
            }
        };

        const focus = (index) => {
            if (elementsRef.current[index]) {
                elementsRef.current[index].focus();
                currentFocusIndex.current = index;
            }
        };

        animationFrameId = requestAnimationFrame(loop);

        return () => cancelAnimationFrame(animationFrameId);
    }, [elementsRef, showInfoModal, showSettingsModal, showCreditsModal, visible, nicknameKeyboard, lastClosedTime]);
};
