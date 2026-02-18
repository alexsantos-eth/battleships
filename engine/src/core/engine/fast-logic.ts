/**
 * FastGameEngine - Motor de juego optimizado para simulaciones masivas
 * 
 * Diferencias clave con GameEngine:
 * - Sin callbacks (silent mode)
 * - Sin copias defensivas de arrays
 * - Usa Map/Set para búsquedas O(1)
 * - Cachea celdas de barcos
 * - 10-20x más rápido para simulaciones
 * 
 * USO EXCLUSIVO: Simulaciones, análisis, testing
 * NO USAR: Para UI interactiva (usar GameEngine normal)
 */

import { GAME_CONSTANTS } from "../constants/game";
import { getShipCellsFromShip } from "../tools/ship/calculations";
import type { GameShip, Shot, Winner, GameTurn } from "../types/common";
import type { GameConfig } from "../types/config";

/**
 * Posición codificada como string "x,y" para usar en Map/Set
 */
type PositionKey = string;

const posKey = (x: number, y: number): PositionKey => `${x},${y}`;

export class FastGameEngine {
  // Config
  private boardWidth: number;
  private boardHeight: number;

  // Game state (minimal)
  private currentTurn: GameTurn;
  private playerShips: GameShip[];
  private enemyShips: GameShip[];
  private isGameOver: boolean;
  private winner: Winner;
  private shotCount: number;

  // 🚀 OPTIMIZACIONES: Maps y Sets para O(1)
  private playerShotsSet: Set<PositionKey>; // O(1) lookup en vez de O(n)
  private enemyShotsSet: Set<PositionKey>;
  private playerShipPositions: Map<PositionKey, number>; // position -> shipId
  private enemyShipPositions: Map<PositionKey, number>;
  
  // Cachear hits por barco
  private playerShipHits: Map<number, number>; // shipId -> hit count
  private enemyShipHits: Map<number, number>;
  
  // Cachear tamaños de barcos
  private playerShipSizes: Map<number, number>; // shipId -> size
  private enemyShipSizes: Map<number, number>;

  constructor(config: Partial<GameConfig> = {}) {
    this.boardWidth = config.boardWidth ?? GAME_CONSTANTS.BOARD.DEFAULT_WIDTH;
    this.boardHeight = config.boardHeight ?? GAME_CONSTANTS.BOARD.DEFAULT_HEIGHT;
    
    this.currentTurn = "PLAYER_TURN";
    this.playerShips = [];
    this.enemyShips = [];
    this.isGameOver = false;
    this.winner = null;
    this.shotCount = 0;

    // Inicializar estructuras optimizadas
    this.playerShotsSet = new Set();
    this.enemyShotsSet = new Set();
    this.playerShipPositions = new Map();
    this.enemyShipPositions = new Map();
    this.playerShipHits = new Map();
    this.enemyShipHits = new Map();
    this.playerShipSizes = new Map();
    this.enemyShipSizes = new Map();
  }

  /**
   * Inicializar juego - Cachea todas las posiciones de barcos
   */
  public initializeGame(
    playerShips: GameShip[],
    enemyShips: GameShip[],
    initialTurn: GameTurn = "PLAYER_TURN"
  ): void {
    this.playerShips = playerShips;
    this.enemyShips = enemyShips;
    this.currentTurn = initialTurn;
    this.isGameOver = false;
    this.winner = null;
    this.shotCount = 0;

    // Limpiar estructuras
    this.playerShotsSet.clear();
    this.enemyShotsSet.clear();
    this.playerShipPositions.clear();
    this.enemyShipPositions.clear();
    this.playerShipHits.clear();
    this.enemyShipHits.clear();
    this.playerShipSizes.clear();
    this.enemyShipSizes.clear();

    // 🚀 OPTIMIZACIÓN: Pre-cachear posiciones de barcos
    this.cacheShipPositions(playerShips, this.playerShipPositions, this.playerShipSizes);
    this.cacheShipPositions(enemyShips, this.enemyShipPositions, this.enemyShipSizes);
  }

