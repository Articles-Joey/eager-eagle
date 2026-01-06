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
import GameScoreboard from '@/components/GameScoreboard';
import ArticlesAd from '@/components/ArticlesAd';
import { useLandingNavigation } from '@/hooks/useLandingNavigation';
import ReturnToLauncherButton from '@/components/UI/ReturnToLauncherButton';

// import GameScoreboard from 'components/Games/GameScoreboard'

// const Ad = dynamic(() => import('components/Ads/Ad'), {
//     ssr: false,
// });



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

    const nickname = useStore(state => state.nickname)
    const setNickname = useStore(state => state.setNickname)

    const infoModal = useStore((state) => state.infoModal)
    const setInfoModal = useStore((state) => state.setInfoModal)

    const settingsModal = useStore((state) => state.showSettingsModal)
    const setSettingsModal = useStore((state) => state.setSettingsModal)

    const creditsModal = useStore((state) => state.creditsModal)
    const setCreditsModal = useStore((state) => state.setCreditsModal)

    const setGameOver = useGameStore((state) => state.setGameOver)

    const controllerState = useControllerStore((state) => state.controllerState)

    const hasController = controllerState?.buttons?.length > 0

    const elementsRef = useRef([]);
    useLandingNavigation(elementsRef);

    useEffect(() => {
        setGameOver(false)
    }, [])

    return (

        <div className="game-landing-page">

            <div className='background-wrap'>
                {/* <Image
                    src={`${process.env.NEXT_PUBLIC_CDN}games/Assassin/assassin-thumbnail.webp`}
                    alt=""
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center', filter: 'blur(10px)' }}
                /> */}
            </div>

            <div
                className="container d-flex flex-column justify-content-center align-items-center"
                style={{ "width": "20rem" }}
            >

                <img src="img/icon.png" height={200} alt="Logo" />

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
                            <Link href={{
                                pathname: `/play`
                            }}>
                                <ArticlesButton
                                    ref={el => elementsRef.current[2] = el}
                                    // active={activeIndex === 1}
                                    className={`w-50`}
                                    small
                                >
                                    <i className="fas fa-palette"></i>
                                    Customize
                                </ArticlesButton>
                            </Link>
                            <Link href={{
                                pathname: `/play`
                            }}>
                                <ArticlesButton
                                    ref={el => elementsRef.current[3] = el}
                                    // active={activeIndex === 2}
                                    className={`w-50`}
                                    small
                                >
                                    <i className="fas fa-coins"></i>
                                    Rewards
                                </ArticlesButton>
                            </Link>
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

                        <ArticlesButton
                            ref={el => elementsRef.current[4] = el}
                            // active={activeIndex === 3}
                            className={`w-50`}
                            small
                            onClick={() => {
                                setSettingsModal(true)
                            }}
                        >
                            <i className="fad fa-cog"></i>
                            Settings
                        </ArticlesButton>

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

                <GameScoreboard
                    game="Eager Eagle"
                />

                <ArticlesAd
                    section={"Games"}
                    section_id={game_name}
                />

            </div>
        </div>
    );
}