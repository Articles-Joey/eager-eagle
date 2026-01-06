"use client"

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useGameStore } from '@/hooks/useGameStore';
import { useControllerStore } from '@/hooks/useControllerStore';

export default function ControllerInputHandler() {

    const pathname = usePathname()

    const router = useRouter()

    const gameOver = useGameStore((state) => state.gameOver)
    const setGameOver = useGameStore((state) => state.setGameOver)
    const setDistance = useGameStore((state) => state.setDistance)

    const controllerState = useControllerStore((state) => state.controllerState)
    const setControllerState = useControllerStore((state) => state.setControllerState)

    const setCanvasClicked = useGameStore((state) => state.setCanvasClicked)

    const prevJumpPressed = useRef(false)

    useEffect(() => {
        let animationFrameId;
        const pollGamepad = () => {
            const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
            const gp = gamepads[0];
            if (gp) {
                const axes = gp.axes.map((axis) => parseFloat(axis.toFixed(2)));
                const buttons = gp.buttons.map((button) => ({
                    pressed: button.pressed,
                    value: parseFloat(button.value.toFixed(2))
                }));
                setControllerState({ axes, buttons });
            }
            animationFrameId = requestAnimationFrame(pollGamepad);
        };
        animationFrameId = requestAnimationFrame(pollGamepad);
        return () => cancelAnimationFrame(animationFrameId);
    }, [setControllerState]);

    useEffect(() => {

        if (pathname == '/') {
            
            // const isJumpPressed = controllerState?.buttons?.[0]?.pressed

            // if (!gameOver) {
            //     // Button A Jump
            //     if (isJumpPressed && !prevJumpPressed.current) {
            //         console.log("Jump")
            //         // setCanvasClicked(true)
            //     } else if (!isJumpPressed && prevJumpPressed.current) {
            //         // setCanvasClicked(false)
            //     }
            //     prevJumpPressed.current = isJumpPressed
            //     return;
            // }

            // // if (prevJumpPressed.current = isJumpPressed) {
            // //     return;
            // // }

            // // if (!controllerState?.buttons) return

            // // Button A (index 0) => Play Again
            // if (controllerState.buttons[0]?.pressed) {
            //     setDistance(0)
            //     setGameOver(false)
            // }

            // // Button B (index 1) => Go Back
            // if (controllerState.buttons[1]?.pressed) {
            //     router.push('/')
            // }

            // return

        }

        if (pathname == '/play') {

            // if (!controllerState?.buttons) return

            const isJumpPressed = controllerState?.buttons?.[0]?.pressed

            if (!gameOver) {
                // Button A Jump
                if (isJumpPressed && !prevJumpPressed.current) {
                    console.log("Jump")
                    setCanvasClicked(true)
                } else if (!isJumpPressed && prevJumpPressed.current) {
                    setCanvasClicked(false)
                }
                prevJumpPressed.current = isJumpPressed
                return;
            }

            // if (prevJumpPressed.current = isJumpPressed) {
            //     return;
            // }

            // if (!controllerState?.buttons) return

            // Button A (index 0) => Play Again
            if (controllerState?.buttons?.[0]?.pressed) {
                setDistance(0)
                setGameOver(false)
            }

            // Button B (index 1) => Go Back
            if (controllerState?.buttons?.[1]?.pressed) {
                router.push('/')
            }

            return

        }


    }, [controllerState, gameOver, router, setDistance, setGameOver, pathname])

    return null;

}