// import { create } from 'zustand'
import { createWithEqualityFn as create } from 'zustand/traditional'

export const useTouchControlsStore = create((set) => ({

    enabled: true,
    setEnabled: (value) => set({ enabled: value }),

    touchControls: {
        // enabled: true,
        jump: false,
        left: false,
        right: false
    },
    setTouchControls: (newValue) => {
        set((prev) => ({
            touchControls: newValue
        }))
    }

}))