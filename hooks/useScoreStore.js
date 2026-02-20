import { createWithEqualityFn as create } from 'zustand/traditional'
import { persist } from 'zustand/middleware'

export const useScoreStore = create()(
    persist(
        (set, get) => ({

            _hasHydrated: false,
            setHasHydrated: (state) => {
                set({
                    _hasHydrated: state
                });
            },

            maxDistance: 0,
            setMaxDistance: (value) => set({ maxDistance: value }),

            lifetimeDistance: 0,
            setLifetimeDistance: (value) => set({ lifetimeDistance: value }),
            incrementLifetimeDistance: (value) => set((state) => ({ lifetimeDistance: state.lifetimeDistance + 1 })),

        }),
        {
            name: 'eager-eagle-score-store', // name of the item in the storage (must be unique)
            version: 2,
            onRehydrateStorage: () => (state) => {
                state.setHasHydrated(true)
            },
            // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
            partialize: (state) =>
                Object.fromEntries(
                    Object.entries(state).filter(([key]) => ![
                        // Don't persist these keys
                    ].includes(key))
                ),
        },
    ),
)