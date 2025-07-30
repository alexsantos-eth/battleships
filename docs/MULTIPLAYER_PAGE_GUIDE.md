# Multiplayer Page Guide

## Overview

The multiplayer page (`/multiplayer`) allows users to create and join game rooms for multiplayer battleship games. This page integrates with the existing RoomService to manage room creation, joining, and navigation to the game.

## Features

### Room Creation
- Users can create new game rooms with a single click
- Each room gets a unique 5-character code (e.g., "ABC12")
- The creator becomes the "host" player
- Rooms are created in "waiting" status

### Room Joining
- Users can join existing rooms by entering the room code
- Room codes are case-insensitive and auto-converted to uppercase
- The joiner becomes the "guest" player
- Validation ensures rooms exist and are available

### Shot Counter
- Real-time shot count tracking during multiplayer games
- Displays current shot count with visual indicator (🎯)
- Updates automatically when shots are fired
- Visible in both waiting lobby and active game
- Resets to 0 when new game starts

### Authentication
- Users must be authenticated to access multiplayer features
- Unauthenticated users are redirected to the home page
- User profile data is automatically loaded

### Navigation
- Successful room creation/joining redirects to the match page
- Users can return to the home page from the multiplayer page
- Navigation is integrated into the main app navigation

## Technical Implementation

### Components
- **MultiplayerPage**: Main component handling room creation and joining
- **Navigation**: Updated to include multiplayer link
- **ShotCounter**: Displays current shot count in multiplayer games

### Services Used
- **RoomService**: Handles all room-related operations
- **AuthStore**: Manages user authentication state
- **UserProfileStore**: Manages user profile data
- **GameStore**: Manages game state including shot count

### Key Functions

#### Room Creation
```typescript
const room = await roomService.createRoom({
  uid: user.uid,
  displayName: profile.displayName,
  role: "host" as PlayerRole,
});
```

#### Room Joining
```typescript
const room = await roomService.joinRoom(roomCode, {
  uid: user.uid,
  displayName: profile.displayName,
  role: "guest" as PlayerRole,
});
```

#### Shot Count Management
```typescript
// Shot count is automatically incremented when shots are fired
addPlayerShot: (shot: Shot) => {
  set((state) => ({
    playerShots: [...state.playerShots, shot],
    shotCount: state.shotCount + 1,
  }));
  get().checkGameOver();
},

addEnemyShot: (shot: Shot) => {
  set((state) => ({
    enemyShots: [...state.enemyShots, shot],
    shotCount: state.shotCount + 1,
  }));
  get().checkGameOver();
},
```

### Error Handling
- Room not found
- Room is full
- Room is no longer available
- Authentication errors
- Network errors

### UI Features
- Loading states for create/join operations
- Error messages with user-friendly text
- Success messages with room codes
- Shot counter display with visual indicator
- Responsive design with mobile support
- Consistent styling with the app theme

## User Flow

1. **Access**: User clicks "Multiplayer" in navigation
2. **Authentication**: System checks if user is logged in
3. **Profile Loading**: User profile is loaded if not already cached
4. **Room Options**: User can create or join a room
5. **Room Creation**: 
   - Click "Crear Sala" button
   - System generates unique room code
   - User is redirected to match page
6. **Room Joining**:
   - Enter room code in input field
   - Click "Unirse a Sala" button
   - System validates room exists and is available
   - User is redirected to match page
7. **Game Play**:
   - Shot counter displays current shot count
   - Counter updates in real-time as shots are fired
   - Counter resets when new game starts

## Integration Points

### With Match Page
- Room ID is passed via URL parameter (`/match/:roomId`)
- Match page can use RoomService to subscribe to room updates
- Real-time updates for player readiness and game state
- Shot counter integrated into game interface

### With Navigation
- Multiplayer link added to main navigation
- Active state highlighting for current page
- Mobile-responsive navigation menu

### With Authentication
- Automatic redirect for unauthenticated users
- User profile data required for room operations
- Secure room access with user validation

### With Game Store
- Shot count automatically tracked in game state
- Counter updates when shots are fired
- Counter resets when game is reset or initialized

## Future Enhancements

### Planned Features
- Room listing with available rooms
- Room search and filtering
- Room settings (game configuration)
- Player statistics display
- Chat functionality in lobby
- Shot accuracy tracking
- Shot history display

### Technical Improvements
- Room cleanup for abandoned rooms
- Better error handling and recovery
- Performance optimizations for large user bases
- Offline support and reconnection handling
- Shot analytics and statistics

## Testing

### Manual Testing Checklist
- [ ] Create room as authenticated user
- [ ] Join room with valid code
- [ ] Handle invalid room codes
- [ ] Handle full rooms
- [ ] Handle unauthenticated access
- [ ] Test mobile responsiveness
- [ ] Test error message display
- [ ] Test loading states
- [ ] Test navigation flow
- [ ] Test shot counter functionality
- [ ] Test shot counter reset on new game
- [ ] Test shot counter in waiting lobby

### Automated Testing
- Unit tests for RoomService methods
- Integration tests for room creation/joining
- Component tests for MultiplayerPage
- Component tests for ShotCounter
- E2E tests for complete user flows

## Security Considerations

- Room codes are generated server-side
- User authentication required for all operations
- Room access validated on each operation
- User data sanitized before storage
- Rate limiting for room creation/joining

## Performance Considerations

- Room service uses singleton pattern
- User profile cached in store
- Lazy loading of room data
- Efficient database queries
- Real-time updates via Firebase subscriptions
- Shot counter updates optimized for performance 