export default function GameScoreboard({ game }) {

    return (
        <div className="game-scoreboard card bg-white border shadow-sm">
            <div className="card-body p-2">
                <h5 className="card-title mb-1">{game} Scoreboard</h5>
                {/* Scoreboard content goes here */}
                <p className="card-text">Top Players will be displayed here.</p>
            </div>
        </div>
    )
}