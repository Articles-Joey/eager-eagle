"use client"
import { useEffect, useContext, useState, useRef, Suspense } from 'react';

import Link from 'next/link'

import ArticlesButton from '@/components/UI/Button';

import { useControllerStore } from '@/hooks/useControllerStore';
import { useStore } from '@/hooks/useStore';
import { useGameStore } from '@/hooks/useGameStore';

import { useLandingNavigation } from '@/hooks/useLandingNavigation';

import ScoreCard from '@/components/UI/ScoreCard';
import { useScoreStore } from '@/hooks/useScoreStore';

import PageTemplateLandingPage from '@articles-media/articles-dev-box/PageTemplateLandingPage';
import { useSocketStore } from '@/hooks/useSocketStore';
import RotatingMascot from '@/components/UI/RotatingMascot';
import LandingBackgroundAnimation from '@/components/Game/LandingBackgroundAnimation';

export default function LobbyPage() {

    const darkMode = useStore((state) => state.darkMode)
    const lobbyDetails = useStore(state => state.lobbyDetails)

    const setCustomizeModal = useStore((state) => state.setCustomizeModal)
    const setRewardsModal = useStore((state) => state.setRewardsModal)

    // const distance = useGameStore((state) => state.distance)
    const setDistance = useGameStore((state) => state.setDistance)

    const setGameOver = useGameStore((state) => state.setGameOver)

    const maxDistance = useScoreStore((state) => state.maxDistance)

    const controllerState = useControllerStore((state) => state.controllerState)

    const hasController = controllerState?.buttons?.length > 0

    const elementsRef = useRef([]);
    useLandingNavigation(elementsRef);

    useEffect(() => {
        setGameOver(false)
        setDistance(0)
    }, [])

    return (
        <>
            <PageTemplateLandingPage
                useSocketStore={useSocketStore}
                useStore={useStore}
                RotatingMascot={RotatingMascot}
                Link={Link}
                // logoImage={logo.src}
                LandingBackgroundAnimation={
                    <LandingBackgroundAnimation />
                }
                CardBodyOverride={<>
                    <div className="card-body">

                        {process.env.NEXT_PUBLIC_ENABLE_ARTICLES === 'true' &&
                            <>
                                <div className="fw-bold mb-1 small text-center">
                                    {lobbyDetails?.online_player_count || 0} player{(lobbyDetails?.online_player_count !== 1) && 's'} online.
                                </div>
                            </>
                        }

                        {/* <div className='small fw-bold'>Public Servers</div> */}

                        <Link
                            prefetch={false}
                            className={``}
                            href={{
                                pathname: `/play`
                            }}
                        >
                            <ArticlesButton
                                className="px-5 w-100 mb-2"
                            >
                                <i className="fas fa-play me-2"></i>
                                Play Game
                            </ArticlesButton>
                        </Link>

                        <div
                            className={`controller-button-group ${hasController && 'hasController'}`}
                        >
                            <ArticlesButton
                                ref={el => elementsRef.current[2] = el}
                                // active={activeIndex === 1}
                                className={`w-50`}
                                small
                                onClick={() => {
                                    setCustomizeModal(true)
                                }}
                            >
                                <i className="fas fa-palette"></i>
                                Customize
                            </ArticlesButton>
                            <ArticlesButton
                                ref={el => elementsRef.current[3] = el}
                                // active={activeIndex === 2}
                                className={`w-50`}
                                small
                                onClick={() => {
                                    setRewardsModal(true)
                                }}
                            >
                                <i className="fas fa-gift"></i>
                                Rewards
                            </ArticlesButton>
                        </div>

                    </div>
                </>}
                PostHeroContent={<>
                    {maxDistance ?
                        <div
                            className='mb-3 d-flex align-items-stretch w-100'
                        >
                            <ScoreCard />
                        </div>
                        :
                        null
                    }
                </>}
                // disableHero
                heroOverride={<div className='d-flex flex-column justify-content-center align-items-center'>

                    <img
                        src="img/icon.png"
                        height={200}
                        alt="Logo"
                    />

                    <h1 className='metal-mania-regular mb-4 text-center'>
                        {process.env.NEXT_PUBLIC_GAME_NAME}
                    </h1>

                </div>}
                backgroundImage={darkMode ? "/img/dark-preview.webp" : "/img/preview.webp"}
                singlePlayerConfig={{

                }}
                NicknameInputConfig={{
                    PreComponent: <></>,
                }}
                multiplayerConfig={{
                    // type: "WebSocket",
                    // comingSoon: true,
                    // defaultServers: 2,
                    // privateServerSupport: false,
                }}
                gameScoreboardConfig={{
                    append_score_text: "m",
                    metrics: [
                        {
                            label: 'Max Distance',
                            key: "score",
                            format: (value) => `${value} m`
                        },
                        {
                            label: 'Distance Traveled',
                            key: "total_distance",
                            format: (value) => `${value} m`
                        }
                    ]
                }}
                // brandingTextClass="jaro-primary"
                disableGameScoreboard={process.env.NEXT_PUBLIC_ENABLE_ARTICLES !== 'true'}
                disableAd={process.env.NEXT_PUBLIC_ENABLE_ARTICLES !== 'true'}
            />
        </>
    );
}