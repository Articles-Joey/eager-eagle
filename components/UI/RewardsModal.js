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
import rewards from "../rewards";
import { useGameStore } from "@/hooks/useGameStore";
import { useStore } from "@/hooks/useStore";
import classNames from "classnames";

export default function RewardsModal({
    show,
    setShow,
}) {

    const maxDistance = useStore((state) => state.maxDistance)

    const [showModal, setShowModal] = useState(true)

    const [lightboxData, setLightboxData] = useState(null)

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

                    {rewards.map((reward, index) => (
                        <div
                            key={index}
                            className={classNames(
                                `reward-item mb-3 p-3 border rounded`,
                                { 
                                    'unlocked': maxDistance >= reward.distance 
                                }
                            )}
                        >
                            
                            <h5>{reward.name}</h5>
                            <p>{reward.description}</p>
                            
                            <p className="mb-0"><strong>Distance Required:</strong> {reward.distance} meters</p>
                            <p><strong>Lifetime Distance Required:</strong> {reward.lifetimeDistance} meters</p>

                        </div>
                    ))}

                </Modal.Body>

                <Modal.Footer className="justify-content-between">

                    <div></div>

                    <ArticlesButton variant="outline-dark" onClick={() => {
                        setShow(false)
                    }}>
                        <img src={B.src} className="me-1" alt="Close" />
                        Close
                    </ArticlesButton>

                </Modal.Footer>

            </Modal>
        </>
    )

}