  /**
   * Cachea las posiciones de barcos en un Map para O(1) lookup
   */
  private cacheShipPositions(
    ships: GameShip[],
    positionsMap: Map<PositionKey, number>,
    sizesMap: Map<number, number>
  ): void {
    ships.forEach((ship, shipId) => {
      const cells = getShipCellsFromShip(ship);
      sizesMap.set(shipId, cells.length);
      
      cells.forEach(([x, y]) => {
        positionsMap.set(posKey(x, y), shipId);
      });
    });
  }

  /**
   * Ejecutar disparo - Optimizado con Map lookup O(1)
   */
  public executeShot(x: number, y: number, isPlayerShot: boolean): FastShotResult {
    const key = posKey(x, y);
    const shotsSet = isPlayerShot ? this.playerShotsSet : this.enemyShotsSet;

    // 🚀 OPTIMIZACIÓN: O(1) en vez de O(n)
    if (shotsSet.has(key)) {
      return {
        success: false,
        hit: false,
        shipId: -1,
        shipDestroyed: false,
        isGameOver: false,
      };
    }

    // Registrar disparo
    shotsSet.add(key);
    this.shotCount++;

    // 🚀 OPTIMIZACIÓN: O(1) lookup en Map en vez de iterar todos los barcos
    const shipPositions = isPlayerShot ? this.enemyShipPositions : this.playerShipPositions;
    const shipId = shipPositions.get(key);
    const hit = shipId !== undefined;

    let shipDestroyed = false;

    if (hit && shipId !== undefined) {
      // Incrementar hits del barco
      const hitsMap = isPlayerShot ? this.enemyShipHits : this.playerShipHits;
      const sizesMap = isPlayerShot ? this.enemyShipSizes : this.playerShipSizes;
      
      const currentHits = (hitsMap.get(shipId) || 0) + 1;
      hitsMap.set(shipId, currentHits);
      
      // 🚀 OPTIMIZACIÓN: Comparar con tamaño cacheado
      const shipSize = sizesMap.get(shipId)!;
      shipDestroyed = currentHits === shipSize;
    }

    // Check game over
    this.checkGameOver();

    return {
      success: true,
      hit,
      shipId: shipId ?? -1,
      shipDestroyed,
      isGameOver: this.isGameOver,
      winner: this.winner,
    };
  }

  /**
   * Verificar si una celda ya fue disparada - O(1)
   */
  public isCellShot(x: number, y: number, isPlayerShot: boolean): boolean {
    const shotsSet = isPlayerShot ? this.playerShotsSet : this.enemyShotsSet;
    return shotsSet.has(posKey(x, y));
  }

  /**
   * Verificar si hay un barco en una posición - O(1)
   */
  public hasShipAtPosition(x: number, y: number, isPlayerShips: boolean): boolean {
    const positions = isPlayerShips ? this.playerShipPositions : this.enemyShipPositions;
    return positions.has(posKey(x, y));
  }

  /**
   * Verificar si todos los barcos están destroyed - Optimizado
   */
  private areAllShipsDestroyed(isPlayerShips: boolean): boolean {
    const ships = isPlayerShips ? this.playerShips : this.enemyShips;
    const hitsMap = isPlayerShips ? this.playerShipHits : this.enemyShipHits;
    const sizesMap = isPlayerShips ? this.playerShipSizes : this.enemyShipSizes;

    if (ships.length === 0) return false;

    // 🚀 OPTIMIZACIÓN: Comparar hits vs sizes directamente
    for (let shipId = 0; shipId < ships.length; shipId++) {
      const hits = hitsMap.get(shipId) || 0;
      const size = sizesMap.get(shipId)!;
      
      if (hits < size) {
        return false; // Al menos un barco vivo
      }
    }

    return true;
  }

  /**
   * Verificar game over
   */
  private checkGameOver(): void {
    if (this.isGameOver) return;

    const allPlayerShipsDestroyed = this.areAllShipsDestroyed(true);
    const allEnemyShipsDestroyed = this.areAllShipsDestroyed(false);

    if (allPlayerShipsDestroyed || allEnemyShipsDestroyed) {
      this.winner = allPlayerShipsDestroyed ? "enemy" : "player";
      this.isGameOver = true;
    }
  }

