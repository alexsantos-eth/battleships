import type { Ship, ShipVariant } from '@/stores/game';
import { GAME_CONSTANTS, GAME_CONFIGS } from '@/constants/game';

export interface GameConfig {
  boardWidth: number;
  boardHeight: number;
  
  shipCounts: {
    small: number;
    medium: number;
    large: number;
    xlarge: number;
  };
  
  initialTurn: 'player' | 'enemy' | 'random';
  
  seed?: number;
  allowShipOverlap: boolean;
  minShipDistance: number;
  
  enemyAI: 'random' | 'smart' | 'deterministic' | 'basic';
  
  turnTimeLimit?: number;
}

export interface GameSetup {
  playerShips: Ship[];
  enemyShips: Ship[];
  initialTurn: 'PLAYER_TURN' | 'ENEMY_TURN';
  config: GameConfig;
}

export class GameInitializer {
  private config: GameConfig;

  constructor(config: Partial<GameConfig> = {}) {
    this.config = { ...this.getDefaultConfig(), ...config };
    this.validateConfig();
  }

  private validateConfig(): void {
    const { boardWidth, boardHeight, shipCounts, minShipDistance } = this.config;
    
    if (boardWidth < GAME_CONSTANTS.BOARD.MIN_SIZE || boardWidth > GAME_CONSTANTS.BOARD.MAX_SIZE) {
      throw new Error(`Board width must be between ${GAME_CONSTANTS.BOARD.MIN_SIZE} and ${GAME_CONSTANTS.BOARD.MAX_SIZE}`);
    }
    
    if (boardHeight < GAME_CONSTANTS.BOARD.MIN_SIZE || boardHeight > GAME_CONSTANTS.BOARD.MAX_SIZE) {
      throw new Error(`Board height must be between ${GAME_CONSTANTS.BOARD.MIN_SIZE} and ${GAME_CONSTANTS.BOARD.MAX_SIZE}`);
    }
    
    if (minShipDistance < 0) {
      throw new Error('Minimum ship distance cannot be negative');
    }
    
    const totalShips = Object.values(shipCounts).reduce((sum, count) => sum + count, 0);
    const maxPossibleShips = Math.floor((boardWidth * boardHeight) / 4);
    
    if (totalShips > maxPossibleShips) {
      throw new Error(`Too many ships for board size. Maximum possible: ${maxPossibleShips}`);
    }
  }

  private getDefaultConfig(): GameConfig {
    return {
      boardWidth: GAME_CONSTANTS.BOARD.DEFAULT_WIDTH,
      boardHeight: GAME_CONSTANTS.BOARD.DEFAULT_HEIGHT,
      shipCounts: GAME_CONSTANTS.SHIPS.DEFAULT_COUNTS,
      initialTurn: 'random',
      allowShipOverlap: false,
      minShipDistance: GAME_CONSTANTS.SHIPS.MIN_DISTANCE,
      enemyAI: 'random'
    };
  }

  public initializeGame(): GameSetup {
    const playerShips = this.generateShips();
    const enemyShips = this.generateShips();
    const initialTurn = this.determineInitialTurn();

    return {
      playerShips,
      enemyShips,
      initialTurn,
      config: this.config
    };
  }

  private generateShips(): Ship[] {
    const ships: Ship[] = [];
    const shipVariants: ShipVariant[] = ['small', 'medium', 'large', 'xlarge'];

    for (const variant of shipVariants) {
      const count = this.config.shipCounts[variant];
      for (let i = 0; i < count; i++) {
        const ship = this.generateShip(variant, ships);
        if (ship) {
          ships.push(ship);
        } else {
          console.warn(`Failed to place ${variant} ship ${i + 1}/${count}. Board may be too crowded.`);
        }
      }
    }

    return ships;
  }

  private generateShip(variant: ShipVariant, existingShips: Ship[]): Ship | null {
    const maxAttempts = GAME_CONSTANTS.SHIPS.MAX_PLACEMENT_ATTEMPTS;
    const shipSize = this.getShipSize(variant);
    
    const quadrantPreferences = this.getQuadrantPreferences(variant);
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const orientation = Math.random() < GAME_CONSTANTS.GAME_LOGIC.SHIP_GENERATION.ORIENTATION_RANDOM_THRESHOLD ? 'horizontal' : 'vertical';
      let coords: [number, number];
      
      if (Math.random() < 0.7 && existingShips.length > 0) {
        coords = this.generatePositionInPreferredQuadrant(shipSize, orientation, quadrantPreferences);
      } else {
        coords = this.generateRandomPosition(shipSize, orientation);
      }
      
      const ship: Ship = {
        coords,
        variant,
        orientation
      };

      if (this.isValidShipPlacement(ship, existingShips)) {
        return ship;
      }
    }

