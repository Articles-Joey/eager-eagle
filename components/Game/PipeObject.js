import { memo } from "react";
import { Edges } from "@react-three/drei";
import { DoubleSide } from "three";

const bands = [
    { start: 0.12, length: 0.28, color: "#d3f48c" },
    { start: 0.42, length: 0.55, color: "#a5dc28" },
    { start: 1.05, length: 1.1, color: "#7bc508" },
    { start: 2.25, length: 0.7, color: "#4b9205" },
];

export default memo(function PipeObject({ width, height, depth }) {
    const rimHeight = Math.min(0.18, 0.5 / height);
    const shaftHeight = 1 - rimHeight;

    return (
        <group scale={[width, height, depth]}>
            <mesh position={[0, shaftHeight / 2, 0]}>
                <cylinderGeometry args={[0.43, 0.43, shaftHeight, 32]} />
                <meshBasicMaterial
                    color="#70bd08"
                    toneMapped={false}
                />
                <Edges
                    color="#304509"
                    threshold={20}
                />
            </mesh>
            {bands.map(({ start, length, color }) => (
                <mesh
                    key={start}
                    position={[0, shaftHeight / 2, 0]}
                >
                    <cylinderGeometry
                        args={[
                            0.431,
                            0.431,
                            shaftHeight,
                            32,
                            1,
                            true,
                            start,
                            length,
                        ]}
                    />
                    <meshBasicMaterial
                        color={color}
                        toneMapped={false}
                    />
                </mesh>
            ))}
            <mesh position={[0, 1 - rimHeight / 2, 0]}>
                <cylinderGeometry args={[0.5, 0.5, rimHeight, 32, 1, true]} />
                <meshBasicMaterial
                    color="#85ce13"
                    toneMapped={false}
                />
                <Edges
                    color="#304509"
                    threshold={20}
                />
            </mesh>
            <mesh
                position={[0, 1, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <ringGeometry args={[0.31, 0.5, 32]} />
                <meshBasicMaterial
                    color="#c7ec6b"
                    toneMapped={false}
                />
            </mesh>
            <mesh
                position={[0, 1 - rimHeight * 0.7, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <circleGeometry args={[0.31, 32]} />
                <meshBasicMaterial
                    color="#294a08"
                    toneMapped={false}
                />
            </mesh>
            <mesh
                position={[0, shaftHeight, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <ringGeometry args={[0.43, 0.5, 32]} />
                <meshBasicMaterial
                    color="#3c7407"
                    side={DoubleSide}
                    toneMapped={false}
                />
            </mesh>
        </group>
    );
});
