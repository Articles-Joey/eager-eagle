import Link from "next/link";

import { useGameStore } from "@/hooks/useGameStore";
import ArticlesButton from "@/components/UI/Button";

import { useStore } from "@/hooks/useStore";
import { useTouchControlsStore } from "@/hooks/useTouchControlsStore";
import DebugPanel from "./DebugPanel";
import { useScoreStore } from "@/hooks/useScoreStore";
import useFullscreen from "@/hooks/useFullScreen";

export default function LeftPanelContent(props) {

    const {
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
    } = props;

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    // const {
    //     touchControls: touchControlsEnabled,
    //     setTouchControls: setTouchControlsEnabled
    // } = useTouchControlsStore()

    const enabled = useTouchControlsStore(state => state.enabled)
    const setEnabled = useTouchControlsStore(state => state.setEnabled)

    // const {
    //     socket,
    // } = useSocketStore(state => ({
    //     socket: state.socket,
    // }));

    // const showMenu = useStore((state) => state.showMenu)
    const setShowMenu = useStore((state) => state.setShowMenu)

    const debug = useStore((state) => state.debug)
    // const toggleDebug = useStore((state) => state.toggleDebug)

    // const theme = useStore((state) => state.theme)
    // const setTheme = useStore((state) => state.setTheme)

    const darkMode = useStore((state) => state.darkMode)
    const toggleDarkMode = useStore((state) => state.toggleDarkMode)
    // const setDarkMode = useStore((state) => state.setDarkMode)

    // const toggleDisableDeath = useStore((state) => state.toggleDisableDeath)
    // const disableDeath = useStore((state) => state.disableDeath)

    const sidebar = useStore((state) => state.sidebar)
    const toggleSidebar = useStore((state) => state.toggleSidebar)

    // const settingsModal = useStore((state) => state.showSettingsModal)
    const setSettingsModal = useStore((state) => state.setSettingsModal)

    return (
        <div className='w-100'>

            <div className="card card-articles card-sm rounded-0">

                <div className="card-body">

                    <div
                        className="d-flex flex-wrap"
                    >

                        <Link
                            href={'/'}
                            className="w-50"
                            onClick={() => {
                                setShowMenu(false)
                            }}
                        >
                            <ArticlesButton
                                className="w-100"
                                small
                            >
                                <i className="fad fa-arrow-alt-square-left"></i>
                                <span>Leave Game</span>
                            </ArticlesButton>
                        </Link>

                        <ArticlesButton
                            small
                            className="w-50"
                            active={isFullscreen}
                            onClick={() => {
                                if (isFullscreen) {
                                    exitFullscreen()
                                } else {
                                    requestFullscreen('eager-eagle-game-page')
                                }
                            }}
                        >
                            {isFullscreen && <span>Exit </span>}
                            {!isFullscreen && <span><i className='fad fa-expand'></i></span>}
                            <span>Fullscreen</span>
                        </ArticlesButton>

                        <ArticlesButton
                            className="w-50"
                            small
                            active={sidebar}
                            onClick={() => {
                                toggleSidebar()
                                setShowMenu(false)
                            }}
                        >
                            <i className="fad fa-arrow-alt-square-left"></i>
                            <span>Sidebar</span>
                        </ArticlesButton>

                        <div className="w-50 d-flex">
                            <ArticlesButton
                                className="flex-grow-1"
                                small
                                // active={}
                                onClick={() => {
                                    setSettingsModal(true)
                                }}
                            >
                                <i className="fad fa-cog"></i>
                                <span>Settings</span>
                            </ArticlesButton>
                            <ArticlesButton
                                className=""
                                small
                                // active={}
                                onClick={() => {
                                    toggleDarkMode()
                                }}
                            >
                                {darkMode ? <i className="fad fa-sun"></i> : <i className="fad fa-moon"></i>}
                            </ArticlesButton>
                        </div>

                        {/* <ArticlesButton
                            small
                            className="w-50"
                            onClick={() => {
                                toggleDarkMode()
                            }}
                        >
                            <i className="fad fa-eye-dropper"></i>
                            <span>{darkMode ? ' Dark Mode' : 'Light Mode'}</span>
                        </ArticlesButton> */}

                    </div>

                    {/* <div className="card-footer border">

                        <div className='flex-header'>
                            <div>Server: {server}</div>
                            <div>Players: {players.length || 0}/50</div>
                        </div>

                        {!socket?.connected &&
                            <div
                                className=""
                            >

                                <div className="">

                                    <div className="h6 mb-1">Not connected</div>

                                    <ArticlesButton
                                        className="w-100 "
                                        small
                                        onClick={() => {
                                            console.log("Reconnect")
                                            socket.connect()
                                        }}
                                    >
                                        <i className="fad fa-arrow-alt-square-left"></i>
                                        Reconnect!
                                    </ArticlesButton>

                                </div>

                            </div>
                        }

                    </div> */}

                </div>
            </div>

            <DistanceCard />

            {/* Touch Controls */}
            <div
                className="card card-articles card-sm rounded-0"
            >
                <div className="card-body">

                    <div className="small text-muted">Touch Controls</div>

                    <div className='d-flex flex-column'>

                        <div>
                            <ArticlesButton
                                size="sm"
                                className="w-50"
                                active={!enabled}
                                onClick={() => {
                                    setEnabled(false)
                                }}
                            >
                                <i className="fad fa-redo"></i>
                                Off
                            </ArticlesButton>

                            <ArticlesButton
                                size="sm"
                                className="w-50"
                                active={enabled}
                                onClick={() => {
                                    setEnabled(true)
                                }}
                            >
                                <i className="fad fa-redo"></i>
                                On
                            </ArticlesButton>
                        </div>

                    </div>

                </div>
            </div>

            {/* Debug Controls */}
            {debug &&
                <DebugPanel
                    reloadScene={reloadScene}
                />
            }

            {/* Make component */}
            {/* {controllerState?.connected &&
                <div className="panel-content-group p-0 text-dark">

                    <div className="p-1 border-bottom border-dark">
                        <div className="fw-bold" style={{ fontSize: '0.7rem' }}>
                            {controllerState?.id}
                        </div>
                    </div>

                    <div className='p-1'>
                        <ArticlesButton
                            small
                            className="w-100"
                            active={showControllerState}
                            onClick={() => {
                                setShowControllerState(prev => !prev)
                            }}
                        >
                            {showControllerState ? 'Hide' : 'Show'} Controller Preview
                        </ArticlesButton>
                    </div>

                    {showControllerState && <div className='p-3'>

                        <ControllerPreview
                            controllerState={controllerState}
                            showJSON={true}
                            showVibrationControls={true}
                            maxHeight={300}
                            showPreview={true}
                        />
                    </div>}

                </div>
            } */}

        </div>
    )

}

function DistanceCard() {

    const distance = useGameStore((state) => state.distance)
    const maxDistance = useScoreStore((state) => state.maxDistance)
    const lifetimeDistance = useScoreStore((state) => state.lifetimeDistance)

    return (
        <div
            className="card card-articles card-sm rounded-0"
        >
            <div className="card-body d-flex justify-content-between align-items-center">

                <div>
                    <div className="small text-muted">
                        Distance: {distance}
                    </div>
                    {/* <div className="small text-muted">
                            Diving: {isDiving ? 'True' : 'False'}
                        </div> */}
                </div>

                <div className="d-flex flex-column align-items-end">
                    <div className="small text-muted me-2">Max Distance: {maxDistance}</div>
                    <div className="small text-muted me-2">Lifetime Distance: {lifetimeDistance}</div>
                </div>

            </div>
        </div>
    )

}