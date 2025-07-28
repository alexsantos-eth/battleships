import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { LogoutButtonProps } from './LogoutButton.types';

export const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  variant = 'default', 
  className = '' 
}) => {
  const { signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const baseClasses = 'transition-all duration-200 font-medium';
  
  const variantClasses = {
    default: 'bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl',
    minimal: 'text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1 rounded',
    floating: 'fixed top-4 right-4 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl z-50'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={classes}
      title="Sign Out"
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span>Signing out...</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>{variant === 'minimal' ? 'Logout' : 'Sign Out'}</span>
        </div>
      )}
    </button>
  );
}; 