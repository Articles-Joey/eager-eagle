import {
    BufferAttribute,
    Color,
    DataTexture,
    LinearFilter,
    LinearMipmapLinearFilter,
    PlaneGeometry,
    RepeatWrapping,
    RGBAFormat,
    SRGBColorSpace,
} from "three";

export const MOUNTAIN_SCENERY_HEIGHT_SCALE = 0.75;

export function variation(seed) {
    const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
    return value - Math.floor(value);
}

function smooth(value) {
    const t = Math.max(0, Math.min(1, value));
    return t * t * (3 - 2 * t);
}

function noise(x, z) {
    const ix = Math.floor(x),
        iz = Math.floor(z);
    const tx = smooth(x - ix),
        tz = smooth(z - iz);
    const a = variation(ix * 31 + iz * 97);
    const b = variation((ix + 1) * 31 + iz * 97);
    const c = variation(ix * 31 + (iz + 1) * 97);
    const d = variation((ix + 1) * 31 + (iz + 1) * 97);
    return (a + (b - a) * tx) * (1 - tz) + (c + (d - c) * tx) * tz;
}

export function terrainHeight(type, x, z, background = false) {
    if (type === "Tree") return 0.175;
    if (type !== "Mountain" && type !== "Mountains") return 0;
    if (background) {
        const ridge = 1 - Math.abs(noise(x * 0.045, z * 0.035) * 2 - 1);
        return (
            smooth((-x - 42) / 24) *
            (3 + ridge * ridge * 21 + noise(x * 0.11, z * 0.09) * 3)
        );
    }
    const ridge = 1 - Math.abs(noise(x * 0.085, z * 0.065) * 2 - 1);
    const secondaryRidge = 1 - Math.abs(noise(x * 0.17, z * 0.13) * 2 - 1);
    const peaks = Math.pow(ridge, 2.1);
    const mountains =
        1.2 +
        peaks * (12 + noise(x * 0.035, z * 0.04) * 8) +
        secondaryRidge * secondaryRidge * 2 +
        noise(x * 0.27, z * 0.24) * 0.8;
    // The visual flight lane stays at the common gameplay grade. Steep ridges
    // rise behind it, tapering to a shared boundary with the distant landscape.
    const mountainWeight = smooth((-x - 4) / 16);
    const nearTerrain =
        0.175 + smooth((x - 4) / 12) * noise(x * 0.15, z * 0.15) * 0.65;
    return (
        smooth((x + 42) / 6) *
        (nearTerrain * (1 - mountainWeight) +
            mountains * MOUNTAIN_SCENERY_HEIGHT_SCALE * mountainWeight)
    );
}

export function createTerrainGeometry(
    type,
    width,
    centerX,
    tile,
    length,
    detail,
    background = false,
) {
    const hilly = type === "Mountain" || type === "Mountains";
    const geometry = new PlaneGeometry(
        width,
        length,
        hilly ? detail : 1,
        hilly ? Math.max(8, Math.round((detail * length) / width)) : 1,
    );
    geometry.rotateX(-Math.PI / 2);
    const positions = geometry.attributes.position;
    const normals = geometry.attributes.normal;
    const colors = new Float32Array(positions.count * 3);
    const grass = new Color("#6d9544");
    const alpine = new Color("#69765a");
    const earth = new Color("#796b58");
    const stone = new Color("#8e918f");
    const paleStone = new Color("#b7b7b1");
    const snow = new Color("#edf0ed");
    const color = new Color();
    for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i) + centerX;
        const z = positions.getZ(i) - tile * length;
        const y = terrainHeight(type, x, z, background);
        positions.setY(i, y);
        const dx =
            (terrainHeight(type, x + 0.1, z, background) -
                terrainHeight(type, x - 0.1, z, background)) /
            0.2;
        const dz =
            (terrainHeight(type, x, z + 0.1, background) -
                terrainHeight(type, x, z - 0.1, background)) /
            0.2;
        const magnitude = Math.hypot(dx, 1, dz);
        normals.setXYZ(i, -dx / magnitude, 1 / magnitude, -dz / magnitude);
        if (type === "Building" || type === "City") color.set("#ffffff");
        else if (hilly) {
            const slope = Math.hypot(dx, dz);
            color.copy(alpine).lerp(earth, noise(x * 0.18, z * 0.18) * 0.65);
            color.lerp(
                stone,
                Math.max(
                    smooth((y - 1.5) / 5),
                    smooth((slope - 0.3) / 1.3) * 0.9,
                ),
            );
            color.lerp(paleStone, smooth((y - 7) / 10));
            const strata =
                0.91 + Math.sin(y * 2.4 + noise(x * 0.08, z * 0.08)) * 0.07;
            color.multiplyScalar(strata);
            color.lerp(snow, smooth((y - (background ? 21 : 15)) / 6));
        } else
            color
                .copy(grass)
                .multiplyScalar(0.85 + noise(x * 0.15, z * 0.15) * 0.25);
        color.toArray(colors, i * 3);
    }
    geometry.setAttribute("color", new BufferAttribute(colors, 3));
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    return geometry;
}

export function createSurfaceTexture(surface = "grass") {
    const asphalt = surface === "asphalt" || surface === true;
    const rock = surface === "rock";
    const size = 128;
    const pixels = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const grain = variation(y * size + x);
            const broad =
                Math.sin((x / size) * Math.PI * 8) *
                Math.cos((y / size) * Math.PI * 6);
            const offset = (y * size + x) * 4;
            const base = asphalt
                ? 43 + grain * 22
                : rock
                  ? 202 + grain * 43 + broad * 10
                  : 145 + grain * 65 + broad * 20;
            pixels[offset] = rock ? base * 0.98 : asphalt ? base : base * 0.84;
            pixels[offset + 1] = rock
                ? base * 0.99
                : asphalt
                  ? base * 1.04
                  : base;
            pixels[offset + 2] = rock
                ? base
                : asphalt
                  ? base * 1.1
                  : base * 0.63;
            pixels[offset + 3] = 255;
        }
    }
    const texture = new DataTexture(pixels, size, size, RGBAFormat);
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(12, 4);
    texture.magFilter = LinearFilter;
    texture.minFilter = LinearMipmapLinearFilter;
    texture.generateMipmaps = true;
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
}
