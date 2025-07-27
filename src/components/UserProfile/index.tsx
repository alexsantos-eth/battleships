import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();

  if (!user) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 shadow-lg border border-white/20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {user.uid.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="text-white">
            <p className="text-sm font-medium">
              {profile?.displayName || 'Anonymous Player'}
            </p>
            <p className="text-xs text-blue-200">
              {profile?.stats ? `${profile.stats.gamesWon}W / ${profile.stats.gamesLost}L` : 'New Player'}
            </p>
          </div>
          <button
            onClick={signOut}
            className="text-blue-300 hover:text-white text-sm transition-colors duration-200"
            title="Sign Out"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 