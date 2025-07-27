import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import type { FloatingProfileButtonProps } from './FloatingProfileButton.types';

export const FloatingProfileButton: React.FC<FloatingProfileButtonProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const { profile } = useUserProfile();

  if (!user || !profile) {
    return null;
  }

  return (
    <Link
      to="/profile"
      className={`fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 ${className}`}
      title="View Profile"
    >
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-sm font-bold">
            {profile.displayName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="hidden sm:block">
          <div className="text-sm font-medium">{profile.displayName}</div>
          <div className="text-xs opacity-80">
            {profile.stats.gamesPlayed} games played
          </div>
        </div>
      </div>
    </Link>
  );
}; 