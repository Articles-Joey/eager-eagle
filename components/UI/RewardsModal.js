import { useEffect, useRef, useState } from "react";

// import Image from "next/image";
// import dynamic from 'next/dynamic'

// import { useSelector } from 'react-redux'

import { Modal } from "react-bootstrap"

import ViewUserModal from "@/components/UI/ViewUserModal"

// import BasicLoading from "@/components/loading/BasicLoading";

// import powerups from "app/(site)/community/games/four-frogs/components/powerups";

// import games from "../constants/games";
const games = []

import IsDev from "@/components/UI/IsDev";
import ArticlesButton from "./Button";
import Link from "next/link";

import B from "@articles-media/articles-gamepad-helper/dist/img/Xbox UI/B.svg";
import { useModalNavigation } from "@/hooks/useModalNavigation";
// import rewards from "../rewards";
import { useGameStore } from "@/hooks/useGameStore";
import { defaultCharacter, useStore } from "@/hooks/useStore";
import classNames from "classnames";
import { useScoreStore } from "@/hooks/useScoreStore";

export function rewards() {

    return [
        {
            name: "Diving",
            description: "Unlock the ability to dive swiftly and navigate through tight spaces with precision.",
            distance: 20,
            lifetimeDistance: 20 * 5,
        },
        {
            name: "Armor Plating",
            description: "No longer die from collisions on the top and bottom of ground and sky obstacles. Watch out because you will bounce off!",
            distance: 200,
            lifetimeDistance: 200 * 5,
        },
        ...defaultCharacter.models.map(reward => {
            return {
                ...reward,
                name: reward.name + ' Player Model',
            }
        }),
        ...defaultCharacter.trails.map(reward => {
            return {
                ...reward,
                name: reward.name + ' Trail',
            }
        }),
        ...defaultCharacter.backgrounds.map(reward => {
            return {
                ...reward,
                name: reward.name + ' Background',
            }
        }),
        ...defaultCharacter.skyObjects.map(reward => {
            return {
                ...reward,
                name: reward.name + ' Sky Object',
            }
        }),
        ...defaultCharacter.groundObjects.map(reward => {
            return {
                ...reward,
                name: reward.name + ' Ground Object',
            }
        }),
    ]
}

export default function RewardsModal({
    show,
    setShow,
}) {

    const maxDistance = useScoreStore((state) => state.maxDistance)
    const lifetimeDistance = useScoreStore((state) => state.lifetimeDistance)

    const [showModal, setShowModal] = useState(true)

    const [lightboxData, setLightboxData] = useState(null)

    // const defaultCharacter = useStore((state) => state.defaultCharacter)

    // const userReduxState = useSelector((state) => state.auth.user_details);
    const userReduxState = false

    const [showVideo, setShowVideo] = useState()

    const elementsRef = useRef([]);
    useModalNavigation(elementsRef, () => setShowModal(false));

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
                className="articles-modal rewards-modal"
                size='md'
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
                    <Modal.Title>Distance Rewards</Modal.Title>
                </Modal.Header>

                <Modal.Body className="flex-column p-3">

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

                    <div>
                        {/* {rewards().filter(reward => reward.distance).length > 0 ?

                            rewards()
                            .filter(reward => reward.distance)
                            .sort((a, b) => a.distance - b.distance)
                            .map((reward, index) => (
                                <div
                                    key={index}
                                    className={classNames(
                                        `reward-item mb-3 p-3 border rounded`,
                                        {
                                            'unlocked': maxDistance >= reward.distance
                                        }
                                    )}
                                >

                                    <h5>{reward?.name}</h5>
                                    <p>{reward?.description}</p>

                                    <p className="mb-0"><strong>Distance Required:</strong> {reward?.distance} meters</p>
                                    <p><strong>Lifetime Distance Required:</strong> {reward?.lifetimeDistance} meters</p>

                                </div>
                            ))

                            :

                            <p>All rewards unlocked! Congratulations!</p>

                        } */}
                        {
                            rewards()
                                .filter(reward => reward.distance)
                                .sort((a, b) => a.distance - b.distance)
                                .map((reward, index) => (
                                    <div
                                        key={index}
                                        className={classNames(
                                            `reward-item mb-3 p-3 border rounded`,
                                            {
                                                'unlocked': maxDistance >= reward.distance
                                            }
                                        )}
                                    >

                                        <h5>{reward?.name}</h5>
                                        <p>{reward?.description}</p>

                                        <p className="mb-0"><strong>Distance Required:</strong> {reward?.distance} meters</p>
                                        <p><strong>Lifetime Distance Required:</strong> {reward?.lifetimeDistance} meters</p>

                                    </div>
                                ))
                        }
                    </div>

                </Modal.Body>

                <Modal.Footer className="justify-content-between">

                    <div></div>

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