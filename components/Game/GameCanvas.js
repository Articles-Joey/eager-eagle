import { memo, Suspense, useCallback, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { useStore } from "@/hooks/useStore";
import { useGameStore } from "@/hooks/useGameStore";
import Player from "./Player";
import ObstacleManager from "./ObstacleManager";
import Ground from "./Ground";
import SkyBox from "./SkyBox";
import { WorldMotion } from "./WorldMotion";

function GameCanvas({ landingAnimationMode = false }) {
    const darkMode = useStore((state) => state.darkMode);
    const showPhysicsDebug = useStore((state) => state?.debugConfig?.showPhysicsDebug);
    const showStats = useStore((state) => state?.debugConfig?.showStats);
    const gameOver = useGameStore((state) => state.gameOver);
    const setPointerJump = useGameStore((state) => state.setPointerJump);
    const setPointerDive = useGameStore((state) => state.setPointerDive);

    const clearPointerControls = useCallback(() => {
        setPointerJump(false);
        setPointerDive(false);
    }, [setPointerJump, setPointerDive]);

    const updatePointerButtons = useCallback((event) => {
        if (useGameStore.getState().gameOver) {
            clearPointerControls();
            return;
        }
        setPointerJump((event.buttons & 1) !== 0);
        setPointerDive((event.buttons & 2) !== 0);
    }, [setPointerJump, setPointerDive, clearPointerControls]);

    const handlePointerDown = useCallback((event) => {
        if (event.button === 2) event.preventDefault();
        updatePointerButtons(event);
        if (event.buttons & 3) event.currentTarget.setPointerCapture(event.pointerId);
    }, [updatePointerButtons]);

    const handlePointerUp = useCallback((event) => {
        updatePointerButtons(event);
        if (event.buttons === 0 && event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    }, [updatePointerButtons]);

    useEffect(() => {
        if (landingAnimationMode) return;
        const handleVisibilityChange = () => {
            if (document.hidden) clearPointerControls();
        };
        window.addEventListener("pointerup", updatePointerButtons);
        window.addEventListener("pointercancel", clearPointerControls);
        window.addEventListener("blur", clearPointerControls);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            window.removeEventListener("pointerup", updatePointerButtons);
            window.removeEventListener("pointercancel", clearPointerControls);
            window.removeEventListener("blur", clearPointerControls);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            clearPointerControls();
        };
    }, [landingAnimationMode, clearPointerControls, updatePointerButtons]);

    useEffect(() => {
        if (gameOver) clearPointerControls();
    }, [gameOver, clearPointerControls]);

    return (
        <Canvas
            camera={{ position: [30, 3, 0], fov: 50 }}
            onPointerDown={landingAnimationMode ? undefined : handlePointerDown}
            onPointerMove={landingAnimationMode ? undefined : updatePointerButtons}
            onPointerUp={landingAnimationMode ? undefined : handlePointerUp}
            onPointerLeave={landingAnimationMode ? undefined : clearPointerControls}
            onPointerCancel={landingAnimationMode ? undefined : clearPointerControls}
            onLostPointerCapture={landingAnimationMode ? undefined : clearPointerControls}
            onContextMenu={(event) => { if (!landingAnimationMode) event.preventDefault(); }}
        >
            {showStats && <Stats className="stats-overlay" />}
            <OrbitControls enableRotate={landingAnimationMode} enablePan={landingAnimationMode} />
            <SkyBox />
            <ambientLight intensity={darkMode ? 0.5 : 2.5} />
            <directionalLight position={[20, 35, -20]} intensity={darkMode ? 0.6 : 2} />
            <Suspense fallback={null}>
                <WorldMotion preview={landingAnimationMode}>
                    <Physics
                        debug={showPhysicsDebug}
                        gravity={[0, -9.81, 0]}
                        paused={gameOver && !landingAnimationMode}
                        interpolation={false}
                    >
                        {!landingAnimationMode && <Player />}
                        <ObstacleManager />
                        <Ground />
                    </Physics>
                </WorldMotion>
            </Suspense>
        </Canvas>
    );
}

export default memo(GameCanvas);
