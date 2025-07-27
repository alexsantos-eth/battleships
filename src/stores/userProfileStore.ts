import { create } from 'zustand';
import { userService } from '@/services/userService';
import type { UserProfile, GameStats, UserPreferences, GameHistory } from '@/types/user';

export interface UserProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  loadProfile: (uid: string) => Promise<void>;
  createProfile: (uid: string, displayName: string, isAnonymous: boolean) => Promise<void>;
  updateStats: (stats: Partial<GameStats>) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  addGameToHistory: (gameHistory: GameHistory) => Promise<void>;
  updateCurrentGame: (gameData: UserProfile['currentGame']) => Promise<void>;
  clearCurrentGame: () => Promise<void>;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useUserProfileStore = create<UserProfileState>((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,

  loadProfile: async (uid: string) => {
    try {
      set({ isLoading: true, error: null });
      const profile = await userService.getUserProfile(uid);
      set({ profile, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load profile',
        isLoading: false 
      });
    }
  },

  createProfile: async (uid: string, displayName: string, isAnonymous: boolean) => {
    try {
      set({ isLoading: true, error: null });
      await userService.createUser({
        uid,
        displayName,
        isAnonymous
      });
      
      const profile = await userService.getUserProfile(uid);
      set({ profile, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create profile',
        isLoading: false 
      });
    }
  },

  updateStats: async (stats: Partial<GameStats>) => {
    const { profile } = get();
    if (!profile) return;

    try {
      set({ isLoading: true, error: null });
      await userService.updateUserStats(profile.uid, stats);
      
      const updatedProfile = await userService.getUserProfile(profile.uid);
      set({ profile: updatedProfile, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update stats',
        isLoading: false 
      });
    }
  },

  updatePreferences: async (preferences: Partial<UserPreferences>) => {
    const { profile } = get();
    if (!profile) return;

    try {
      set({ isLoading: true, error: null });
      await userService.updateUserPreferences(profile.uid, preferences);
      
      const updatedProfile = await userService.getUserProfile(profile.uid);
      set({ profile: updatedProfile, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update preferences',
        isLoading: false 
      });
    }
  },

  addGameToHistory: async (gameHistory: GameHistory) => {
    const { profile } = get();
    if (!profile) return;

    try {
      set({ isLoading: true, error: null });
      await userService.addGameToHistory(profile.uid, gameHistory);
      
      const updatedProfile = await userService.getUserProfile(profile.uid);
      set({ profile: updatedProfile, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add game to history',
        isLoading: false 
      });
    }
  },

  updateCurrentGame: async (gameData: UserProfile['currentGame']) => {
    const { profile } = get();
    if (!profile) return;

    try {
      set({ isLoading: true, error: null });
      await userService.updateCurrentGame(profile.uid, gameData);
      
      const updatedProfile = await userService.getUserProfile(profile.uid);
      set({ profile: updatedProfile, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update current game',
        isLoading: false 
      });
    }
  },

  clearCurrentGame: async () => {
    const { profile } = get();
    if (!profile) return;

    try {
      set({ isLoading: true, error: null });
      await userService.clearCurrentGame(profile.uid);
      
      const updatedProfile = await userService.getUserProfile(profile.uid);
      set({ profile: updatedProfile, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to clear current game',
        isLoading: false 
      });
    }
  },

  setProfile: (profile: UserProfile | null) => {
    set({ profile });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  reset: () => {
    set({ profile: null, isLoading: false, error: null });
  }
})); 