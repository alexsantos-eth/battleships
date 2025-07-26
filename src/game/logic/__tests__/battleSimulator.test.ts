import { BattleSimulator } from '../battleSimulator';
import type { BattleConfig, BattleInstruction } from '../battleSimulator';

describe('BattleSimulator', () => {
  const createTestConfig = (seed: number = 12345): BattleConfig => ({
    seed,
    boardWidth: 10,
    boardHeight: 10
  });

  describe('Deterministic Behavior', () => {
    it('should produce identical results with the same seed', () => {
      const config1 = createTestConfig(12345);
      const config2 = createTestConfig(12345);
      
      const simulator1 = new BattleSimulator(config1);
      const simulator2 = new BattleSimulator(config2);
      
      // Solo ejecutar unos pocos turnos para evitar problemas de memoria
      const result1 = simulator1.simulateRandomBattle(5);
      const result2 = simulator2.simulateRandomBattle(5);
      
      expect(result1.totalTurns).toBe(result2.totalTurns);
      expect(result1.playerShots).toBe(result2.playerShots);
      expect(result1.enemyShots).toBe(result2.enemyShots);
    });

    it('should produce different results with different seeds', () => {
      const config1 = createTestConfig(12345);
      const config2 = createTestConfig(67890);
      
      const simulator1 = new BattleSimulator(config1);
      const simulator2 = new BattleSimulator(config2);
      
      // Solo ejecutar unos pocos turnos para evitar problemas de memoria
      const result1 = simulator1.simulateRandomBattle(5);
      const result2 = simulator2.simulateRandomBattle(5);
      
      // Verificar que al menos las posiciones de los barcos son diferentes
      const playerShips1 = result1.shipPlacements.player;
      const playerShips2 = result2.shipPlacements.player;
      
      const isDifferent = playerShips1.some((ship1, index) => {
        const ship2 = playerShips2[index];
        return ship1.position.x !== ship2.position.x || ship1.position.y !== ship2.position.y;
      });
      
      expect(isDifferent).toBe(true);
    });
  });

  describe('Ship Placement', () => {
    it('should place ships deterministically', () => {
      const config = createTestConfig(12345);
      const simulator = new BattleSimulator(config);
      
      const result = simulator.simulateRandomBattle(0); // Sin disparos
      
      expect(result.shipPlacements.player).toHaveLength(10);
      expect(result.shipPlacements.enemy).toHaveLength(10);
      
      // Verificar que los barcos están en posiciones válidas
      result.shipPlacements.player.forEach(ship => {
        expect(ship.position.x).toBeGreaterThanOrEqual(0);
        expect(ship.position.x).toBeLessThan(10);
        expect(ship.position.y).toBeGreaterThanOrEqual(0);
        expect(ship.position.y).toBeLessThan(10);
      });
    });

    it('should accept custom ship placements', () => {
      const config: BattleConfig = {
        seed: 12345,
        boardWidth: 10,
        boardHeight: 10,
        playerShips: [
          {
            position: { x: 0, y: 0 },
            variant: 'small',
            orientation: 'horizontal'
          }
        ],
        enemyShips: [
          {
            position: { x: 5, y: 5 },
            variant: 'small',
            orientation: 'vertical'
          }
        ]
      };
      
      const simulator = new BattleSimulator(config);
      const result = simulator.simulateRandomBattle(0);
      
      expect(result.shipPlacements.player).toHaveLength(1);
      expect(result.shipPlacements.enemy).toHaveLength(1);
      expect(result.shipPlacements.player[0].position).toEqual({ x: 0, y: 0 });
      expect(result.shipPlacements.enemy[0].position).toEqual({ x: 5, y: 5 });
    });
  });

  describe('Battle Simulation', () => {
    it('should simulate a complete battle', () => {
      const config = createTestConfig(12345);
      const simulator = new BattleSimulator(config);
      
      const result = simulator.simulateRandomBattle(10);
      
      expect(result.totalTurns).toBeGreaterThan(0);
      expect(result.playerShots + result.enemyShots).toBe(result.totalTurns);
      expect(result.shotHistory).toHaveLength(result.totalTurns);
    });

    it('should respect max turns limit', () => {
      const config = createTestConfig(12345);
      const simulator = new BattleSimulator(config);
      
      const maxTurns = 10;
      const result = simulator.simulateRandomBattle(maxTurns);
      
      expect(result.totalTurns).toBeLessThanOrEqual(maxTurns);
    });

    it('should track shot history correctly', () => {
      const config = createTestConfig(12345);
      const simulator = new BattleSimulator(config);
      
      const result = simulator.simulateRandomBattle(5);
      
      result.shotHistory.forEach((shot) => {
        expect(shot.position.x).toBeGreaterThanOrEqual(0);
        expect(shot.position.x).toBeLessThan(10);
        expect(shot.position.y).toBeGreaterThanOrEqual(0);
        expect(shot.position.y).toBeLessThan(10);
        expect(typeof shot.hit).toBe('boolean');
        expect(shot.turn).toMatch(/^(PLAYER_TURN|ENEMY_TURN)$/);
      });
    });
  });

  describe('Instruction Execution', () => {
    it('should execute place_ship instructions', () => {
      const config = createTestConfig(12345);
      const simulator = new BattleSimulator(config);
      
      const instructions: BattleInstruction[] = [
        {
          type: 'place_ship',
          data: {
            player: 'player',
            position: { x: 0, y: 0 },
            variant: 'small',
            orientation: 'horizontal'
          }
        }
      ];
      
      const result = simulator.executeInstructions(instructions);
      
      expect(result.shipPlacements.player).toContainEqual({
        position: { x: 0, y: 0 },
        variant: 'small',
        orientation: 'horizontal'
      });
    });

    it('should execute fire_shot instructions', () => {
      const config = createTestConfig(12345);
      const simulator = new BattleSimulator(config);
      
      const instructions: BattleInstruction[] = [
        {
          type: 'fire_shot',
          data: {
            position: { x: 0, y: 0 }
          }
        }
      ];
      
      const result = simulator.executeInstructions(instructions);
      
      expect(result.totalTurns).toBe(1);
      expect(result.shotHistory).toHaveLength(1);
      expect(result.shotHistory[0].position).toEqual({ x: 0, y: 0 });
    });

    it('should execute multiple instructions in order', () => {
      const config = createTestConfig(12345);
      const simulator = new BattleSimulator(config);
      
      const instructions: BattleInstruction[] = [
        {
          type: 'fire_shot',
          data: { position: { x: 0, y: 0 } }
        },
        {
          type: 'fire_shot',
          data: { position: { x: 1, y: 1 } }
        },
        {
          type: 'fire_shot',
          data: { position: { x: 2, y: 2 } }
        }
      ];
      
      const result = simulator.executeInstructions(instructions);
      
      expect(result.totalTurns).toBe(3);
      expect(result.shotHistory).toHaveLength(3);
      expect(result.shotHistory[0].position).toEqual({ x: 0, y: 0 });
      expect(result.shotHistory[1].position).toEqual({ x: 1, y: 1 });
      expect(result.shotHistory[2].position).toEqual({ x: 2, y: 2 });
    });
  });

  describe('Game State', () => {
    it('should provide current game state', () => {
      const config = createTestConfig(12345);
      const simulator = new BattleSimulator(config);
      
      const state = simulator.getCurrentGameState();
      
      expect(state.currentTurn).toMatch(/^(PLAYER_TURN|ENEMY_TURN)$/);
      expect(typeof state.isGameOver).toBe('boolean');
      expect(state.winner === 'player' || state.winner === 'enemy' || state.winner === null).toBe(true);
      expect(state.playerShipsRemaining).toBeGreaterThanOrEqual(0);
      expect(state.enemyShipsRemaining).toBeGreaterThanOrEqual(0);
    });

    it('should track remaining ships correctly', () => {
      const config = createTestConfig(12345);
      const simulator = new BattleSimulator(config);
      
      const initialState = simulator.getCurrentGameState();
      expect(initialState.playerShipsRemaining).toBe(10);
      expect(initialState.enemyShipsRemaining).toBe(10);
      
      // Simular algunos disparos
      simulator.simulateRandomBattle(5);
      const finalState = simulator.getCurrentGameState();
      
      expect(finalState.playerShipsRemaining).toBeLessThanOrEqual(10);
      expect(finalState.enemyShipsRemaining).toBeLessThanOrEqual(10);
    });
  });
}); 