import { useAuthStore } from '@/stores/auth';

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