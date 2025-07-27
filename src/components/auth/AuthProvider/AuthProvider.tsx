import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';

import { LoadingScreen } from '@/components/ui/LoadingScreen';
import type { AuthProviderProps } from './AuthProvider.types';
import { SignInScreen } from './SignInScreen';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { profile, loadProfile } = useUserProfile();

  useEffect(() => {
    const handleUserProfile = async () => {
      if (user && !profile) {
        try {
          await loadProfile(user.uid);
        } catch (error) {
          console.warn('Failed to load profile, user may not exist yet:', error);
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