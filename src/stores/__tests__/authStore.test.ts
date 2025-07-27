import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../auth';
import type { User } from 'firebase/auth';

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

describe('AuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isLoading: true,
      isAuthenticated: false
    });
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAuthStore());
    
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should set user and update authentication state', () => {
    const { result } = renderHook(() => useAuthStore());
    const mockUser = { uid: 'test-uid' } as User;

    act(() => {
      result.current.setUser(mockUser);
    });

    expect(result.current.user).toBe(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('should set loading state', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setLoading(false);
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should clear user and update authentication state', () => {
    const { result } = renderHook(() => useAuthStore());
    const mockUser = { uid: 'test-uid' } as User;

    act(() => {
      result.current.setUser(mockUser);
    });

    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.setUser(null);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });
}); 