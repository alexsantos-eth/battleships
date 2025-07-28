import { useState, useEffect, useRef } from 'react';
import { GAME_CONSTANTS } from '@/constants/game';

interface SystemMetrics {
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    usage: number;
    cores: number;
  };
  timestamp: number;
}

export const useSystemMetrics = (
  enabled: boolean = true, 
  updateInterval: number = GAME_CONSTANTS.PERFORMANCE.SYSTEM.UPDATE_INTERVAL, 
  showCpu: boolean = false
) => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    memory: { used: 0, total: 0, percentage: 0 },
    cpu: { usage: 0, cores: 0 },
    timestamp: Date.now()
  });

  const lastActivityRef = useRef<number>(Date.now());
  const frameCountRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    const detectActivity = () => {
      frameCountRef.current++;
      lastActivityRef.current = Date.now();
      requestAnimationFrame(detectActivity);
    };
    
    const animationId = requestAnimationFrame(detectActivity);

    const updateMetrics = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityRef.current;
      const frameRate = frameCountRef.current / (updateInterval / 1000);
      
      frameCountRef.current = 0;
      
      let memoryUsed = 0;
      let memoryTotal = 0;
      
      if ('memory' in performance) {
        const mem = (performance as Performance & { memory: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
        memoryUsed = mem.usedJSHeapSize;
        memoryTotal = mem.jsHeapSizeLimit;
      } else {
        memoryUsed = Math.random() * GAME_CONSTANTS.PERFORMANCE.MEMORY.DEFAULT_USED;
        memoryTotal = GAME_CONSTANTS.PERFORMANCE.MEMORY.DEFAULT_TOTAL;
      }

      let cpuUsage: number = GAME_CONSTANTS.PERFORMANCE.CPU.BASE_USAGE;
      
      if (showCpu) {
        if (timeSinceLastActivity < GAME_CONSTANTS.PERFORMANCE.SYSTEM.ACTIVITY_TIMEOUT) {
          cpuUsage += Math.min(frameRate / GAME_CONSTANTS.PERFORMANCE.SYSTEM.FRAME_RATE_DIVISOR, GAME_CONSTANTS.PERFORMANCE.CPU.ACTIVITY_BONUS);
        }
        
        cpuUsage += Math.random() * GAME_CONSTANTS.PERFORMANCE.CPU.VARIATION;
      } else {
        cpuUsage = 0;
      }
      
      setMetrics({
        memory: {
          used: memoryUsed,
          total: memoryTotal,
          percentage: (memoryUsed / memoryTotal) * 100
        },
        cpu: {
          usage: Math.min(cpuUsage, GAME_CONSTANTS.PERFORMANCE.CPU.MAX_USAGE),
          cores: navigator.hardwareConcurrency || GAME_CONSTANTS.CAMERA.PERFORMANCE.slowDeviceCores
        },
        timestamp: now
      });
    };

    updateMetrics();

    const interval = setInterval(updateMetrics, updateInterval);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animationId);
    };
  }, [enabled, updateInterval, showCpu]);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = GAME_CONSTANTS.PERFORMANCE.SYSTEM.BYTES_BASE;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getMemoryColor = (percentage: number): string => {
    if (percentage < 50) return GAME_CONSTANTS.UI.COLORS.SUCCESS;
    if (percentage < 80) return GAME_CONSTANTS.UI.COLORS.WARNING;
    return GAME_CONSTANTS.UI.COLORS.DANGER;
  };

  const getCpuColor = (usage: number): string => {
    if (usage < 50) return GAME_CONSTANTS.UI.COLORS.SUCCESS;
    if (usage < 80) return GAME_CONSTANTS.UI.COLORS.WARNING;
    return GAME_CONSTANTS.UI.COLORS.DANGER;
  };

  return {
    metrics,
    formatBytes,
    getMemoryColor,
    getCpuColor
  };
}; 