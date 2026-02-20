import { createWithEqualityFn as create } from 'zustand/traditional'
import { persist } from 'zustand/middleware'

export const useAudioStore = create()(
  persist(
    (set, get) => ({

      _hasHydrated: false,
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state
        });
      },

      audioSettings: {
        enabled: true,
        backgroundMusicVolume: 50,
        soundEffectsVolume: 100,
      },
      setAudioSettings: (value) => set({ audioSettings: value }),

    }),
    {
      name: 'eager-eagle-audio-store', // name of the item in the storage (must be unique)
      version: 1,
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