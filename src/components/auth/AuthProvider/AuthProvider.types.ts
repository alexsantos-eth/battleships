import type { ReactNode } from 'react';

export interface AuthProviderProps {
  children: ReactNode;
}

export interface SignInScreenProps {
  authError?: string | null;
}

export interface SignInButtonProps {
  className?: string;
  children?: ReactNode;
} 