    return null;
  }

  private getQuadrantPreferences(variant: ShipVariant): number[][] {
    const preferences = {
      small: [[0, 1], [2, 3]],
      medium: [[1, 2], [0, 3]],
      large: [[0, 2], [1, 3]],
      xlarge: [[0, 1, 2, 3]]
    };
    return preferences[variant];
  }

  private generatePositionInPreferredQuadrant(
    shipSize: number, 
    orientation: 'horizontal' | 'vertical',
    quadrantPreferences: number[][]
  ): [number, number] {
    const targetQuadrant = quadrantPreferences[Math.floor(Math.random() * quadrantPreferences.length)];
    const quadrant = targetQuadrant[Math.floor(Math.random() * targetQuadrant.length)];
    
    const quadrantSize = Math.max(this.config.boardWidth, this.config.boardHeight) / GAME_CONSTANTS.GAME_LOGIC.SHIP_GENERATION.QUADRANT_SIZE_DIVISOR;
    const xMin = (quadrant % 2) * quadrantSize;
    const yMin = Math.floor(quadrant / 2) * quadrantSize;
    const xMax = xMin + quadrantSize - 1;
    const yMax = yMin + quadrantSize - 1;
    
    let x: number, y: number;
    
    if (orientation === 'horizontal') {
      x = Math.floor(Math.random() * (Math.min(xMax, this.config.boardWidth - shipSize) - xMin + 1)) + xMin;
      y = Math.floor(Math.random() * (yMax - yMin + 1)) + yMin;
    } else {
      x = Math.floor(Math.random() * (xMax - xMin + 1)) + xMin;
      y = Math.floor(Math.random() * (Math.min(yMax, this.config.boardHeight - shipSize) - yMin + 1)) + yMin;
    }
    
    return [x, y];
  }

  private generateRandomPosition(shipSize: number, orientation: 'horizontal' | 'vertical'): [number, number] {
    let x: number, y: number;
    
    if (orientation === 'horizontal') {
      x = Math.floor(Math.random() * (this.config.boardWidth - shipSize + 1));
      y = Math.floor(Math.random() * this.config.boardHeight);
    } else {
      x = Math.floor(Math.random() * this.config.boardWidth);
      y = Math.floor(Math.random() * (this.config.boardHeight - shipSize + 1));
    }
    
    return [x, y];
  }

  private isValidShipPlacement(newShip: Ship, existingShips: Ship[]): boolean {
    if (!this.isShipInBounds(newShip)) {
      return false;
    }

    for (const existingShip of existingShips) {
      if (!this.isValidDistance(newShip, existingShip)) {
        return false;
      }
    }

    return true;
  }

  private isShipInBounds(ship: Ship): boolean {
    const size = this.getShipSize(ship.variant);
    const [x, y] = ship.coords;

    if (ship.orientation === 'horizontal') {
      return x >= 0 && x + size <= this.config.boardWidth && y >= 0 && y < this.config.boardHeight;
    } else {
      return x >= 0 && x < this.config.boardWidth && y >= 0 && y + size <= this.config.boardHeight;
    }
  }

  private isValidDistance(ship1: Ship, ship2: Ship): boolean {
    const cells1 = this.getShipCells(ship1);
    const cells2 = this.getShipCells(ship2);

    for (const [x1, y1] of cells1) {
      for (const [x2, y2] of cells2) {
        const distance = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
        
        if (distance < this.config.minShipDistance) {
          return false;
        }
      }
    }

    return true;
  }

  private getShipCells(ship: Ship): [number, number][] {
    const cells: [number, number][] = [];
    const size = this.getShipSize(ship.variant);
    const [x, y] = ship.coords;

    for (let i = 0; i < size; i++) {
      if (ship.orientation === 'horizontal') {
        cells.push([x + i, y]);
      } else {
        cells.push([x, y + i]);
      }
    }

    return cells;
  }

  private getShipSize(variant: ShipVariant): number {
    return GAME_CONSTANTS.SHIPS.SIZES[variant];
  }

  private determineInitialTurn(): 'PLAYER_TURN' | 'ENEMY_TURN' {
    switch (this.config.initialTurn) {
      case 'player':
        return 'PLAYER_TURN';
      case 'enemy':
        return 'ENEMY_TURN';
      case 'random':
      default:
        return Math.random() < GAME_CONSTANTS.GAME_LOGIC.BATTLE.RANDOM_TURN_THRESHOLD ? 'PLAYER_TURN' : 'ENEMY_TURN';
    }
  }

  public static createQuickGameConfig(): GameConfig {
    return {
      ...GAME_CONFIGS.QUICK,
      initialTurn: 'player',
      enemyAI: 'basic'
    };
  }

  public static createClassicGameConfig(): GameConfig {
    return {
      ...GAME_CONFIGS.CLASSIC,
      initialTurn: 'player',
      enemyAI: 'basic'
    };
  }

  public static createChallengingGameConfig(): GameConfig {
    return {
      ...GAME_CONFIGS.CHALLENGING,
      initialTurn: 'player',
      enemyAI: 'basic'
    };
  }
} 