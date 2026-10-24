import { variation } from "./terrain";
import { GROUND_Y } from "./WorldMotion";

export const GROUND_SURFACE_OFFSET = 0.175;
export const GROUND_OBJECT_WIDTH = 2.8;
export const GROUND_OBJECT_DEPTH = 2.8;
export const SKY_OBJECT_SIZE = [2.5, 1.5, 3];
export const AIRSHIP_SIZE = [5.5, 2.2, 8];
export const PLAY_AREA_TOP = 13;

// Gameplay measurements depend on the obstacle index, never its cosmetic model.
export function getGroundHeight(index, row = 0) {
    return row === 0
        ? 2.8 + variation(index * 7) * 3.2
        : 3 + variation(index * 7 + row) * 6;
}

export function getSkyMotion(index) {
    return {
        baseY: Math.max(
            4.2,
            GROUND_Y + GROUND_SURFACE_OFFSET + getGroundHeight(index) + 4,
        ),
        phase: variation(index * 13 + 4) * Math.PI * 2,
        frequency: 0.65 + variation(index * 19 + 2) * 0.6,
        amplitude: 0.6 + variation(index * 23 + 1) * 0.65,
    };
}
