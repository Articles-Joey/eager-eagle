import { useStore } from "@/hooks/useStore"
import ArticlesButton from "./Button"
import { set } from "date-fns"
import { useGameStore } from "@/hooks/useGameStore"

export default function ScoreCard({ score }) {

    const maxDistance = useGameStore((state) => state.maxDistance)
    const setMaxDistance = useGameStore((state) => state.setMaxDistance)

    return (
        <div
            className="card card-articles card-sm w-100"            
        >

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
                        setMaxDistance(0)
                    }}
                >
                    <i className="fad fa-redo"></i>
                </ArticlesButton>

            </div>

            <div className="card-body">

                {maxDistance}

            </div>

            {/* <div className="card-footer d-flex flex-wrap justify-content-center">

            </div> */}

        </div>
    )
}