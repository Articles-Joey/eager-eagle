// import { create } from 'zustand'
import { createWithEqualityFn as create } from 'zustand/traditional'
import { persist } from 'zustand/middleware'

import typicalZustandStoreExcludes from '@articles-media/articles-dev-box/typicalZustandStoreExcludes';
import typicalZustandStoreStateSlice from '@articles-media/articles-dev-box/typicalZustandStoreStateSlice';

export const defaultCharacter = {

  // Eagle, Airplane
  models: [
    {
      name: "Eagle",
      distance: 0,
    },
    {
      name: "Airplane",
      distance: 30,
      lifetimeDistance: 30 * 4,
    },
    {
      name: "Flappy Bird",
      distance: 60,
      lifetimeDistance: 60 * 4,
    }
  ],
  model: 'Eagle',

  trails: [
    {
      name: "None",
      distance: 0,
    },
    {
      name: "Basic",
      distance: 10,
      lifetimeDistance: 10 * 4,
    },
    {
      name: "Neon",
      distance: 50,
      lifetimeDistance: 50 * 4,
    },
    {
      name: "Fire",
      distance: 100,
      lifetimeDistance: 100 * 4,
    }
  ],
  trail: "None",

  groundObjects: [
    {
      name: "Building",
      distance: 0,
      lifetimeDistance: 0,
    },
    {
      name: "Mountain",
      distance: 40,
      lifetimeDistance: 40 * 4,
    },
    {
      name: "Tree",
      distance: 70,
      lifetimeDistance: 70 * 4,
    }
  ],
  groundObject: "Building",

  skyObjects: [
    {
      name: "Helicopter",
      distance: 0,
      lifetimeDistance: 0
    },
    {
      name: "Bat",
      distance: 40,
      lifetimeDistance: 40 * 4
    },
    {
      name: "UFO",
      distance: 80,
      lifetimeDistance: 80 * 4
    }
  ],
  skyObject: "Helicopter",

  backgrounds: [
    {
      name: "City",
      distance: 0,
      lifetimeDistance: 0,
    },
    {
      name: "Mountains",
      distance: 42,
      lifetimeDistance: 42 * 4,
    },
    {
      name: "Forest",
      distance: 66,
      lifetimeDistance: 66 * 4,
    }
  ],
  background: "City",

}

const generateRandomNickname = () => {
  const adjectives = ["Swift", "Brave", "Clever", "Mighty", "Fierce", "Nimble", "Wise", "Bold"];
  const animals = ["Eagle", "Raven", "Crow", "Falcon", "Dragon", "Hawk"];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
  return `${randomAdjective}${randomAnimal}`;
}

export const useStore = create()(
  persist(
    (set, get) => ({

      ...typicalZustandStoreStateSlice(set, get, generateRandomNickname),

      // _hasHydrated: false,
      // setHasHydrated: (state) => {
      //   set({
      //     _hasHydrated: state
      //   });
      // },

      // nickname: generateRandomNickname(),
      // setNickname: (value) => set({ nickname: value }),
      // randomNickname: () => {
      //   set({ nickname: generateRandomNickname() })
      // },

      // nicknameKeyboard: false,
      // setNicknameKeyboard: (newValue) => {
      //   set((prev) => ({
      //     nicknameKeyboard: newValue
      //   }))
      // },

      // darkMode: true,
      // toggleDarkMode: () => set({ darkMode: !get().darkMode }),
      // setDarkMode: (value) => set({ darkMode: value }),

      // graphicsQuality: "Medium",
      // setGraphicsQuality: (value) => set({ graphicsQuality: value }),

      // theme: null,
      // // toggleTheme: () => set({ theme: !get().theme }),
      // setTheme: (value) => set({ theme: value }),

      // debug: false,
      // toggleDebug: () => set({ debug: !get().debug }),
      // setDebug: (value) => set({ debug: value }),

      defaultCharacter: defaultCharacter,
      character: defaultCharacter,
      setCharacter: (value) => set({ character: value }),

      // sidebar: true,
      // toggleSidebar: () => set({ sidebar: !get().sidebar }),
      // setSidebar: (value) => set({ sidebar: value }),

      // showMenu: false,
      // setShowMenu: (value) => set({ showMenu: value }),

      // musicVolume: 0.5,
      // setMusicVolume: (value) => set({ musicVolume: value }),
      // audioSettings: {
      //   enabled: true,
      //   backgroundMusicVolume: 100,
      //   soundEffectsVolume: 100,
      // },
      // setAudioSettings: (value) => set({ audioSettings: value }),

      // infoModal: false,
      // setInfoModal: (value) => set({ infoModal: value }),

      // settingsModal: false,
      // setSettingsModal: (value) => set({ settingsModal: value }),

      // creditsModal: false,
      // setCreditsModal: (value) => set({ creditsModal: value }),

      customizeModal: false,
      setCustomizeModal: (value) => set({ customizeModal: value }),

      rewardsModal: false,
      setRewardsModal: (value) => set({ rewardsModal: value }),

      disableDeath: false,
      toggleDisableDeath: () => set({ disableDeath: !get().disableDeath }),
      setDisableDeath: (value) => set({ disableDeath: value }),

      isDiving: false,
      setIsDiving: (value) => set({ isDiving: value }),

      sceneSettings: false,
      setSceneSettings: (newValue) => {
        set((prev) => ({
          sceneSettings: newValue
        }))
      },

    }),
    {
      name: 'eager-eagle-game-store', // name of the item in the storage (must be unique)
      version: 4,
      onRehydrateStorage: () => (state) => {
        state.setHasHydrated(true)
      },
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => ![
            ...typicalZustandStoreExcludes,
            'isDiving',
          ].includes(key))
        ),
    },
  ),
)