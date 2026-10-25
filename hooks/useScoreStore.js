import { createWithEqualityFn as create } from "zustand/traditional";
import { persist } from "zustand/middleware";

export const useScoreStore = create()(
    persist(
        (set, get) => ({
            _hasHydrated: false,
            setHasHydrated: (state) => {
                set({
                    _hasHydrated: state,
                });
            },

            maxDistance: 0,
            setMaxDistance: (value) => set({ maxDistance: value }),
            recordObstaclePassed: (distance) =>
                set((state) => ({
                    lifetimeDistance: state.lifetimeDistance + 1,
                    maxDistance: Math.max(state.maxDistance, distance),
                })),

            maxDistances: [],
            recentDistances: [],
            recordDeath: (distance, nickname) => {
                const entry = {
                    distance,
                    date: new Date().toISOString(),
                    nickname: nickname?.trim() || "Player",
                };
                set((state) => ({
                    maxDistance: Math.max(state.maxDistance, distance),
                    maxDistances: [entry, ...state.maxDistances]
                        .sort((a, b) => b.distance - a.distance)
                        .slice(0, 20),
                    recentDistances: [entry, ...state.recentDistances].slice(
                        0,
                        20,
                    ),
                }));
            },

            lifetimeDistance: 0,
            setLifetimeDistance: (value) => set({ lifetimeDistance: value }),
            incrementLifetimeDistance: (value) =>
                set((state) => ({
                    lifetimeDistance: state.lifetimeDistance + 1,
                })),
        }),
        {
            name: "eager-eagle-score-store", // name of the item in the storage (must be unique)
            version: 2,
            onRehydrateStorage: () => (state) => {
                state.setHasHydrated(true);
            },
            // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
            partialize: (state) =>
                Object.fromEntries(
                    Object.entries(state).filter(
                        ([key]) =>
                            ![
                                // Don't persist these keys
                            ].includes(key),
                    ),
                ),
        },
    ),
);
