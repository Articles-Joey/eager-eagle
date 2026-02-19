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
import { useModalNavigation } from "@/hooks/useModalNavigation";
import { useStore } from "@/hooks/useStore";
import ScenePreview from "../Game/ScenePreview";

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

    const character = useStore((state) => state.character)
    const setCharacter = useStore((state) => state.setCharacter)

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

                                {character?.models?.map(location =>
                                    <Dropdown.Item
                                        key={location.name}
                                        // active={cameraMode == location.name}
                                        onClick={() => {
                                            setCharacter({ ...character, model: location.name })
                                            // setCameraMode(location.name)
                                            // setShowMenu(false)
                                        }}
                                        className="d-flex justify-content-between"
                                    >
                                        <i className="fad fa-check"></i>
                                        {location.name}
                                    </Dropdown.Item>
                                )}

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

                                {character?.trails?.map(location =>
                                    <Dropdown.Item
                                        key={location.name}
                                        // active={cameraMode == location.name}
                                        onClick={() => {
                                            setCharacter({ ...character, trail: location.name })
                                            // setCameraMode(location.name)
                                            // setShowMenu(false)
                                        }}
                                        className="d-flex justify-content-between"
                                    >
                                        <i className="fad fa-check"></i>
                                        {location.name}
                                    </Dropdown.Item>
                                )}

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

                                {character?.groundObjects?.map(location =>
                                    <Dropdown.Item
                                        key={location.name}
                                        // active={cameraMode == location.name}
                                        onClick={() => {
                                            setCharacter({
                                                ...character,
                                                groundObject: location.name
                                            })
                                            // setCameraMode(location.name)
                                            // setShowMenu(false)
                                        }}
                                        className="d-flex justify-content-between"
                                    >
                                        <i className="fad fa-check"></i>
                                        {location.name}
                                    </Dropdown.Item>
                                )}

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

                                {character?.skyObjects?.map(location =>
                                    <Dropdown.Item
                                        key={location.name}
                                        // active={cameraMode == location.name}
                                        onClick={() => {
                                            setCharacter({
                                                ...character,
                                                skyObject: location.name
                                            })
                                            // setCameraMode(location.name)
                                            // setShowMenu(false)
                                        }}
                                        className="d-flex justify-content-between"
                                    >
                                        <i className="fad fa-check"></i>
                                        {location.name}
                                    </Dropdown.Item>
                                )}

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

                                {character?.backgrounds?.map(location =>
                                    <Dropdown.Item
                                        key={location.name}
                                        // active={cameraMode == location.name}
                                        onClick={() => {
                                            setCharacter({
                                                ...character,
                                                background: location.name
                                            })
                                            // setCameraMode(location.name)
                                            // setShowMenu(false)
                                        }}
                                        className="d-flex justify-content-between"
                                    >
                                        <i className="fad fa-check"></i>
                                        {location.name}
                                    </Dropdown.Item>
                                )}

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