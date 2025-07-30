import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  limit as firestoreLimit,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/config/database/firestore';
import type {
  UserProfile,
  GameStats,
  UserPreferences,
  GameHistory,
  CreateUserData
} from '@/types/user/profile';

const USERS_COLLECTION = 'users';

const createDefaultStats = (): GameStats => ({
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  totalShots: 0,
  totalHits: 0,
  accuracy: 0,
  currentStreak: 0,
  longestStreak: 0
});

const createDefaultPreferences = (): UserPreferences => ({
  soundEnabled: true,
  musicEnabled: true,
  difficulty: 'medium',
  theme: 'dark',
  language: 'en'
});

export const userService = {
  async createUser(userData: CreateUserData): Promise<void> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userData.uid);
      
      const newUser: Omit<UserProfile, 'createdAt' | 'lastLoginAt'> = {
        uid: userData.uid,
        displayName: userData.displayName,
        email: userData.email,
        photoURL: userData.photoURL,
        isAnonymous: userData.isAnonymous,
        stats: createDefaultStats(),
        preferences: createDefaultPreferences(),
        gameHistory: [],
        achievements: []
      };

      const userDataToSave = {
        ...newUser,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp()
      };

      const filteredData = Object.fromEntries(
        Object.entries(userDataToSave).filter(([, value]) => value !== undefined)
      );

      await setDoc(userRef, filteredData);
      
  
    } catch (error) {
      console.warn('Firestore createUser failed, using localStorage fallback:', error);
      const defaultProfile: UserProfile = {
        uid: userData.uid,
        displayName: userData.displayName,
        email: userData.email || undefined,
        photoURL: userData.photoURL || undefined,
        isAnonymous: userData.isAnonymous,
        stats: createDefaultStats(),
        preferences: createDefaultPreferences(),
        gameHistory: [],
        achievements: [],
        createdAt: new Date(),
        lastLoginAt: new Date()
      };
      
      localStorage.setItem(`user_profile_${userData.uid}`, JSON.stringify(defaultProfile));
  
    }
  },

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, USERS_COLLECTION, uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        return null;
      }

      const data = userSnap.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
        gameHistory: data.gameHistory?.map((game: Record<string, unknown>) => ({
          ...game,
          timestamp: (game.timestamp as { toDate: () => Date })?.toDate() || new Date()
        })) || []
      } as UserProfile;
    } catch (error) {
      console.warn('Firestore getUserProfile failed, checking localStorage:', error);
      const storedProfile = localStorage.getItem(`user_profile_${uid}`);
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        return {
          ...profile,
          createdAt: new Date(profile.createdAt),
          lastLoginAt: new Date(profile.lastLoginAt)
        };
      }
      return null;
    }
  },

  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const userRef = doc(db, USERS_COLLECTION, uid);
      await updateDoc(userRef, {
        ...updates,
        lastLoginAt: serverTimestamp()
      });
    } catch (error) {
      console.warn('Firestore updateUserProfile failed, updating localStorage:', error);
      const storedProfile = localStorage.getItem(`user_profile_${uid}`);
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        const updatedProfile = { ...profile, ...updates, lastLoginAt: new Date() };
        localStorage.setItem(`user_profile_${uid}`, JSON.stringify(updatedProfile));
      }
    }
  },

  async updateUserStats(uid: string, stats: Partial<GameStats>): Promise<void> {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, {
      [`stats.${Object.keys(stats)[0]}`]: Object.values(stats)[0]
    });
  },

  async addGameToHistory(uid: string, gameHistory: GameHistory): Promise<void> {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new Error('User not found');
    }

    const currentHistory = userSnap.data().gameHistory || [];
    const updatedHistory = [gameHistory, ...currentHistory].slice(0, 50);

    await updateDoc(userRef, {
      gameHistory: updatedHistory
    });
  },

  async updateUserPreferences(uid: string, preferences: Partial<UserPreferences>): Promise<void> {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, {
      preferences: preferences
    });
  },

  async getTopPlayers(limitCount: number = 10): Promise<UserProfile[]> {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, orderBy('stats.gamesWon', 'desc'), firestoreLimit(limitCount));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
        gameHistory: data.gameHistory?.map((game: Record<string, unknown>) => ({
          ...game,
          timestamp: (game.timestamp as { toDate: () => Date })?.toDate() || new Date()
        })) || []
      } as UserProfile;
    });
  },

  async updateCurrentGame(uid: string, gameData: UserProfile['currentGame']): Promise<void> {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, {
      currentGame: gameData
    });
  },

  async clearCurrentGame(uid: string): Promise<void> {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, {
      currentGame: null
    });
  }
}; 