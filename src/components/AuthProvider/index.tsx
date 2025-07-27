import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';

import { LoadingScreen } from '@/components/LoadingScreen';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const { user, isLoading, isAuthenticated, signInAnonymously } = useAuth();
  const { profile, loadProfile } = useUserProfile();
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const handleUserProfile = async () => {
      if (user && !profile) {
        try {
          console.log('Loading profile for user:', user.uid);
          await loadProfile(user.uid);
        } catch (error) {
          console.warn('Failed to load profile, user may not exist yet:', error);
        }
      }
    };

    handleUserProfile();
  }, [user, profile, loadProfile]);

  const handleSignIn = async () => {
    try {
      setAuthError(null);
      await signInAnonymously();
    } catch (error) {
      console.error('Sign in error:', error);
      setAuthError('Failed to sign in. Please try again.');
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 max-w-md w-full mx-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-6">⚓ Armada.io</h1>
            <p className="text-blue-200 mb-8 text-lg">
              Welcome to the ultimate naval battle experience
            </p>
            
            {authError && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
                <p className="text-red-300 text-sm">{authError}</p>
              </div>
            )}
            
            <button
              onClick={handleSignIn}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl w-full"
            >
              Start Playing Anonymously
            </button>
            
            <p className="text-blue-300 text-sm mt-4">
              No account required - just start playing!
            </p>
            
            <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <p className="text-blue-200 text-xs">
                <strong>Note:</strong> Firebase authentication is required for full functionality. 
                Please configure your Firebase project to enable user profiles and game statistics.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider; 