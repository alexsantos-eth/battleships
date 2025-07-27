import { create } from 'zustand';
import { 
  signInAnonymously, 
  signOut, 
  onAuthStateChanged, 
  type User 
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import { userService } from '@/services/userService';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  signInAnonymously: async () => {
    try {
      set({ isLoading: true });
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;
      
      // Create user profile in Firestore
      try {
        const displayName = `Player_${user.uid.slice(0, 6)}`;
        await userService.createUser({
          uid: user.uid,
          displayName,
          isAnonymous: true
        });
        console.log('User profile created successfully:', displayName);
      } catch (profileError) {
        console.warn('Failed to create user profile:', profileError);
        // Continue even if profile creation fails
      }
    } catch (error) {
      console.error('Error signing in anonymously:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true });
      await signOut(auth);
      // Reset state after successful sign out
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error signing out:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  setUser: (user: User | null) => {
    set({ 
      user, 
      isAuthenticated: !!user,
      isLoading: false 
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  reset: () => {
    set({ 
      user: null, 
      isAuthenticated: false, 
      isLoading: false 
    });
  }
}));

onAuthStateChanged(auth, (user) => {
  useAuthStore.getState().setUser(user);
}); 