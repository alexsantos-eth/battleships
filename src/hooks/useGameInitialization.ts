import { useEffect, useRef, useCallback, useState } from 'react';
import { useGameStore } from '@/stores/game';
import type { GameConfig } from '@/game/logic/gameInitializer';

interface UseGameInitializationOptions {
  config?: Partial<GameConfig>;
  autoInitialize?: boolean;
  onInitialized?: () => void;
  onError?: (error: Error) => void;
}

export const useGameInitialization = (options: UseGameInitializationOptions = {}) => {
  const { config, autoInitialize = true, onInitialized, onError } = options;
  const { initializeGame } = useGameStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const initializationPromise = useRef<Promise<void> | null>(null);
  const configRef = useRef(config);

  const initialize = useCallback(async () => {
    if (isInitialized) {
      return Promise.resolve();
    }

    if (initializationPromise.current) {
      return initializationPromise.current;
    }

    setIsLoading(true);
    initializationPromise.current = new Promise<void>((resolve, reject) => {
      try {
        initializeGame(configRef.current);
        setIsInitialized(true);
        setIsLoading(false);
        onInitialized?.();
        resolve();
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error('Unknown initialization error');
        setIsLoading(false);
        onError?.(errorObj);
        reject(errorObj);
      } finally {
        initializationPromise.current = null;
      }
    });

    return initializationPromise.current;
  }, [initializeGame, onInitialized, onError, isInitialized]);

  const reset = useCallback(() => {
    setIsInitialized(false);
    initializationPromise.current = null;
  }, []);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    let mounted = true;

    if (autoInitialize) {
      const initPromise = new Promise<void>((resolve, reject) => {
        try {
          initializeGame(configRef.current);
          if (mounted) {
            setIsInitialized(true);
            setIsLoading(false);
            onInitialized?.();
          }
          resolve();
        } catch (error) {
          const errorObj = error instanceof Error ? error : new Error('Unknown initialization error');
          if (mounted) {
            setIsLoading(false);
            onError?.(errorObj);
          }
          reject(errorObj);
        }
      });

      initPromise.catch((error) => {
        if (mounted) {
          console.error('Failed to initialize game:', error);
        }
      });
    }

    return () => {
      mounted = false;
      setIsInitialized(false);
      initializationPromise.current = null;
    };
  }, [autoInitialize, initializeGame, onInitialized, onError]);

  return {
    initialize,
    reset,
    isInitialized,
    isLoading,
  };
}; 