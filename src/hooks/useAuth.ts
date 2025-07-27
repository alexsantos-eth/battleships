import { useAuthStore } from '@/stores/authStore';

export const useAuth = () => {
  const {
    user,
    isLoading,
    isAuthenticated,
    signInAnonymously,
    signOut,
    reset
  } = useAuthStore();

  return {
    user,
    isLoading,
    isAuthenticated,
    signInAnonymously,
    signOut,
    reset
  };
}; 