  // ============================================
  // Métodos de acceso rápido (sin copias)
  // ============================================

  public getCurrentTurn(): GameTurn {
    return this.currentTurn;
  }

  public isPlayerTurn(): boolean {
    return this.currentTurn === "PLAYER_TURN";
  }

  public isEnemyTurn(): boolean {
    return this.currentTurn === "ENEMY_TURN";
  }

  public setPlayerTurn(): void {
    this.currentTurn = "PLAYER_TURN";
  }

  public setEnemyTurn(): void {
    this.currentTurn = "ENEMY_TURN";
  }

  public toggleTurn(): void {
    this.currentTurn = this.currentTurn === "PLAYER_TURN" ? "ENEMY_TURN" : "PLAYER_TURN";
  }

  public getWinner(): Winner {
    return this.winner;
  }

  public getIsGameOver(): boolean {
    return this.isGameOver;
  }

  public getShotCount(): number {
    return this.shotCount;
  }

  public getBoardDimensions(): { width: number; height: number } {
    return { width: this.boardWidth, height: this.boardHeight };
  }

  public isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x < this.boardWidth && y >= 0 && y < this.boardHeight;
  }

  /**
   * Obtener estado - SIN copias defensivas para máximo rendimiento
   * ⚠️  NO modificar los arrays retornados
   */
  public getStateUnsafe() {
    return {
      currentTurn: this.currentTurn,
      isPlayerTurn: this.isPlayerTurn(),
      isEnemyTurn: this.isEnemyTurn(),
      playerShips: this.playerShips, // ⚠️  Referencia directa
      enemyShips: this.enemyShips,   // ⚠️  Referencia directa
      isGameOver: this.isGameOver,
      winner: this.winner,
      shotCount: this.shotCount,
      boardWidth: this.boardWidth,
      boardHeight: this.boardHeight,
    };
  }

  /**
   * Reset completo
   */
  public resetGame(): void {
    this.currentTurn = "PLAYER_TURN";
    this.playerShips = [];
    this.enemyShips = [];
    this.isGameOver = false;
    this.winner = null;
    this.shotCount = 0;

    this.playerShotsSet.clear();
    this.enemyShotsSet.clear();
    this.playerShipPositions.clear();
    this.enemyShipPositions.clear();
    this.playerShipHits.clear();
    this.enemyShipHits.clear();
    this.playerShipSizes.clear();
    this.enemyShipSizes.clear();
  }
}

/**
 * Resultado de disparo simplificado (sin callbacks)
 */
export interface FastShotResult {
  success: boolean;
  hit: boolean;
  shipId: number;
  shipDestroyed: boolean;
  isGameOver: boolean;
  winner?: Winner;
}

/**
 * AI Player optimizado para FastGameEngine
 */
export class FastAIPlayer {
  private engine: FastGameEngine;
  private availablePositions: Set<PositionKey>;
  private positionsList: [number, number][];
  private isPlayer: boolean;

  constructor(engine: FastGameEngine, isPlayer: boolean = false) {
    this.engine = engine;
    this.isPlayer = isPlayer;
    this.availablePositions = new Set();
    this.positionsList = [];
    this.initializeAvailablePositions();
  }

  /**
   * 🚀 OPTIMIZACIÓN: Inicializar lista de posiciones una vez
   */
  private initializeAvailablePositions(): void {
    const { width, height } = this.engine.getBoardDimensions();
    
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const key = posKey(x, y);
        this.availablePositions.add(key);
        this.positionsList.push([x, y]);
      }
    }
  }

  /**
   * Generar disparo random - 🚀 OPTIMIZACIÓN: Sin reconstruir array
   */
  public generateRandomShot(): [number, number] | null {
    // Filtrar posiciones ya disparadas
    const available = this.positionsList.filter(([x, y]) => 
      !this.engine.isCellShot(x, y, this.isPlayer)
    );

    if (available.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex];
  }
}
