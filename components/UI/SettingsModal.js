import { useRef, useState } from "react";

import { Modal, Form } from "react-bootstrap"

import ArticlesButton from "@/components/UI/Button";
import { useStore } from "@/hooks/useStore";

import B from "@articles-media/articles-gamepad-helper/dist/img/Xbox UI/B.svg";
import Y from "@articles-media/articles-gamepad-helper/dist/img/Xbox UI/Y.svg";
import { useModalNavigation } from "@/hooks/useModalNavigation";
import { set } from "date-fns";

export default function SettingsModal({
    show,
    setShow,
}) {

    const [showModal, setShowModal] = useState(true)

    const [lightboxData, setLightboxData] = useState(null)

    const [tab, setTab] = useState('Graphics')

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
                className="articles-modal"
                size='md'
                show={showModal}
                // To much jumping with little content for now
                // centered
                scrollable
                onExited={() => {
                    setShow(false)
                }}
                onHide={() => {
                    setShowModal(false)
                }}
            >

                <Modal.Header closeButton>
                    <Modal.Title>Game Settings</Modal.Title>
                </Modal.Header>

                <Modal.Body className="flex-column p-0">

                    <div className='p-2'>
                        {[
                            'Graphics',
                            'Controls',
                            'Audio',
                            // 'Chat'
                        ].map(item =>
                            <ArticlesButton
                                key={item}
                                active={tab == item}
                                onClick={() => { setTab(item) }}
                            >
                                {item}
                            </ArticlesButton>
                        )}
                    </div>

                    <hr className="my-0" />

                    <div className="p-2">
                        {tab == 'Graphics' &&
                            <GraphicsSettings />
                        }
                        {tab == 'Controls' &&
                            <ControlsSettings />
                        }
                        {tab == 'Audio' &&
                            <AudioSettings />
                        }
                        {tab == 'Chat' &&
                            <>
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Game chat panel"
                                />
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Censor chat"
                                />
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Game chat speech bubbles"
                                />
                            </>
                        }
                    </div>

                </Modal.Body>

                <Modal.Footer className="justify-content-between">

                    <ArticlesButton
                        variant="outline-danger "
                        onClick={() => {
                            setShow(false)
                        }}
                    >
                        <i className="no-controller-only fad fa-eraser"></i>
                        <img src={Y.src} className="controller-only me-1" alt="Close" />
                        Reset
                    </ArticlesButton>

                    <ArticlesButton
                        variant="outline-dark"
                        onClick={() => {
                            setShow(false)
                        }}
                    >
                        <i className="no-controller-only fad fa-times me-1"></i>
                        <img src={B.src} className="controller-only me-1" alt="Close" />
                        Close
                    </ArticlesButton>

                </Modal.Footer>

            </Modal>
        </>
    )

}

function GraphicsSettings() {
    
    const darkMode = useStore(state => state.darkMode)
    const setDarkMode = useStore(state => state.setDarkMode)

    const debug = useStore(state => state.debug)
    const setDebug = useStore(state => state.setDebug)

    const graphicsQuality = useStore(state => state.graphicsQuality)
    const setGraphicsQuality = useStore(state => state.setGraphicsQuality)

    return (
        <>
            <div>
                <div className="mb-0">Color Mode</div>
                <div className="mb-3">
                    <ArticlesButton
                        variant="articles"
                        className="border "
                        active={darkMode}
                        onClick={() => {
                            // setGraphicsQuality(level)
                            setDarkMode(true)
                        }}
                    >
                        Dark Mode
                    </ArticlesButton>
                    <ArticlesButton
                        variant="articles"
                        className="border me-2"
                        active={!darkMode}
                        onClick={() => {
                            // setGraphicsQuality(level)
                            setDarkMode(false)
                        }}
                    >
                        Light Mode
                    </ArticlesButton>
                </div>
            </div>

            <div>
                <div className="mb-0">Debug Mode</div>
                <div className="mb-3">
                    <ArticlesButton
                        variant="articles"
                        className="border "
                        active={!debug}
                        onClick={() => {
                            setDebug(false)
                        }}
                    >
                        Disabled
                    </ArticlesButton>
                    <ArticlesButton
                        variant="articles"
                        className="border me-2"
                        active={debug}
                        onClick={() => {
                            setDebug(true)
                        }}
                    >
                        Enabled
                    </ArticlesButton>
                </div>
            </div>

            <div className="mb-3">
                <div className="mb-0">Graphics Quality</div>
                {['Low', 'Medium', 'High'].map(level =>
                    <ArticlesButton
                        variant="articles"
                        className=""
                        key={level}
                        active={graphicsQuality == level}
                        onClick={() => {
                            setGraphicsQuality(level)
                        }}
                    >
                        {level}
                    </ArticlesButton>
                )
                }
            </div>
        </>
    )
}

function AudioSettings() {

    const setAudioSettings = useStore(state => state.setAudioSettings)
    const audioSettings = useStore(state => state.audioSettings)

    return (
        <>

            <div>Game Audio</div>

            <div className="mb-3">
                <ArticlesButton
                    variant="articles"
                    className=""
                    active={!audioSettings.enabled}
                    onClick={() => {
                        // setGraphicsQuality(level)
                        setAudioSettings({ ...audioSettings, enabled: false })
                    }}
                >
                    Disabled
                </ArticlesButton>
                <ArticlesButton
                    variant="articles"
                    className="me-2"
                    active={audioSettings.enabled}
                    onClick={() => {
                        // setGraphicsQuality(level)
                        setAudioSettings({ ...audioSettings, enabled: true })
                    }}
                >
                    Enabled
                </ArticlesButton>
            </div>

            <Form.Label className="mb-0">Game Volume - {audioSettings?.soundEffectsVolume}</Form.Label>
            <Form.Range
                value={audioSettings?.soundEffectsVolume}
                onChange={(e) => setAudioSettings({
                    ...audioSettings,
                    soundEffectsVolume: Number(e.target.value),
                })}
            />
            <Form.Label className="mb-0">Music Volume - {audioSettings?.backgroundMusicVolume}</Form.Label>
            <Form.Range
                value={audioSettings?.backgroundMusicVolume}
                onChange={(e) => setAudioSettings({
                    ...audioSettings,
                    backgroundMusicVolume: Number(e.target.value),
                })}
            />
        </>
    )
}

function ControlsSettings() {
    return (
        <div>
            {[
                {
                    action: 'Jump',
                    defaultKeyboardKey: 'Space'
                },
                {
                    action: 'Dive',
                    defaultKeyboardKey: 'Shift'
                },
                {
                    action: 'Use Item',
                    defaultKeyboardKey: 'Enter'
                },
            ].map(obj =>
                <div key={obj.action}>
                    <div className="flex-header border-bottom pb-1 mb-1">

                        <div>
                            <div>{obj.action}</div>
                            {obj.emote && <div className="span badge border bg-dark">Emote</div>}
                        </div>

                        <div>

                            <div className="badge badge-hover border bg-articles me-1">{obj.defaultKeyboardKey}</div>

                            <ArticlesButton
                                className=""
                                small
                            >
                                Change Key
                            </ArticlesButton>

                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}