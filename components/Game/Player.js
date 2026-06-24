import { useFrame, useThree } from "@react-three/fiber"
import { useCylinder, useSphere } from "@react-three/cannon"
import { useGLTF, useAnimations, Text } from '@react-three/drei'
import { memo, useEffect, useRef, useState } from "react"
import { Vector3 } from "three"
// import * as THREE from 'three';
import { useKeyboard } from "@/hooks/useKeyboard"

import { useGameStore } from "@/hooks/useGameStore";
import { ModelEagle } from "../Models/Eagle"
import { MeshPhysicalMaterial } from "three"
import PlayerTrail from "./PlayerTrail";
import { ModelAirplane } from "../Models/Airplane"
import { degToRad } from "three/src/math/MathUtils"
import { useStore } from "@/hooks/useStore"
import ModelFlappyBird from "../Models/ModelFlappyBird"
import PlayerTrailFire from "./PlayerTrailFire"
import { rewards } from '@/components/UI/RewardsModal'
import { useScoreStore } from "@/hooks/useScoreStore"

// const JUMP_FORCE = 5;
const JUMP_FORCE = 7.5;

const SPEED = 6;

let lastLocation

function myToFixed(i, digits) {
    var pow = Math.pow(10, digits);
    return Math.floor(i * pow) / pow;
}

