"use client"
import { useEffect, useContext, useState, useRef, useMemo, Suspense } from 'react';

import dynamic from "next/dynamic";

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
// import Link from 'next/link';
// import dynamic from 'next/dynamic'
// import Script from 'next/script'

// import { useSelector, useDispatch } from 'react-redux'

// import ROUTES from '@/components/constants/routes';

// import ArticlesButton from '@/components/UI/Button';

import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';
// import { useControllerStore } from '@/hooks/useControllerStore';

// import { useLocalStorageNew } from '@/hooks/useLocalStorageNew';
import LeftPanelContent from '@/components/UI/LeftPanel';
// import { useSocketStore } from '@/hooks/useSocketStore';
import { useGameStore } from '@/hooks/useGameStore';
import { useStore } from '@/hooks/useStore';
// import { useTouchControlsStore } from '@/hooks/useTouchControlsStore';
import AudioHandler from '@/components/Game/AudioHandler';
// import { useScoreStore } from '@/hooks/useScoreStore';
import DiveButton from '@/components/UI/DiveButton';
import GameMenu from '@articles-media/articles-dev-box/GameMenu';

const GameCanvas = dynamic(() => import('@/components/Game/GameCanvas'), {
    ssr: false,
});

const GameOverModal = dynamic(
    () => import('@/components/UI/GameOverOverlay'),
    { ssr: false }
)

const game_name = 'Eager Eagle'
const game_key = 'eager-eagle'

export default function GamePage() {

    const distance = useGameStore((state) => state.distance)

    const sidebar = useStore((state) => state.sidebar)

    const sceneKey = useStore((state) => state.sceneKey)

    const gameOver = useGameStore((state) => state.gameOver)
    const setGameOver = useGameStore((state) => state.setGameOver)

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    return (

        <div
            className={`${game_key}-game-page ${isFullscreen && 'fullscreen'} ${sidebar ? 'show-sidebar' : ''}`}
        // id={`${game_key}-game-page`}
        >

            <AudioHandler />

            <GameMenu
                useStore={useStore}
                LeftPanelContent={LeftPanelContent}
                menuBarConfig={{
                    style: "Bar",
                    menuBarButtonPosition: "Left"
                }}
                sidebarConfig={{
                    style: "Static Panel",
                }}
            />

            <div className='canvas-wrap'>

                {gameOver &&
                    <GameOverModal
                        // show={gameOver}
                        // setShow={setGameOver}
                    />
                }

                <Suspense>
                    <DiveButton />
                </Suspense>

                {!sidebar && <div className='distance-badge badge bg-black text-white border'>
                    Distance: {distance}
                </div>}

                <GameCanvas
                    key={sceneKey}
                />

            </div>

        </div>
    );
}

