# Core Game Engine Documentation

Complete guide for implementing a naval battle game using the `./core` package.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Getting Started](#getting-started)
4. [API Reference](#api-reference)
5. [Usage Examples](#usage-examples)
6. [Integration Guide](#integration-guide)
7. [Advanced Topics](#advanced-topics)

---

## Overview

The Core Game Engine is a pure TypeScript library that implements complete naval battle game logic without any dependencies on UI frameworks, rendering engines, or React hooks.

### Key Features

- **Headless Capable**: Perfect for simulations, testing, and servers
- **Strongly Typed**: Full TypeScript support with comprehensive type definitions
- **Observable**: Optional callbacks for state changes and events
- **Testable**: Easy to test with deterministic behavior

### What's Included

```
core/
├── engine/
│   ├── index.ts        # Main exports
│   ├── logic.ts        # Game engine class
│   ├── match.ts        # Match rules manager
│   ├── automata.ts     # AI players
│   └── examples.ts     # Usage examples
├── manager/
│   ├── index.ts        # Manager exports
│   ├── initializer.ts  # Game initialization helper
│   └── quick-start.ts  # Quick start examples
├── tools/
│   └── ship/
│       └── calculations.ts  # Ship generation utilities
├── types/
│   ├── common.ts       # Common type definitions
│   └── config.ts       # Configuration types
└── constants/
    └── game.ts         # Game constants
```

---

## Architecture

### Core Components

#### 1. GameEngine (logic.ts)

The main game engine class that manages all game state and logic.

**Responsibilities:**
- Track game state (ships, shots, turns)
- Execute shots and validate moves
- Determine game outcomes
- Notify observers of changes

**Key Characteristics:**
- Stateful but deterministic
- No side effects (except callbacks)
- Thread-safe (no async operations)

#### 2. Match (match.ts)

Wrapper around GameEngine that enforces match rules automatically.

**Res5onsibilities:**
- Automatic turn management based on shot results
- Rule enforcement (hit = shoot again, miss/destroy = turn ends)
- Simplified API for game flow

**Rules Applied:**
- Hit (ship not destroyed): Player shoots again
- Hit (ship destroyed): Turn ends
- Miss: Turn ends
- Winner: First to destroy all enemy ships

#### 3. GameInitializer (manager/initializer.ts)

Helper to generate initial game values from simple configuration.

**Responsibilities:**
- Validate configuration
- Provide sensible defaults
- Generate ship placements
- Determine initial turn

**Benefits:**
- Simplified setup
- Automatic validation
- Consistent configuration

#### 4. AI Players (automata.ts)

Automated players that can make decisions without human input.

**Available AI Types:**
- `AIPlayer`: Random shot strategy
- `SmartAIPlayer`: Intelligent hunting strategy

#### 3. Ship Utilities (tools/ship/calculations.ts)

Helper functions for ship placement and validation.

**Functions:**
- `generateShips()`: Create random ship placements
- `isValidShipPlacement()`: Validate ship positions
- `getShipCells()`: Calculate ship cell coordinates

---

## Getting Started

### Installation

```typescript
// Import the core engine
import { GameEngine, Match, GameInitializer, AIPlayer } from './core/engine';
import { generateShips } from './core/tools/ship/calculations';
import type { GameConfig, GameShip, Shot } from './core';
```

### Quick Start (Recommended)

The easiest way to start a game is using `GameInitializer` with `Match`:

```typescript
import { GameInitializer, Match } from './core/engine';

// 1. Create initializer with your config
const initializer = new GameInitializer({
  boardWidth: 10,
  boardHeight: 10,
  shipCounts: { small: 1, medium: 2, large: 1, xlarge: 1 }
});

// 2. Generate complete setup
const setup = initializer.initializeGame();

// 3. Create and start match
const match = new Match(setup.config);
match.initializeMatch(setup.playerShips, setup.enemyShips, setup.initialTurn);

// 4. Play!
const result = match.executeShot(5, 5, true);
console.log(result.hit ? 'HIT!' : 'MISS!');
console.log(result.reason); // "Hit - shoot again" or "Miss - turn ends"
```

### Basic Setup

```typescript
// 1. Create engine instance
const engine = new GameEngine({
  boardWidth: 10,
  boardHeight: 10
});

// 2. Generate ships for both players
const playerShips = generateShips({ 
  boardWidth: 10, 
  boardHeight: 10,
  shipCounts: {
    small: 1,
    medium: 2,
    large: 1,
    xlarge: 1
  }
});

const enemyShips = generateShips({ 
  boardWidth: 10, 
  boardHeight: 10,
  shipCounts: {
    small: 1,
    medium: 2,
    large: 1,
    xlarge: 1
  }
});

// 3. Initialize the game
engine.initializeGame(playerShips, enemyShips, 'PLAYER_TURN');

// 4. Game is ready to play!
console.log('Game started!');
```

### Minimal Example

```typescript
import { GameEngine } from './core/engine';
import { generateShips } from './core/tools/ship/calculations';

// Setup
const engine = new GameEngine({ boardWidth: 10, boardHeight: 10 });
const playerShips = generateShips({ boardWidth: 10, boardHeight: 10 });
const enemyShips = generateShips({ boardWidth: 10, boardHeight: 10 });
engine.initializeGame(playerShips, enemyShips, 'PLAYER_TURN');

// Execute a shot
const result = engine.executeShot(5, 5, true);
console.log(result.hit ? 'HIT!' : 'MISS!');

// Check game state
const state = engine.getState();
console.log(`Game Over: ${state.isGameOver}`);
console.log(`Winner: ${state.winner}`);
```

---

## API Reference

### GameEngine Class

#### Constructor

```typescript
constructor(
  config?: Partial<GameConfig>,
  callbacks?: GameEngineCallbacks
)
```

**Parameters:**
- `config` (optional): Board dimensions and ship counts
  - `boardWidth`: Number (default: 10)
  - `boardHeight`: Number (default: 10)
  - `shipCounts`: Object with counts for each ship size
- `callbacks` (optional): Event callbacks
  - `onStateChange`: Called when state changes
  - `onTurnChange`: Called when turn changes
  - `onShot`: Called when a shot is fired
  - `onGameOver`: Called when game ends

**Example:**
```typescript
const engine = new GameEngine(
  { boardWidth: 10, boardHeight: 10 },
  {
    onShot: (shot, isPlayerShot) => {
      console.log(`Shot at (${shot.x}, ${shot.y}): ${shot.hit ? 'HIT' : 'MISS'}`);
    },
    onGameOver: (winner) => {
      console.log(`Game Over! Winner: ${winner}`);
    }
  }
);
```

#### Game Initialization

##### `initializeGame()`

```typescript
initializeGame(
  playerShips: GameShip[], 
  enemyShips: GameShip[], 
  initialTurn?: GameTurn
): void
```

Initialize a new game with ships and starting turn.

**Parameters:**
- `playerShips`: Array of player's ship placements
- `enemyShips`: Array of enemy's ship placements
- `initialTurn`: 'PLAYER_TURN' or 'ENEMY_TURN' (default: 'PLAYER_TURN')

**Example:**
```typescript
const playerShips = generateShips({ boardWidth: 10, boardHeight: 10 });
const enemyShips = generateShips({ boardWidth: 10, boardHeight: 10 });
engine.initializeGame(playerShips, enemyShips, 'PLAYER_TURN');
```

##### `resetGame()`

```typescript
resetGame(): void
```

Reset the game to initial empty state.

**Example:**
```typescript
engine.resetGame();
// Game is now reset, need to call initializeGame() again
```

#### Turn Management

##### `getCurrentTurn()`

```typescript
getCurrentTurn(): GameTurn
```

Returns the current turn ('PLAYER_TURN' or 'ENEMY_TURN').

##### `isPlayerTurn()`

```typescript
isPlayerTurn(): boolean
```

Returns true if it's the player's turn.

##### `isEnemyTurn()`

```typescript
isEnemyTurn(): boolean
```

Returns true if it's the enemy's turn.

##### `toggleTurn()`

```typescript
toggleTurn(): void
```

Switch turn between player and enemy.

**Example:**
```typescript
if (engine.isPlayerTurn()) {
  // Player shoots
  const result = engine.executeShot(x, y, true);
  
  if (!result.shipDestroyed) {
    engine.toggleTurn(); // Switch to enemy turn
  }
}
```

##### `setPlayerTurn()` / `setEnemyTurn()`

```typescript
setPlayerTurn(): void
setEnemyTurn(): void
```

Explicitly set the current turn.

#### Shot Execution

##### `executeShot()`

```typescript
executeShot(x: number, y: number, isPlayerShot: boolean): ShotResult
```

Execute a shot at the specified coordinates.

**Parameters:**
- `x`: X coordinate (0 to boardWidth - 1)
- `y`: Y coordinate (0 to boardHeight - 1)
- `isPlayerShot`: true for player shot, false for enemy shot

**Returns:** `ShotResult` object:
```typescript
{
  success: boolean;        // True if shot was executed
  error?: string;          // Error message if failed
  hit: boolean;            // True if shot hit a ship
  shipId: number;          // ID of hit ship (-1 if miss)
  shipDestroyed?: boolean; // True if ship was destroyed
  isGameOver?: boolean;    // True if game ended
  winner?: Winner;         // Winner if game ended
}
```

**Example:**
```typescript
const result = engine.executeShot(5, 5, true);

if (result.success) {
  if (result.hit) {
    console.log('HIT!');
    if (result.shipDestroyed) {
      console.log(`Ship ${result.shipId} destroyed!`);
    }
  } else {
    console.log('MISS!');
  }
  
  if (result.isGameOver) {
    console.log(`Game Over! Winner: ${result.winner}`);
  }
}
```

##### `checkShot()`

```typescript
checkShot(x: number, y: number, isPlayerShot: boolean): { hit: boolean; shipId: number }
```

Check if a shot would hit without actually executing it.

**Example:**
```typescript
const check = engine.checkShot(5, 5, true);
if (check.hit) {
  console.log(`Would hit ship ${check.shipId}`);
}
```

##### `isCellShot()`

```typescript
isCellShot(x: number, y: number, isPlayerShot: boolean): boolean
```

Check if a cell has already been shot at.

**Example:**
```typescript
if (!engine.isCellShot(5, 5, true)) {
  engine.executeShot(5, 5, true);
}
```

#### State Queries

##### `getState()`

```typescript
getState(): GameEngineState
```

Get complete current game state.

**Returns:** `GameEngineState` object:
```typescript
{
  currentTurn: GameTurn;
  isPlayerTurn: boolean;
  isEnemyTurn: boolean;
  playerShips: GameShip[];
  enemyShips: GameShip[];
  playerShots: Shot[];
  enemyShots: Shot[];
  isGameOver: boolean;
  winner: Winner;
  boardWidth: number;
  boardHeight: number;
  shotCount: number;
}
```

**Example:**
```typescript
const state = engine.getState();
console.log(`Turn: ${state.currentTurn}`);
console.log(`Shots: ${state.shotCount}`);
console.log(`Game Over: ${state.isGameOver}`);
```

##### Specific State Getters

```typescript
getPlayerShips(): GameShip[]
getEnemyShips(): GameShip[]
getPlayerShots(): Shot[]
getEnemyShots(): Shot[]
getShotCount(): number
getWinner(): Winner
getBoardDimensions(): { width: number; height: number }
```

##### `isValidPosition()`

```typescript
isValidPosition(x: number, y: number): boolean
```

Check if a position is within board boundaries.

**Example:**
```typescript
if (engine.isValidPosition(x, y)) {
  engine.executeShot(x, y, true);
}
```

##### `isShipDestroyed()`

```typescript
isShipDestroyed(shipId: number, isPlayerShot: boolean): boolean
```

Check if a specific ship is completely destroyed.

**Parameters:**
- `shipId`: ID of ship to check
- `isPlayerShot`: true to check enemy ships, false for player ships

---

### Match Class

The `Match` class wraps the `GameEngine` and automatically enforces game rules for turn management.

#### Match Rules

1. **Hit (ship not destroyed)**: Player can shoot again
2. **Hit (ship destroyed)**: Turn ends automatically
3. **Miss**: Turn ends automatically
4. **Winner**: First player to destroy all enemy ships

This eliminates the need to manually manage turn logic - the Match class handles it for you.

#### Constructor

```typescript
constructor(config?: Partial<GameConfig>, callbacks?: MatchCallbacks)
```

**Parameters:**
- `config` (optional): Board dimensions and ship counts
- `callbacks` (optional): Match event callbacks
  - `onStateChange`: Called when state changes
  - `onTurnChange`: Called when turn changes
  - `onShot`: Called when a shot is fired
  - `onGameOver`: Called when game ends
  - `onMatchStart`: Called when match starts

**Example:**
```typescript
const match = new Match(
  { boardWidth: 10, boardHeight: 10 },
  {
    onShot: (shot, isPlayerShot) => {
      console.log(`Shot: ${shot.hit ? 'HIT' : 'MISS'}`);
    },
    onTurnChange: (turn) => {
      console.log(`Turn: ${turn}`);
    },
    onGameOver: (winner) => {
      console.log(`Winner: ${winner}`);
    }
  }
);
```

#### Match Initialization

##### `initializeMatch()`

```typescript
initializeMatch(
  playerShips: GameShip[], 
  enemyShips: GameShip[], 
  initialTurn?: GameTurn
): void
```

Initialize a new match with ships.

**Example:**
```typescript
const playerShips = generateShips({ boardWidth: 10, boardHeight: 10 });
const enemyShips = generateShips({ boardWidth: 10, boardHeight: 10 });
match.initializeMatch(playerShips, enemyShips, 'PLAYER_TURN');
```

##### `resetMatch()`

```typescript
resetMatch(): void
```

Reset the match to initial state.

#### Shot Execution with Automatic Rules

##### `executeShot()`

```typescript
executeShot(x: number, y: number, isPlayerShot: boolean): MatchShotResult
```

Execute a shot with automatic turn management based on match rules.

**Returns:** `MatchShotResult` with turn information:
```typescript
{
  success: boolean;        // Shot was executed
  hit: boolean;            // Shot hit a ship
  shipId: number;          // ID of hit ship
  shipDestroyed?: boolean; // Ship was destroyed
  isGameOver?: boolean;    // Game ended
  winner?: Winner;         // Winner if game over
  turnEnded: boolean;      // Turn ended with this shot
  canShootAgain: boolean;  // Can shoot again this turn
  reason: string;          // Explanation
}
```

**Example:**
```typescript
// Player shoots
const result = match.executeShot(5, 5, true);

if (result.hit) {
  if (result.canShootAgain) {
    console.log('Hit! Shoot again');
    // Can shoot again immediately
  } else {
    console.log('Ship destroyed! Turn ends');
    // Turn automatically switched
  }
} else {
  console.log('Miss! Turn ends');
  // Turn automatically switched
}
```

**Complete Turn Example:**
```typescript
// Keep shooting until turn ends
while (match.isPlayerTurn() && !match.isMatchOver()) {
  const [x, y] = getPlayerInput();
  const result = match.executeShot(x, y, true);
  
  console.log(result.reason); // "Hit - shoot again" or "Miss - turn ends"
  
  if (!result.canShootAgain) {
    break; // Turn ended
  }
}
```

#### State Queries

##### `isPlayerTurn()` / `isEnemyTurn()`

```typescript
isPlayerTurn(): boolean
isEnemyTurn(): boolean
```

Check whose turn it is.

##### `getCurrentTurn()`

```typescript
getCurrentTurn(): GameTurn
```

Get current turn.

##### `getState()`

```typescript
getState(): GameEngineState
```

Get complete match state.

##### `isMatchOver()`

```typescript
isMatchOver(): boolean
```

Check if match has ended.

##### `getWinner()`

```typescript
getWinner(): Winner
```

Get winner (if match is over).

#### Utility Methods

##### `isCellShot()`

```typescript
isCellShot(x: number, y: number, isPlayerShot: boolean): boolean
```

Check if a cell has been shot.

##### `isValidPosition()`

```typescript
isValidPosition(x: number, y: number): boolean
```

Check if position is valid.

##### `getBoardDimensions()`

```typescript
getBoardDimensions(): { width: number; height: number }
```

Get board dimensions.

##### `getEngine()`

```typescript
getEngine(): GameEngine
```

Get underlying GameEngine (for advanced usage).

---

### AIPlayer Class

Basic AI that makes random shots.

#### Constructor

```typescript
constructor(engine: GameEngine)
```

**Example:**
```typescript
const ai = new AIPlayer(engine);
```

#### Methods

##### `executeTurn()`

```typescript
executeTurn(): {
  position: [number, number] | null;
  hit: boolean;
  shipId: number;
  shipDestroyed: boolean;
} | null
```

Execute a full AI turn (generate shot and execute it).

**Example:**
```typescript
const result = ai.executeTurn();
if (result) {
  const [x, y] = result.position!;
  console.log(`AI shot at (${x}, ${y}): ${result.hit ? 'HIT' : 'MISS'}`);
}
```

##### `generateRandomShot()`

```typescript
generateRandomShot(): [number, number] | null
```

Generate random shot coordinates without executing.

**Example:**
```typescript
const pos = ai.generateRandomShot();
if (pos) {
  const [x, y] = pos;
  engine.executeShot(x, y, false);
}
```

##### `getAvailablePositions()`

```typescript
getAvailablePositions(): [number, number][]
```

Get all positions that haven't been shot yet.

##### `hasAvailablePositions()`

```typescript
hasAvailablePositions(): boolean
```

Check if there are any unshot positions remaining.

---

### SmartAIPlayer Class

Advanced AI with hunting strategy. Extends `AIPlayer`.

#### Constructor

```typescript
constructor(engine: GameEngine)
```

**Example:**
```typescript
const smartAI = new SmartAIPlayer(engine);
```

#### Methods

##### `generateSmartShot()`

```typescript
generateSmartShot(): [number, number] | null
```

Generate intelligent shot using hunting strategy.

**Strategy:**
- Normal mode: Random shots
- Hunting mode: Targets adjacent cells after a hit
- Follows ship direction when identified

**Example:**
```typescript
const pos = smartAI.generateSmartShot();
if (pos) {
  const [x, y] = pos;
  const result = engine.executeShot(x, y, true);
  smartAI.onShotResult(result.hit, pos, result.shipDestroyed || false);
}
```

##### `onShotResult()`

```typescript
onShotResult(hit: boolean, position: [number, number], shipDestroyed: boolean): void
```

Update AI state based on shot result. Must be called after each shot for smart behavior to work.

**Example:**
```typescript
const position = smartAI.generateSmartShot();
if (position) {
  const result = engine.executeShot(...position, true);
  smartAI.onShotResult(result.hit, position, result.shipDestroyed || false);
}
```

---

### GameInitializer Class

Helper class to generate initial game values from simple configuration. Handles validation, defaults, and ship generation automatically.

#### Benefits

- **Simplified Setup**: Generate everything needed to start a game
- **Validation**: Automatic config validation with helpful errors
- **Defaults**: Sensible default values for all settings
- **Flexible**: Override any part of the configuration

#### Constructor

```typescript
constructor(config?: Partial<GameConfig>)
```

**Parameters:**
- `config` (optional): Partial game configuration
  - `boardWidth`: Board width (default: 10)
  - `boardHeight`: Board height (default: 10)
  - `shipCounts`: Ship counts by size
  - `initialTurn`: Who starts ('player', 'enemy', or 'random')

**Example:**
```typescript
const initializer = new GameInitializer({
  boardWidth: 10,
  boardHeight: 10,
  shipCounts: {
    small: 1,
    medium: 2,
    large: 1,
    xlarge: 1
  },
  initialTurn: 'random'
});
```

**Validation:**
The constructor automatically validates:
- Board size within allowed range (5-15)
- Ship counts don't exceed board capacity
- Throws descriptive errors if invalid

#### Methods

##### `initializeGame()`

```typescript
initializeGame(
  startTurn?: PlayerName | 'random',
  ships?: { playerShips: GameShip[]; enemyShips: GameShip[] }
): GameSetup
```

Generate complete game setup ready to use.

**Parameters:**
- `startTurn` (optional): Override initial turn
- `ships` (optional): Provide custom ship placements

**Returns:** `GameSetup` object:
```typescript
{
  playerShips: GameShip[];  // Generated or provided ships
  enemyShips: GameShip[];   // Generated or provided ships
  initialTurn: GameTurn;    // Determined turn
  config: GameConfig;       // Complete configuration
}
```

**Examples:**
```typescript
// Simple - generates everything
const setup = initializer.initializeGame();

// Override turn
const setup = initializer.initializeGame('player');

// Provide custom ships
const customShips = {
  playerShips: generateShips(config),
  enemyShips: generateShips(config)
};
const setup = initializer.initializeGame('random', customShips);
```

##### `getDefaultConfig()`

```typescript
getDefaultConfig(): GameConfig
```

Get the complete default configuration.

**Returns:** Complete `GameConfig` with all default values:
```typescript
{
  boardWidth: 10,
  boardHeight: 10,
  shipCounts: {
    small: 1,
    medium: 2,
    large: 1,
    xlarge: 1
  },
  initialTurn: 'random'
}
```

#### Complete Example

```typescript
import { GameInitializer, Match } from './core/engine';

// Create initializer
const initializer = new GameInitializer({
  boardWidth: 12,
  boardHeight: 12,
  shipCounts: {
    small: 2,
    medium: 2,
    large: 1,
    xlarge: 1
  }
});

// Generate setup
const setup = initializer.initializeGame('player');

// Use with Match
const match = new Match(setup.config);
match.initializeMatch(
  setup.playerShips, 
  setup.enemyShips, 
  setup.initialTurn
);

// Game ready!
console.log(`Board: ${setup.config.boardWidth}x${setup.config.boardHeight}`);
console.log(`Ships: ${setup.playerShips.length}`);
console.log(`Starts: ${setup.initialTurn}`);
```

#### GameSetup Interface

```typescript
interface GameSetup {
  playerShips: GameShip[];    // Player's ship placements
  enemyShips: GameShip[];     // Enemy's ship placements
  initialTurn: GameTurn;      // Who starts
  config: Partial<GameConfig>; // Configuration used
}
```

---

### Ship Utilities

#### `generateShips()`

```typescript
generateShips(config: Partial<GameConfig>): GameShip[]
```

Generate random valid ship placements.

**Parameters:**
- `config`: Configuration with board dimensions and ship counts

**Returns:** Array of `GameShip` objects

**Example:**
```typescript
const ships = generateShips({
  boardWidth: 10,
  boardHeight: 10,
  shipCounts: {
    small: 1,   // 2 cells
    medium: 2,  // 3 cells
    large: 1,   // 4 cells
    xlarge: 1   // 5 cells
  }
});
```

#### `getShipCellsFromShip()`

```typescript
getShipCellsFromShip(ship: GameShip): [number, number][]
```

Get all cell coordinates occupied by a ship.

**Example:**
```typescript
const ship: GameShip = {
  coords: [2, 3],
  variant: 'medium',
  orientation: 'horizontal',
  shipId: 0
};
const cells = getShipCellsFromShip(ship);
// Returns: [[2,3], [3,3], [4,3]]
```

#### `isValidShipPlacement()`

```typescript
isValidShipPlacement(
  ship: GameShip,
  existingShips: GameShip[],
  boardWidth: number,
  boardHeight: number
): boolean
```

Validate if ship placement is valid.

**Checks:**
- Ship is within board boundaries
- Ship doesn't overlap with existing ships
- Ship maintains minimum distance from other ships

---

## Usage Examples

### Example 0: Basic Match with Automatic Rules (Recommended)

```typescript
import { Match } from './core/engine';
import { generateShips } from './core/tools/ship/calculations';

// Create match
const match = new Match({ boardWidth: 10, boardHeight: 10 });

// Setup ships
const playerShips = generateShips({ boardWidth: 10, boardHeight: 10 });
const enemyShips = generateShips({ boardWidth: 10, boardHeight: 10 });
match.initializeMatch(playerShips, enemyShips, 'PLAYER_TURN');

// Player's turn - can shoot multiple times on hits
while (match.isPlayerTurn() && !match.isMatchOver()) {
  const [x, y] = getUserInput(); // Get coordinates from user
  const result = match.executeShot(x, y, true);
  
  console.log(result.reason);
  // "Hit - shoot again" = continue
  // "Ship destroyed - turn ends" = turn over
  // "Miss - turn ends" = turn over
  
  if (!result.canShootAgain) {
    break; // Turn ended automatically
  }
}

// Enemy's turn (with AI)
const ai = new AIPlayer(match.getEngine());
while (match.isEnemyTurn() && !match.isMatchOver()) {
  const pos = ai.generateRandomShot();
  if (pos) {
    const result = match.executeShot(pos[0], pos[1], false);
    if (!result.canShootAgain) {
      break;
    }
  }
}

if (match.isMatchOver()) {
  console.log(`Winner: ${match.getWinner()}`);
}
```

### Example 0.5: Using GameInitializer (Easiest)

```typescript
import { GameInitializer, Match } from './core/engine';

// Create initializer with your preferences
const initializer = new GameInitializer({
  boardWidth: 10,
  boardHeight: 10,
  shipCounts: {
    small: 1,
    medium: 2,
    large: 1,
    xlarge: 1
  }
});

// Generate everything needed
const setup = initializer.initializeGame();

// Create match with generated setup
const match = new Match(setup.config);
match.initializeMatch(
  setup.playerShips,
  setup.enemyShips,
  setup.initialTurn
);

// Start playing!
console.log('Game ready!');
console.log(`Turn: ${match.getCurrentTurn()}`);
console.log(`Board: ${setup.config.boardWidth}x${setup.config.boardHeight}`);
console.log(`Ships: ${setup.playerShips.length}`);

// The rest is the same as Example 0...
```

### Example 1: Basic Game Loop (Manual Turn Management)

```typescript
import { GameEngine, AIPlayer } from './core/engine';
import { generateShips } from './core/tools/ship/calculations';

// Setup
const engine = new GameEngine({ boardWidth: 10, boardHeight: 10 });
const playerShips = generateShips({ boardWidth: 10, boardHeight: 10 });
const enemyShips = generateShips({ boardWidth: 10, boardHeight: 10 });
engine.initializeGame(playerShips, enemyShips, 'PLAYER_TURN');

const ai = new AIPlayer(engine);

// Game loop
while (!engine.getState().isGameOver) {
  if (engine.isPlayerTurn()) {
    // Player's turn (random for demo)
    const pos = ai.generateRandomShot();
    if (pos) {
      const result = engine.executeShot(pos[0], pos[1], true);
      console.log(`Player: ${result.hit ? 'HIT' : 'MISS'}`);
      if (!result.shipDestroyed) {
        engine.toggleTurn();
      }
    }
  } else {
    // AI's turn
    const result = ai.executeTurn();
    if (result) {
      console.log(`AI: ${result.hit ? 'HIT' : 'MISS'}`);
      if (!result.shipDestroyed) {
        engine.toggleTurn();
      }
    }
  }
}

const state = engine.getState();
console.log(`Winner: ${state.winner}`);
```

### Example 2: Using Callbacks

```typescript
import { GameEngine } from './core/engine';
import { generateShips } from './core/tools/ship/calculations';

let totalHits = 0;
let totalShots = 0;

const engine = new GameEngine(
  { boardWidth: 10, boardHeight: 10 },
  {
    onShot: (shot, isPlayerShot) => {
      totalShots++;
      if (shot.hit) totalHits++;
      
      const player = isPlayerShot ? 'Player' : 'Enemy';
      console.log(`${player} shot: ${shot.hit ? 'HIT' : 'MISS'}`);
    },
    onTurnChange: (turn) => {
      console.log(`Turn: ${turn}`);
    },
    onGameOver: (winner) => {
      console.log(`Game Over! Winner: ${winner}`);
      console.log(`Accuracy: ${(totalHits / totalShots * 100).toFixed(2)}%`);
    }
  }
);

// Initialize and play...
const playerShips = generateShips({ boardWidth: 10, boardHeight: 10 });
const enemyShips = generateShips({ boardWidth: 10, boardHeight: 10 });
engine.initializeGame(playerShips, enemyShips, 'PLAYER_TURN');
```

### Example 3: Smart AI vs Random AI

```typescript
import { GameEngine, AIPlayer, SmartAIPlayer } from './core/engine';
import { generateShips } from './core/tools/ship/calculations';

const engine = new GameEngine({ boardWidth: 10, boardHeight: 10 });
const playerShips = generateShips({ boardWidth: 10, boardHeight: 10 });
const enemyShips = generateShips({ boardWidth: 10, boardHeight: 10 });
engine.initializeGame(playerShips, enemyShips, 'PLAYER_TURN');

const smartAI = new SmartAIPlayer(engine);
const randomAI = new AIPlayer(engine);

while (!engine.getState().isGameOver) {
  if (engine.isPlayerTurn()) {
    // Smart AI for player
    const pos = smartAI.generateSmartShot();
    if (pos) {
      const result = engine.executeShot(pos[0], pos[1], true);
      smartAI.onShotResult(result.hit, pos, result.shipDestroyed || false);
      
      if (!result.shipDestroyed) {
        engine.toggleTurn();
      }
    }
  } else {
    // Random AI for enemy
    const result = randomAI.executeTurn();
    if (result && !result.shipDestroyed) {
      engine.toggleTurn();
    }
  }
}

const state = engine.getState();
console.log(`Winner: ${state.winner}`);
console.log(`Smart AI shots: ${state.playerShots.length}`);
console.log(`Random AI shots: ${state.enemyShots.length}`);
```

### Example 4: Batch Simulation

```typescript
import { GameEngine, AIPlayer } from './core/engine';
import { generateShips } from './core/tools/ship/calculations';

function simulateGame(): { 
  winner: string | null; 
  turns: number 
} {
  const engine = new GameEngine({ boardWidth: 10, boardHeight: 10 });
  const playerShips = generateShips({ boardWidth: 10, boardHeight: 10 });
  const enemyShips = generateShips({ boardWidth: 10, boardHeight: 10 });
  engine.initializeGame(playerShips, enemyShips, 'PLAYER_TURN');

  const playerAI = new AIPlayer(engine);
  const enemyAI = new AIPlayer(engine);

  let turns = 0;
  while (!engine.getState().isGameOver && turns < 200) {
    if (engine.isPlayerTurn()) {
      playerAI.executeTurn();
    } else {
      enemyAI.executeTurn();
    }
    engine.toggleTurn();
    turns++;
  }

  return {
    winner: engine.getWinner(),
    turns
  };
}

// Simulate 1000 games
const results = Array.from({ length: 1000 }, () => simulateGame());

const playerWins = results.filter(r => r.winner === 'player').length;
const enemyWins = results.filter(r => r.winner === 'enemy').length;
const avgTurns = results.reduce((sum, r) => sum + r.turns, 0) / results.length;

console.log(`Player wins: ${playerWins} (${(playerWins / 10).toFixed(1)}%)`);
console.log(`Enemy wins: ${enemyWins} (${(enemyWins / 10).toFixed(1)}%)`);
console.log(`Average turns: ${avgTurns.toFixed(2)}`);
```

### Example 5: Game Replay

```typescript
import { GameEngine, AIPlayer } from './core/engine';
import { generateShips } from './core/tools/ship/calculations';

// Play original game
const engine1 = new GameEngine({ boardWidth: 10, boardHeight: 10 });
const playerShips = generateShips({ boardWidth: 10, boardHeight: 10 });
const enemyShips = generateShips({ boardWidth: 10, boardHeight: 10 });
engine1.initializeGame(playerShips, enemyShips, 'PLAYER_TURN');

const ai = new AIPlayer(engine1);

// Play until game over...
while (!engine1.getState().isGameOver) {
  if (engine1.isPlayerTurn()) {
    ai.executeTurn();
  } else {
    ai.executeTurn();
  }
  engine1.toggleTurn();
}

const originalState = engine1.getState();

// Replay the same game
const engine2 = new GameEngine({ boardWidth: 10, boardHeight: 10 });
engine2.initializeGame(playerShips, enemyShips, 'PLAYER_TURN');

// Replay all shots
for (const shot of originalState.playerShots) {
  engine2.executeShot(shot.x, shot.y, true);
}
for (const shot of originalState.enemyShots) {
  engine2.executeShot(shot.x, shot.y, false);
}

const replayState = engine2.getState();

console.log('Original:', originalState.winner, originalState.shotCount);
console.log('Replay:', replayState.winner, replayState.shotCount);
console.log('Match:', originalState.winner === replayState.winner);
```

---

## Integration Guide

### React Integration

```typescript
import { useEffect, useState, useCallback } from 'react';
import { GameEngine } from './core/engine';
import { generateShips } from './core/tools/ship/calculations';
import type { GameEngineState } from './core/engine';

function useGameEngine() {
  const [gameState, setGameState] = useState<GameEngineState | null>(null);
  const [engine] = useState(() => new GameEngine(
    { boardWidth: 10, boardHeight: 10 },
    { onStateChange: setGameState }
  ));

  const startGame = useCallback(() => {
    const playerShips = generateShips({ boardWidth: 10, boardHeight: 10 });
    const enemyShips = generateShips({ boardWidth: 10, boardHeight: 10 });
    engine.initializeGame(playerShips, enemyShips, 'PLAYER_TURN');
  }, [engine]);

  const shoot = useCallback((x: number, y: number) => {
    if (engine.isPlayerTurn()) {
      const result = engine.executeShot(x, y, true);
      if (!result.shipDestroyed) {
        engine.toggleTurn();
      }
      return result;
    }
  }, [engine]);

  return { gameState, engine, startGame, shoot };
}

// Usage in component
function GameComponent() {
  const { gameState, startGame, shoot } = useGameEngine();

  useEffect(() => {
    startGame();
  }, [startGame]);

  const handleCellClick = (x: number, y: number) => {
    const result = shoot(x, y);
    if (result?.hit) {
      console.log('HIT!');
    }
  };

  return (
    <div>
      <h1>Naval Battle</h1>
      {gameState?.isGameOver && <h2>Winner: {gameState.winner}</h2>}
      {/* Render board... */}
    </div>
  );
}
```

### Vue Integration

```typescript
import { ref, onMounted } from 'vue';
import { GameEngine } from './core/engine';
import { generateShips } from './core/tools/ship/calculations';

export default {
  setup() {
    const gameState = ref(null);
    
    const engine = new GameEngine(
      { boardWidth: 10, boardHeight: 10 },
      { onStateChange: (state) => { gameState.value = state; } }
    );

    const startGame = () => {
      const playerShips = generateShips({ boardWidth: 10, boardHeight: 10 });
      const enemyShips = generateShips({ boardWidth: 10, boardHeight: 10 });
      engine.initializeGame(playerShips, enemyShips, 'PLAYER_TURN');
    };

    const shoot = (x: number, y: number) => {
      if (engine.isPlayerTurn()) {
        const result = engine.executeShot(x, y, true);
        if (!result.shipDestroyed) {
          engine.toggleTurn();
        }
        return result;
      }
    };

    onMounted(() => {
      startGame();
    });

    return { gameState, startGame, shoot };
  }
};
```

### Node.js/Server Integration

```typescript
import { GameEngine, AIPlayer } from './core/engine';
import { generateShips } from './core/tools/ship/calculations';

class GameServer {
  private games = new Map<string, GameEngine>();

  createGame(gameId: string): void {
    const engine = new GameEngine({ boardWidth: 10, boardHeight: 10 });
    const playerShips = generateShips({ boardWidth: 10, boardHeight: 10 });
    const enemyShips = generateShips({ boardWidth: 10, boardHeight: 10 });
    engine.initializeGame(playerShips, enemyShips, 'PLAYER_TURN');
    
    this.games.set(gameId, engine);
  }

  executePlayerShot(gameId: string, x: number, y: number) {
    const engine = this.games.get(gameId);
    if (!engine || !engine.isPlayerTurn()) {
      return { error: 'Invalid game or not player turn' };
    }

    const result = engine.executeShot(x, y, true);
    
    if (!result.shipDestroyed && !result.isGameOver) {
      engine.toggleTurn();
      // Execute AI turn
      const ai = new AIPlayer(engine);
      ai.executeTurn();
      engine.toggleTurn();
    }

    return {
      playerShot: result,
      gameState: engine.getState()
    };
  }

  getGameState(gameId: string) {
    const engine = this.games.get(gameId);
    return engine?.getState() || null;
  }
}

// Usage
const server = new GameServer();
server.createGame('game-123');
const result = server.executePlayerShot('game-123', 5, 5);
console.log(result);
```

---

## Advanced Topics

### Custom Ship Generation

```typescript
import type { GameShip } from './core/types/common';

function createCustomShips(): GameShip[] {
  return [
    {
      coords: [0, 0],
      variant: 'large',
      orientation: 'horizontal',
      shipId: 0
    },
    {
      coords: [5, 5],
      variant: 'medium',
      orientation: 'vertical',
      shipId: 1
    }
    // ... more ships
  ];
}

const engine = new GameEngine({ boardWidth: 10, boardHeight: 10 });
const playerShips = createCustomShips();
const enemyShips = generateShips({ boardWidth: 10, boardHeight: 10 });
engine.initializeGame(playerShips, enemyShips, 'PLAYER_TURN');
```

### State Persistence

```typescript
import { GameEngine } from './core/engine';
import type { GameEngineState } from './core/engine';

// Save game
function saveGame(engine: GameEngine): string {
  const state = engine.getState();
  return JSON.stringify(state);
}

// Load game
function loadGame(savedState: string): GameEngine {
  const state: GameEngineState = JSON.parse(savedState);
  
  const engine = new GameEngine({
    boardWidth: state.boardWidth,
    boardHeight: state.boardHeight
  });
  
  engine.initializeGame(
    state.playerShips,
    state.enemyShips,
    state.currentTurn
  );
  
  // Restore shots
  engine.setPlayerShots(state.playerShots);
  engine.setEnemyShots(state.enemyShots);
  
  return engine;
}

// Usage
const engine = new GameEngine({ boardWidth: 10, boardHeight: 10 });
// ... play game ...
const saved = saveGame(engine);

// Later...
const restoredEngine = loadGame(saved);
console.log('Game restored:', restoredEngine.getState());
```

### Custom AI Strategy

```typescript
import { SmartAIPlayer } from './core/engine';
import type { GameEngine } from './core/engine';

class CustomAI extends SmartAIPlayer {
  private targetPriority: [number, number][] = [];

  constructor(engine: GameEngine) {
    super(engine);
    this.calculatePriorityTargets();
  }

  private calculatePriorityTargets(): void {
    // Custom logic: prioritize center of board
    const { width, height } = (this as any).engine.getBoardDimensions();
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    
    this.targetPriority = [
      [centerX, centerY],
      [centerX + 1, centerY],
      [centerX - 1, centerY],
      [centerX, centerY + 1],
      [centerX, centerY - 1]
    ];
  }

  public generateCustomShot(): [number, number] | null {
    // Try priority targets first
    for (const [x, y] of this.targetPriority) {
      const engine = (this as any).engine as GameEngine;
      if (engine.isValidPosition(x, y) && !engine.isCellShot(x, y, false)) {
        return [x, y];
      }
    }
    
    // Fall back to smart shot
    return this.generateSmartShot();
  }
}

// Usage
const engine = new GameEngine({ boardWidth: 10, boardHeight: 10 });
const customAI = new CustomAI(engine);
const shot = customAI.generateCustomShot();
```

### Performance Optimization

```typescript
import { GameEngine, AIPlayer } from './core/engine';
import { generateShips } from './core/tools/ship/calculations';

// Batch game simulation with worker pool
async function runBatchSimulation(count: number): Promise<any[]> {
  const results = [];
  const batchSize = 100;
  
  for (let i = 0; i < count; i += batchSize) {
    const batch = Math.min(batchSize, count - i);
    const batchResults = await Promise.all(
      Array.from({ length: batch }, () => simulateGameAsync())
    );
    results.push(...batchResults);
    
    console.log(`Completed ${i + batch}/${count} simulations`);
  }
  
  return results;
}

async function simulateGameAsync() {
  return new Promise(resolve => {
    setTimeout(() => {
      const engine = new GameEngine({ boardWidth: 10, boardHeight: 10 });
      const playerShips = generateShips({ boardWidth: 10, boardHeight: 10 });
      const enemyShips = generateShips({ boardWidth: 10, boardHeight: 10 });
      engine.initializeGame(playerShips, enemyShips, 'PLAYER_TURN');
      
      const ai = new AIPlayer(engine);
      let turns = 0;
      
      while (!engine.getState().isGameOver && turns < 200) {
        ai.executeTurn();
        engine.toggleTurn();
        turns++;
      }
      
      resolve({
        winner: engine.getWinner(),
        turns
      });
    }, 0);
  });
}

// Usage
runBatchSimulation(10000).then(results => {
  console.log(`Simulated ${results.length} games`);
});
```

### Testing Helper Functions

```typescript
import { GameEngine } from './core/engine';
import { generateShips } from './core/tools/ship/calculations';

/**
 * Create a test game with predictable setup
 */
export function createTestGame() {
  const engine = new GameEngine({ boardWidth: 10, boardHeight: 10 });
  const playerShips = generateShips({ boardWidth: 10, boardHeight: 10 });
  const enemyShips = generateShips({ boardWidth: 10, boardHeight: 10 });
  engine.initializeGame(playerShips, enemyShips, 'PLAYER_TURN');
  return { engine, playerShips, enemyShips };
}

/**
 * Execute shots until hit
 */
export function shootUntilHit(engine: GameEngine, isPlayerShot: boolean): void {
  const { width, height } = engine.getBoardDimensions();
  
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (!engine.isCellShot(x, y, isPlayerShot)) {
        const result = engine.executeShot(x, y, isPlayerShot);
        if (result.hit) return;
      }
    }
  }
}

/**
 * Play game until completion
 */
export function playUntilEnd(engine: GameEngine): void {
  const ai = new AIPlayer(engine);
  
  while (!engine.getState().isGameOver) {
    ai.executeTurn();
    engine.toggleTurn();
  }
}

// Usage in tests
describe('GameEngine', () => {
  test('should end game when all ships destroyed', () => {
    const { engine } = createTestGame();
    playUntilEnd(engine);
    expect(engine.getState().isGameOver).toBe(true);
  });
});
```

---

## Type Definitions

### Core Types

```typescript
// Game turn
type GameTurn = "PLAYER_TURN" | "ENEMY_TURN";

// Player identification
type PlayerName = "player" | "enemy";

// Winner (null if game not over)
type Winner = PlayerName | null;

// Ship size variants
type ShipVariant = "small" | "medium" | "large" | "xlarge";

// Ship orientation
type ShipOrientation = "horizontal" | "vertical";

// Ship definition
interface GameShip {
  coords: [number, number];    // Starting position [x, y]
  variant: ShipVariant;        // Ship size
  orientation: ShipOrientation; // Direction
  shipId?: number;             // Unique identifier
}

// Shot record
interface Shot {
  x: number;           // X coordinate
  y: number;           // Y coordinate
  hit: boolean;        // Whether it hit a ship
  shipId?: number;     // ID of hit ship (if any)
}

// Game configuration
interface GameConfig {
  boardWidth: number;
  boardHeight: number;
  shipCounts: {
    small: number;   // 2 cells
    medium: number;  // 3 cells
    large: number;   // 4 cells
    xlarge: number;  // 5 cells
  };
  initialTurn: PlayerName | "random";
}
```

---

## Constants

```typescript
// From core/constants/game.ts

GAME_CONSTANTS = {
  SHIPS: {
    SIZES: {
      small: 2,
      medium: 3,
      large: 4,
      xlarge: 5
    },
    DEFAULT_COUNTS: {
      small: 1,
      medium: 2,
      large: 1,
      xlarge: 1
    },
    MIN_DISTANCE: 2,                // Minimum cells between ships
    MAX_PLACEMENT_ATTEMPTS: 200     // Attempts before giving up
  },
  BOARD: {
    DEFAULT_WIDTH: 10,
    DEFAULT_HEIGHT: 10,
    MIN_SIZE: 5,
    MAX_SIZE: 15
  }
}
```

---

## Best Practices

### 1. Turn Management

Always check turn before executing shots:

```typescript
if (engine.isPlayerTurn()) {
  const result = engine.executeShot(x, y, true);
  
  // Only switch turn if ship not destroyed
  if (!result.shipDestroyed) {
    engine.toggleTurn();
  }
}
```

### 2. Error Handling

Check for errors when executing shots:

```typescript
const result = engine.executeShot(x, y, true);

if (!result.success) {
  console.error('Shot failed:', result.error);
  return;
}
```

### 3. State Immutability

The engine returns copies of state, never mutate them:

```typescript
// ✅ Good
const ships = engine.getPlayerShips();
console.log(ships.length);

// ❌ Bad - don't mutate returned data
const ships = engine.getPlayerShips();
ships.push(newShip); // Don't do this!
```

### 4. Callback Usage

Use callbacks for reactive updates rather than polling:

```typescript
// ✅ Good - reactive
const engine = new GameEngine(config, {
  onStateChange: (state) => {
    updateUI(state);
  }
});

// ❌ Avoid - polling
setInterval(() => {
  const state = engine.getState();
  updateUI(state);
}, 100);
```

### 5. AI Integration

Always call `onShotResult()` for SmartAI:

```typescript
const smartAI = new SmartAIPlayer(engine);
const pos = smartAI.generateSmartShot();

if (pos) {
  const result = engine.executeShot(pos[0], pos[1], true);
  
  // ✅ Important: inform AI of result
  smartAI.onShotResult(result.hit, pos, result.shipDestroyed || false);
}
```

---

## Troubleshooting

### Common Issues

#### 1. Shots not registering

**Problem:** `executeShot()` returns `success: false`

**Solution:** Check if cell was already shot:
```typescript
if (!engine.isCellShot(x, y, isPlayerShot)) {
  engine.executeShot(x, y, isPlayerShot);
}
```

#### 2. Game not ending

**Problem:** Game continues even when all ships destroyed

**Solution:** Ensure you're checking the return value:
```typescript
const result = engine.executeShot(x, y, true);
if (result.isGameOver) {
  // Handle game end
}
```

#### 3. SmartAI acting randomly

**Problem:** SmartAI doesn't hunt after hits

**Solution:** Must call `onShotResult()`:
```typescript
const result = engine.executeShot(x, y, true);
smartAI.onShotResult(result.hit, [x, y], result.shipDestroyed || false);
```

#### 4. Ship generation fails

**Problem:** `generateShips()` returns fewer ships than requested

**Solution:** Board may be too small or too many ships. Reduce ship counts or increase board size:
```typescript
const ships = generateShips({
  boardWidth: 12,  // Increase from 10
  boardHeight: 12,
  shipCounts: {
    small: 1,
    medium: 1,
    large: 1,
    xlarge: 1
  }
});
```

---

## FAQ

**Q: Can I use this with a UI framework?**  
A: Yes! The core is framework-agnostic. Use callbacks for reactivity.

**Q: How do I save/load games?**  
A: Serialize `getState()` to JSON, then restore using setters.

**Q: Can I customize ship sizes?**  
A: Ship sizes are defined in constants. You can modify them but ensure consistency.

**Q: Is the engine thread-safe?**  
A: Yes, as long as you don't access the same engine instance from multiple threads.

**Q: Can I run this server-side?**  
A: Yes! It's pure TypeScript with no browser dependencies.

**Q: How do I implement multiplayer?**  
A: Use the engine on server, execute shots from both clients, broadcast state changes.

**Q: Can I create custom AI?**  
A: Yes! Extend `AIPlayer` or `SmartAIPlayer` and override methods.

**Q: What's the performance for large simulations?**  
A: Very fast. Can easily simulate 10,000+ games per second.

---

## License

See your project's LICENSE file.

---

## Support

For issues, examples, or contributions, please refer to the main project repository.

---

**Last Updated:** Generated for naval battle game engine v1.0
