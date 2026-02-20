const { useScoreStore } = require("@/hooks/useScoreStore")
const { useStore } = require("@/hooks/useStore")
const { useTouchControlsStore } = require("@/hooks/useTouchControlsStore")

export default function DiveButton() {

    const hasHydrated = useStore((state) => state._hasHydrated)
    const enabled = useTouchControlsStore(state => state.enabled)
    const setIsDiving = useStore((state) => state.setIsDiving)

    const lifetimeDistance = useScoreStore((state) => state.lifetimeDistance)
    const maxDistance = useScoreStore((state) => state.maxDistance)

    return (
        <>
            {(
                hasHydrated
                &&
                enabled
                &&
                (
                    lifetimeDistance > 40
                    ||
                    maxDistance > 10
                )
            ) &&
                <button
                    className="dive-button"
                    onMouseDown={() => setIsDiving(true)}
                    onMouseUp={() => setIsDiving(false)}
                    onMouseLeave={() => setIsDiving(false)}
                    onTouchStart={(e) => {
                        // e.preventDefault();
                        setIsDiving(true)
                    }}
                    onTouchEnd={() => setIsDiving(false)}
                >
                    <i className="fas fa-arrow-down"></i>
                </button>
            }
        </>
    )
}