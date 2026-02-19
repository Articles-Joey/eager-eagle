import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap"
import ArticlesButton from "./Button";
import { useGameStore } from "@/hooks/useGameStore";
import { useHotkeys } from "react-hotkeys-hook";

import "@/styles/components/GameOverModal.scss"
import { useStore } from "@/hooks/useStore";
import classNames from "classnames";
import Link from "next/link";
import rewards from "../rewards";

import A from "@articles-media/articles-gamepad-helper/dist/img/Xbox UI/A.svg";
import B from "@articles-media/articles-gamepad-helper/dist/img/Xbox UI/B.svg";

export default function GameOverModal({
    show,
    setShow
}) {

    const [showModal, setShowModal] = useState(true)
    const { distance, setDistance } = useGameStore()

    const maxDistance = useStore((state) => state.maxDistance)

    const sidebar = useStore((state) => state.sidebar)
    const showMenu = useStore((state) => state.showMenu)
    const setShowMenu = useStore((state) => state.setShowMenu)

    const handleRestart = () => {
        setDistance(0)
        setShowModal(false)
    }

    useHotkeys('space', handleRestart)

    return (
        <Modal
            className={
                classNames(
                    "articles-modal game-over-modal",
                    sidebar && "sidebar-enabled",
                    showMenu && "menu-open"
                )
            }
            size='md'
            show={showModal}
            // backdropClassName="game-over-modal-backdrop"
            backdropClassName={
                classNames(
                    "articles-modal game-over-modal-backdrop",
                    sidebar && "sidebar-enabled",
                    showMenu && "menu-open"
                )
            }
            centered
            onExited={() => {
                setShow(false)
            }}
            onHide={() => {
                // Prevent closing by clicking outside or escape key if desired, 
                // or allow it but ensure restart logic is handled if needed.
                // For now, let's treat closing as just hiding the modal, 
                // but usually game over requires a restart action.
                setShowModal(false)
            }}
            backdrop="static" // Force user to interact with buttons
            keyboard={false}
        >

            <Modal.Header>
                <Modal.Title>Game Over</Modal.Title>
            </Modal.Header>

            <Modal.Body className="text-center">
                <h3>You Crashed!</h3>
                <div className="my-4">
                    <div className="h5">Score: {distance}</div>
                    <div className="h5 text-muted">Best: {maxDistance}</div>
                </div>
                <div className="my-4">
                    <div className="h5">Upcoming Unlocks</div>
                    <div
                        className="border p-2"
                        style={{
                            maxHeight: '400px',
                            overflow: 'auto'
                        }}
                    >
                        {rewards.map((reward, index) => {
                            if (reward.distance > maxDistance) {
                                return (
                                    <div
                                        key={index}
                                        className={
                                            classNames(
                                                "reward-item mb-1 p-3 border rounded",
                                                {
                                                    'unlocked': maxDistance >= reward.distance
                                                }
                                            )
                                        }
    
                                    >
                                        <h6>{reward.name}</h6>
                                        <div className="text-muted">Unlocks at {reward.distance}m</div>
    
                                        <div className="reward-progress-bar">
    
                                            <i className="fad fa-home"></i>
    
                                            <div className="bar"></div>
                                            <div 
                                                className="current"
                                                style={{
                                                    left: `${Math.min((maxDistance / reward.distance) * 100, 100)}%`
                                                }}
                                            >
                                                <i className="fas fa-plane"></i>
                                            </div>
    
                                            <i className="fad fa-map-pin"></i>
    
                                        </div>
    
                                    </div>
                                )
                            }
                        })}
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer className="justify-content-between">

                <Link
                    href={'/'}
                    // className="w-50"
                    onClick={() => {
                        handleRestart()
                        setShowMenu(false)
                    }}
                >
                    <ArticlesButton
                    // className="w-100"
                    // small
                    >
                        <i className="no-controller-only fad fa-times me-1"></i>
                        <img className='controller-only me-2' height={20} width={20} src={B.src} alt="Control Keys"></img>
                        <span>Exit</span>
                    </ArticlesButton>
                </Link>

                <ArticlesButton onClick={handleRestart}>
                    <i className="no-controller-only fad fa-redo me-1"></i>
                    <img className='controller-only me-2' height={20} width={20} src={A.src} alt="Control Keys"></img>
                    Play Again (Space)
                </ArticlesButton>

            </Modal.Footer>

        </Modal>
    )
}
