import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useStore = create()(
  persist(
    (set, get) => ({

      nickname: "",
      setNickname: (value) => set({ nickname: value }),
      randomNickname: (value) => {
        const adjectives = ["Swift", "Brave", "Clever", "Mighty", "Fierce", "Nimble", "Wise", "Bold"];
        const animals = ["Eagle", "Raven", "Crow", "Falcon", "Dragon", "Hawk"];
        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
        set({ nickname: `${randomAdjective}${randomAnimal}` })
      },

      nicknameKeyboard: false,
      setNicknameKeyboard: (newValue) => {
        set((prev) => ({
          nicknameKeyboard: newValue
        }))
      },

      darkMode: true,
      toggleDarkMode: () => set({ darkMode: !get().darkMode }),
      setDarkMode: (value) => set({ darkMode: value }),

      graphicsQuality: "Medium",
      setGraphicsQuality: (value) => set({ graphicsQuality: value }),

      theme: null,
      // toggleTheme: () => set({ theme: !get().theme }),
      setTheme: (value) => set({ theme: value }),

      debug: false,
      toggleDebug: () => set({ debug: !get().debug }),
      setDebug: (value) => set({ debug: value }),

      character: {

        // Eagle, Airplane
        model: 'Eagle',

        trail: {
          enabled: true,
          type: 'Standard',
          color: 'red'
        }

      },
      setCharacter: (value) => set({ character: value }),

      sidebar: true,
      toggleSidebar: () => set({ sidebar: !get().sidebar }),
      setSidebar: (value) => set({ sidebar: value }),

      showMenu: false,
      setShowMenu: (value) => set({ showMenu: value }),

      musicVolume: 0.5,
      setMusicVolume: (value) => set({ musicVolume: value }),

      audioSettings: {
        enabled: true,
        music_volume: 50,
      },
      setAudioSettings: (value) => set({ audioSettings: value }),

      infoModal: false,
      setInfoModal: (value) => set({ infoModal: value }),

      settingsModal: false,
      setSettingsModal: (value) => set({ settingsModal: value }),

      creditsModal: false,
      setCreditsModal: (value) => set({ creditsModal: value }),

      disableDeath: false,
      toggleDisableDeath: () => set({ disableDeath: !get().disableDeath }),
      setDisableDeath: (value) => set({ disableDeath: value }),

      isDiving: false,
      setIsDiving: (value) => set({ isDiving: value }),

    }),
    {
      name: 'eager-eagle-game-store', // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => ![
            'infoModal',
            'settingsModal',
            'creditsModal',
            'showMenu',
            'isDiving',
          ].includes(key))
        ),
    },
  ),
)