import { useEffect, useRef, useState } from "react";

// import Image from "next/image";
// import dynamic from 'next/dynamic'

// import { useSelector } from 'react-redux'

import { Dropdown, DropdownButton, Modal } from "react-bootstrap"

import ViewUserModal from "@/components/UI/ViewUserModal"

// import BasicLoading from "@/components/loading/BasicLoading";

// import powerups from "app/(site)/community/games/four-frogs/components/powerups";

// import games from "../constants/games";
const games = []

import IsDev from "@/components/UI/IsDev";
import ArticlesButton from "./Button";
import Link from "next/link";

import B from "@articles-media/articles-gamepad-helper/dist/img/Xbox UI/B.svg";
import Y from "@articles-media/articles-gamepad-helper/dist/img/Xbox UI/Y.svg";

import { useModalNavigation } from "@/hooks/useModalNavigation";
import { defaultCharacter, useStore } from "@/hooks/useStore";
import ScenePreview from "../Game/ScenePreview";
import { useScoreStore } from "@/hooks/useScoreStore";
import classNames from "classnames";

export default function CustomizeModal({
    show,
    setShow,
    credits
}) {

    const [showModal, setShowModal] = useState(true)

    const [lightboxData, setLightboxData] = useState(null)

    // const userReduxState = useSelector((state) => state.auth.user_details);
    const userReduxState = false

    const [showVideo, setShowVideo] = useState()

    const elementsRef = useRef([]);
    useModalNavigation(elementsRef, () => setShowModal(false));

    // const defaultCharacter = useStore((state) => state.defaultCharacter)
    const character = useStore((state) => state.character)
    const setCharacter = useStore((state) => state.setCharacter)

    const maxDistance = useScoreStore((state) => state.maxDistance)
    const lifetimeDistance = useScoreStore((state) => state.lifetimeDistance)

    return (
        <>
            {/* {lightboxData && (
                <Lightbox
                    mainSrc={lightboxData?.location}
                    onCloseRequest={() => setLightboxData(null)}
                    reactModalStyle={{
                        overlay: {
                            zIndex: '2000'
                        }
                    }}
                />
            )} */}

            <Modal
                className="articles-modal customize-modal"
                size='lg'
                show={showModal}
                centered
                scrollable
                onExited={() => {
                    setShow(false)
                }}
                onHide={() => {
                    setShowModal(false)
                }}
            >

                <Modal.Header closeButton>
                    <Modal.Title>Customize Game</Modal.Title>
                </Modal.Header>

                <Modal.Body
                    className="d-flex flex-column flex-lg-row p-3"
                >

                    <div
                        className="scene-preview mb-3 mb-lg-0"
                    >
                        <ScenePreview />
                    </div>

                    <div className="d-flex flex-column w-100 ms-lg-3">

                        <div className="d-flex justify-content-center text-center mb-3">

                            <div className="px-3">
                                <h3>{maxDistance}</h3>
                                <div>max distance</div>
                            </div>

                            <div className="px-3">
                                <h3>{lifetimeDistance}</h3>
                                <div>lifetime distance</div>
                            </div>

                        </div>

                        {/* Eagle / Flappy Bird / Plane */}
                        {/* <div>Player:</div> */}
                        <DropdownButton
                            variant="articles w-100 text-start"
                            size='sm'
                            id="dropdown-basic-button"
                            className="dropdown-articles mb-3"
                            title={
                                <span>
                                    <i className="fad fa-user me-2"></i>
                                    <span>Player: {character.model}</span>
                                </span>
                            }
                        >

                            <div style={{ maxHeight: '600px', overflowY: 'auto', width: '200px' }}>

                                {defaultCharacter?.models?.map(location => {

                                    const isUnlocked = defaultCharacter.models.find(bg => {
                                        return (
                                            bg.name === location.name
                                            &&
                                            (
                                                maxDistance >= bg.distance
                                                ||
                                                lifetimeDistance >= bg.lifetimeDistance
                                                ||
                                                bg.distance === 0
                                            )
                                        )
                                    })

                                    return (
                                        <RewardDropdownItem
                                            key={location.name}
                                            reward={location}
                                            isUnlocked={isUnlocked}
                                        />
                                    )

                                })}

                            </div>

                        </DropdownButton>

                        <DropdownButton
                            variant="articles w-100 text-start"
                            size='sm'
                            id="dropdown-basic-button"
                            className="dropdown-articles mb-3"
                            title={
                                <span>
                                    <i className="fad fa-user me-2"></i>
                                    <span>Trail: {character.trail}</span>
                                </span>
                            }
                        >

                            <div style={{ maxHeight: '600px', overflowY: 'auto', width: '200px' }}>

                                {defaultCharacter?.trails?.map(location => {

                                    const isUnlocked = defaultCharacter.trails.find(bg => {
                                        return (
                                            bg.name === location.name
                                            &&
                                            (
                                                maxDistance >= bg.distance
                                                ||
                                                lifetimeDistance >= bg.lifetimeDistance
                                                ||
                                                bg.distance === 0
                                            )
                                        )
                                    })

                                    return (
                                        <RewardDropdownItem
                                            key={location.name}
                                            reward={location}
                                            isUnlocked={isUnlocked}
                                        />
                                    )
                                })}

                            </div>

                        </DropdownButton>

                        <DropdownButton
                            variant="articles w-100 text-start"
                            size='sm'
                            id="dropdown-basic-button"
                            className="dropdown-articles mb-3"
                            title={
                                <span>
                                    <i className="fad fa-user me-2"></i>
                                    <span>Ground Object: {character.groundObject}</span>
                                </span>
                            }
                        >

                            <div style={{ maxHeight: '600px', overflowY: 'auto', width: '200px' }}>

                                {defaultCharacter?.groundObjects?.map(location => {

                                    const isUnlocked = defaultCharacter.groundObjects.find(bg => {
                                        return (
                                            bg.name === location.name
                                            &&
                                            (
                                                maxDistance >= bg.distance
                                                ||
                                                lifetimeDistance >= bg.lifetimeDistance
                                                ||
                                                bg.distance === 0
                                            )
                                        )
                                    })

                                    return (
                                        <RewardDropdownItem
                                            key={location.name}
                                            reward={location}
                                            isUnlocked={isUnlocked}
                                        />
                                    )

                                })}

                            </div>

                        </DropdownButton>

                        <DropdownButton
                            variant="articles w-100 text-start"
                            size='sm'
                            id="dropdown-basic-button"
                            className="dropdown-articles mb-3"
                            title={
                                <span>
                                    <i className="fad fa-user me-2"></i>
                                    <span>Sky Object: {character.skyObject}</span>
                                </span>
                            }
                        >

                            <div style={{ maxHeight: '600px', overflowY: 'auto', width: '200px' }}>

                                {defaultCharacter?.skyObjects?.map(location => {

                                    const isUnlocked = defaultCharacter.skyObjects.find(bg => {
                                        return (
                                            bg.name === location.name
                                            &&
                                            (
                                                maxDistance >= bg.distance
                                                ||
                                                lifetimeDistance >= bg.lifetimeDistance
                                                ||
                                                bg.distance === 0
                                            )
                                        )
                                    })

                                    return (
                                        <RewardDropdownItem
                                            key={location.name}
                                            reward={location}
                                            isUnlocked={isUnlocked}
                                        />
                                    )

                                })}

                            </div>

                        </DropdownButton>

                        <DropdownButton
                            variant="articles w-100 text-start"
                            size='sm'
                            id="dropdown-basic-button"
                            className="dropdown-articles mb-3"
                            title={
                                <span>
                                    <i className="fad fa-user me-2"></i>
                                    <span>Background: {character.background}</span>
                                </span>
                            }
                        >

                            <div style={{ maxHeight: '600px', overflowY: 'auto', width: '200px' }}>

                                {defaultCharacter?.backgrounds?.map(location => {

                                    const isUnlocked = defaultCharacter.backgrounds.find(bg => {
                                        return (
                                            bg.name === location.name
                                            &&
                                            (
                                                maxDistance >= bg.distance
                                                ||
                                                lifetimeDistance >= bg.lifetimeDistance
                                                ||
                                                bg.distance === 0
                                            )
                                        )
                                    })

                                    return (
                                        <RewardDropdownItem
                                            key={location.name}
                                            reward={location}
                                            isUnlocked={isUnlocked}
                                        />
                                    )
                                })}

                            </div>

                        </DropdownButton>

                        {/* <div>Accent Color: Blue</div> */}

                        {/* Basic / Neon / Fire */}
                        {/* <div>Trail: Basic</div> */}

                        {/* Buildings / Rocks / Light Post / Tubes */}
                        {/* <div>Ground Obstacles: Rocks</div> */}

                        {/* Helicopters / Birds / Drones */}
                        {/* <div>Sky Obstacles: Helicopters</div> */}

                    </div>

                </Modal.Body>

                <Modal.Footer className="justify-content-between">

                    <ArticlesButton variant="danger" onClick={() => {
                        setCharacter(defaultCharacter)
                    }}>
                        <i className="no-controller-only fad fa-redo me-1"></i>
                        <img src={Y.src} className="controller-only me-1" alt="Reset" />
                        Reset
                    </ArticlesButton>

                    <ArticlesButton variant="outline-dark" onClick={() => {
                        setShow(false)
                    }}>
                        <i className="no-controller-only fad fa-times me-1"></i>
                        <img src={B.src} className="controller-only me-1" alt="Close" />
                        Close
                    </ArticlesButton>

                </Modal.Footer>

            </Modal>
        </>
    )

}

function RewardDropdownItem({
    reward,
    isUnlocked
}) {

    const setCharacter = useStore((state) => state.setCharacter)
    const character = useStore((state) => state.character)

    return (
        <Dropdown.Item
            // key={reward.name}
            onClick={() => {
                setCharacter({
                    ...character,
                    background: reward.name
                })
            }}
            className={
                classNames(
                    `d-flex justify-content-between`,
                    {
                        'unlocked': isUnlocked
                    }
                )
            }
            disabled={!isUnlocked}
        >

            <div className="d-flex justify-content-between w-100">

                {isUnlocked ? <i className="fad fa-check"></i> : <i className="fad fa-lock"></i>}

                <div className="text-end">

                    <div>{reward.name}</div>

                    <div>
                        <div className="text-muted small">
                            {reward.distance > 0 && <div>{reward.distance} Distance</div>}
                            {reward.lifetimeDistance > 0 && <div>{reward.lifetimeDistance} Lifetime</div>}
                        </div>
                    </div>

                </div>

            </div>

        </Dropdown.Item>
    )
}