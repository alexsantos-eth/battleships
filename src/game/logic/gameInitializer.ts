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
        small: 1,
        medium: 2,
        large: 1,
        xlarge: 1
      },
      initialTurn: 'random',
      allowShipOverlap: false,
      minShipDistance: 2,
      enemyAI: 'random'
    };
  }

  /**
   * Inicializa una nueva partida con la configuración especificada
   */
  public initializeGame(): GameSetup {
    console.log('🚢 Inicializando partida con configuración:', this.config);
    
    const playerShips = this.generateShips();
    const enemyShips = this.generateShips();
    const initialTurn = this.determineInitialTurn();

    console.log('✅ Barcos del jugador generados:', playerShips.length);
    console.log('✅ Barcos del enemigo generados:', enemyShips.length);
    console.log('🎯 Turno inicial:', initialTurn);

    return {
      playerShips,
      enemyShips,
      initialTurn,
      config: this.config
    };
  }

  /**
   * Genera todos los barcos para un jugador
   */
  private generateShips(): Ship[] {
    const ships: Ship[] = [];
    
    console.log('🎲 Generando barcos para tablero', this.config.boardWidth, 'x', this.config.boardHeight);

    for (const [variant, count] of Object.entries(this.config.shipCounts)) {
      for (let i = 0; i < count; i++) {
        const ship = this.generateShip(variant as ShipVariant, ships);
        if (ship) {
          ships.push(ship);
          console.log(`✅ Barco ${variant} ${i + 1}/${count} colocado en [${ship.coords[0]}, ${ship.coords[1]}] ${ship.orientation}`);
        } else {
          console.error(`❌ No se pudo colocar barco ${variant} ${i + 1}/${count}`);
        }
      }
    }

    console.log('🎯 Total de barcos generados:', ships.length);
    return ships;
  }

  /**
   * Genera un barco individual con estrategias de posicionamiento inteligente
   */
  private generateShip(variant: ShipVariant, existingShips: Ship[]): Ship | null {
    const maxAttempts = 200;
    const shipSize = this.getShipSize(variant);
    
    // Estrategias de posicionamiento por tipo de barco
    const quadrantPreferences = this.getQuadrantPreferences(variant);
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      let coords: [number, number];
      
      // 70% de probabilidad de usar estrategia de cuadrantes si hay barcos existentes
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

    // Fallback: intentar posiciones aleatorias sin restricciones de cuadrantes
    for (let attempt = 0; attempt < 50; attempt++) {
      const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      const coords = this.generateRandomPosition(shipSize, orientation);
      
      const ship: Ship = {
        coords,
        variant,
        orientation
      };

      if (this.isValidShipPlacement(ship, existingShips)) {
        return ship;
      }
    }

    console.warn(`No se pudo colocar barco ${variant} después de ${maxAttempts + 50} intentos`);
    return null;
  }

  /**
   * Verifica si la colocación de un barco es válida
   */
  private isValidShipPlacement(newShip: Ship, existingShips: Ship[]): boolean {
    // Verificar que el barco esté dentro del tablero
    if (!this.isShipInBounds(newShip)) {
      console.log(`❌ Barco ${newShip.variant} fuera de límites en [${newShip.coords[0]}, ${newShip.coords[1]}]`);
      return false;
    }

    // Verificar distancia mínima con otros barcos
    for (const existingShip of existingShips) {
      if (!this.isValidDistance(newShip, existingShip)) {
        console.log(`❌ Barco ${newShip.variant} muy cerca de ${existingShip.variant} en [${existingShip.coords[0]}, ${existingShip.coords[1]}]`);
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

    // Verificar superposición directa
    for (const cell1 of cells1) {
      for (const cell2 of cells2) {
        if (cell1[0] === cell2[0] && cell1[1] === cell2[1]) {
          return false; // Superposición directa
        }
      }
    }

    // Verificar distancia mínima entre cualquier celda de ambos barcos
    for (const cell1 of cells1) {
      for (const cell2 of cells2) {
        const distance = Math.max(
          Math.abs(cell1[0] - cell2[0]),
          Math.abs(cell1[1] - cell2[1])
        );
        
        // La distancia debe ser al menos minShipDistance
        // Si minShipDistance = 2, los barcos deben estar separados por al menos 1 celda
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
   * Obtiene las preferencias de cuadrantes según el tipo de barco
   */
  private getQuadrantPreferences(variant: ShipVariant): number[][] {
    const preferences = {
      small: [[0, 1], [2, 3], [1, 2], [0, 3]],
      medium: [[1, 0], [2, 1], [3, 2], [0, 1]],
      large: [[0, 2], [1, 3], [2, 0], [3, 1]],
      xlarge: [[0, 0], [1, 1], [2, 2], [3, 3]]
    };
    return preferences[variant] || [[0, 1, 2, 3]];
  }

  /**
   * Genera una posición en un cuadrante preferido
   */
  private generatePositionInPreferredQuadrant(
    shipSize: number, 
    orientation: 'horizontal' | 'vertical',
    quadrantPreferences: number[][]
  ): [number, number] {
    const targetQuadrant = quadrantPreferences[Math.floor(Math.random() * quadrantPreferences.length)];
    const quadrant = targetQuadrant[Math.floor(Math.random() * targetQuadrant.length)];
    
    const quadrantSize = Math.max(this.config.boardWidth, this.config.boardHeight) / 2;
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

  /**
   * Genera una posición aleatoria en todo el tablero
   */
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
      minShipDistance: 2,
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
        small: 1,
        medium: 2,
        large: 1,
        xlarge: 1
      },
      initialTurn: 'random',
      allowShipOverlap: false,
      minShipDistance: 2,
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