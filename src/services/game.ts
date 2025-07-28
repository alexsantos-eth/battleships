import type { GameConfig, GameState, Ship, Shot, ShipVariant, ShipOrientation } from '@/types/game';
import { GAME_CONSTANTS, SHIP_VARIANTS_CONFIG } from '@/constants/game';

export class GameService {
  private static instance: GameService;

  static getInstance(): GameService {
    if (!GameService.instance) {
      GameService.instance = new GameService();
    }
    return GameService.instance;
  }

  async initializeGame(config: GameConfig): Promise<GameState> {
    try {
      const playerShips = this.generateShips(config);
      const enemyShips = this.generateShips(config);
      
      return {
        currentTurn: 'PLAYER_TURN',
        playerShips,
        enemyShips,
        playerShots: [],
        enemyShots: [],
        isGameOver: false,
        winner: null,
        boardWidth: config.boardWidth,
        boardHeight: config.boardHeight,
      };
    } catch (error) {
      throw new Error(`Failed to initialize game: ${error}`);
    }
  }

  private generateShips(config: GameConfig): Ship[] {
    const ships: Ship[] = [];
    const shipTypes: ShipVariant[] = ['small', 'medium', 'large', 'xlarge'];

    for (const shipType of shipTypes) {
      const count = config.shipCounts[shipType];
      for (let i = 0; i < count; i++) {
        const ship = this.generateShip(shipType, config.boardWidth, config.boardHeight, ships);
        if (ship) {
          ships.push(ship);
        }
      }
    }

    return ships;
  }

  private generateShip(
    variant: ShipVariant,
    boardWidth: number,
    boardHeight: number,
    existingShips: Ship[]
  ): Ship | null {
    const size = GAME_CONSTANTS.SHIPS.SIZES[variant];
    const maxAttempts = GAME_CONSTANTS.SHIPS.MAX_PLACEMENT_ATTEMPTS;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const orientation: ShipOrientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      const maxX = orientation === 'horizontal' ? boardWidth - size : boardWidth - 1;
      const maxY = orientation === 'vertical' ? boardHeight - size : boardHeight - 1;

      if (maxX < 0 || maxY < 0) continue;

      const x = Math.floor(Math.random() * (maxX + 1));
      const y = Math.floor(Math.random() * (maxY + 1));

      const ship: Ship = {
        id: `${variant}-${Date.now()}-${Math.random()}`,
        coords: [x, y],
        variant,
        orientation,
        health: SHIP_VARIANTS_CONFIG[variant].health,
      };

      if (this.isValidShipPlacement(ship, existingShips, boardWidth, boardHeight)) {
        return ship;
      }
    }

    return null;
  }

  private isValidShipPlacement(
    ship: Ship,
    existingShips: Ship[],
    boardWidth: number,
    boardHeight: number
  ): boolean {
    const shipCells = this.getShipCells(ship);
    
    for (const [x, y] of shipCells) {
      if (x < 0 || x >= boardWidth || y < 0 || y >= boardHeight) {
        return false;
      }
    }

    for (const existingShip of existingShips) {
      const existingCells = this.getShipCells(existingShip);
      
      for (const [shipX, shipY] of shipCells) {
        for (const [existingX, existingY] of existingCells) {
          const distance = Math.max(Math.abs(shipX - existingX), Math.abs(shipY - existingY));
          if (distance < GAME_CONSTANTS.SHIPS.MIN_DISTANCE) {
            return false;
          }
        }
      }
    }

    return true;
  }

  private getShipCells(ship: Ship): [number, number][] {
    const cells: [number, number][] = [];
    const size = GAME_CONSTANTS.SHIPS.SIZES[ship.variant];
    const [startX, startY] = ship.coords;

    if (ship.orientation === 'horizontal') {
      for (let i = 0; i < size; i++) {
        cells.push([startX + i, startY]);
      }
    } else {
      for (let i = 0; i < size; i++) {
        cells.push([startX, startY + i]);
      }
    }

    return cells;
  }

  checkShot(x: number, y: number, ships: Ship[]): { hit: boolean; shipId?: string } {
    for (const ship of ships) {
      const shipCells = this.getShipCells(ship);
      
      for (const [shipX, shipY] of shipCells) {
        if (shipX === x && shipY === y) {
          return { hit: true, shipId: ship.id };
        }
      }
    }

    return { hit: false };
  }

  isShipDestroyed(shipId: string, shots: Shot[]): boolean {
    const shipShots = shots.filter(shot => shot.shipId === shipId);
    const hitShots = shipShots.filter(shot => shot.hit);
    
    const ship = this.findShipById(shipId);
    if (!ship) return false;

    const shipSize = GAME_CONSTANTS.SHIPS.SIZES[ship.variant];
    return hitShots.length >= shipSize;
  }

  private findShipById(_shipId: string): Ship | undefined {
    // TODO: Implement ship finding logic
    // This method would need access to all ships to find by ID
    return undefined;
  }

  checkGameOver(playerShips: Ship[], enemyShips: Ship[], playerShots: Shot[], enemyShots: Shot[]): {
    isGameOver: boolean;
    winner: 'player' | 'enemy' | null;
  } {
    const allPlayerShipsDestroyed = playerShips.every(ship => 
      this.isShipDestroyed(ship.id, enemyShots)
    );

    const allEnemyShipsDestroyed = enemyShips.every(ship => 
      this.isShipDestroyed(ship.id, playerShots)
    );

    if (allPlayerShipsDestroyed) {
      return { isGameOver: true, winner: 'enemy' };
    }

    if (allEnemyShipsDestroyed) {
      return { isGameOver: true, winner: 'player' };
    }

    return { isGameOver: false, winner: null };
  }

  createShot(x: number, y: number, hit: boolean, shipId?: string): Shot {
    return {
      id: `shot-${Date.now()}-${Math.random()}`,
      x,
      y,
      hit,
      shipId,
      timestamp: Date.now(),
    };
  }
}

export const gameService = GameService.getInstance(); 