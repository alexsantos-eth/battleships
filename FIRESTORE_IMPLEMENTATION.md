# Firestore Implementation for Armada.io

## Overview

This document describes the complete Firestore implementation for managing user data in Armada.io, including user profiles, game statistics, preferences, and game history.

## Architecture

### 1. Data Structure

#### User Profile (`users/{userId}`)
```typescript
interface UserProfile {
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
```

#### Game Statistics
```typescript
interface GameStats {
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
```

#### User Preferences
```typescript
interface UserPreferences {
  soundEnabled: boolean;
  musicEnabled: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  theme: 'light' | 'dark' | 'auto';
  language: string;
}
```

#### Game History
```typescript
interface GameHistory {
  gameId: string;
  timestamp: Date;
  result: 'win' | 'loss';
  duration: number;
  shots: number;
  hits: number;
  accuracy: number;
  opponentType: 'ai' | 'player';
}
```

### 2. Services

#### UserService (`src/services/userService.ts`)
- `createUser()` - Creates new user profile with default values
- `getUserProfile()` - Retrieves user profile from Firestore
- `updateUserProfile()` - Updates user profile information
- `updateUserStats()` - Updates game statistics
- `updateUserPreferences()` - Updates user preferences
- `addGameToHistory()` - Adds game result to history
- `getTopPlayers()` - Retrieves leaderboard data
- `updateCurrentGame()` - Saves current game state
- `clearCurrentGame()` - Clears current game data

### 3. State Management

#### UserProfileStore (`src/stores/userProfileStore.ts`)
Zustand store for managing user profile state:
- Profile data
- Loading states
- Error handling
- Async operations with Firestore

#### AuthStore (`src/stores/authStore.ts`)
Zustand store for authentication:
- User authentication state
- Anonymous sign-in/sign-out
- Real-time auth state changes

### 4. Hooks

#### useUserProfile (`src/hooks/useUserProfile.ts`)
Custom hook providing easy access to user profile functionality.

#### useGameStats (`src/hooks/useGameStats.ts`)
Hook for integrating game statistics with user profiles:
- Automatic stats calculation
- Game history tracking
- Real-time updates

### 5. Components

#### UserProfilePanel (`src/components/UserProfilePanel/index.tsx`)
Comprehensive user profile interface:
- User information display
- Statistics overview
- Game history
- Sign out functionality

#### UserStats (`src/components/UserStats/index.tsx`)
Statistics display component:
- Games played/won/lost
- Win rate and accuracy
- Current streak
- Best time

#### GameHistory (`src/components/GameHistory/index.tsx`)
Game history display component:
- Recent games list
- Game results and details
- Performance metrics

### 6. Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Features

### ✅ Implemented
- **Anonymous Authentication** - Seamless user registration
- **User Profile Management** - Complete profile system
- **Game Statistics Tracking** - Comprehensive stats
- **Game History** - Detailed game records
- **User Preferences** - Customizable settings
- **Real-time Updates** - Live data synchronization
- **Security** - User-specific data access
- **TypeScript Support** - Full type safety
- **Testing Coverage** - Comprehensive test suite

### 🔄 Automatic Integration
- **Profile Creation** - Auto-creates profile on first login
- **Stats Updates** - Automatic stats calculation on game end
- **History Tracking** - Automatic game history recording
- **Session Persistence** - Maintains user state across sessions

### 📊 Data Analytics Ready
- **Leaderboards** - Top players functionality
- **Performance Metrics** - Detailed game analytics
- **User Behavior** - Gameplay pattern tracking
- **Achievement System** - Framework for achievements

## Usage Examples

### Creating a User Profile
```typescript
const { createProfile } = useUserProfile();
await createProfile(user.uid, 'Player_123', true);
```

### Updating Game Statistics
```typescript
const { updateStats } = useUserProfile();
await updateStats({ gamesWon: 5, accuracy: 75.5 });
```

### Adding Game to History
```typescript
const { addGameToHistory } = useUserProfile();
await addGameToHistory({
  gameId: 'game_123',
  timestamp: new Date(),
  result: 'win',
  duration: 300,
  shots: 20,
  hits: 15,
  accuracy: 75,
  opponentType: 'ai'
});
```

### Updating Preferences
```typescript
const { updatePreferences } = useUserProfile();
await updatePreferences({ theme: 'dark', soundEnabled: false });
```

## Setup Instructions

1. **Firebase Project Setup**
   - Create Firebase project
   - Enable Authentication (Anonymous)
   - Enable Firestore Database
   - Configure security rules

2. **Environment Variables**
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
   ```

3. **Component Integration**
   ```typescript
   import { AuthProvider } from '@/components/AuthProvider';
   import { UserProfilePanel } from '@/components/UserProfilePanel';
   
   // Wrap your app with AuthProvider
   <AuthProvider>
     <UserProfilePanel />
     {/* Your app content */}
   </AuthProvider>
   ```

## Testing

The implementation includes comprehensive tests:
- **Service Tests** - Firestore operations
- **Store Tests** - State management
- **Hook Tests** - Custom hooks
- **Component Tests** - UI components

Run tests with:
```bash
npm test -- --testPathPatterns="user|auth"
```

## Performance Considerations

- **Lazy Loading** - Profile data loaded on demand
- **Caching** - Zustand store caches user data
- **Optimistic Updates** - UI updates immediately
- **Batch Operations** - Efficient Firestore queries
- **Error Handling** - Graceful failure recovery

## Future Enhancements

- **Real-time Leaderboards** - Live competitive features
- **Achievement System** - Gamification elements
- **Social Features** - Friend system and multiplayer
- **Advanced Analytics** - Detailed performance insights
- **Cloud Functions** - Server-side processing
- **Offline Support** - Local data synchronization 