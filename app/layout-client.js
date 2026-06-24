"use client"
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import packageInfo from '@/package.json';

import { useHotkeys } from 'react-hotkeys-hook';

import { useStore } from '@/hooks/useStore';
import { useAudioStore } from '@/hooks/useAudioStore';
import useTouchControlsStore from '@/hooks/useTouchControlsStore';
// import { useSocketStore } from '@/hooks/useSocketStore';

import DarkModeHandler from "@articles-media/articles-dev-box/DarkModeHandler";
import GlobalBody from '@articles-media/articles-dev-box/GlobalBody';
import ToontownModeHandler from '@articles-media/articles-dev-box/ToontownModeHandler';
import GlobalClientModals from '@articles-media/articles-dev-box/GlobalClientModals';
import HotkeyHandler from '@articles-media/articles-dev-box/HotkeyHandler';

const CustomizeModal = dynamic(
    () => import('@/components/UI/CustomizeModal'),
    { ssr: false }
)
const RewardsModal = dynamic(
    () => import('@/components/UI/RewardsModal'),
    { ssr: false }
)

export default function LayoutClient({

}) {

    const darkMode = useStore((state) => state?.darkMode);
    const customizeModal = useStore((state) => state.customizeModal)
    const setCustomizeModal = useStore((state) => state.setCustomizeModal)
    const rewardsModal = useStore((state) => state.rewardsModal)
    const setRewardsModal = useStore((state) => state.setRewardsModal)

    return (
        <>
            <GlobalBody />
            <DarkModeHandler
                useStore={useStore}
            />
            <ToontownModeHandler
                useStore={useStore}
            />
            <Suspense>

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

                <HotkeyHandler 
                    useStore={useStore}
                    useHotkeys={useHotkeys}
                />

                <GlobalClientModals
                    useStore={useStore}
                    useAudioStore={useAudioStore}
                    useTouchControlsStore={useTouchControlsStore}
                    // useSocketStore={useSocketStore}
                    packageInfo={packageInfo}
                    settingsModalConfig={{
                        tabs: {
                            'Graphics': {
                                darkMode: true,
                                landingAnimation: true
                            },
                            'Audio': {
                                sliders: [
                                    ...useAudioStore.getState().audioSettings ?
                                        Object.keys(useAudioStore.getState().audioSettings).filter(key => key !== "enabled").map(key => ({
                                            key,
                                            label: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                                        }))
                                        :
                                        [],
                                ]
                            },
                            'Controls': {
                                touchControls: true
                                // defaultKeyBindings: {
                                //     // moveUp: "W",
                                //     // moveDown: "S",
                                //     // moveLeft: "A",
                                //     // moveRight: "D",
                                // }
                            },
                            'Multiplayer': {
                                serverUrl: true,
                            },
                            'Other': {
                                // toontownMode: true,
                            },
                            'Debug': {
                                showStats: true,
                                children: <>

                                </>,
                            }
                        },
                        reset: () => {
                            useAudioStore.getState().resetAudioSettings();
                        }
                    }}
                    infoModalConfig={{
                        previewImage: darkMode ? "img/dark-preview.webp" : "img/preview.webp",
                    }}
                />

            </Suspense>
        </>
    );
}
