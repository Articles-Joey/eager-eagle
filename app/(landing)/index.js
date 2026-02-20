"use client"
import { useEffect, useContext, useState, useRef, Suspense } from 'react';

import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// import { useSelector, useDispatch } from 'react-redux'

// import ROUTES from 'components/constants/routes'

import ArticlesButton from '@/components/UI/Button';
// import SingleInput from '@/components/Articles/SingleInput';
// import { useLocalStorageNew } from '@/hooks/useLocalStorageNew';
// import IsDev from '@/components/IsDev';
// import { ChromePicker } from 'react-color';
import { useControllerStore } from '@/hooks/useControllerStore';
// import { useSocketStore } from '@/hooks/useSocketStore';
import { useStore } from '@/hooks/useStore';
import { useGameStore } from '@/hooks/useGameStore';

// TODO - Use dev-box
// import GameScoreboard from '@/components/GameScoreboard';

// import ArticlesAd from '@/components/ArticlesAd';
import { useLandingNavigation } from '@/hooks/useLandingNavigation';
// import ReturnToLauncherButton from '@/components/UI/ReturnToLauncherButton';

// import GameScoreboard from 'components/Games/GameScoreboard'

// const Ad = dynamic(() => import('components/Ads/Ad'), {
//     ssr: false,
// });

import Ad from '@articles-media/articles-dev-box/Ad';
import GameScoreboard from '@articles-media/articles-dev-box/GameScoreboard';
import { useUserDetails, useUserToken } from '@articles-media/articles-dev-box';
import { GamepadKeyboard, PieMenu } from '@articles-media/articles-gamepad-helper';
import ScoreCard from '@/components/UI/ScoreCard';
import { useScoreStore } from '@/hooks/useScoreStore';

const ReturnToLauncherButton = dynamic(() =>
    import('@articles-media/articles-dev-box').then((mod) => mod.ReturnToLauncherButton),
    { loading: () => <p>Loading...</p> }
);

// const GlobalBody = dynamic(() =>
//     import('@articles-media/articles-dev-box/GlobalBody')
// );

// const PrivateGameModal = dynamic(
//     () => import('app/(site)/community/games/four-frogs/components/PrivateGameModal'),
//     { ssr: false }
// )

const game_key = 'eager-eagle'
const game_name = 'Eager Eagle'

