import { GAME_CONSTANTS } from "@/constants/game/board";
import { generateShips } from "@/tools/ship/calculations";
import { getShipCellsFromShip } from "@/tools/ship/calculations";

import type { 
  GameShip, 
  Shot, 
  Winner, 
  BattleResult, 
  ShipPlacement,
  ShotRecord,
  GameTurn 
} from "@/types/game/common";
import type { GameConfig } from "@/types/game/config";

/**
 * Simulador de partidas puro - ejecuta partidas completas sin actualizar UI
 */
export class BattleSimulator {
  private config: GameConfig;
  private playerShips: GameShip[];
  private enemyShips: GameShip[];
  private playerShots: Shot[];
  private enemyShots: Shot[];
  private currentTurn: GameTurn;
  private shotHistory: ShotRecord[];
  private turnCount: number;
  private maxTurns: number;

  constructor(config?: Partial<GameConfig>) {
    this.config = {
      boardWidth: config?.boardWidth ?? GAME_CONSTANTS.BOARD.DEFAULT_WIDTH,
      boardHeight: config?.boardHeight ?? GAME_CONSTANTS.BOARD.DEFAULT_HEIGHT,
      shipCounts: config?.shipCounts ?? GAME_CONSTANTS.SHIPS.DEFAULT_COUNTS,
      initialTurn: config?.initialTurn ?? "random",
    };

    this.playerShips = [];
    this.enemyShips = [];
    this.playerShots = [];
    this.enemyShots = [];
    this.shotHistory = [];
    this.turnCount = 0;
    this.maxTurns = GAME_CONSTANTS.GAME_LOGIC.BATTLE.DEFAULT_MAX_TURNS;
    this.currentTurn = this.determineInitialTurn();
  }

  private determineInitialTurn(): GameTurn {
    if (this.config.initialTurn === "player") return "PLAYER_TURN";
    if (this.config.initialTurn === "enemy") return "ENEMY_TURN";
    return Math.random() < 0.5 ? "PLAYER_TURN" : "ENEMY_TURN";
  }

  /**
   * Verifica si un disparo impacta en un barco
   */
  private checkShot(
    x: number, 
    y: number, 
    isPlayerShot: boolean
  ): { hit: boolean; shipId: number } {
    const ships = isPlayerShot ? this.enemyShips : this.playerShips;

    for (let i = 0; i < ships.length; i++) {
      const ship = ships[i];
      const shipCells = getShipCellsFromShip(ship);

      for (const [cellX, cellY] of shipCells) {
        if (cellX === x && cellY === y) {
          return { hit: true, shipId: i };
        }
      }
    }

    return { hit: false, shipId: -1 };
  }

  /**
   * Verifica si ya se disparó en una celda
   */
  private isCellShot(x: number, y: number, isPlayerShot: boolean): boolean {
    const shots = isPlayerShot ? this.playerShots : this.enemyShots;
    return shots.some((shot) => shot.x === x && shot.y === y);
  }

  /**
   * Verifica si un barco está completamente destruido
   */
  private isShipDestroyed(shipId: number, isPlayerShot: boolean): boolean {
    const ships = isPlayerShot ? this.enemyShips : this.playerShips;
    const shots = isPlayerShot ? this.playerShots : this.enemyShots;

    if (shipId >= ships.length) return false;

    const ship = ships[shipId];
    const shipCells = getShipCellsFromShip(ship);
    const hitCells = shots.filter((shot) => shot.hit && shot.shipId === shipId);

    return hitCells.length === shipCells.length;
  }

  /**
   * Verifica si todos los barcos de un jugador están destruidos
   */
  private areAllShipsDestroyed(isPlayerShips: boolean): boolean {
    const ships = isPlayerShips ? this.playerShips : this.enemyShips;
    return ships.every((_, shipId) => 
      this.isShipDestroyed(shipId, !isPlayerShips)
    );
  }

