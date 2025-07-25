import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

import { useGameStore } from "@/stores/gameStore";
import { PLAYER_CAMERA_POSITION } from "@/utils/camera";
import { eventBus, EVENTS } from "@/utils/eventBus";
import { useFrame, useThree } from "@react-three/fiber";

interface CameraEventData {
  newRotation: number;
  targetDistance: number;
}

interface UseCameraEventsOptions {
  onShootStart?: (data: CameraEventData) => void;
  onShootEnd?: (data: CameraEventData) => void;
  animationSpeed?: number;
}

interface UseCameraEventsReturn {
  isShooting: boolean;
  shootData: CameraEventData | null;
  triggerShoot: () => void;
}

export const useCameraEvents = (
  options: UseCameraEventsOptions = {}
): UseCameraEventsReturn => {
  const { onShootStart, onShootEnd, animationSpeed = 0.08 } = options;

  const { camera } = useThree();
  const { setPlayerTurn, setEnemyTurn } = useGameStore();
  const targetPosition = useRef(camera.position.clone());
  const targetRotation = useRef(camera.rotation.clone());
  const isAnimating = useRef(false);
  const [isShooting, setIsShooting] = useState(false);
  const [shootData, setShootData] = useState<CameraEventData | null>(null);

  const handleShootStart = useCallback(
    (...args: unknown[]) => {
      const data = args[0] as CameraEventData;

      targetPosition.current.set(0, 9, 5);
      targetRotation.current.set(0, 0, 0);
      isAnimating.current = true;

      setIsShooting(true);
      setShootData(data);
      setPlayerTurn();

      if (onShootStart) {
        onShootStart(data);
      }
    },
    [onShootStart, camera, setPlayerTurn]
  );

  const handleShootEnd = useCallback(
    (...args: unknown[]) => {
      const data = args[0] as CameraEventData;
      targetPosition.current.set(
        PLAYER_CAMERA_POSITION.position[0],
        PLAYER_CAMERA_POSITION.position[1],
        PLAYER_CAMERA_POSITION.position[2]
      );

      targetRotation.current.set(
        PLAYER_CAMERA_POSITION.rotation[0],
        PLAYER_CAMERA_POSITION.rotation[1],
        PLAYER_CAMERA_POSITION.rotation[2]
      );
      isAnimating.current = true;
      setEnemyTurn();

      if (onShootEnd) {
        onShootEnd(data);
      }
    },
    [onShootEnd, camera, setEnemyTurn]
  );

  const triggerShoot = useCallback(() => {}, []);

  useFrame(() => {
    if (isAnimating.current) {
      const currentPos = camera.position;
      const currentRot = camera.rotation;
      const targetPos = targetPosition.current;
      const targetRot = targetRotation.current;

      currentPos.lerp(targetPos, animationSpeed);

      currentRot.x = THREE.MathUtils.lerp(
        currentRot.x,
        targetRot.x,
        animationSpeed
      );
      currentRot.y = THREE.MathUtils.lerp(
        currentRot.y,
        targetRot.y,
        animationSpeed
      );
      currentRot.z = THREE.MathUtils.lerp(
        currentRot.z,
        targetRot.z,
        animationSpeed
      );

      const posDistance = currentPos.distanceTo(targetPos);
      const rotDistance =
        Math.abs(currentRot.x - targetRot.x) +
        Math.abs(currentRot.y - targetRot.y) +
        Math.abs(currentRot.z - targetRot.z);

      if (posDistance < 0.01 && rotDistance < 0.01) {
        currentPos.copy(targetPos);
        currentRot.copy(targetRot);
        isAnimating.current = false;
      }
    }
  });

  useEffect(() => {
    eventBus.on(EVENTS.CAMERA_SHOOT_START, handleShootStart);
    eventBus.on(EVENTS.CAMERA_SHOOT_END, handleShootEnd);

    return () => {
      eventBus.off(EVENTS.CAMERA_SHOOT_START, handleShootStart);
      eventBus.off(EVENTS.CAMERA_SHOOT_END, handleShootEnd);
    };
  }, [handleShootStart, handleShootEnd]);

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
