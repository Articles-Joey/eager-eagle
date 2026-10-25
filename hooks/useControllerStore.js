// import { create } from 'zustand'
import { createWithEqualityFn as create } from "zustand/traditional";

export const isPrimaryGamepadButtonPressed = (buttons) =>
    Boolean(
        buttons?.[0]?.pressed ||
        buttons?.[6]?.pressed ||
        buttons?.[6]?.value > 0.1,
    );

export const useControllerStore = create((set) => ({
    controllerState: {},
    setControllerState: (newValue) => {
        set((prev) => ({
            controllerState: newValue,
        }));
    },
}));
