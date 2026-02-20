import { useStore } from "@/hooks/useStore"
import ArticlesButton from "./Button"
// import { useGameStore } from "@/hooks/useGameStore"
import { Dropdown, DropdownButton } from "react-bootstrap"
// import { set } from "date-fns"
import { useScoreStore } from "@/hooks/useScoreStore"

export default function DebugPanel({
    reloadScene
}) {

    // const debugMode = useStore(state => state.debugMode)
    // const setDebugMode = useStore(state => state.setDebugMode)

    // const enabled = useTouchControlsStore(state => state.enabled)
    // const setEnabled = useTouchControlsStore(state => state.setEnabled)

    // const setShowMenu = useStore((state) => state.setShowMenu)

    const debug = useStore((state) => state.debug)
    const toggleDebug = useStore((state) => state.toggleDebug)

    const toggleDisableDeath = useStore((state) => state.toggleDisableDeath)
    const disableDeath = useStore((state) => state.disableDeath)

    // const cameraMode = useGameStore((state) => state.cameraMode)
    // const setCameraMode = useGameStore((state) => state.setCameraMode)
    // const cameraModes = useGameStore((state) => state.cameraModes)

    const setMaxDistance = useScoreStore((state) => state.setMaxDistance)
    const setLifetimeDistance = useScoreStore((state) => state.setLifetimeDistance)

    return (
        <div
            className="card card-articles card-sm rounded-0"
        >
            <div className="card-body">

                <div className="small text-muted">Debug Controls</div>

                <div className='d-flex flex-column'>

                    <div>
                        <ArticlesButton
                            size="sm"
                            className="w-50"
                            onClick={reloadScene}
                        >
                            <i className="fad fa-redo"></i>
                            Reload Game
                        </ArticlesButton>

                        <ArticlesButton
                            size="sm"
                            className="w-50"
                            onClick={reloadScene}
                        >
                            <i className="fad fa-redo"></i>
                            Reset Camera
                        </ArticlesButton>
                    </div>

                    <div className='d-flex flex-wrap'>

                        <ArticlesButton
                            size="sm"
                            className="w-50"
                            onClick={() => {
                                toggleDisableDeath()
                            }}
                        >
                            <i className="fad fa-redo"></i>
                            {disableDeath ? 'Enable' : 'Disable'} Death
                        </ArticlesButton>

                        {/* Camera Mode */}
                        <div className='w-50'>
                            <DropdownButton
                                variant="articles w-100"
                                size='sm'
                                id="dropdown-basic-button"
                                className="dropdown-articles"
                                title={
                                    <span>
                                        <i className="fad fa-camera"></i>
                                        <span>Camera</span>
                                    </span>
                                }
                            >

                                <div style={{ maxHeight: '600px', overflowY: 'auto', width: '200px' }}>

                                    {/* {cameraModes
                                        .map(location => {

                                            const newLocation = {
                                                name: location,
                                            }

                                            return (
                                                <Dropdown.Item
                                                    key={newLocation.name}
                                                    active={cameraMode == newLocation.name}
                                                    onClick={() => {
                                                        setCameraMode(newLocation.name)
                                                        setShowMenu(false)
                                                    }}
                                                    className="d-flex justify-content-between"
                                                >
                                                    <i className="fad fa-camera"></i>
                                                    {newLocation.name}
                                                </Dropdown.Item>
                                            )
                                        })
                                    } */}

                                </div>

                            </DropdownButton>
                        </div>

                        <div className='w-100'>

                            <ArticlesButton
                                small
                                className="w-50"
                                onClick={() => {
                                    toggleDebug()
                                }}
                            >
                                <i className="fad fa-bug"></i>
                                <span>Debug: {debug ? 'True' : 'Disable'}</span>
                            </ArticlesButton>

                            <ArticlesButton
                                size="sm"
                                className="w-50"
                                onClick={() => {
                                    setMaxDistance(9999)
                                    setLifetimeDistance(9999)
                                }}
                            >
                                <i className="fad fa-debug"></i>
                                Give Max
                            </ArticlesButton>

                            {/* <DropdownButton
                                    variant="articles w-100"
                                    size='sm'
                                    id="dropdown-basic-button"
                                    className="dropdown-articles"
                                    title={
                                        <span>
                                            <i className="fad fa-bug"></i>
                                            <span>Debug: {debug ? 'True' : 'Disable'}</span>
                                        </span>
                                    }
                                >

                                    <div style={{ maxHeight: '600px', overflowY: 'auto', width: '200px' }}>

                                        {[
                                            true,
                                            false
                                        ]
                                            .map((choice, index) =>
                                                <Dropdown.Item
                                                    key={index}
                                                    onClick={() => {
                                                        // setTeleport(location.position)
                                                        // setShowMenu(false)
                                                        toggleDebug()
                                                    }}
                                                    className="d-flex justify-content-between"
                                                >
                                                    {choice ? 'Enable' : 'Disable'}
                                                </Dropdown.Item>
                                            )}

                                    </div>

                                </DropdownButton> */}

                        </div>

                    </div>

                    <div className='d-flex'>



                    </div>

                </div>

            </div>
        </div>
    )

}