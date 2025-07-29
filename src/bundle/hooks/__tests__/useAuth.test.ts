import { renderHook } from '@testing-library/react';
import { useAuth } from '../../../auth/hooks/data/useAuth';
import { useAuthStore } from '@/stores/auth/authStore';
import type { User } from 'firebase/auth';

jest.mock('@/stores/auth');

jest.mock('firebase/auth', () => ({
  signInAnonymously: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  getAuth: jest.fn()
}));

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn()
}));

jest.mock('@/config/firebase', () => ({
  auth: {}
}));

describe('useAuth', () => {
  const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

  beforeEach(() => {
    mockUseAuthStore.mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      signInAnonymously: jest.fn(),
      signOut: jest.fn(),
      setUser: jest.fn(),
      setLoading: jest.fn()
    });
  });

  it('should return authentication state and methods', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('isAuthenticated');
    expect(result.current).toHaveProperty('signInAnonymously');
    expect(result.current).toHaveProperty('signOut');
  });

  it('should return user data when authenticated', () => {
    const mockUser = { uid: 'test-uid' } as User;
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      isLoading: false,
      isAuthenticated: true,
      signInAnonymously: jest.fn(),
      signOut: jest.fn(),
      setUser: jest.fn(),
      setLoading: jest.fn()
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBe(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });
}); 