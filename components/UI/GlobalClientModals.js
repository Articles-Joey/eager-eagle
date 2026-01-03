"use client"

import { useStore } from '@/hooks/useStore'
import { useGameStore } from '@/hooks/useGameStore'
// import { Suspense } from 'react';
import dynamic from 'next/dynamic'
// import { useStore } from '../hooks/useStore'
// import CreditsModal from './CreditsModal'

// const KickedModal = dynamic(
//     () => import('@/components/UI/KickedModal'),
//     { ssr: false }
// )

const SettingsModal = dynamic(
    () => import('@/components/UI/SettingsModal'),
    { ssr: false }
)

const InfoModal = dynamic(
    () => import('@/components/UI/InfoModal'),
    { ssr: false }
)

const CreditsModal = dynamic(
    () => import('@/components/UI/CreditsModal'),
    { ssr: false }
)

const GameOverModal = dynamic(
    () => import('@/components/UI/GameOverModal'),
    { ssr: false }
)

export default function GlobalClientModals() {

    const infoModal = useStore((state) => state.infoModal)
    const setInfoModal = useStore((state) => state.setInfoModal)

    const showSettingsModal = useStore((state) => state.showSettingsModal)
    const setShowSettingsModal = useStore((state) => state.setShowSettingsModal)

    const creditsModal = useStore((state) => state.creditsModal)
    const setCreditsModal = useStore((state) => state.setCreditsModal)

    const { gameOver, setGameOver } = useGameStore()

    return (
        <>

            {/* {kickedStore &&
                <KickedModal
                    show={kickedStore}
                    setShow={setKickedStore}
                />
            } */}

            {gameOver &&
                <GameOverModal
                    show={gameOver}
                    setShow={setGameOver}
                />
            }

            {creditsModal &&
                <CreditsModal
                    show={creditsModal}
                    setShow={setCreditsModal}
                />
            }

            {infoModal &&
                <InfoModal
                    show={infoModal}
                    setShow={setInfoModal}
                />
            }

            {showSettingsModal &&
                <SettingsModal
                    show={showSettingsModal}
                    setShow={setShowSettingsModal}
                />
            }

            {/* <GameControllerKeyboard onFinish={(text) => console.log("Keyboard finished:", text)} /> */}

        </>
    )
}