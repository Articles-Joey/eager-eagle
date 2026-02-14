import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap"
import ArticlesButton from "./Button";
import { useGameStore } from "@/hooks/useGameStore";
import { useHotkeys } from "react-hotkeys-hook";

import "@/styles/components/GameOverModal.scss"
import { useStore } from "@/hooks/useStore";
import classNames from "classnames";
import Link from "next/link";

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
                    <div className="h5 text-muted">1,000 Distance: Faster Speed</div>
                    <div className="h5 text-muted">5,000 Distance: New Character</div>
                    <div className="h5 text-muted">10,000 Distance: Special Ability</div>
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
                        {/* <i className="fad fa-arrow-alt-square-left"></i> */}
                        <img className='me-2' height={20} width={20} src="img/Xbox UI/B.svg" alt="Control Keys"></img>
                        <span>Exit</span>
                    </ArticlesButton>
                </Link>

                <ArticlesButton onClick={handleRestart}>
                    <img className='me-2' height={20} width={20} src="img/Xbox UI/A.svg" alt="Control Keys"></img>
                    Play Again (Space)
                </ArticlesButton>

            </Modal.Footer>

        </Modal>
    )
}
