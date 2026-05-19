import Link from "next/link";

import { useGameStore } from "@/hooks/useGameStore";
import ArticlesButton from "@/components/UI/Button";

import { useStore } from "@/hooks/useStore";
import DebugPanel from "./DebugPanel";
import { useScoreStore } from "@/hooks/useScoreStore";
import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';
import useTouchControlsStore from "@/hooks/useTouchControlsStore";

import GameMenuPrimaryButtonGroup from '@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup';

export default function LeftPanelContent(props) {

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
    const reloadScene = useStore((state) => state.reloadScene)

    const debug = useStore((state) => state.debug)

    return (
        <div className='w-100'>

            <div className="card card-articles card-sm rounded-0">

                <div className="card-body">

                    <div
                        className="d-flex flex-wrap"
                    >

                        <GameMenuPrimaryButtonGroup
                        useStore={useStore}
                        type="GameMenu"
                    />

                    </div>

                </div>
            </div>

            <DistanceCard />

            {/* Debug Controls */}
            {debug &&
                <DebugPanel
                    reloadScene={reloadScene}
                />
            }

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