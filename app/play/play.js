"use client"
import { useEffect, useContext, useState, useRef, useMemo, Suspense } from 'react';

import dynamic from "next/dynamic";

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
// import Link from 'next/link';
// import dynamic from 'next/dynamic'
// import Script from 'next/script'

// import { useSelector, useDispatch } from 'react-redux'

// import ROUTES from '@/components/constants/routes';

import ArticlesButton from '@/components/UI/Button';

import useFullscreen from '@/hooks/useFullScreen';
import { useControllerStore } from '@/hooks/useControllerStore';

// import { useLocalStorageNew } from '@/hooks/useLocalStorageNew';
import LeftPanelContent from '@/components/UI/LeftPanel';
// import { useSocketStore } from '@/hooks/useSocketStore';
import { useGameStore } from '@/hooks/useGameStore';
import { useStore } from '@/hooks/useStore';
import { useTouchControlsStore } from '@/hooks/useTouchControlsStore';
import AudioHandler from '@/components/Game/AudioHandler';
import { useScoreStore } from '@/hooks/useScoreStore';
import DiveButton from '@/components/UI/DiveButton';

const GameCanvas = dynamic(() => import('@/components/Game/GameCanvas'), {
    ssr: false,
});

const game_name = 'Eager Eagle'
const game_key = 'eager-eagle'

export default function GamePage() {

    // const {
    //     socket
    // } = useSocketStore(state => ({
    //     socket: state.socket
    // }));

    // const router = useRouter()
    // const pathname = usePathname()
    // const searchParams = useSearchParams()
    // const params = Object.fromEntries(searchParams.entries());
    // const { server } = params

    // const { controllerState, setControllerState } = useControllerStore()
    // const [showControllerState, setShowControllerState] = useState(false)

    // const [ cameraMode, setCameraMode ] = useState('Player')

    // const [players, setPlayers] = useState([])

    // const serverGameState = useGameStore((state) => state.serverGameState)
    // const setServerGameState = useGameStore((state) => state.setServerGameState)

    const distance = useGameStore((state) => state.distance)

    const sidebar = useStore((state) => state.sidebar)
    const showMenu = useStore((state) => state.showMenu)
    const setShowMenu = useStore((state) => state.setShowMenu)
    const setIsDiving = useStore((state) => state.setIsDiving)

    const enabled = useTouchControlsStore(state => state.enabled)

    // const [showMenu, setShowMenu] = useState(false)

    // const [touchControlsEnabled, setTouchControlsEnabled] = useLocalStorageNew("game:touchControlsEnabled", false)

    const [sceneKey, setSceneKey] = useState(0);

    // const [gameState, setGameState] = useState(false)

    // Function to handle scene reload
    const reloadScene = () => {
        setSceneKey((prevKey) => prevKey + 1);
    };

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    let panelProps = {
        // server,
        // players,
        // touchControlsEnabled,
        // setTouchControlsEnabled,
        reloadScene,
        // controllerState,
        // isFullscreen,
        // requestFullscreen,
        // exitFullscreen,
        // setShowMenu
    }

    return (

        <div
            className={`${game_key}-game-page ${isFullscreen && 'fullscreen'} ${sidebar ? 'sidebar-enabled' : ''}`}
        // id={`${game_key}-game-page`}
        >

            <AudioHandler />

            <div className=''>
                <div className="menu-bar card card-articles p-1 justify-content-center border-0 rounded-0">

                    <div className='flex-header align-items-center justify-content-center'>

                        <ArticlesButton
                            // small
                            active={showMenu}
                            onClick={() => {
                                setShowMenu(!showMenu)
                            }}
                        >
                            <i className="fad fa-bars"></i>
                            <span>Menu</span>
                        </ArticlesButton>

                    </div>

                </div>
            </div>

            <div className={`mobile-menu ${(showMenu || (!sidebar && showMenu)) && 'show'}`}>
                <div
                    style={{
                        maxWidth: '300px',
                        margin: '0 auto'
                    }}
                >
                    <LeftPanelContent
                        {...panelProps}
                    />
                </div>
            </div>

            {/* <TouchControls
                touchControlsEnabled={touchControlsEnabled}
            /> */}

            <div className='panel-left card rounded-0'>

                <LeftPanelContent
                    {...panelProps}
                />

            </div>

            {/* <div className='game-info'>
                <div className="card card-articles card-sm">
                    <div className="card-body">
                        <pre> 
                            {JSON.stringify(playerData, undefined, 2)}
                        </pre>
                    </div>
                </div>
            </div> */}

            <div className='canvas-wrap'>

                <Suspense><DiveButton /></Suspense>

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

