import { useEffect } from "react";

import { useAuth } from "@/auth/hooks/data/useAuth";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useUserProfile } from "@/user/hooks/profile/useUserProfile";

import { SignInScreen } from "./SigninScreen/SignInScreen";

import type { AuthProviderProps } from "./AuthProvider.types";
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { profile, loadProfile } = useUserProfile();

  useEffect(() => {
    const handleUserProfile = async () => {
      if (user && !profile) {
        try {
          await loadProfile(user.uid);
        } catch (error) {
          console.warn(
            "Failed to load profile, user may not exist yet:",
            error
          );
        }
      }
    };

    handleUserProfile();
  }, [user, profile, loadProfile]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <SignInScreen />;
  }

  return <>{children}</>;
};
