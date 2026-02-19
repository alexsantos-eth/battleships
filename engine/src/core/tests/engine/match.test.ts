import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Match } from '../../engine/match';
import type { GameShip } from '../../types/common';

describe('Match', () => {
  let match: Match;
  let playerShips: GameShip[];
  let enemyShips: GameShip[];

  beforeEach(() => {
    match = new Match({ boardWidth: 10, boardHeight: 10 });
    
    playerShips = [
      { coords: [0, 0], variant: 'small', orientation: 'horizontal', shipId: 0 },
      { coords: [2, 2], variant: 'medium', orientation: 'vertical', shipId: 1 },
    ];
    
    enemyShips = [
      { coords: [5, 5], variant: 'small', orientation: 'horizontal', shipId: 0 },
      { coords: [7, 7], variant: 'medium', orientation: 'vertical', shipId: 1 },
    ];
  });

  describe('Match Initialization', () => {
    it('should initialize a match with ships', () => {
      match.initializeMatch(playerShips, enemyShips);
      
      const state = match.getState();
      expect(state.playerShips).toHaveLength(2);
      expect(state.enemyShips).toHaveLength(2);
      expect(state.currentTurn).toBe('PLAYER_TURN');
    });

    it('should initialize with custom starting turn', () => {
      match.initializeMatch(playerShips, enemyShips, 'ENEMY_TURN');
      
      expect(match.getCurrentTurn()).toBe('ENEMY_TURN');
      expect(match.isEnemyTurn()).toBe(true);
    });

    it('should call onMatchStart callback', () => {
      const onMatchStart = vi.fn();
      const matchWithCallback = new Match({ boardWidth: 10, boardHeight: 10 }, { onMatchStart });
      
      matchWithCallback.initializeMatch(playerShips, enemyShips);
      
      expect(onMatchStart).toHaveBeenCalled();
    });
  });

  describe('Match Rules - Hit Continuation', () => {
    beforeEach(() => {
      match.initializeMatch(playerShips, enemyShips);
    });

    it('should allow shooting again after a hit (ship not destroyed)', () => {
      // Enemy medium ship at [7,7], size 3
      const result = match.executeShot(7, 7, true);
      
      expect(result.success).toBe(true);
      expect(result.hit).toBe(true);
      expect(result.shipDestroyed).toBe(false);
      expect(result.turnEnded).toBe(false);
      expect(result.canShootAgain).toBe(true);
      expect(result.reason).toBe('Hit - shoot again');
      expect(match.getCurrentTurn()).toBe('PLAYER_TURN'); // Turn doesn't change
    });

    it('should end turn after miss', () => {
      const result = match.executeShot(0, 0, true); // Miss
      
      expect(result.success).toBe(true);
      expect(result.hit).toBe(false);
      expect(result.turnEnded).toBe(true);
      expect(result.canShootAgain).toBe(false);
      expect(result.reason).toBe('Miss - turn ends');
      expect(match.getCurrentTurn()).toBe('ENEMY_TURN'); // Turn changes
    });

    it('should end turn after ship destruction', () => {
      // Enemy small ship at [5,5], size 2
      match.executeShot(5, 5, true); // First hit
      const result = match.executeShot(6, 5, true); // Second hit - destroys
      
      expect(result.success).toBe(true);
      expect(result.hit).toBe(true);
      expect(result.shipDestroyed).toBe(true);
      expect(result.turnEnded).toBe(true);
      expect(result.canShootAgain).toBe(false);
      expect(result.reason).toBe('Ship destroyed - turn ends');
      expect(match.getCurrentTurn()).toBe('ENEMY_TURN'); // Turn changes
    });
  });

  describe('Match Rules - Turn Sequence', () => {
    beforeEach(() => {
      match.initializeMatch(playerShips, enemyShips);
    });

    it('should allow multiple hits in same turn if ship not destroyed', () => {
      // Enemy medium ship at [7,7] vertical, size 3
      const hit1 = match.executeShot(7, 7, true);
      expect(hit1.canShootAgain).toBe(true);
      expect(match.getCurrentTurn()).toBe('PLAYER_TURN');
      
      const hit2 = match.executeShot(7, 8, true);
      expect(hit2.canShootAgain).toBe(true);
      expect(match.getCurrentTurn()).toBe('PLAYER_TURN');
      
      // Third hit destroys the ship
      const hit3 = match.executeShot(7, 9, true);
      expect(hit3.shipDestroyed).toBe(true);
      expect(hit3.turnEnded).toBe(true);
      expect(match.getCurrentTurn()).toBe('ENEMY_TURN');
    });

    it('should alternate turns correctly with misses', () => {
      expect(match.isPlayerTurn()).toBe(true);
      
      // Player misses
      match.executeShot(0, 0, true);
      expect(match.isEnemyTurn()).toBe(true);
      
      // Enemy misses
      match.executeShot(9, 9, false);
      expect(match.isPlayerTurn()).toBe(true);
    });

    it('should handle complex turn sequence', () => {
      // Player hits but doesn't destroy
      const r1 = match.executeShot(7, 7, true);
      expect(r1.canShootAgain).toBe(true);
      expect(match.isPlayerTurn()).toBe(true);
      
      // Player misses on second shot
      const r2 = match.executeShot(0, 0, true);
      expect(r2.turnEnded).toBe(true);
      expect(match.isEnemyTurn()).toBe(true);
      
      // Enemy hits player ship
      const r3 = match.executeShot(0, 0, false);
      expect(r3.canShootAgain).toBe(true);
      expect(match.isEnemyTurn()).toBe(true);
      
      // Enemy destroys player small ship
      const r4 = match.executeShot(1, 0, false);
      expect(r4.shipDestroyed).toBe(true);
      expect(r4.turnEnded).toBe(true);
      expect(match.isPlayerTurn()).toBe(true);
    });
  });

  describe('Match Rules - Game Over', () => {
    beforeEach(() => {
      match.initializeMatch(playerShips, enemyShips);
    });

    it('should end match when all enemy ships destroyed', () => {
      // Destroy enemy ship 1 (small at [5,5])
      match.executeShot(5, 5, true);
      match.executeShot(6, 5, true);
      
      // Turn should switch after destruction
      expect(match.isEnemyTurn()).toBe(true);
      
      // Enemy misses to give turn back
      match.executeShot(9, 9, false);
      
      // Destroy enemy ship 2 (medium at [7,7])
      match.executeShot(7, 7, true);
      match.executeShot(7, 8, true);
      const result = match.executeShot(7, 9, true);
      
      expect(result.isGameOver).toBe(true);
      expect(result.winner).toBe('player');
      expect(match.isMatchOver()).toBe(true);
      expect(match.getWinner()).toBe('player');
    });

    it('should provide game over reason', () => {
      // Destroy all enemy ships
      match.executeShot(5, 5, true);
      match.executeShot(6, 5, true);
      match.executeShot(9, 9, false); // Enemy miss to switch turn
      match.executeShot(7, 7, true);
      match.executeShot(7, 8, true);
      const result = match.executeShot(7, 9, true);
      
      expect(result.reason).toBe('Game over');
      expect(result.turnEnded).toBe(true);
      expect(result.canShootAgain).toBe(false);
    });
  });

  describe('Shot Validation', () => {
    beforeEach(() => {
      match.initializeMatch(playerShips, enemyShips);
    });

    it('should reject already shot cells', () => {
      match.executeShot(5, 5, true);
      const result = match.executeShot(5, 5, true);
      
      expect(result.success).toBe(false);
      expect(result.turnEnded).toBe(false);
      expect(result.canShootAgain).toBe(false);
      expect(result.reason).toBeDefined();
    });

    it('should check if cell has been shot', () => {
      expect(match.isCellShot(5, 5, true)).toBe(false);
      
      match.executeShot(5, 5, true);
      
      expect(match.isCellShot(5, 5, true)).toBe(true);
    });

    it('should validate position bounds', () => {
      expect(match.isValidPosition(0, 0)).toBe(true);
      expect(match.isValidPosition(9, 9)).toBe(true);
      expect(match.isValidPosition(-1, 0)).toBe(false);
      expect(match.isValidPosition(10, 10)).toBe(false);
    });

    it('should get shot at position', () => {
      match.executeShot(5, 5, true);
      
      const shot = match.getShotAtPosition(5, 5, true);
      expect(shot).toBeDefined();
      expect(shot?.x).toBe(5);
      expect(shot?.y).toBe(5);
    });
  });

  describe('Match State', () => {
    beforeEach(() => {
      match.initializeMatch(playerShips, enemyShips);
    });

    it('should provide complete match state', () => {
      const state = match.getState();
      
      expect(state).toHaveProperty('currentTurn');
      expect(state).toHaveProperty('playerShips');
      expect(state).toHaveProperty('enemyShips');
      expect(state).toHaveProperty('playerShots');
      expect(state).toHaveProperty('enemyShots');
      expect(state).toHaveProperty('isGameOver');
      expect(state).toHaveProperty('winner');
    });

    it('should allow resetting match', () => {
      match.executeShot(5, 5, true);
      
      match.resetMatch();
      
      const state = match.getState();
      expect(state.playerShots).toHaveLength(0);
      expect(state.enemyShots).toHaveLength(0);
      expect(state.shotCount).toBe(0);
    });

    it('should get board dimensions', () => {
      const dimensions = match.getBoardDimensions();
      
      expect(dimensions.width).toBe(10);
      expect(dimensions.height).toBe(10);
    });

    it('should check ship positions', () => {
      expect(match.hasShipAtPosition(0, 0, true)).toBe(true); // Player ship
      expect(match.hasShipAtPosition(5, 5, false)).toBe(true); // Enemy ship
      expect(match.hasShipAtPosition(9, 9, true)).toBe(false); // Empty
    });
  });

  describe('Match Callbacks', () => {
    it('should call onStateChange callback', () => {
      const onStateChange = vi.fn();
      const matchWithCallback = new Match({ boardWidth: 10, boardHeight: 10 }, { onStateChange });
      
      matchWithCallback.initializeMatch(playerShips, enemyShips);
      
      expect(onStateChange).toHaveBeenCalled();
    });

    it('should call onTurnChange callback', () => {
      const onTurnChange = vi.fn();
      const matchWithCallback = new Match({ boardWidth: 10, boardHeight: 10 }, { onTurnChange });
      
      matchWithCallback.initializeMatch(playerShips, enemyShips);
      
      // Miss to trigger turn change
      matchWithCallback.executeShot(0, 0, true);
      
      expect(onTurnChange).toHaveBeenCalledWith('ENEMY_TURN');
    });

    it('should call onShot callback', () => {
      const onShot = vi.fn();
      const matchWithCallback = new Match({ boardWidth: 10, boardHeight: 10 }, { onShot });
      
      matchWithCallback.initializeMatch(playerShips, enemyShips);
      
      matchWithCallback.executeShot(5, 5, true);
      
      expect(onShot).toHaveBeenCalledWith(
        expect.objectContaining({ x: 5, y: 5 }),
        true
      );
    });

    it('should call onGameOver callback', () => {
      const onGameOver = vi.fn();
      const matchWithCallback = new Match({ boardWidth: 10, boardHeight: 10 }, { onGameOver });
      
      matchWithCallback.initializeMatch(playerShips, enemyShips);
      
      // Destroy all enemy ships
      matchWithCallback.executeShot(5, 5, true);
      matchWithCallback.executeShot(6, 5, true);
      matchWithCallback.executeShot(9, 9, false);
      matchWithCallback.executeShot(7, 7, true);
      matchWithCallback.executeShot(7, 8, true);
      matchWithCallback.executeShot(7, 9, true);
      
      expect(onGameOver).toHaveBeenCalledWith('player');
    });
  });

  describe('Engine Access', () => {
    it('should provide access to underlying engine', () => {
      const engine = match.getEngine();
      
      expect(engine).toBeDefined();
      expect(typeof engine.getState).toBe('function');
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      match.initializeMatch(playerShips, enemyShips);
    });

    it('should handle shot on last cell of destroyed ship', () => {
      // Destroy small ship completely
      match.executeShot(5, 5, true);
      const result = match.executeShot(6, 5, true);
      
      expect(result.shipDestroyed).toBe(true);
      expect(result.turnEnded).toBe(true);
    });

    it('should maintain turn logic when game ends', () => {
      // Destroy all enemy ships
      match.executeShot(5, 5, true);
      match.executeShot(6, 5, true);
      match.executeShot(9, 9, false);
      match.executeShot(7, 7, true);
      match.executeShot(7, 8, true);
      const result = match.executeShot(7, 9, true);
      
      expect(result.isGameOver).toBe(true);
      expect(result.turnEnded).toBe(true);
      expect(result.canShootAgain).toBe(false);
    });

    it('should handle rapid hits on same ship', () => {
      // Hit medium ship multiple times in succession
      const r1 = match.executeShot(7, 7, true);
      expect(r1.canShootAgain).toBe(true);
      
      const r2 = match.executeShot(7, 8, true);
      expect(r2.canShootAgain).toBe(true);
      
      const r3 = match.executeShot(7, 9, true);
      expect(r3.shipDestroyed).toBe(true);
      expect(r3.turnEnded).toBe(true);
    });
  });

  describe('Both Players Shooting', () => {
    beforeEach(() => {
      match.initializeMatch(playerShips, enemyShips);
    });

    it('should handle both players following match rules', () => {
      // Player hits enemy ship
      const p1 = match.executeShot(7, 7, true);
      expect(p1.canShootAgain).toBe(true);
      
      // Player misses
      const p2 = match.executeShot(0, 0, true);
      expect(p2.turnEnded).toBe(true);
      expect(match.isEnemyTurn()).toBe(true);
      
      // Enemy hits player ship
      const e1 = match.executeShot(0, 0, false);
      expect(e1.canShootAgain).toBe(true);
      
      // Enemy destroys player ship
      const e2 = match.executeShot(1, 0, false);
      expect(e2.shipDestroyed).toBe(true);
      expect(e2.turnEnded).toBe(true);
      expect(match.isPlayerTurn()).toBe(true);
    });
  });
});
