import { defaultCharacter, useStore } from "@/hooks/useStore"
import ArticlesButton from "./Button"
// import { set } from "date-fns"
// import { useGameStore } from "@/hooks/useGameStore"
import { Modal } from "react-bootstrap"
import { useState } from "react"
import { useScoreStore } from "@/hooks/useScoreStore"

export default function ScoreCard({ score }) {

    const setCharacter = useStore((state) => state.setCharacter)

    const maxDistance = useScoreStore((state) => state.maxDistance)
    const setMaxDistance = useScoreStore((state) => state.setMaxDistance)

    const lifetimeDistance = useScoreStore((state) => state.lifetimeDistance)
    const setLifetimeDistance = useScoreStore((state) => state.setLifetimeDistance)

    const [ confirmReset, setConfirmReset ] = useState(false)

    return (
        <div
            className="card card-articles card-sm w-100"            
        >

            <Modal show={confirmReset} onHide={() => setConfirmReset(false)} centered>

                <Modal.Header closeButton>
                    <Modal.Title>Reset High Score?</Modal.Title>
                </Modal.Header>

                <Modal.Body className="p-3">

                    <div className="mb-0">Are you sure you want to reset your high score? This will also reset your lifetime distance and unlocked rewards.</div>

                </Modal.Body>

                <Modal.Footer className="d-flex justify-content-between">

                    <ArticlesButton
                        onClick={() => {
                            setConfirmReset(false)
                        }}
                    >
                        Cancel
                    </ArticlesButton>

                    <ArticlesButton
                        onClick={() => {
                            setMaxDistance(0)
                            setLifetimeDistance(0)
                            setCharacter(defaultCharacter)
                            setConfirmReset(false)
                        }}
                        variant="danger"
                    >
                        Confirm
                    </ArticlesButton>

                    
                </Modal.Footer>
                
            </Modal>

            {/* <div style={{ position: 'relative', height: '200px' }}>
                <Image
                    src={Logo}ddda
                    alt=""
                    fill
                    style={{ objectFit: 'cover' }}
                />
            </div> */}

            <div className='card-header flex-header'>

                <div>High Score</div>

                <ArticlesButton
                    className=''
                    small
                    onClick={() => {
                        setConfirmReset(true)
                    }}
                >
                    <i className="fad fa-redo"></i>
                </ArticlesButton>

            </div>

            <div className="card-body d-flex justify-content-between">

                <span>{maxDistance}</span>

                <span className="text-muted">(lifetime: {lifetimeDistance})</span>

            </div>

            {/* <div className="card-footer d-flex flex-wrap justify-content-center">

            </div> */}

        </div>
    )
}