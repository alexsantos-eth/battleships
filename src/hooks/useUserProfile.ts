import { useUserProfileStore } from '@/stores/userProfileStore';

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