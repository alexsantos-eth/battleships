import { useUserProfileStore } from '@/user/stores/profile/profileStore';

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