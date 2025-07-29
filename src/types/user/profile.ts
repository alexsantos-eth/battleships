export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  totalShots: number;
  totalHits: number;
  accuracy: number;
  bestTime?: number;
  currentStreak: number;
  longestStreak: number;
}

export interface GameHistory {
  gameId: string;
  timestamp: Date;
  result: 'win' | 'loss';
  duration: number;
  shots: number;
  hits: number;
  accuracy: number;
  opponentType: 'ai' | 'player';
}

export interface UserPreferences {
  soundEnabled: boolean;
  musicEnabled: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  theme: 'light' | 'dark' | 'auto';
  language: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email?: string;
  photoURL?: string;
  createdAt: Date;
  lastLoginAt: Date;
  isAnonymous: boolean;
  stats: GameStats;
  preferences: UserPreferences;
  gameHistory: GameHistory[];
  achievements: string[];
  currentGame?: {
    gameId: string;
    startedAt: Date;
    boardState: Record<string, unknown>;
  };
}

export interface CreateUserData {
  uid: string;
  displayName: string;
  email?: string;
  photoURL?: string;
  isAnonymous: boolean;
} 