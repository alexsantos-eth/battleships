import React from 'react';
import { LogoutButton } from '@/components/ui/LogoutButton';
import type { FloatingLogoutButtonProps } from './FloatingLogoutButton.types';

export const FloatingLogoutButton: React.FC<FloatingLogoutButtonProps> = ({ className = '' }) => {
  return (
    <LogoutButton 
      variant="floating" 
      className={`animate-fade-in ${className}`}
    />
  );
}; 