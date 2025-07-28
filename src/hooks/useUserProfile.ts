import { useUserProfileStore } from '@/stores/userProfile';

export const useUserProfile = () => {
  const {
    profile,
    isLoading,
    error,
    loadProfile,
    createProfile,
    updateStats,
    updatePreferences,
    addGameToHistory,
    updateCurrentGame,
    clearCurrentGame,
    setProfile,
    setLoading,
    setError,
    reset
  } = useUserProfileStore();

  return {
    profile,
    isLoading,
    error,
    loadProfile,
    createProfile,
    updateStats,
    updatePreferences,
    addGameToHistory,
    updateCurrentGame,
    clearCurrentGame,
    setProfile,
    setLoading,
    setError,
    reset
  };
}; 