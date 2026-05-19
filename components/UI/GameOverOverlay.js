import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap"
import ArticlesButton from "./Button";
import { useGameStore } from "@/hooks/useGameStore";
import { useHotkeys } from "react-hotkeys-hook";

import "@/styles/components/GameOverModal.scss"
import { useStore } from "@/hooks/useStore";
import classNames from "classnames";
import Link from "next/link";

import A from "@articles-media/articles-gamepad-helper/dist/img/Xbox UI/A.svg";
import B from "@articles-media/articles-gamepad-helper/dist/img/Xbox UI/B.svg";

import { useScoreStore } from "@/hooks/useScoreStore";

// import RewardsModal, { rewards } from "./RewardsModal";
import { useRouter } from "next/navigation";
// import rewards from "../rewards";

export default function GameOverOverlay({
    show,
    setShow
}) {

    const router = useRouter()

    // const [showModal, setShowModal] = useState(true)
    // const { distance, setDistance } = useGameStore()

    const setGameOver = useGameStore((state) => state.setGameOver)
    const distance = useGameStore((state) => state.distance)
    const setDistance = useGameStore((state) => state.setDistance)

    const maxDistance = useScoreStore((state) => state.maxDistance)
    const defaultCharacter = useStore((state) => state.defaultCharacter)
    const reloadScene = useStore((state) => state.reloadScene)

    const sidebar = useStore((state) => state.sidebar)
    const showMenu = useStore((state) => state.showMenu)
    const setShowMenu = useStore((state) => state.setShowMenu)

    const setCustomizeModal = useStore((state) => state.setCustomizeModal)
    const setRewardsModal = useStore((state) => state.setRewardsModal)

    const handleRestart = () => {
        console.log('Restarting game...')
        setDistance(0)
        setGameOver(false)
        // reloadScene()
        // setShowModal(false)
    }

    useHotkeys('space', handleRestart)

    return (
        <div className="game-over-overlay">

            <div className="card card-articles">

                <div className="card-header">
                    <h3 className="mb-0">You Crashed!</h3>
                </div>

                <div className="card-body">

                    <div className="my-2">
                        <div className="h5">Score: {distance}</div>
                        <div className="h5 text-muted">Best: {maxDistance}</div>
                    </div>

                    <div className="my-4">

                        {/* Possible TODO - Add upcoming unlocks */}
                        {/* <div className="h5">Upcoming Unlocks</div> */}

                        <ArticlesButton
                            onClick={() => {
                                router.push('/')
                                // window.location.href = "/"
                                setCustomizeModal(true)
                            }}
                            className="w-50 mt-2"
                        >
                            <i className="fas fa-palette"></i>
                            Customize
                        </ArticlesButton>
                        <ArticlesButton
                            onClick={() => {
                                router.push('/')
                                // window.location.href = "/"
                                setRewardsModal(true)
                            }}
                            className="w-50 mt-2"
                        >
                            <i className="fas fa-gift"></i>
                            View Rewards
                        </ArticlesButton>

                    </div>
                </div>

                <div className="card-footer justify-content-between">

                    <div className="d-flex">
                        <Link
                            href={'/'}
                            className="w-50"
                            onClick={() => {
                                handleRestart()
                                setShowMenu(false)
                            }}
                        >
                            <ArticlesButton
                            className="w-100"
                            // small
                            >
                                <i className="no-controller-only fad fa-times me-1"></i>
                                <img className='controller-only me-2' height={20} width={20} src={B.src} alt="Control Keys"></img>
                                <span>Exit</span>
                            </ArticlesButton>
                        </Link>
    
                        <ArticlesButton 
                            className="w-50"
                            onClick={handleRestart}
                        >
                            <i className="no-controller-only fad fa-redo me-1"></i>
                            <img className='controller-only me-2' height={20} width={20} src={A.src} alt="Control Keys"></img>
                            Play Again (Space)
                        </ArticlesButton>
                    </div>

                </div>

            </div>

        </div>
    )
}
