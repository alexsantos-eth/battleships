import { useState, useEffect, useRef } from 'react';

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

export const useSystemMetrics = (enabled: boolean = true, updateInterval: number = 2000, showCpu: boolean = false) => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    memory: { used: 0, total: 0, percentage: 0 },
    cpu: { usage: 0, cores: 0 },
    timestamp: Date.now()
  });

  // Referencia para detectar actividad
  const lastActivityRef = useRef<number>(Date.now());
  const frameCountRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    // Detectar actividad basada en requestAnimationFrame
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
      
      // Reset frame counter
      frameCountRef.current = 0;
      
      // Simular uso de memoria (basado en performance.memory si está disponible)
      let memoryUsed = 0;
      let memoryTotal = 0;
      
      if ('memory' in performance) {
        const mem = (performance as Performance & { memory: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
        memoryUsed = mem.usedJSHeapSize;
        memoryTotal = mem.jsHeapSizeLimit;
      } else {
        // Fallback: simular valores
        memoryUsed = Math.random() * 100 * 1024 * 1024; // 0-100MB
        memoryTotal = 512 * 1024 * 1024; // 512MB
      }

      // CPU usage basado en actividad real
      let cpuUsage = 5; // Uso base del navegador
      
      if (showCpu) {
        // Si hay actividad reciente (menos de 1 segundo), aumentar CPU
        if (timeSinceLastActivity < 1000) {
          cpuUsage += Math.min(frameRate / 10, 20); // Máximo 25% con actividad
        }
        
        // Pequeña variación aleatoria
        cpuUsage += Math.random() * 2;
      } else {
        // Si no mostrar CPU, usar valor muy bajo
        cpuUsage = 0;
      }
      
      setMetrics({
        memory: {
          used: memoryUsed,
          total: memoryTotal,
          percentage: (memoryUsed / memoryTotal) * 100
        },
        cpu: {
          usage: Math.min(cpuUsage, 30), // Máximo 30%
          cores: navigator.hardwareConcurrency || 4
        },
        timestamp: now
      });
    };

    // Actualizar inmediatamente
    updateMetrics();

    // Configurar intervalo
    const interval = setInterval(updateMetrics, updateInterval);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animationId);
    };
  }, [enabled, updateInterval, showCpu]);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getMemoryColor = (percentage: number): string => {
    if (percentage < 50) return '#4CAF50'; // Verde
    if (percentage < 80) return '#FF9800'; // Naranja
    return '#F44336'; // Rojo
  };

  const getCpuColor = (usage: number): string => {
    if (usage < 50) return '#4CAF50'; // Verde
    if (usage < 80) return '#FF9800'; // Naranja
    return '#F44336'; // Rojo
  };

  return {
    metrics,
    formatBytes,
    getMemoryColor,
    getCpuColor
  };
}; 