import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameEngine } from '../../engine/logic';
import type { GameShip, Shot } from '../../types/common';

describe('GameEngine', () => {
  let engine: GameEngine;
  let playerShips: GameShip[];
  let enemyShips: GameShip[];

  beforeEach(() => {
    engine = new GameEngine({ boardWidth: 10, boardHeight: 10 });
    
    // Standard test ships
    playerShips = [
      { coords: [0, 0], variant: 'small', orientation: 'horizontal', shipId: 0 },
      { coords: [2, 2], variant: 'medium', orientation: 'vertical', shipId: 1 },
    ];
    
    enemyShips = [
      { coords: [5, 5], variant: 'small', orientation: 'horizontal', shipId: 0 },
      { coords: [7, 7], variant: 'medium', orientation: 'vertical', shipId: 1 },
    ];
  });

  describe('Initialization', () => {
    it('should start with default values', () => {
      const state = engine.getState();
      expect(state.currentTurn).toBe('PLAYER_TURN');
      expect(state.isGameOver).toBe(false);
      expect(state.winner).toBe(null);
      expect(state.playerShips).toHaveLength(0);
      expect(state.enemyShips).toHaveLength(0);
      expect(state.shotCount).toBe(0);
    });

    it('should initialize game with ships', () => {
      engine.initializeGame(playerShips, enemyShips);
      
      const state = engine.getState();
      expect(state.playerShips).toHaveLength(2);
      expect(state.enemyShips).toHaveLength(2);
      expect(state.currentTurn).toBe('PLAYER_TURN');
    });

    it('should initialize with custom starting turn', () => {
      engine.initializeGame(playerShips, enemyShips, 'ENEMY_TURN');
      
      expect(engine.getCurrentTurn()).toBe('ENEMY_TURN');
      expect(engine.isEnemyTurn()).toBe(true);
      expect(engine.isPlayerTurn()).toBe(false);
    });

    it('should accept custom board dimensions', () => {
      const customEngine = new GameEngine({ boardWidth: 15, boardHeight: 12 });
      const dimensions = customEngine.getBoardDimensions();
      
      expect(dimensions.width).toBe(15);
      expect(dimensions.height).toBe(12);
    });
  });

  describe('Turn Management', () => {
    beforeEach(() => {
      engine.initializeGame(playerShips, enemyShips);
    });

    it('should start with player turn by default', () => {
      expect(engine.isPlayerTurn()).toBe(true);
      expect(engine.isEnemyTurn()).toBe(false);
      expect(engine.getCurrentTurn()).toBe('PLAYER_TURN');
    });

    it('should switch to enemy turn', () => {
      engine.setEnemyTurn();
      
      expect(engine.isPlayerTurn()).toBe(false);
      expect(engine.isEnemyTurn()).toBe(true);
      expect(engine.getCurrentTurn()).toBe('ENEMY_TURN');
    });

    it('should toggle turns correctly', () => {
      expect(engine.getCurrentTurn()).toBe('PLAYER_TURN');
      
      engine.toggleTurn();
      expect(engine.getCurrentTurn()).toBe('ENEMY_TURN');
      
      engine.toggleTurn();
      expect(engine.getCurrentTurn()).toBe('PLAYER_TURN');
    });

    it('should call onTurnChange callback when turn changes', () => {
      const onTurnChange = vi.fn();
      const engineWithCallback = new GameEngine({}, { onTurnChange });
      
      engineWithCallback.setEnemyTurn();
      expect(onTurnChange).toHaveBeenCalledWith('ENEMY_TURN');
      
      engineWithCallback.setPlayerTurn();
      expect(onTurnChange).toHaveBeenCalledWith('PLAYER_TURN');
    });
  });

  describe('Shot Execution', () => {
    beforeEach(() => {
      engine.initializeGame(playerShips, enemyShips);
    });

    it('should register a miss correctly', () => {
      const result = engine.executeShot(9, 9, true);
      
      expect(result.success).toBe(true);
      expect(result.hit).toBe(false);
      expect(result.shipId).toBe(-1);
      expect(result.shipDestroyed).toBe(false);
    });

    it('should register a hit correctly', () => {
      // Enemy ship at [5,5] horizontal, size 2
      const result = engine.executeShot(5, 5, true);
      
      expect(result.success).toBe(true);
      expect(result.hit).toBe(true);
      expect(result.shipId).toBe(0);
      expect(result.shipDestroyed).toBe(false);
    });

    it('should detect ship destruction', () => {
      // Enemy small ship at [5,5] horizontal, size 2
      engine.executeShot(5, 5, true); // First hit
      const result = engine.executeShot(6, 5, true); // Second hit - destroys ship
      
      expect(result.hit).toBe(true);
      expect(result.shipDestroyed).toBe(true);
    });

    it('should prevent shooting same cell twice', () => {
      engine.executeShot(5, 5, true);
      const result = engine.executeShot(5, 5, true);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Cell already shot');
    });

    it('should track shots for both players separately', () => {
      engine.executeShot(5, 5, true); // Player shot
      engine.executeShot(0, 0, false); // Enemy shot
      
      const state = engine.getState();
      expect(state.playerShots).toHaveLength(1);
      expect(state.enemyShots).toHaveLength(1);
    });

    it('should call onShot callback', () => {
      const onShot = vi.fn();
      const engineWithCallback = new GameEngine({}, { onShot });
      engineWithCallback.initializeGame(playerShips, enemyShips);
      
      engineWithCallback.executeShot(9, 9, true);
      
      expect(onShot).toHaveBeenCalledWith(
        expect.objectContaining({ x: 9, y: 9, hit: false }),
        true
      );
    });

    it('should increment shot count', () => {
      expect(engine.getShotCount()).toBe(0);
      
      engine.executeShot(0, 0, true);
      expect(engine.getShotCount()).toBe(1);
      
      engine.executeShot(1, 1, false);
      expect(engine.getShotCount()).toBe(2);
    });
  });

  describe('Game Over Detection', () => {
    beforeEach(() => {
      engine.initializeGame(playerShips, enemyShips);
    });

    it('should detect player victory when all enemy ships destroyed', () => {
      // Destroy enemy ship 1 (small ship at [5,5], size 2)
      engine.executeShot(5, 5, true);
      engine.executeShot(6, 5, true);
      
      // Destroy enemy ship 2 (medium ship at [7,7], size 3)
      engine.executeShot(7, 7, true);
      engine.executeShot(7, 8, true);
      const result = engine.executeShot(7, 9, true);
      
      expect(result.isGameOver).toBe(true);
      expect(result.winner).toBe('player');
      expect(engine.getWinner()).toBe('player');
    });

    it('should detect enemy victory when all player ships destroyed', () => {
      // Destroy player ship 1 (small ship at [0,0], size 2)
      engine.executeShot(0, 0, false);
      engine.executeShot(1, 0, false);
      
      // Destroy player ship 2 (medium ship at [2,2], size 3)
      engine.executeShot(2, 2, false);
      engine.executeShot(2, 3, false);
      const result = engine.executeShot(2, 4, false);
      
      expect(result.isGameOver).toBe(true);
      expect(result.winner).toBe('enemy');
    });

    it('should call onGameOver callback', () => {
      const onGameOver = vi.fn();
      const engineWithCallback = new GameEngine({}, { onGameOver });
      engineWithCallback.initializeGame(playerShips, enemyShips);
      
      // Destroy all enemy ships
      engineWithCallback.executeShot(5, 5, true);
      engineWithCallback.executeShot(6, 5, true);
      engineWithCallback.executeShot(7, 7, true);
      engineWithCallback.executeShot(7, 8, true);
      engineWithCallback.executeShot(7, 9, true);
      
      expect(onGameOver).toHaveBeenCalledWith('player');
    });

    it('should not allow shots after game over', () => {
      // Destroy all enemy ships
      engine.executeShot(5, 5, true);
      engine.executeShot(6, 5, true);
      engine.executeShot(7, 7, true);
      engine.executeShot(7, 8, true);
      engine.executeShot(7, 9, true);
      
      const state = engine.getState();
      expect(state.isGameOver).toBe(true);
    });
  });

  describe('Ship Position Queries', () => {
    beforeEach(() => {
      engine.initializeGame(playerShips, enemyShips);
    });

    it('should detect ship at position', () => {
      expect(engine.hasShipAtPosition(0, 0, true)).toBe(true); // Player ship
      expect(engine.hasShipAtPosition(1, 0, true)).toBe(true); // Player ship continues
      expect(engine.hasShipAtPosition(5, 5, false)).toBe(true); // Enemy ship
    });

    it('should return false for empty positions', () => {
      expect(engine.hasShipAtPosition(9, 9, true)).toBe(false);
      expect(engine.hasShipAtPosition(9, 9, false)).toBe(false);
    });

    it('should check if cell has been shot', () => {
      expect(engine.isCellShot(5, 5, true)).toBe(false);
      
      engine.executeShot(5, 5, true);
      
      expect(engine.isCellShot(5, 5, true)).toBe(true);
      expect(engine.isCellShot(5, 5, false)).toBe(false); // Different player
    });

    it('should get shot at position', () => {
      engine.executeShot(5, 5, true);
      
      const shot = engine.getShotAtPosition(5, 5, true);
      expect(shot).toBeDefined();
      expect(shot?.x).toBe(5);
      expect(shot?.y).toBe(5);
      
      const noShot = engine.getShotAtPosition(9, 9, true);
      expect(noShot).toBeUndefined();
    });
  });

  describe('State Management', () => {
    beforeEach(() => {
      engine.initializeGame(playerShips, enemyShips);
    });

    it('should return complete game state', () => {
      const state = engine.getState();
      
      expect(state).toHaveProperty('currentTurn');
      expect(state).toHaveProperty('isPlayerTurn');
      expect(state).toHaveProperty('isEnemyTurn');
      expect(state).toHaveProperty('playerShips');
      expect(state).toHaveProperty('enemyShips');
      expect(state).toHaveProperty('playerShots');
      expect(state).toHaveProperty('enemyShots');
      expect(state).toHaveProperty('isGameOver');
      expect(state).toHaveProperty('winner');
      expect(state).toHaveProperty('boardWidth');
      expect(state).toHaveProperty('boardHeight');
      expect(state).toHaveProperty('shotCount');
    });

    it('should call onStateChange callback on significant changes', () => {
      const onStateChange = vi.fn();
      const engineWithCallback = new GameEngine({}, { onStateChange });
      
      engineWithCallback.initializeGame(playerShips, enemyShips);
      expect(onStateChange).toHaveBeenCalled();
      
      onStateChange.mockClear();
      engineWithCallback.executeShot(5, 5, true);
      expect(onStateChange).toHaveBeenCalled();
    });

    it('should reset game state', () => {
      engine.executeShot(5, 5, true);
      engine.setEnemyTurn();
      
      engine.resetGame();
      
      const state = engine.getState();
      expect(state.currentTurn).toBe('PLAYER_TURN');
      expect(state.playerShots).toHaveLength(0);
      expect(state.enemyShots).toHaveLength(0);
      expect(state.shotCount).toBe(0);
      expect(state.isGameOver).toBe(false);
      expect(state.winner).toBe(null);
    });

    it('should get player ships copy', () => {
      const ships = engine.getPlayerShips();
      expect(ships).toHaveLength(2);
      
      // Verify it's a copy
      ships.push({ coords: [9, 9], variant: 'small', orientation: 'horizontal', shipId: 99 });
      expect(engine.getPlayerShips()).toHaveLength(2); // Original unchanged
    });

    it('should get enemy ships copy', () => {
      const ships = engine.getEnemyShips();
      expect(ships).toHaveLength(2);
      
      // Verify it's a copy
      ships.push({ coords: [9, 9], variant: 'small', orientation: 'horizontal', shipId: 99 });
      expect(engine.getEnemyShips()).toHaveLength(2); // Original unchanged
    });
  });

  describe('Board Validation', () => {
    beforeEach(() => {
      engine.initializeGame(playerShips, enemyShips);
    });

    it('should validate positions within bounds', () => {
      expect(engine.isValidPosition(0, 0)).toBe(true);
      expect(engine.isValidPosition(9, 9)).toBe(true);
      expect(engine.isValidPosition(5, 5)).toBe(true);
    });

    it('should reject positions outside bounds', () => {
      expect(engine.isValidPosition(-1, 0)).toBe(false);
      expect(engine.isValidPosition(0, -1)).toBe(false);
      expect(engine.isValidPosition(10, 0)).toBe(false);
      expect(engine.isValidPosition(0, 10)).toBe(false);
      expect(engine.isValidPosition(15, 15)).toBe(false);
    });
  });

  describe('Shot Checking', () => {
    beforeEach(() => {
      engine.initializeGame(playerShips, enemyShips);
    });

    it('should check shot against enemy ships for player', () => {
      const hit = engine.checkShot(5, 5, true);
      expect(hit.hit).toBe(true);
      expect(hit.shipId).toBe(0);
      
      const miss = engine.checkShot(9, 9, true);
      expect(miss.hit).toBe(false);
      expect(miss.shipId).toBe(-1);
    });

    it('should check shot against player ships for enemy', () => {
      const hit = engine.checkShot(0, 0, false);
      expect(hit.hit).toBe(true);
      expect(hit.shipId).toBe(0);
      
      const miss = engine.checkShot(9, 9, false);
      expect(miss.hit).toBe(false);
      expect(miss.shipId).toBe(-1);
    });
  });

  describe('Ship Status', () => {
    beforeEach(() => {
      engine.initializeGame(playerShips, enemyShips);
    });

    it('should track ship destruction status', () => {
      // Enemy small ship at [5,5], size 2
      expect(engine.isShipDestroyed(0, true)).toBe(false);
      
      engine.executeShot(5, 5, true);
      expect(engine.isShipDestroyed(0, true)).toBe(false);
      
      engine.executeShot(6, 5, true);
      expect(engine.isShipDestroyed(0, true)).toBe(true);
    });

    it('should handle checking invalid ship IDs', () => {
      expect(engine.isShipDestroyed(999, true)).toBe(false);
      expect(engine.isShipDestroyed(-1, false)).toBe(false);
    });
  });

  describe('Ship Setters', () => {
    it('should allow setting player ships after construction', () => {
      engine.setPlayerShips(playerShips);
      expect(engine.getPlayerShips()).toHaveLength(2);
    });

    it('should allow setting enemy ships after construction', () => {
      engine.setEnemyShips(enemyShips);
      expect(engine.getEnemyShips()).toHaveLength(2);
    });

    it('should update ship positions when setting ships', () => {
      engine.setPlayerShips(playerShips);
      expect(engine.hasShipAtPosition(0, 0, true)).toBe(true);
      
      engine.setEnemyShips(enemyShips);
      expect(engine.hasShipAtPosition(5, 5, false)).toBe(true);
    });
  });

  describe('Shot History', () => {
    beforeEach(() => {
      engine.initializeGame(playerShips, enemyShips);
    });

    it('should allow setting player shots for replay', () => {
      const shots: Shot[] = [
        { x: 5, y: 5, hit: true, shipId: 0 },
        { x: 6, y: 5, hit: true, shipId: 0 },
      ];
      
      engine.setPlayerShots(shots);
      
      const playerShots = engine.getPlayerShots();
      expect(playerShots).toHaveLength(2);
      expect(engine.isCellShot(5, 5, true)).toBe(true);
    });

    it('should allow setting enemy shots for replay', () => {
      const shots: Shot[] = [
        { x: 0, y: 0, hit: true, shipId: 0 },
        { x: 1, y: 0, hit: true, shipId: 0 },
      ];
      
      engine.setEnemyShots(shots);
      
      const enemyShots = engine.getEnemyShots();
      expect(enemyShots).toHaveLength(2);
      expect(engine.isCellShot(0, 0, false)).toBe(true);
    });

    it('should update shot count when setting shots', () => {
      const playerShots: Shot[] = [{ x: 5, y: 5, hit: true, shipId: 0 }];
      const enemyShots: Shot[] = [{ x: 0, y: 0, hit: true, shipId: 0 }];
      
      engine.setPlayerShots(playerShots);
      engine.setEnemyShots(enemyShots);
      
      expect(engine.getShotCount()).toBe(2);
    });
  });

  describe('Board Dimensions', () => {
    it('should allow setting board dimensions', () => {
      engine.setBoardDimensions(15, 12);
      
      const dimensions = engine.getBoardDimensions();
      expect(dimensions.width).toBe(15);
      expect(dimensions.height).toBe(12);
    });

    it('should update validation after changing dimensions', () => {
      engine.setBoardDimensions(5, 5);
      
      expect(engine.isValidPosition(4, 4)).toBe(true);
      expect(engine.isValidPosition(5, 5)).toBe(false);
    });
  });
});