function Player(props) {

    // let rewards = rewards()

    const debug = useStore((state) => state.debug)

    const character = useStore((state) => state.character)
    const isDiving = useStore((state) => state.isDiving)

    const setPlayerLocation = useGameStore((state) => state.setPlayerLocation)
    const setGameOver = useGameStore((state) => state.setGameOver)
    const gameOver = useGameStore((state) => state.gameOver)
    const canvasClicked = useGameStore((state) => state.canvasClicked)

    const { jump, dive } = useKeyboard()

    // const { camera } = useThree()

    const [ref, api] = useSphere(() => ({
        mass: 1,
        args: [0.5],
        position: [0, 2, 0],
        fixedRotation: true,
        collisionFilterGroup: 1, // Player is in group 1
        collisionFilterMask: 2, // Player can collide with group 2 (rocks)
        onCollide: (e) => {
            const disableDeath = useStore.getState().disableDeath
            const collisionType = e?.body?.userData?.type

            console.log("Player Collided", collisionType)

            if (
                collisionType === 'helicopter-top'
                ||
                collisionType === 'helicopter-bottom'
            ) {
                
                let maxDistance = useScoreStore.getState().maxDistance

                const armorPlating = rewards.find(reward => reward.name === 'Armor Plating')

                console.log("maxDistance", maxDistance)
                console.log("armorPlating.distance", armorPlating.distance)                

                if (
                    maxDistance < armorPlating.distance
                ) {
                    console.log("Armor Plating not yet unlocked")
                    // return
                } else {
                    console.log("Helicopter top/bottom hit, ignoring")
                    return
                }

            }

            if (hitAudioRef.current) {
                hitAudioRef.current.currentTime = 0;
                hitAudioRef.current.play().catch(() => { });
            }

            if (disableDeath) {
                console.log("Death disabled, ignoring collision")
                return
            }

            if (
                collisionType === 'helicopter-side'
            ) {
                console.log("Helicopter side hit, game over")
            } else {
                console.log("Death")
            }

            setGameOver(true)
            api.position.set(0, 2, 0)
        }
    }))

    const windAudioRef = useRef(null);
    const jumpAudioRef = useRef(null);
    const hitAudioRef = useRef(null);
    const windFadeTimeout = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!windAudioRef.current) {
                windAudioRef.current = new Audio('audio/Wind.mp3');
                windAudioRef.current.loop = true;
                windAudioRef.current.volume = 0;
            }
            if (!jumpAudioRef.current) {
                jumpAudioRef.current = new Audio('audio/Fly.mp3');
            }
            if (!hitAudioRef.current) {
                hitAudioRef.current = new Audio('audio/Hit.mp3');
            }
        }
        return () => {
            if (windAudioRef.current) {
                windAudioRef.current.pause();
                windAudioRef.current = null;
            }
            if (jumpAudioRef.current) {
                jumpAudioRef.current = null;
            }
            if (hitAudioRef.current) {
                hitAudioRef.current = null;
            }
            if (windFadeTimeout.current) {
                clearTimeout(windFadeTimeout.current);
            }
        };
    }, []);

    // Wind audio fade logic
    useEffect(() => {
        if (!windAudioRef.current) return;
        if (isDiving) {
            windAudioRef.current.volume = 1;
            windAudioRef.current.play().catch(() => { });
        } else {
            // Fade out
            let fadeStep = 0.05;
            let fadeInterval = 50;
            function fade() {
                if (!windAudioRef.current) return;
                let v = windAudioRef.current.volume;
                if (v > 0) {
                    windAudioRef.current.volume = Math.max(0, v - fadeStep);
                    windFadeTimeout.current = setTimeout(fade, fadeInterval);
                } else {
                    windAudioRef.current.pause();
                }
            }
            fade();
        }
    }, [isDiving]);

    const material = new MeshPhysicalMaterial({
        color: 'blue',
        opacity: 0.5,
        transparent: true
    });

    const vel = useRef([0, 0, 0])
    const jumpPressed = useRef(false)
    const jumpRotation = useRef(0)

    useEffect(() => {
        api.velocity.subscribe((v) => vel.current = v)
    }, [api.velocity])

    useEffect(() => {
        if (!gameOver) {
            api.position.set(0, 0, 0)
            api.velocity.set(0, 0, 0)
            pos.current = [0, 0, 0]
            api.mass.set(1)
        } else {
            api.mass.set(0)
        }
    }, [gameOver, api])

    const pos = useRef([0, 0, 0])

    const touching = useRef(new Set())



    const playerModelRef = useRef()
    useEffect(() => {

        api.position.subscribe((p) => {

            pos.current = p

            // playerReachApi.position.set(...p)

            if (playerModelRef.current) {
                playerModelRef.current.position.set(...p);
            }

        })

        // if (playerModelRef.current) {
        //     // Get the current position of the sphere from the physics API
        //     api.position.subscribe((position) => {

        //         playerModelRef.current.position.set(...position);

        //     });
        // }

    }, [api.position])

    // useEffect(() => {
    //     console.log("Shift", isShifting)
    //     setShift(isShifting)
    // }, [isShifting])

    useFrame(() => {

        if (gameOver) return

        // return

        // addDistance(0.1)

        // if (cameraMode == "Player") {
        //     camera.position.copy(new Vector3(0, pos.current[1], (pos.current[2] + 10)))
        //     camera.lookAt(new Vector3(0, pos.current[1], (pos.current[2] + 5)))
        // }

        let posX = 0
        if (pos.current[0]) {
            posX = myToFixed(pos.current[0], 2)
        }

        // console.log(pos.current[1])
        let posY = 0
        if (pos.current[1]) {
            posY = myToFixed(pos.current[1], 2)
        }

        let posZ = 0
        if (pos.current[2]) {
            posZ = myToFixed(pos.current[2], 2)
        }

        // console.log(posX)

        let newLocation = new Vector3(posX, posY, posZ)

        if (JSON.stringify(lastLocation) !== JSON.stringify(newLocation)) {
            // console.log(newLocation, lastLocation)
            setPlayerLocation(newLocation)
            lastLocation = newLocation
        }

        let vy = vel.current[1]

        jumpRotation.current = jumpRotation.current * 0.85

        if (jump || canvasClicked) {
            if (!jumpPressed.current) {
                jumpPressed.current = true
                vy = JUMP_FORCE
                jumpRotation.current = degToRad(45)
                if (jumpAudioRef.current) {
                    jumpAudioRef.current.currentTime = 0;
                    jumpAudioRef.current.play().catch(() => { });
                }
            }
        } else {
            jumpPressed.current = false
        }

        if (dive || isDiving) {

            if (
                useStore.getState().lifetimeDistance < 40
                &&
                useGameStore.getState().maxDistance < 10
            ) {
                return
            }

            vy -= 0.5; // Accelerate downward
            if (playerModelRef.current) {
                // Determine target rotation
                const targetRotation = degToRad(-45);
                playerModelRef.current.rotation.x = targetRotation
            }
        } else {
            // Reset rotation
            if (playerModelRef.current) {
                // Smoothly return to 0? Or just set 0.
                playerModelRef.current.rotation.x = jumpRotation.current;
            }
        }

        api.velocity.set(0, vy, 0)
        api.position.set(0, pos.current[1], 0)

        if (posY > 13) posY = 13
        api.position.set(0, posY, 0)

    })

    return (
        <group>

            {character.trail !== "Fire" && <PlayerTrail positionRef={pos} />}
            {character.trail === "Fire" && <PlayerTrailFire positionRef={pos} />}

            <group
                ref={playerModelRef}
            >

                {character.model === "Eagle" &&
                    <ModelEagle
                        scale={0.02}
                        position={[0, -0.5, -0.7]}
                    />
                }
                {character.model === "Airplane" &&
                    <ModelAirplane
                        scale={1}
                        rotation={[0, degToRad(90), 0]}
                        position={[0, 0, 0]}
                    />
                }
                {character.model === "Flappy Bird" &&
                    <ModelFlappyBird
                        scale={0.1}
                        rotation={[0, degToRad(90), 0]}
                        position={[0, -0.5, 0]}
                    />
                }

            </group>

            {/* <mesh ref={playerReachRef}>
                <cylinderGeometry args={[2, 2, 1, 8]} />
                <meshStandardMaterial
                    color="orange"
                    transparent={true}
                    opacity={0.5}
                />
            </mesh> */}

            <mesh
                ref={ref}
                // {...props}
                // position={position}
                material={material}
            >

                {debug && <sphereGeometry args={[0.5, 32, 32]} />}

                {/* {character.model == 'Clownfish' && <ClownfishModel rotation={[0, Math.PI / 1, 0]} />}
                {character.model == 'Bone Fish' && <BoneFishModel rotation={[0, -Math.PI / 2, 0]} />} */}

                {/* <Text
                    color="black" position={[0, -0.7, 0]} scale={0.3} anchorX="center" anchorY="middle"
                >
                    Player ({character.model})
                </Text> */}

            </mesh>

        </group>
    )
}

export default Player