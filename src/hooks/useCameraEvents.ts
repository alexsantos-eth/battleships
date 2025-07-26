import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

import { useGameStore } from "@/stores/gameStore";
import { PLAYER_CAMERA_POSITION, ENEMY_CAMERA_POSITION, PLAYER_PERSPECTIVE_POSITION } from "@/utils/camera";
import { eventBus, EVENTS } from "@/utils/eventBus";
import { useFrame, useThree } from "@react-three/fiber";

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
  enableLOD?: boolean; // Nueva opción para controlar LOD
}

interface UseCameraEventsReturn {
  isShooting: boolean;
  shootData: CameraEventData | null;
  triggerShoot: () => void;
}

export const useCameraEvents = (
  options: UseCameraEventsOptions = {}
): UseCameraEventsReturn => {
  const { onShootStart, onShootEnd, animationSpeed = 0.15, enableLOD = true } = options; // Aumentado de 0.08 a 0.15

  const { camera, gl } = useThree();
  const { setPlayerTurn, setEnemyTurn, isPlayerTurn } = useGameStore();
  const targetPosition = useRef(camera.position.clone());
  const targetRotation = useRef(camera.rotation.clone());
  const isAnimating = useRef(false);
  const [isShooting, setIsShooting] = useState(false);
  const [shootData, setShootData] = useState<CameraEventData | null>(null);
  const [isPlayerPerspective, setIsPlayerPerspective] = useState(false);
  const originalPixelRatio = useRef<number>(1);
  const lastEventTime = useRef<number>(0);
  const EVENT_THROTTLE_MS = 16; // Reducido de 100ms a 16ms (60fps) para transiciones más fluidas
  const frameCountRef = useRef<number>(0);
  const lastFpsCheckRef = useRef<number>(0);

  // Optimización: Throttling para eventos de cámara
  const throttledEvent = useCallback((eventHandler: (...args: unknown[]) => void, ...args: unknown[]) => {
    const now = Date.now();
    // Permitir eventos más frecuentes durante animaciones
    const throttleTime = isAnimating.current ? 8 : EVENT_THROTTLE_MS;
    if (now - lastEventTime.current > throttleTime) {
      eventHandler(...args);
      lastEventTime.current = now;
    }
  }, []);

  // Optimización: Reducir calidad durante transiciones
  const setLowQualityMode = useCallback((enabled: boolean) => {
    if (gl) {
      if (enabled) {
        originalPixelRatio.current = gl.getPixelRatio();
        // Reducir menos la calidad para mantener buena apariencia visual
        const reducedRatio = Math.max(originalPixelRatio.current * 0.8, 1);
        gl.setPixelRatio(reducedRatio);
        gl.setSize(gl.domElement.clientWidth, gl.domElement.clientHeight, false);
      } else {
        gl.setPixelRatio(originalPixelRatio.current);
        gl.setSize(gl.domElement.clientWidth, gl.domElement.clientHeight, false);
      }
    }
  }, [gl]);

  // Optimización: Monitoreo de FPS durante transiciones
  const checkPerformance = useCallback(() => {
    frameCountRef.current++;
    const now = Date.now();
    
    if (now - lastFpsCheckRef.current >= 1000) {
      const fps = frameCountRef.current;
      frameCountRef.current = 0;
      lastFpsCheckRef.current = now;
      
      // Solo reducir calidad si FPS es muy bajo (más conservador)
      if (fps < 20 && isAnimating.current) {
        if (gl) {
          // Reducir menos agresivamente
          const currentRatio = gl.getPixelRatio();
          const newRatio = Math.max(currentRatio * 0.9, 1);
          gl.setPixelRatio(newRatio);
        }
      }
    }
  }, [gl]);

  const setPlayerCameraPosition = useCallback(
    (usePlayerPerspective: boolean) => {
      throttledEvent(() => {
        if (usePlayerPerspective) {
          targetPosition.current.set(
            PLAYER_PERSPECTIVE_POSITION.position[0],
            PLAYER_PERSPECTIVE_POSITION.position[1],
            PLAYER_PERSPECTIVE_POSITION.position[2]
          );
          targetRotation.current.set(
            PLAYER_PERSPECTIVE_POSITION.rotation[0],
            PLAYER_PERSPECTIVE_POSITION.rotation[1],
            PLAYER_PERSPECTIVE_POSITION.rotation[2]
          );
        } else {
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
        }
        isAnimating.current = true;
      });
    },
    [throttledEvent]
  );

  const handleShootStart = useCallback(
    (...args: unknown[]) => {
      const data = args[0] as CameraEventData;

      // Transición inmediata sin throttling para evitar lag
      targetPosition.current.set(
        ENEMY_CAMERA_POSITION.position[0],
        ENEMY_CAMERA_POSITION.position[1],
        ENEMY_CAMERA_POSITION.position[2]
      );
      targetRotation.current.set(
        ENEMY_CAMERA_POSITION.rotation[0],
        ENEMY_CAMERA_POSITION.rotation[1],
        ENEMY_CAMERA_POSITION.rotation[2]
      );
      isAnimating.current = true;

      // Solo activar LOD si el dispositivo es lento (opcional)
      const isSlowDevice = navigator.hardwareConcurrency <= 4;
      if (isSlowDevice && enableLOD) {
        setLowQualityMode(true);
      }

      setIsShooting(true);
      setShootData(data);
      setPlayerTurn();

      if (onShootStart) {
        onShootStart(data);
      }
    },
    [onShootStart, camera, setPlayerTurn, setLowQualityMode, enableLOD]
  );

  const handleShootEnd = useCallback(
    (...args: unknown[]) => {
      const data = args[0] as CameraEventData;
      
      // Transición inmediata sin throttling para evitar lag
      if (isPlayerPerspective) {
        targetPosition.current.set(
          PLAYER_PERSPECTIVE_POSITION.position[0],
          PLAYER_PERSPECTIVE_POSITION.position[1],
          PLAYER_PERSPECTIVE_POSITION.position[2]
        );
        targetRotation.current.set(
          PLAYER_PERSPECTIVE_POSITION.rotation[0],
          PLAYER_PERSPECTIVE_POSITION.rotation[1],
          PLAYER_PERSPECTIVE_POSITION.rotation[2]
        );
      } else {
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
      }
      isAnimating.current = true;
      
      setEnemyTurn();

      // Solo activar LOD si el dispositivo es lento (opcional)
      const isSlowDevice = navigator.hardwareConcurrency <= 4;
      if (isSlowDevice && enableLOD) {
        setLowQualityMode(true);
      }

      if (onShootEnd) {
        onShootEnd(data);
      }
    },
    [
      onShootEnd,
      camera,
      setEnemyTurn,
      isPlayerPerspective,
      setLowQualityMode,
      enableLOD,
    ]
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
    // Optimización: Monitorear performance
    checkPerformance();
    
    if (!isAnimating.current) return;

    const currentPos = camera.position;
    const currentRot = camera.rotation;
    const targetPos = targetPosition.current;
    const targetRot = targetRotation.current;

    // Optimización: Usar lerp más eficiente
    currentPos.lerp(targetPos, animationSpeed);

    // Optimización: Calcular rotación en una sola operación
    const lerpX = THREE.MathUtils.lerp(currentRot.x, targetRot.x, animationSpeed);
    const lerpY = THREE.MathUtils.lerp(currentRot.y, targetRot.y, animationSpeed);
    const lerpZ = THREE.MathUtils.lerp(currentRot.z, targetRot.z, animationSpeed);
    
    currentRot.set(lerpX, lerpY, lerpZ);

    // Optimización: Usar distanceSquared en lugar de distanceTo para evitar sqrt
    const posDistanceSquared = currentPos.distanceToSquared(targetPos);
    const rotDistance = Math.abs(currentRot.x - targetRot.x) + 
                       Math.abs(currentRot.y - targetRot.y) + 
                       Math.abs(currentRot.z - targetRot.z);

    // Optimización: Usar threshold más eficiente
    if (posDistanceSquared < 0.00001 && rotDistance < 0.005) { // Thresholds más estrictos para finalización más rápida
      currentPos.copy(targetPos);
      currentRot.copy(targetRot);
      isAnimating.current = false;
      
      // Siempre restaurar calidad normal cuando termine la animación
      if (enableLOD) {
        setLowQualityMode(false);
      }
    }
  });

  useEffect(() => {
    eventBus.on(EVENTS.CAMERA_SHOOT_START, handleShootStart);
    eventBus.on(EVENTS.CAMERA_SHOOT_END, handleShootEnd);
    eventBus.on(
      EVENTS.CAMERA_TOGGLE_PLAYER_PERSPECTIVE,
      handleTogglePlayerPerspective
    );

    return () => {
      eventBus.off(EVENTS.CAMERA_SHOOT_START, handleShootStart);
      eventBus.off(EVENTS.CAMERA_SHOOT_END, handleShootEnd);
      eventBus.off(
        EVENTS.CAMERA_TOGGLE_PLAYER_PERSPECTIVE,
        handleTogglePlayerPerspective
      );
    };
  }, [handleShootStart, handleShootEnd, handleTogglePlayerPerspective]);

  useEffect(() => {
    if (isPlayerTurn) {
      eventBus.emit(EVENTS.CAMERA_SHOOT_START);
    } else {
      eventBus.emit(EVENTS.CAMERA_SHOOT_END);
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
