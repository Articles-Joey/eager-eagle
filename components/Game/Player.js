import { memo, useCallback, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
    BallCollider,
    interactionGroups,
    RigidBody,
    useAfterPhysicsStep,
    useBeforePhysicsStep,
} from "@react-three/rapier";
import { Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useGameStore } from "@/hooks/useGameStore";
import { useScoreStore } from "@/hooks/useScoreStore";
import { useStore } from "@/hooks/useStore";
import { useAudioStore } from "@/hooks/useAudioStore";
import { ModelEagle } from "../Models/Eagle";
import { ModelAirplane } from "../Models/Airplane";
import ModelFlappyBird from "../Models/ModelFlappyBird";
import { rewards } from "@/components/UI/RewardsModal";
import PlayerTrail from "./PlayerTrail";
import PlayerTrailFire from "./PlayerTrailFire";
import PlayerTrailBubbles from "./PlayerTrailBubbles";
import PlayerTrailRainbow from "./PlayerTrailRainbow";
import { PLAY_AREA_TOP } from "./obstacleLayout";
import { PlayerVehicleObject } from "./SceneObject";

const JUMP_FORCE = 7.5;
const PLAYER_BODY_DATA = { type: "player" };

function Player() {
    const character = useStore((state) => state.character);
    const isDiving = useStore((state) => state.isDiving);
    const gameOver = useGameStore((state) => state.gameOver);
    const canvasClicked = useGameStore((state) => state.canvasClicked);
    const pointerJump = useGameStore((state) => state.pointerJump);
    const pointerDive = useGameStore((state) => state.pointerDive);
    const canDive = useScoreStore(
        (state) => state.lifetimeDistance >= 40 || state.maxDistance >= 10,
    );
    const { jump, dive } = useKeyboard();
    const diving = (dive || isDiving || pointerDive) && canDive && !gameOver;
    const body = useRef();
    const playerModel = useRef();
    const position = useRef([0, 0, 0]);
    const lastY = useRef(null);
    const jumpPressed = useRef(false);
    const jumpRotation = useRef(0);
    const windAudio = useRef(null);
    const jumpAudio = useRef(null);
    const hitAudio = useRef(null);
    const windFadeTimeout = useRef(null);
    const windGain = useRef(0);

    useEffect(() => {
        return () => {
            clearTimeout(windFadeTimeout.current);
            for (const audio of [windAudio, jumpAudio, hitAudio]) {
                useAudioStore.getState().stopSound(audio.current);
                audio.current = null;
            }
        };
    }, []);

    useEffect(() => {
        clearTimeout(windFadeTimeout.current);
        const { playSound, stopSound, setSoundVolume } =
            useAudioStore.getState();
        if (diving) {
            windGain.current = 1;
            if (windAudio.current) setSoundVolume(windAudio.current, 1);
            else
                windAudio.current = playSound("/audio/Wind.mp3", {
                    loop: true,
                });
        } else {
            const fade = () => {
                if (!windAudio.current) return;
                windGain.current = Math.max(0, windGain.current - 0.05);
                setSoundVolume(windAudio.current, windGain.current);
                if (windGain.current > 0)
                    windFadeTimeout.current = setTimeout(fade, 50);
                else {
                    stopSound(windAudio.current);
                    windAudio.current = null;
                }
            };
            fade();
        }
        return () => clearTimeout(windFadeTimeout.current);
    }, [diving]);

    useEffect(() => {
        if (gameOver || !body.current) return;
        body.current.setTranslation({ x: 0, y: 0, z: 0 }, true);
        body.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        position.current = [0, 0, 0];
        jumpPressed.current = false;
        jumpRotation.current = 0;
        lastY.current = null;
    }, [gameOver]);

    const onCollision = useCallback(({ other }) => {
        if (useGameStore.getState().gameOver) return;
        const type =
            other.colliderObject?.name || other.rigidBodyObject?.userData?.type;
        if (type === "sky-top" || type === "sky-bottom") {
            const armor = rewards.find(
                (reward) => reward.name === "Armor Plating",
            );
            const score = useScoreStore.getState();
            if (
                armor &&
                (score.maxDistance >= armor.distance ||
                    score.lifetimeDistance >= armor.lifetimeDistance)
            )
                return;
        }
        useAudioStore.getState().stopSound(hitAudio.current);
        hitAudio.current = useAudioStore.getState().playSound("/audio/Hit.mp3");
        if (useStore.getState().disableDeath) return;
        useGameStore.getState().setGameOver(true);
    }, []);

    useBeforePhysicsStep((world) => {
        if (useGameStore.getState().gameOver || !body.current) return;
        let vy = body.current.linvel().y;
        if (jump || canvasClicked || pointerJump) {
            if (!jumpPressed.current) {
                vy = JUMP_FORCE;
                jumpRotation.current = degToRad(45);
                useAudioStore.getState().stopSound(jumpAudio.current);
                jumpAudio.current = useAudioStore
                    .getState()
                    .playSound("/audio/Fly.mp3");
            }
            jumpPressed.current = true;
        } else jumpPressed.current = false;

        if (diving) vy -= 30 * world.timestep;
        body.current.setLinvel({ x: 0, y: vy, z: 0 }, true);
        const current = body.current.translation();
        if (current.y > PLAY_AREA_TOP) {
            body.current.setTranslation({ x: 0, y: PLAY_AREA_TOP, z: 0 }, true);
            body.current.setLinvel({ x: 0, y: Math.min(0, vy), z: 0 }, true);
        }
    });

    useAfterPhysicsStep(() => {
        if (!body.current) return;
        const current = body.current.translation();
        position.current = [current.x, current.y, current.z];
        const roundedY = Math.floor(current.y * 100) / 100;
        if (lastY.current !== roundedY) {
            useGameStore
                .getState()
                .setPlayerLocation(new Vector3(0, roundedY, 0));
            lastY.current = roundedY;
        }
    });

    useFrame((_, delta) => {
        if (!playerModel.current || gameOver) return;
        jumpRotation.current *= Math.pow(0.85, delta * 60);
        playerModel.current.rotation.x = diving
            ? degToRad(-45)
            : jumpRotation.current;
    });

    return (
        <group>
            {character.trail === "Fire" ? (
                <PlayerTrailFire positionRef={position} />
            ) : character.trail === "Bubbles" ? (
                <PlayerTrailBubbles positionRef={position} />
            ) : character.trail === "Rainbow" ? (
                <PlayerTrailRainbow positionRef={position} />
            ) : (
                <PlayerTrail positionRef={position} />
            )}
            <RigidBody
                ref={body}
                type="dynamic"
                colliders={false}
                enabledTranslations={[false, true, false]}
                lockRotations
                canSleep={false}
                ccd
                onCollisionEnter={onCollision}
                userData={PLAYER_BODY_DATA}
            >
                <BallCollider
                    args={[0.5]}
                    mass={1}
                    collisionGroups={interactionGroups(0, [1])}
                />
                <group ref={playerModel}>
                    {(character.model === "Helicopter" ||
                        character.model === "UFO") && (
                        <PlayerVehicleObject type={character.model} />
                    )}
                    {character.model === "Eagle" && (
                        <ModelEagle
                            scale={0.02}
                            position={[0, -0.5, -0.7]}
                        />
                    )}
                    {character.model === "Airplane" && (
                        <ModelAirplane
                            scale={1}
                            rotation={[0, degToRad(90), 0]}
                        />
                    )}
                    {character.model === "Flappy Bird" && (
                        <ModelFlappyBird
                            scale={0.1}
                            rotation={[0, degToRad(90), 0]}
                            position={[0, -0.5, 0]}
                        />
                    )}
                </group>
            </RigidBody>
        </group>
    );
}

export default memo(Player);
