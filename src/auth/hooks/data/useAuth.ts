import { useAuthStore } from "@/auth/stores/data/authStore";

export const useAuth = () => {
  const {
    user,
    isLoading,
    isAuthenticated,
    signInAnonymously,
    signOut,
    reset,
  } = useAuthStore();

  return {
    user,
    isLoading,
    isAuthenticated,
    signInAnonymously,
    signOut,
    reset,
  };
};
