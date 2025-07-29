import { userService } from '../user/data';
import type { UserProfile, GameStats, GameHistory } from '@/types/user/profile';

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  getDocs: jest.fn(),
  serverTimestamp: jest.fn(() => ({ toDate: () => new Date() }))
}));

jest.mock('@/config/firestore', () => ({
  db: {}
}));

describe('userService', () => {
  const mockUserData = {
    uid: 'test-uid',
    displayName: 'Test Player',
    isAnonymous: true
  };

  const mockUserProfile: UserProfile = {
    uid: 'test-uid',
    displayName: 'Test Player',
    isAnonymous: true,
    createdAt: new Date(),
    lastLoginAt: new Date(),
    stats: {
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      totalShots: 0,
      totalHits: 0,
      accuracy: 0,
      currentStreak: 0,
      longestStreak: 0
    },
    preferences: {
      soundEnabled: true,
      musicEnabled: true,
      difficulty: 'medium',
      theme: 'dark',
      language: 'en'
    },
    gameHistory: [],
    achievements: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user profile', async () => {
      const { setDoc } = await import('firebase/firestore');
      (setDoc as jest.Mock).mockResolvedValue(undefined);

      await userService.createUser(mockUserData);

      expect(setDoc).toHaveBeenCalled();
      const setDocCall = (setDoc as jest.Mock).mock.calls[0];
      const actualData = setDocCall[1];
      
      expect(actualData.uid).toBe(mockUserData.uid);
      expect(actualData.displayName).toBe(mockUserData.displayName);
      expect(actualData.isAnonymous).toBe(mockUserData.isAnonymous);
      expect(actualData.stats).toBeDefined();
      expect(actualData.preferences).toBeDefined();
      expect(actualData.gameHistory).toBeDefined();
      expect(actualData.achievements).toBeDefined();
      expect(actualData.createdAt).toBeDefined();
      expect(actualData.lastLoginAt).toBeDefined();
    });
  });

  describe('getUserProfile', () => {
    it('should return user profile when exists', async () => {
      const { getDoc, doc } = await import('firebase/firestore');
      const mockDocSnap = {
        exists: () => true,
        data: () => ({
          ...mockUserProfile,
          createdAt: { toDate: () => new Date() },
          lastLoginAt: { toDate: () => new Date() }
        })
      };
      (getDoc as jest.Mock).mockResolvedValue(mockDocSnap);
      (doc as jest.Mock).mockReturnValue({});

      const result = await userService.getUserProfile('test-uid');

      expect(result).toEqual(expect.objectContaining({
        uid: mockUserData.uid,
        displayName: mockUserData.displayName
      }));
    });

    it('should return null when user does not exist', async () => {
      const { getDoc } = await import('firebase/firestore');
      const mockDocSnap = {
        exists: () => false
      };
      (getDoc as jest.Mock).mockResolvedValue(mockDocSnap);

      const result = await userService.getUserProfile('test-uid');

      expect(result).toBeNull();
    });
  });

  describe('updateUserStats', () => {
    it('should update user statistics', async () => {
      const { updateDoc } = await import('firebase/firestore');
      (updateDoc as jest.Mock).mockResolvedValue(undefined);

      const statsUpdate: Partial<GameStats> = { gamesWon: 5 };

      await userService.updateUserStats('test-uid', statsUpdate);

      expect(updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          'stats.gamesWon': 5
        })
      );
    });
  });

  describe('addGameToHistory', () => {
    it('should add game to history', async () => {
      const { getDoc, updateDoc } = await import('firebase/firestore');
      const mockDocSnap = {
        exists: () => true,
        data: () => ({ gameHistory: [] })
      };
      (getDoc as jest.Mock).mockResolvedValue(mockDocSnap);
      (updateDoc as jest.Mock).mockResolvedValue(undefined);

      const gameHistory: GameHistory = {
        gameId: 'game-1',
        timestamp: new Date(),
        result: 'win',
        duration: 300,
        shots: 20,
        hits: 15,
        accuracy: 75,
        opponentType: 'ai'
      };

      await userService.addGameToHistory('test-uid', gameHistory);

      expect(updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          gameHistory: [gameHistory]
        })
      );
    });
  });
}); 