import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { UserStats } from '@/components/ui/UserStats';
import { GameHistory } from '@/components/ui/GameHistory';
import type { UserProfilePanelProps } from './UserProfilePanel.types';

export const UserProfilePanel: React.FC<UserProfilePanelProps> = ({ className = '' }) => {
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const [isOpen, setIsOpen] = useState(false);

  if (!user || !profile) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white/10 backdrop-blur-lg rounded-lg p-4 shadow-lg border border-white/20 hover:bg-white/20 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {profile.displayName.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="text-white">
              <p className="text-sm font-medium">{profile.displayName}</p>
              <p className="text-xs text-blue-200">
                {profile.stats.gamesWon}W / {profile.stats.gamesLost}L
              </p>
            </div>
            <svg
              className={`w-4 h-4 text-blue-300 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white/10 backdrop-blur-lg rounded-lg shadow-2xl border border-white/20">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">Profile</h3>
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

              <div className="text-white text-sm">
                <p><span className="text-blue-300">ID:</span> {user.uid.slice(0, 8)}...</p>
                <p><span className="text-blue-300">Member since:</span> {profile.createdAt.toLocaleDateString()}</p>
                <p><span className="text-blue-300">Last login:</span> {profile.lastLoginAt.toLocaleDateString()}</p>
              </div>

              <UserStats />
              <GameHistory />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 