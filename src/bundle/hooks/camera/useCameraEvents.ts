import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

import { useGameStore } from "@/bundle/stores/game/gameStore";
import {
  ENEMY_CAMERA_POSITION,
  PLAYER_CAMERA_POSITION,
  PLAYER_PERSPECTIVE_POSITION,
} from "@/constants/camera/offset";
import { DEBUG_CONFIG } from "@/constants/debug/settings";
import { CAMERA_EVENTS, cameraEventBus } from "@/events/camera/bus";
import { useFrame, useThree } from "@react-three/fiber";
import { GAME_CONSTANTS } from "@/constants/game/board";

interface CameraEventData {
  newRotation: number;
  targetDistance: number;
}

interface TogglePlayerPerspectiveData {
  isPlayerPerspective: boolean;
}

interface UseCameraEventsOptions {
  onShootStart?: (data: CameraEventData) => void;
  onShootEnd?: (data: CameraEventData) => void;
  animationSpeed?: number;
  enableLOD?: boolean;
}

interface UseCameraEventsReturn {
  isShooting: boolean;
  shootData: CameraEventData | null;
  triggerShoot: () => void;
}

export const useCameraEvents = (
  options: UseCameraEventsOptions = {}
): UseCameraEventsReturn => {
  const {
    onShootStart,
    onShootEnd,
    animationSpeed = 0.15,
    enableLOD = true,
  } = options;

  const { camera, gl } = useThree();
  const { isPlayerTurn } = useGameStore();

  const targetPosition = useRef(camera.position.clone());
  const targetRotation = useRef(camera.rotation.clone());
  const targetScale = useRef(camera.scale.clone());
  const isAnimating = useRef(false);
  const [isShooting, setIsShooting] = useState(false);
  const [shootData, setShootData] = useState<CameraEventData | null>(null);
  const [isPlayerPerspective, setIsPlayerPerspective] = useState(true);
  const originalPixelRatio = useRef<number>(1);
  const lastEventTime = useRef<number>(0);
  const EVENT_THROTTLE_MS = 16;

  const throttledEvent = useCallback(
    (eventHandler: (...args: unknown[]) => void, ...args: unknown[]) => {
      const now = Date.now();
      const throttleTime = isAnimating.current ? 8 : EVENT_THROTTLE_MS;
      if (now - lastEventTime.current > throttleTime) {
        eventHandler(...args);
        lastEventTime.current = now;
      }
    },
    []
  );

  const setLowQualityMode = useCallback(
    (enabled: boolean) => {
      if (gl) {
        if (enabled) {
          originalPixelRatio.current = gl.getPixelRatio();
          const reducedRatio = Math.max(originalPixelRatio.current * 0.8, 1);
          gl.setPixelRatio(reducedRatio);
          gl.setSize(
            gl.domElement.clientWidth,
            gl.domElement.clientHeight,
            false
          );
        } else {
          gl.setPixelRatio(originalPixelRatio.current);
          gl.setSize(
            gl.domElement.clientWidth,
            gl.domElement.clientHeight,
            false
          );
        }
      }
    },
    [gl]
  );

  const setPlayerCameraPosition = useCallback(
    (usePlayerPerspective: boolean) => {
      if (DEBUG_CONFIG.ENABLE_CAMERA_CONTROLS) return;

      throttledEvent(() => {
        if (usePlayerPerspective) {
          targetPosition.current.set(...PLAYER_PERSPECTIVE_POSITION.position);
          targetRotation.current.set(...PLAYER_PERSPECTIVE_POSITION.rotation);
          targetScale.current.set(...GAME_CONSTANTS.BOARD.SCALE);
        } else {
          targetPosition.current.set(...PLAYER_CAMERA_POSITION.position);
          targetRotation.current.set(...PLAYER_CAMERA_POSITION.rotation);
          targetScale.current.set(...GAME_CONSTANTS.BOARD.SCALE);
        }
        isAnimating.current = true;
      });
    },
    [throttledEvent]
  );

  const handleShootStart = useCallback(
    (...args: unknown[]) => {
      const data = args[0] as CameraEventData;

      if (DEBUG_CONFIG.ENABLE_CAMERA_CONTROLS) {
        setIsShooting(true);
        setShootData(data);

        if (onShootStart) {
          onShootStart(data);
        }
        return;
      }

      targetPosition.current.set(...ENEMY_CAMERA_POSITION.position);
      targetRotation.current.set(...ENEMY_CAMERA_POSITION.rotation);
      targetScale.current.set(
        GAME_CONSTANTS.BOARD.SCALE[0] * 1,
        GAME_CONSTANTS.BOARD.SCALE[1] * 1,
        GAME_CONSTANTS.BOARD.SCALE[2] * 1
      );
      isAnimating.current = true;

      const isSlowDevice = navigator.hardwareConcurrency <= 4;
      if (isSlowDevice && enableLOD) {
        setLowQualityMode(true);
      }

      setIsShooting(true);
      setShootData(data);

      if (onShootStart) {
        onShootStart(data);
      }
    },
    [onShootStart, camera, setLowQualityMode, enableLOD]
  );

  const handleShootEnd = useCallback(
    (...args: unknown[]) => {
      const data = args[0] as CameraEventData;

      if (DEBUG_CONFIG.ENABLE_CAMERA_CONTROLS) {
        if (onShootEnd) {
          onShootEnd(data);
        }
        return;
      }

      if (isPlayerPerspective) {
        targetPosition.current.set(...PLAYER_PERSPECTIVE_POSITION.position);
        targetRotation.current.set(...PLAYER_PERSPECTIVE_POSITION.rotation);
      } else {
        targetPosition.current.set(...PLAYER_CAMERA_POSITION.position);
        targetRotation.current.set(...PLAYER_CAMERA_POSITION.rotation);
      }

      targetScale.current.set(
        GAME_CONSTANTS.BOARD.SCALE[0] * 1.2,
        GAME_CONSTANTS.BOARD.SCALE[1] * 1.2,
        GAME_CONSTANTS.BOARD.SCALE[2] * 1.2
      );
      isAnimating.current = true;

      const isSlowDevice = navigator.hardwareConcurrency <= 4;
      if (isSlowDevice && enableLOD) {
        setLowQualityMode(true);
      }

      if (onShootEnd) {
        onShootEnd(data);
      }
    },
    [onShootEnd, camera, isPlayerPerspective, setLowQualityMode, enableLOD]
  );

  const handleTogglePlayerPerspective = useCallback(
    (...args: unknown[]) => {
      const data = args[0] as TogglePlayerPerspectiveData;
      setIsPlayerPerspective(data.isPlayerPerspective);

      if (!isPlayerTurn) {
        setPlayerCameraPosition(data.isPlayerPerspective);
      }
    },
    [isPlayerTurn, setPlayerCameraPosition]
  );

  const triggerShoot = useCallback(() => {}, []);

  useFrame(() => {
    if (!isAnimating.current || DEBUG_CONFIG.ENABLE_CAMERA_CONTROLS) return;

    const currentPos = camera.position;
    const currentRot = camera.rotation;
    const currentScale = camera.scale;
    const targetPos = targetPosition.current;
    const targetRot = targetRotation.current;
    const targetSc = targetScale.current;

    currentPos.lerp(targetPos, animationSpeed);

    const lerpX = THREE.MathUtils.lerp(
      currentRot.x,
      targetRot.x,
      animationSpeed
    );
    const lerpY = THREE.MathUtils.lerp(
      currentRot.y,
      targetRot.y,
      animationSpeed
    );
    const lerpZ = THREE.MathUtils.lerp(
      currentRot.z,
      targetRot.z,
      animationSpeed
    );

    currentRot.set(lerpX, lerpY, lerpZ);
    currentScale.lerp(targetSc, animationSpeed);

    const posDistanceSquared = currentPos.distanceToSquared(targetPos);
    const rotDistance =
      Math.abs(currentRot.x - targetRot.x) +
      Math.abs(currentRot.y - targetRot.y) +
      Math.abs(currentRot.z - targetRot.z);

    if (posDistanceSquared < 0.00001 && rotDistance < 0.005) {
      currentPos.copy(targetPos);
      currentRot.copy(targetRot);
      currentScale.copy(targetSc);
      isAnimating.current = false;

      if (enableLOD) {
        setLowQualityMode(false);
      }
    }
  });

  useEffect(() => {
    cameraEventBus.on(CAMERA_EVENTS.CAMERA_SHOOT_START, handleShootStart);
    cameraEventBus.on(CAMERA_EVENTS.CAMERA_SHOOT_END, handleShootEnd);
    cameraEventBus.on(
      CAMERA_EVENTS.CAMERA_TOGGLE_PLAYER_PERSPECTIVE,
      handleTogglePlayerPerspective
    );

    return () => {
      cameraEventBus.off(CAMERA_EVENTS.CAMERA_SHOOT_START, handleShootStart);
      cameraEventBus.off(CAMERA_EVENTS.CAMERA_SHOOT_END, handleShootEnd);
      cameraEventBus.off(
        CAMERA_EVENTS.CAMERA_TOGGLE_PLAYER_PERSPECTIVE,
        handleTogglePlayerPerspective
      );
    };
  }, [handleShootStart, handleShootEnd, handleTogglePlayerPerspective]);

  useEffect(() => {
    if (isPlayerTurn) {
      cameraEventBus.emit(CAMERA_EVENTS.CAMERA_SHOOT_START);
    } else {
      cameraEventBus.emit(CAMERA_EVENTS.CAMERA_SHOOT_END);
    }
  }, [isPlayerTurn]);

  return {
    isShooting,
    shootData,
    triggerShoot,
  };
};

export const useCameraShoot = () => {
  return useCameraEvents();
};

export const useCameraShootStart = (
  callback?: (data: CameraEventData) => void
) => {
  return useCameraEvents({
    onShootStart: callback,
  });
};

export const useCameraShootEnd = (
  callback?: (data: CameraEventData) => void
) => {
  return useCameraEvents({
    onShootEnd: callback,
  });
};
