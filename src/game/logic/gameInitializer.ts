import { ShipGenerator } from './shipGenerator';
import type { Ship, ShipVariant } from '@/stores/gameStore';

export interface GameConfig {
  // Configuración del tablero
  boardWidth: number;
  boardHeight: number;
  
  // Configuración de barcos
  shipCounts: {
    small: number;
    medium: number;
    large: number;
    xlarge: number;
  };
  
  // Configuración de turno inicial
  initialTurn: 'player' | 'enemy' | 'random';
  
  // Configuración de generación
  seed?: number;
  allowShipOverlap: boolean;
  minShipDistance: number;
  
  // Configuración de dificultad
  enemyAI: 'random' | 'smart' | 'deterministic';
  
  // Configuración de tiempo
  turnTimeLimit?: number; // en segundos, undefined = sin límite
}

export interface GameSetup {
  playerShips: Ship[];
  enemyShips: Ship[];
  initialTurn: 'PLAYER_TURN' | 'ENEMY_TURN';
  config: GameConfig;
}

export class GameInitializer {
  private shipGenerator: ShipGenerator;
  private config: GameConfig;

  constructor(config: Partial<GameConfig> = {}) {
    this.config = this.getDefaultConfig();
    this.config = { ...this.config, ...config };
    
    this.shipGenerator = new ShipGenerator(
      this.config.boardWidth, 
      this.config.boardHeight
    );
  }

  private getDefaultConfig(): GameConfig {
    return {
      boardWidth: 10,
      boardHeight: 10,
      shipCounts: {
        small: 4,
        medium: 3,
        large: 2,
        xlarge: 1
      },
      initialTurn: 'random',
      allowShipOverlap: false,
      minShipDistance: 1,
      enemyAI: 'random'
    };
  }

  /**
   * Inicializa una nueva partida con la configuración especificada
   */
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

  /**
   * Genera barcos para un jugador específico
   */
  private generateShips(): Ship[] {
    const ships: Ship[] = [];
    const variants: ShipVariant[] = ['small', 'medium', 'large', 'xlarge'];

    variants.forEach(variant => {
      const count = this.config.shipCounts[variant];
      
      for (let i = 0; i < count; i++) {
        const ship = this.generateShip(variant, ships);
        if (ship) {
          ships.push(ship);
        }
      }
    });

    return ships;
  }

  /**
   * Genera un barco individual
   */
  private generateShip(variant: ShipVariant, existingShips: Ship[]): Ship | null {
    const maxAttempts = 100;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const shipSize = this.getShipSize(variant);
      const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      
      let coords: [number, number];
      
      if (orientation === 'horizontal') {
        coords = [
          Math.floor(Math.random() * (this.config.boardWidth - shipSize + 1)),
          Math.floor(Math.random() * this.config.boardHeight)
        ];
      } else {
        coords = [
          Math.floor(Math.random() * this.config.boardWidth),
          Math.floor(Math.random() * (this.config.boardHeight - shipSize + 1))
        ];
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

    console.warn(`No se pudo colocar barco ${variant} después de ${maxAttempts} intentos`);
    return null;
  }

  /**
   * Verifica si la colocación de un barco es válida
   */
  private isValidShipPlacement(newShip: Ship, existingShips: Ship[]): boolean {
    // Verificar que el barco esté dentro del tablero
    if (!this.isShipInBounds(newShip)) {
      return false;
    }

    // Verificar distancia mínima con otros barcos
    for (const existingShip of existingShips) {
      if (!this.isValidDistance(newShip, existingShip)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Verifica si un barco está dentro de los límites del tablero
   */
  private isShipInBounds(ship: Ship): boolean {
    const size = this.getShipSize(ship.variant);
    const [x, y] = ship.coords;

    if (ship.orientation === 'horizontal') {
      return x >= 0 && x + size <= this.config.boardWidth && y >= 0 && y < this.config.boardHeight;
    } else {
      return x >= 0 && x < this.config.boardWidth && y >= 0 && y + size <= this.config.boardHeight;
    }
  }

  /**
   * Verifica la distancia mínima entre dos barcos
   */
  private isValidDistance(ship1: Ship, ship2: Ship): boolean {
    if (this.config.allowShipOverlap) {
      return true;
    }

    const cells1 = this.getShipCells(ship1);
    const cells2 = this.getShipCells(ship2);

    for (const cell1 of cells1) {
      for (const cell2 of cells2) {
        const distance = Math.max(
          Math.abs(cell1[0] - cell2[0]),
          Math.abs(cell1[1] - cell2[1])
        );
        
        if (distance < this.config.minShipDistance) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Obtiene todas las celdas que ocupa un barco
   */
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

  /**
   * Obtiene el tamaño de un barco según su variante
   */
  private getShipSize(variant: ShipVariant): number {
    const sizes = {
      small: 2,
      medium: 3,
      large: 4,
      xlarge: 5
    };
    return sizes[variant];
  }

  /**
   * Determina el turno inicial basado en la configuración
   */
  private determineInitialTurn(): 'PLAYER_TURN' | 'ENEMY_TURN' {
    switch (this.config.initialTurn) {
      case 'player':
        return 'PLAYER_TURN';
      case 'enemy':
        return 'ENEMY_TURN';
      case 'random':
      default:
        return Math.random() < 0.5 ? 'PLAYER_TURN' : 'ENEMY_TURN';
    }
  }

  /**
   * Crea una configuración predefinida para partidas rápidas
   */
  public static createQuickGameConfig(): GameConfig {
    return {
      boardWidth: 8,
      boardHeight: 8,
      shipCounts: {
        small: 2,
        medium: 1,
        large: 0,
        xlarge: 0
      },
      initialTurn: 'random',
      allowShipOverlap: false,
      minShipDistance: 1,
      enemyAI: 'random'
    };
  }

  /**
   * Crea una configuración predefinida para partidas clásicas
   */
  public static createClassicGameConfig(): GameConfig {
    return {
      boardWidth: 10,
      boardHeight: 10,
      shipCounts: {
        small: 4,
        medium: 3,
        large: 2,
        xlarge: 1
      },
      initialTurn: 'random',
      allowShipOverlap: false,
      minShipDistance: 1,
      enemyAI: 'random'
    };
  }

  /**
   * Crea una configuración predefinida para partidas desafiantes
   */
  public static createChallengingGameConfig(): GameConfig {
    return {
      boardWidth: 12,
      boardHeight: 12,
      shipCounts: {
        small: 5,
        medium: 4,
        large: 3,
        xlarge: 2
      },
      initialTurn: 'enemy',
      allowShipOverlap: false,
      minShipDistance: 2,
      enemyAI: 'smart'
    };
  }
} 