export default function LobbyPage() {

    // const {
    //     socket,
    // } = useSocketStore(state => ({
    //     socket: state.socket,
    // }));

    // const userReduxState = useSelector((state) => state.auth.user_details)
    // const userReduxState = false

    const darkMode = useStore((state) => state.darkMode)
    const toggleDarkMode = useStore((state) => state.toggleDarkMode)

    const nickname = useStore(state => state.nickname)
    const setNickname = useStore(state => state.setNickname)
    const nicknameKeyboard = useStore((state) => state.nicknameKeyboard)

    const hydrated = useStore((state) => state._hasHydrated)

    const infoModal = useStore((state) => state.infoModal)
    const setInfoModal = useStore((state) => state.setInfoModal)

    const settingsModal = useStore((state) => state.showSettingsModal)
    const setSettingsModal = useStore((state) => state.setSettingsModal)

    const creditsModal = useStore((state) => state.creditsModal)
    const setCreditsModal = useStore((state) => state.setCreditsModal)

    const setCustomizeModal = useStore((state) => state.setCustomizeModal)
    const setRewardsModal = useStore((state) => state.setRewardsModal)

    const setGameOver = useGameStore((state) => state.setGameOver)
    
    const maxDistance = useScoreStore((state) => state.maxDistance)

    const controllerState = useControllerStore((state) => state.controllerState)

    const hasController = controllerState?.buttons?.length > 0

    const elementsRef = useRef([]);
    useLandingNavigation(elementsRef);

    useEffect(() => {

        setGameOver(false)

    }, [])

    // First load generate random nickname if not set
    useEffect(() => {

        if (hydrated && nickname == null) {
            useStore.getState().randomNickname()
        }

    }, [hydrated, nickname])

    const {
        data: userToken,
        error: userTokenError,
        isLoading: userTokenLoading,
        mutate: userTokenMutate
    } = useUserToken(
        "3049"
    );

    const {
        data: userDetails,
        error: userDetailsError,
        isLoading: userDetailsLoading,
        mutate: userDetailsMutate
    } = useUserDetails({
        token: userToken
    });

    return (

        <div className="game-landing-page">

            <Suspense>
                <GamepadKeyboard
                    disableToggle={true}
                    active={nicknameKeyboard}
                    onFinish={(text) => {
                        console.log("FINISH KEYBOARD", text)
                        useStore.getState().setNickname(text);
                        useStore.getState().setNicknameKeyboard(false);
                    }}
                    onCancel={(text) => {
                        console.log("CANCEL KEYBOARD", text)
                        // useStore.getState().setNickname(text);
                        useStore.getState().setNicknameKeyboard(false);
                    }}
                />
                <PieMenu
                    options={[
                        {
                            label: 'Settings',
                            icon: 'fad fa-cog',
                            callback: () => {
                                setSettingsModal(prev => !prev)
                            }
                        },
                        {
                            label: 'Go Back',
                            icon: 'fad fa-arrow-left',
                            callback: () => {
                                window.history.back()
                            }
                        },
                        {
                            label: 'Credits',
                            icon: 'fad fa-info-circle',
                            callback: () => {
                                setCreditsModal(true)
                            }
                        },
                        {
                            label: 'Game Launcher',
                            icon: 'fad fa-gamepad',
                            callback: () => {
                                window.location.href = 'https://games.articles.media';
                            }
                        },
                        {
                            label: `${darkMode ? "Light" : "Dark"} Mode`,
                            icon: 'fad fa-palette',
                            callback: () => {
                                toggleDarkMode()
                            }
                        }
                    ]}
                    onFinish={(event) => {
                        console.log("Event", event)
                        if (event.callback) {
                            event.callback()
                        }
                    }}
                />
            </Suspense>

            <div className='background-wrap'>
                {darkMode ?
                    <Image
                        src={`/img/dark-preview.webp`}
                        alt=""
                        fill
                    // style={{ objectFit: 'cover', objectPosition: 'center', filter: 'blur(10px)' }}
                    />
                    :
                    <Image
                        src={`/img/preview.webp`}
                        alt=""
                        fill
                    // style={{ objectFit: 'cover', objectPosition: 'center', filter: 'blur(10px)' }}
                    />
                }

            </div>

            <div
                className="container"
            >

                <div
                    className='mx-auto'
                    style={{
                        "width": "20rem",
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >

                    <img
                        src="img/icon.png"
                        height={200}
                        alt="Logo"
                    />

                    <h1 className='metal-mania-regular mb-4'>{game_name}</h1>

                    {maxDistance ?
                        <div
                            className='mb-3 d-flex align-items-stretch w-100'
                        >
                            <ScoreCard />
                        </div>
                        :
                        null
                    }

                    <div
                        className="card card-articles card-sm mb-3"

                    >

                        {/* <div style={{ position: 'relative', height: '200px' }}>
                            <Image
                                src={Logo}
                                alt=""
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div> */}

                        <div className='card-header d-flex align-items-center'>

                            <div className="flex-grow-1">

                                <div className="form-group articles mb-0">
                                    <label htmlFor="nickname">Nickname</label>
                                    {/* <SingleInput
                                        value={nickname}
                                        setValue={setNickname}
                                        noMargin
                                    /> */}
                                    <div className='d-flex'>
                                        <input
                                            ref={el => elementsRef.current[0] = el}
                                            type="text"
                                            className="form-control"
                                            id="nickname"
                                            value={nickname}
                                            placeholder="Enter your nickname"
                                            onChange={(e) => {
                                                setNickname(e.target.value)
                                            }}
                                        />
                                        <ArticlesButton
                                            className="ms-2"
                                            small
                                            onClick={() => {
                                                useStore.getState().randomNickname()
                                            }}
                                        >
                                            <i className="fas fa-random me-0"></i>
                                        </ArticlesButton>
                                    </div>
                                </div>

                                <div className='mt-1' style={{ fontSize: '0.8rem' }}>Visible to all players</div>

                            </div>
                        </div>

                        <div className="card-body">

                            <Link
                                href={{
                                    pathname: `/play`
                                }}
                            >
                                <ArticlesButton
                                    ref={el => elementsRef.current[1] = el}
                                    // active={activeIndex === 0}
                                    className={`w-100`}
                                    // small
                                    large
                                >
                                    <i className="fas fa-play"></i>
                                    Play Single Player
                                </ArticlesButton>
                            </Link>

                            <div
                                className={`mt-3 controller-button-group ${hasController && 'hasController'}`}
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
                                    <i className="fas fa-coins"></i>
                                    Rewards
                                </ArticlesButton>
                            </div>

                            {/* <div className="fw-bold mb-1 small text-center">
                                {lobbyDetails.players.length || 0} player{lobbyDetails.players.length > 1 && 's'} in the lobby.
                            </div> */}

                            {/* <div className="servers">
    
                                {[1, 2, 3, 4].map(id => {
    
                                    let lobbyLookup = lobbyDetails?.fourFrogsGlobalState?.games?.find(lobby =>
                                        parseInt(lobby.server_id) == id
                                    )
    
                                    return (
                                        <div key={id} className="server">
    
                                            <div className='d-flex justify-content-between align-items-center w-100 mb-2'>
                                                <div className="mb-0" style={{ fontSize: '0.9rem' }}><b>Server {id}</b></div>
                                                <div className='mb-0'>{lobbyLookup?.players?.length || 0}/4</div>
                                            </div>
    
                                            <div className='d-flex justify-content-around w-100 mb-1'>
                                                {[1, 2, 3, 4].map(player_count => {
    
                                                    let playerLookup = false
    
                                                    if (lobbyLookup?.players?.length >= player_count) playerLookup = true
    
                                                    return (
                                                        <div key={player_count} className="icon" style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            ...(playerLookup ? {
                                                                backgroundColor: 'black',
                                                            } : {
                                                                backgroundColor: 'gray',
                                                            }),
                                                            border: '1px solid black'
                                                        }}>
    
                                                        </div>
                                                    )
                                                })}
                                            </div>
    
                                            <Link
                                                className={``}
                                                href={{
                                                    pathname: `/play`,
                                                    query: {
                                                        server: id
                                                    }
                                                }}
                                            >
                                                <ArticlesButton
                                                    className="px-5"
                                                    small
                                                >
                                                    Join
                                                </ArticlesButton>
                                            </Link>
    
                                        </div>
                                    )
                                })}
    
                            </div> */}

                        </div>

                        <div className={`card-footer landing-footer d-flex flex-wrap justify-content-center ${hasController && "hasController"}`}>

                            <div className='w-50 d-flex'>
                                <ArticlesButton
                                    ref={el => elementsRef.current[4] = el}
                                    // active={activeIndex === 3}
                                    className={`w-100 flex-grow-1`}
                                    small
                                    onClick={() => {
                                        setSettingsModal(true)
                                    }}
                                >
                                    <i className="fad fa-cog"></i>
                                    Settings
                                </ArticlesButton>
                                <ArticlesButton
                                    // ref={el => elementsRef.current[4] = el}
                                    // active={activeIndex === 3}
                                    className={`flex-grow-0`}
                                    small
                                    onClick={() => {
                                        toggleDarkMode()
                                    }}
                                >
                                    <i className="fad fa-sun"></i>
                                </ArticlesButton>
                            </div>

                            <ArticlesButton
                                ref={el => elementsRef.current[5] = el}
                                // active={activeIndex === 4}
                                className={`w-50`}
                                small
                                onClick={() => {
                                    setInfoModal(true)
                                }}
                            >
                                <i className="fad fa-info-square"></i>
                                Rules & Controls
                            </ArticlesButton>

                            <Link
                                href={`https://github.com/Articles-Joey/eager-eagle`}
                                target="_blank"
                                className="w-50"
                            >
                                <ArticlesButton
                                    ref={el => elementsRef.current[6] = el}
                                    // active={activeIndex === 5}
                                    className={`w-100`}
                                    onClick={() => {

                                    }}
                                >
                                    <i className="fab fa-github"></i>
                                    Github
                                </ArticlesButton>
                            </Link>

                            {/* <Link href={'/'} className='w-50'>
                                <ArticlesButton
                                    className={`w-100`}
                                    small
                                    onClick={() => {
    
                                    }}
                                >
                                    <i className="fad fa-sign-out fa-rotate-180"></i>
                                    Leave Game
                                </ArticlesButton>
                            </Link> */}

                            <ArticlesButton
                                ref={el => elementsRef.current[7] = el}
                                // active={activeIndex === 6}
                                className={`w-50`}
                                small
                                onClick={() => {
                                    setCreditsModal(true)
                                }}
                            >
                                <i className="fad fa-users"></i>
                                Credits
                            </ArticlesButton>

                        </div>

                    </div>

                    <Suspense>
                        <ReturnToLauncherButton />
                    </Suspense>

                </div>

            </div>

            {/* <div className='mt-4 mt-lg-0'> */}
            <GameScoreboard
                game={game_name}
                style="Default"
                darkMode={darkMode ? true : false}
            />
            {/* </div> */}

            <Ad
                style="Default"
                section={"Games"}
                section_id={game_name}
                darkMode={darkMode ? true : false}
                user_ad_token={userToken}
                userDetails={userDetails}
                userDetailsLoading={userDetailsLoading}
            />

        </div>
    );
}