  /**
   * Genera un disparo aleatorio en una celda no disparada
   */
  private generateRandomShot(isPlayerShot: boolean): [number, number] | null {
    const availablePositions: [number, number][] = [];

    for (let x = 0; x < this.config.boardWidth; x++) {
      for (let y = 0; y < this.config.boardHeight; y++) {
        if (!this.isCellShot(x, y, isPlayerShot)) {
          availablePositions.push([x, y]);
        }
      }
    }

    if (availablePositions.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    return availablePositions[randomIndex];
  }

  /**
   * Ejecuta un turno (un disparo)
   */
  private executeTurn(): boolean {
    const isPlayerShot = this.currentTurn === "PLAYER_TURN";
    const shotPosition = this.generateRandomShot(isPlayerShot);

    if (!shotPosition) {
      // No hay más celdas disponibles
      return false;
    }

    const [x, y] = shotPosition;
    const { hit, shipId } = this.checkShot(x, y, isPlayerShot);

    const shot: Shot = { x, y, hit, shipId };

    if (isPlayerShot) {
      this.playerShots.push(shot);
    } else {
      this.enemyShots.push(shot);
    }

    // Registrar en el historial
    this.shotHistory.push({
      x,
      y,
      hit,
      shipId: shipId >= 0 ? `${isPlayerShot ? 'enemy' : 'player'}_${shipId}` : undefined,
      turn: this.currentTurn,
      timestamp: Date.now(),
    });

    // Alternar turno
    this.currentTurn = this.currentTurn === "PLAYER_TURN" ? "ENEMY_TURN" : "PLAYER_TURN";
    this.turnCount++;

    return true;
  }

  /**
   * Verifica si el juego terminó
   */
  private checkGameOver(): Winner {
    if (this.areAllShipsDestroyed(true)) return "enemy";
    if (this.areAllShipsDestroyed(false)) return "player";
    return null;
  }

  /**
   * Genera los datos de colocación de barcos para el resultado
   */
  private generateShipPlacements(): { player: ShipPlacement[]; enemy: ShipPlacement[] } {
    const playerPlacements: ShipPlacement[] = this.playerShips.map(ship => ({
      ship,
      cells: getShipCellsFromShip(ship),
    }));

    const enemyPlacements: ShipPlacement[] = this.enemyShips.map(ship => ({
      ship,
      cells: getShipCellsFromShip(ship),
    }));

    return { player: playerPlacements, enemy: enemyPlacements };
  }

  /**
   * Simula una partida completa
   */
  public simulate(customShips?: { 
    playerShips: GameShip[]; 
    enemyShips: GameShip[] 
  }): BattleResult {
    // Generar o usar barcos personalizados
    if (customShips) {
      this.playerShips = customShips.playerShips;
      this.enemyShips = customShips.enemyShips;
    } else {
      this.playerShips = generateShips(this.config);
      this.enemyShips = generateShips(this.config);
    }

    // Resetear estados
    this.playerShots = [];
    this.enemyShots = [];
    this.shotHistory = [];
    this.turnCount = 0;
    this.currentTurn = this.determineInitialTurn();

    // Ejecutar turnos hasta que termine el juego
    let winner: Winner = null;
    
    while (this.turnCount < this.maxTurns) {
      const canContinue = this.executeTurn();
      
      if (!canContinue) {
        // No hay más celdas disponibles, empate
        break;
      }

      winner = this.checkGameOver();
      if (winner) break;
    }

    // Generar resultado
    const playerHits = this.playerShots.filter(shot => shot.hit).length;
    const enemyHits = this.enemyShots.filter(shot => shot.hit).length;

    return {
      winner,
      totalTurns: this.turnCount,
      playerShots: this.playerShots.length,
      enemyShots: this.enemyShots.length,
      playerHits,
      enemyHits,
      shipPlacements: this.generateShipPlacements(),
      shotHistory: this.shotHistory,
    };
  }

  /**
   * Obtiene el estado actual del simulador
   */
  public getState() {
    return {
      playerShips: this.playerShips,
      enemyShips: this.enemyShips,
      playerShots: this.playerShots,
      enemyShots: this.enemyShots,
      currentTurn: this.currentTurn,
      turnCount: this.turnCount,
    };
  }
}

/**
 * Función helper para simular múltiples partidas y obtener estadísticas
 */
export function simulateMultipleGames(
  numberOfGames: number,
  config?: Partial<GameConfig>
): {
  results: BattleResult[];
  stats: {
    playerWins: number;
    enemyWins: number;
    draws: number;
    avgTurns: number;
    avgPlayerHits: number;
    avgEnemyHits: number;
    avgPlayerAccuracy: number;
    avgEnemyAccuracy: number;
  };
} {
  const results: BattleResult[] = [];
  const simulator = new BattleSimulator(config);

  for (let i = 0; i < numberOfGames; i++) {
    results.push(simulator.simulate());
  }

  // Calcular estadísticas
  const playerWins = results.filter(r => r.winner === "player").length;
  const enemyWins = results.filter(r => r.winner === "enemy").length;
  const draws = results.filter(r => r.winner === null).length;
  
  const totalTurns = results.reduce((sum, r) => sum + r.totalTurns, 0);
  const totalPlayerHits = results.reduce((sum, r) => sum + r.playerHits, 0);
  const totalEnemyHits = results.reduce((sum, r) => sum + r.enemyHits, 0);
  const totalPlayerShots = results.reduce((sum, r) => sum + r.playerShots, 0);
  const totalEnemyShots = results.reduce((sum, r) => sum + r.enemyShots, 0);

  return {
    results,
    stats: {
      playerWins,
      enemyWins,
      draws,
      avgTurns: totalTurns / numberOfGames,
      avgPlayerHits: totalPlayerHits / numberOfGames,
      avgEnemyHits: totalEnemyHits / numberOfGames,
      avgPlayerAccuracy: totalPlayerShots > 0 ? (totalPlayerHits / totalPlayerShots) * 100 : 0,
      avgEnemyAccuracy: totalEnemyShots > 0 ? (totalEnemyHits / totalEnemyShots) * 100 : 0,
    },
  };
}

/**
 * Función simple para simular una partida con configuración por defecto
 */
export function simulateSingleGame(config?: Partial<GameConfig>): BattleResult {
  const simulator = new BattleSimulator(config);
  return simulator.simulate();
}
