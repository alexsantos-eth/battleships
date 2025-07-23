import { useEffect, useState, useCallback } from "react";
import { eventBus, EVENTS } from "../utils/eventBus";

interface CameraEventData {
  newRotation: number;
  targetDistance: number;
}

interface UseCameraEventsOptions {
  onShootStart?: (data: CameraEventData) => void;
  onShootEnd?: (data: CameraEventData) => void;
  autoReset?: boolean;
  resetDelay?: number;
}

interface UseCameraEventsReturn {
  isShooting: boolean;
  shootData: CameraEventData | null;
  triggerShoot: () => void;
}

export const useCameraEvents = (options: UseCameraEventsOptions = {}): UseCameraEventsReturn => {
  const {
    onShootStart,
    onShootEnd,
    autoReset = true,
    resetDelay = 2000
  } = options;

  const [isShooting, setIsShooting] = useState(false);
  const [shootData, setShootData] = useState<CameraEventData | null>(null);

  const handleShootStart = useCallback((...args: unknown[]) => {
    const data = args[0] as CameraEventData;
    console.log("useCameraEvents: Camera shoot started", data);
    
    setIsShooting(true);
    setShootData(data);
    
    if (onShootStart) {
      onShootStart(data);
    }
  }, [onShootStart]);

  const handleShootEnd = useCallback((...args: unknown[]) => {
    const data = args[0] as CameraEventData;
    console.log("useCameraEvents: Camera shoot ended", data);
    
    if (onShootEnd) {
      onShootEnd(data);
    }

    if (autoReset) {
      setTimeout(() => {
        setIsShooting(false);
        setShootData(null);
      }, resetDelay);
    }
  }, [onShootEnd, autoReset, resetDelay]);

  const triggerShoot = useCallback(() => {
    console.log("useCameraEvents: Manual shoot trigger");
  }, []);

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
    triggerShoot
  };
};

export const useCameraShoot = () => {
  return useCameraEvents();
};

export const useCameraShootStart = (callback?: (data: CameraEventData) => void) => {
  return useCameraEvents({
    onShootStart: callback,
    autoReset: false
  });
};

export const useCameraShootEnd = (callback?: (data: CameraEventData) => void) => {
  return useCameraEvents({
    onShootEnd: callback,
    autoReset: false
  });
}; 