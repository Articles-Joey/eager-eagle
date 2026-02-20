import { useFrame, useThree } from "@react-three/fiber"
import { useCylinder, useSphere } from "@react-three/cannon"
import { useGLTF, useAnimations, Text } from '@react-three/drei'
import { memo, useEffect, useRef, useState } from "react"
import { Vector3 } from "three"
// import * as THREE from 'three';
import { useKeyboard } from "@/hooks/useKeyboard"

import { Model as SpacesuitModel } from "@/components/Models/Spacesuit";

// import { useControllerStore } from '@/hooks/useControllerStore';
import { useControlsStore, useGameStore } from "@/hooks/useGameStore";
import { ModelEagle } from "../Models/Eagle"
import { MeshPhysicalMaterial } from "three"
import PlayerTrail from "./PlayerTrail";
import { ModelAirplane } from "../Models/Airplane"
import { degToRad } from "three/src/math/MathUtils"
import { useStore } from "@/hooks/useStore"
import ModelFlappyBird from "../Models/ModelFlappyBird"
import PlayerTrailFire from "./PlayerTrailFire"

// import ClownfishModel from "./PlayerModels/Clownfish"
// import BoneFishModel from "./PlayerModels/BoneFish"
// import { useLocalStorageNew } from "@/hooks/useLocalStorageNew"

// const JUMP_FORCE = 5;
const JUMP_FORCE = 7.5;

const SPEED = 6;

let lastLocation

function myToFixed(i, digits) {
    var pow = Math.pow(10, digits);

    return Math.floor(i * pow) / pow;
}

function Player(props) {

    const debug = useStore((state) => state.debug)

    // const { setPlayerData, teleportPlayer, setTeleportPlayer } = props;

    const character = useStore((state) => state.character)
    const isDiving = useStore((state) => state.isDiving)

    const setPlayerLocation = useGameStore((state) => state.setPlayerLocation)
    const setGameOver = useGameStore((state) => state.setGameOver)
    const gameOver = useGameStore((state) => state.gameOver)
    const canvasClicked = useGameStore((state) => state.canvasClicked)

    // const toggleDisableDeath = useStore((state) => state.toggleDisableDeath)
    // const disableDeath = useStore((state) => state.disableDeath)

    // const {
    //     touchControls, setTouchControls
    // } = useControlsStore()

    // const [attackCoolDown, setAttackCoolDown] = useState(false);

    // useEffect(() => {

    //     if (!attackCoolDown) return

    //     setTimeout(() => {

    //         setAttackCoolDown(false)

    //     }, 100)

    // }, [attackCoolDown])

    // const { controllerState, setControllerState } = useControllerStore()

    // const [character, setCharacter] = useLocalStorageNew("game:ocean-rings:character", {
    //     model: 'Clownfish',
    //     color: '#000000'
    // })

    // // Attach event listeners when the component mounts
    // useEffect(() => {

    //     if (controllerState.axes && Math.abs(controllerState?.axes[0]) > 0.3) {

    //         if (controllerState?.axes[0] > 0) {
    //             api.position.set([-1, 5, 0]);
    //         } else {
    //             api.position.set([1, 5, 0]);
    //         }

    //     }

    // }, [controllerState]);

    // useEffect(() => {

    //     if (teleport) {

    //         console.log("Teleport has been called!", teleport)
    //         api.position.set(teleport[0], teleport[1], teleport[2]);
    //         setTeleport(false)

    //     }

    // }, [teleport]);

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
            console.log("Player Collided", e?.body.userData?.type)
            if (hitAudioRef.current) {
                hitAudioRef.current.currentTime = 0;
                hitAudioRef.current.play().catch(() => { });
            }
            if (disableDeath) {
                console.log("Death disabled, ignoring collision")
            } else {
                console.log("Death")
                setGameOver(true)
            }
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
        // else {
        //     console.log("location unchanged")
        // }

        // if (pos.current[1] > maxHeight) {
        //     setMaxHeight(pos.current[1].toFixed(2))
        // }

        const direction = new Vector3()

        // const frontVector = new Vector3(
        //     0,
        //     0,
        //     (moveForward || touchControls.up ? -1 : 0) - (moveBackward || touchControls.down ? -1 : 0),
        // )

        // const sideVector = new Vector3(
        //     (moveLeft || touchControls.left ? 1 : 0) - (moveRight || touchControls.right ? 1 : 0),
        //     0,
        //     0,
        // )

        // direction
        //     .subVectors(frontVector, sideVector)
        //     .normalize()
        //     .multiplyScalar(
        //         // SPEED * (shift ? 2 : 1)
        //         SPEED * (1)
        //     )
        // .applyEuler(camera.rotation)

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

                // You might need to handle the specific rotation for each model separately or wrap them differently 
                // but since we're rotating the container, let's try rotating the container's X axis.
                // However, current container `playerModelRef` is also where position is set. `api.velocity` sets velocity.

                // Let's modify the rotation of the inner models or the group itself.
                // But the group position is updated every frame from api.position subscription.
                // If I set rotation on playerModelRef.current here, it should stick for this frame.

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