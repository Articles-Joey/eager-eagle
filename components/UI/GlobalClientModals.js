"use client"

import { useStore } from '@/hooks/useStore'
import { useGameStore } from '@/hooks/useGameStore'
// import { Suspense } from 'react';
import dynamic from 'next/dynamic'

import { useAudioStore } from '@/hooks/useAudioStore'
import { useTouchControlsStore } from '@/hooks/useTouchControlsStore'
import ArticlesButton from './Button'
// import { useStore } from '../hooks/useStore'
// import CreditsModal from './CreditsModal'

// const KickedModal = dynamic(
//     () => import('@/components/UI/KickedModal'),
//     { ssr: false }
// )

const SettingsModal = dynamic(
    () => import('@articles-media/articles-dev-box/SettingsModal'),
    { ssr: false }
)

const CreditsModal = dynamic(
    () => import('@articles-media/articles-dev-box/CreditsModal'),
    { ssr: false }
)

const InfoModal = dynamic(
    () => import('@/components/UI/InfoModal'),
    { ssr: false }
)

const GameOverModal = dynamic(
    () => import('@/components/UI/GameOverOverlay'),
    { ssr: false }
)

export default function GlobalClientModals() {

    const showInfoModal = useStore((state) => state.showInfoModal)
    const setShowInfoModal = useStore((state) => state.setShowInfoModal)

    const showSettingsModal = useStore((state) => state.showSettingsModal)
    const setShowSettingsModal = useStore((state) => state.setShowSettingsModal)

    const showCreditsModal = useStore((state) => state.showCreditsModal)
    const setShowCreditsModal = useStore((state) => state.setShowCreditsModal)

    const gameOver = useGameStore((state) => state.gameOver)
    const setGameOver = useGameStore((state) => state.setGameOver)

    const customizeModal = useStore((state) => state.customizeModal)
    const setCustomizeModal = useStore((state) => state.setCustomizeModal)

    const rewardsModal = useStore((state) => state.rewardsModal)
    const setRewardsModal = useStore((state) => state.setRewardsModal)

    const disableDeath = useStore((state) => state.disableDeath)
    const setDisableDeath = useStore((state) => state.setDisableDeath)

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

            {showCreditsModal &&
                <CreditsModal
                    show={showCreditsModal}
                    setShow={setShowCreditsModal}
                    owner="Articles-Joey"
                    repo="eager-eagle"
                />
            }

            {showInfoModal &&
                <InfoModal
                    show={showInfoModal}
                    setShow={setShowInfoModal}
                />
            }

            {showSettingsModal &&
                <SettingsModal
                    show={showSettingsModal}
                    setShow={setShowSettingsModal}
                    store={useStore}
                    useAudioStore={useAudioStore}
                    useTouchControlsStore={useTouchControlsStore}
                    // useSocketStore={useSocketStore}
                    config={{
                        tabs: {
                            'Graphics': {
                                darkMode: true,
                                landingAnimation: true,
                                children: <></>,
                            },
                            'Audio': {
                                sliders: [
                                    {
                                        key: "gameVolume",
                                        label: "Game Volume"
                                    },
                                    {
                                        key: "musicVolume",
                                        label: "Music Volume"
                                    }
                                ]
                            },
                            'Controls': {
                                // defaultKeyBindings: {
                                //     // moveUp: "W",
                                //     // moveDown: "S",
                                //     // moveLeft: "A",
                                //     // moveRight: "D",
                                // }
                            },
                            'Multiplayer': {
                                // serverUrl: true,
                                // children: <>Test</>
                            },
                            'Other': {
                                toontownMode: false,
                                children: <>

                                </>,
                            },
                            'Debug': {
                                children: <>
                                    <div>Disable Death</div>
                                    <div className="mb-3">
                                        <ArticlesButton
                                            active={disableDeath === false}
                                            onClick={() => {
                                                setDisableDeath(false);
                                            }}
                                        >
                                            Disabled
                                        </ArticlesButton>
                                        <ArticlesButton
                                            active={disableDeath === true}
                                            onClick={() => {
                                                setDisableDeath(true);
                                            }}
                                        >
                                            Enabled
                                        </ArticlesButton>
                                    </div>
                                </>
                            }
                        }
                    }}
                />
            }

            

            {/* <GameControllerKeyboard onFinish={(text) => console.log("Keyboard finished:", text)} /> */}

        </>
    )
}