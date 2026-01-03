import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useStore = create()(
  persist(
    (set, get) => ({

      nickname: "",
      setNickname: (value) => set({ nickname: value }),

      darkMode: true,
      toggleDarkMode: () => set({ darkMode: !get().darkMode }),

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

    }),
    {
      name: 'eager-eagle-game-store', // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)