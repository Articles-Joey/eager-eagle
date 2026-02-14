"use client"

import { useStore } from '@/hooks/useStore'
import { useGameStore } from '@/hooks/useGameStore'
// import { Suspense } from 'react';
import dynamic from 'next/dynamic'
import CustomizeModal from './CustomizeModal'
import RewardsModal from './RewardsModal'
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

    const settingsModal = useStore((state) => state.settingsModal)
    const setSettingsModal = useStore((state) => state.setSettingsModal)

    const creditsModal = useStore((state) => state.creditsModal)
    const setCreditsModal = useStore((state) => state.setCreditsModal)

    const gameOver = useGameStore((state) => state.gameOver)
    const setGameOver = useGameStore((state) => state.setGameOver)

    const customizeModal = useStore((state) => state.customizeModal)
    const setCustomizeModal = useStore((state) => state.setCustomizeModal)

    const rewardsModal = useStore((state) => state.rewardsModal)
    const setRewardsModal = useStore((state) => state.setRewardsModal)

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

            {settingsModal &&
                <SettingsModal
                    show={settingsModal}
                    setShow={setSettingsModal}
                />
            }

            {customizeModal &&
                <CustomizeModal 
                    show={customizeModal}
                    setShow={setCustomizeModal}
                />
            }

            {rewardsModal &&
                <RewardsModal 
                    show={rewardsModal}
                    setShow={setRewardsModal}
                />
            }

            {/* <GameControllerKeyboard onFinish={(text) => console.log("Keyboard finished:", text)} /> */}

        </>
    )
}