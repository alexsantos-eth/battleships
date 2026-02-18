import { getShipCellsFromShip } from "@/tools/ship/calculations";
import type { GameShip, Shot, Winner, GameTurn } from "@/types/game/common";
import type { GameConfig } from "@/types/game/config";

/**
 * Motor del juego - Lógica pura sin dependencias de UI/Three.js
 * 
 * Esta clase contiene toda la lógica del juego de batalla naval,
 * completamente independiente de:
 * - React/Zustand (state management)
 * - Three.js (renderizado 3D)
 * - Event buses (eventos de cámara)
 * - Hooks de React
 * 
 * Puede ser usado tanto para UI como para simulaciones headless.
 */
export class GameEngine {
  // Estado del juego
  private currentTurn: GameTurn;
  private playerShips: GameShip[];
  private enemyShips: GameShip[];
  private playerShots: Shot[];
  private enemyShots: Shot[];
  private isGameOver: boolean;
  private winner: Winner;
  private boardWidth: number;
  private boardHeight: number;
  private shotCount: number;
  
  // Callbacks opcionales para observar cambios (para UI)
  private onStateChange?: (state: GameEngineState) => void;
  private onTurnChange?: (turn: GameTurn) => void;
  private onShot?: (shot: Shot, isPlayerShot: boolean) => void;
  private onGameOver?: (winner: Winner) => void;

  constructor(config: Partial<GameConfig> = {}, callbacks?: GameEngineCallbacks) {
    this.boardWidth = config.boardWidth ?? 10;
    this.boardHeight = config.boardHeight ?? 10;
    this.currentTurn = "PLAYER_TURN";
    this.playerShips = [];
    this.enemyShips = [];
    this.playerShots = [];
    this.enemyShots = [];
    this.isGameOver = false;
    this.winner = null;
    this.shotCount = 0;

    // Callbacks opcionales
    this.onStateChange = callbacks?.onStateChange;
    this.onTurnChange = callbacks?.onTurnChange;
    this.onShot = callbacks?.onShot;
    this.onGameOver = callbacks?.onGameOver;
  }

  /**
   * Inicializa una nueva partida
   */
  public initializeGame(playerShips: GameShip[], enemyShips: GameShip[], initialTurn: GameTurn = "PLAYER_TURN"): void {
    this.playerShips = playerShips;
    this.enemyShips = enemyShips;
    this.currentTurn = initialTurn;
    this.playerShots = [];
    this.enemyShots = [];
    this.isGameOver = false;
    this.winner = null;
    this.shotCount = 0;

    this.notifyStateChange();
  }

  /**
   * Reinicia el juego
   */
  public resetGame(): void {
    this.currentTurn = "PLAYER_TURN";
    this.playerShips = [];
    this.enemyShips = [];
    this.playerShots = [];
    this.enemyShots = [];
    this.isGameOver = false;
    this.winner = null;
    this.shotCount = 0;

    this.notifyStateChange();
  }

  /**
   * Establece las dimensiones del tablero
   */
  public setBoardDimensions(width: number, height: number): void {
    this.boardWidth = width;
    this.boardHeight = height;
    this.notifyStateChange();
  }

  /**
   * Obtiene el turno actual
   */
  public getCurrentTurn(): GameTurn {
    return this.currentTurn;
  }

  /**
   * Verifica si es el turno del jugador
   */
  public isPlayerTurn(): boolean {
    return this.currentTurn === "PLAYER_TURN";
  }

  /**
   * Verifica si es el turno del enemigo
   */
  public isEnemyTurn(): boolean {
    return this.currentTurn === "ENEMY_TURN";
  }

  /**
   * Establece el turno del jugador
   */
  public setPlayerTurn(): void {
    this.currentTurn = "PLAYER_TURN";
    this.onTurnChange?.(this.currentTurn);
    this.notifyStateChange();
  }

  /**
   * Establece el turno del enemigo
   */
  public setEnemyTurn(): void {
    this.currentTurn = "ENEMY_TURN";
    this.onTurnChange?.(this.currentTurn);
    this.notifyStateChange();
  }

  /**
   * Alterna el turno
   */
  public toggleTurn(): void {
    if (this.currentTurn === "PLAYER_TURN") {
      this.setEnemyTurn();
    } else {
      this.setPlayerTurn();
    }
  }

  /**
   * Ejecuta un disparo
   * Retorna el resultado del disparo
   */
  public executeShot(x: number, y: number, isPlayerShot: boolean): ShotResult {
    // Verificar si ya se disparó en esta celda
    if (this.isCellShot(x, y, isPlayerShot)) {
      return {
        success: false,
        error: "Cell already shot",
        hit: false,
        shipId: -1,
      };
    }

    // Verificar el impacto
    const result = this.checkShot(x, y, isPlayerShot);
    
    // Crear el disparo
    const shot: Shot = {
      x,
      y,
      hit: result.hit,
      shipId: result.shipId >= 0 ? result.shipId : undefined,
    };

    // Agregar el disparo
    if (isPlayerShot) {
      this.playerShots.push(shot);
    } else {
      this.enemyShots.push(shot);
    }

    this.shotCount++;

    // Notificar del disparo
    this.onShot?.(shot, isPlayerShot);

    // Verificar si el juego terminó
    this.checkGameOver();

    // Verificar si el barco fue destruido
    const shipDestroyed = result.hit && result.shipId >= 0 
      ? this.isShipDestroyed(result.shipId, isPlayerShot)
      : false;

    this.notifyStateChange();

    return {
      success: true,
      hit: result.hit,
      shipId: result.shipId,
      shipDestroyed,
      isGameOver: this.isGameOver,
      winner: this.winner,
    };
  }

  /**
   * Verifica si un disparo impacta en un barco
   */
  public checkShot(x: number, y: number, isPlayerShot: boolean): { hit: boolean; shipId: number } {
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
  public isCellShot(x: number, y: number, isPlayerShot: boolean): boolean {
    const shots = isPlayerShot ? this.playerShots : this.enemyShots;
    return shots.some((shot) => shot.x === x && shot.y === y);
  }

  /**
   * Verifica si un barco está completamente destruido
   */
  public isShipDestroyed(shipId: number, isPlayerShot: boolean): boolean {
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
    return ships.every((_, shipId) => this.isShipDestroyed(shipId, !isPlayerShips));
  }

  /**
   * Verifica si el juego terminó
   */
  private checkGameOver(): void {
    if (this.isGameOver) return;

    const areAllPlayerShipsDestroyed = this.areAllShipsDestroyed(true);
    const areAllEnemyShipsDestroyed = this.areAllShipsDestroyed(false);

    if (areAllPlayerShipsDestroyed || areAllEnemyShipsDestroyed) {
      this.winner = areAllPlayerShipsDestroyed ? "enemy" : "player";
      this.isGameOver = true;
      this.onGameOver?.(this.winner);
    }
  }

  /**
   * Establece los barcos del jugador
   */
  public setPlayerShips(ships: GameShip[]): void {
    this.playerShips = ships;
    this.notifyStateChange();
  }

  /**
   * Establece los barcos del enemigo
   */
  public setEnemyShips(ships: GameShip[]): void {
    this.enemyShips = ships;
    this.notifyStateChange();
  }

  /**
   * Establece todos los disparos del jugador
   */
  public setPlayerShots(shots: Shot[]): void {
    this.playerShots = shots;
    this.notifyStateChange();
  }

  /**
   * Establece todos los disparos del enemigo
   */
  public setEnemyShots(shots: Shot[]): void {
    this.enemyShots = shots;
    this.notifyStateChange();
  }

  /**
   * Obtiene el estado actual completo del juego
   */
  public getState(): GameEngineState {
    return {
      currentTurn: this.currentTurn,
      isPlayerTurn: this.isPlayerTurn(),
      isEnemyTurn: this.isEnemyTurn(),
      playerShips: [...this.playerShips],
      enemyShips: [...this.enemyShips],
      playerShots: [...this.playerShots],
      enemyShots: [...this.enemyShots],
      isGameOver: this.isGameOver,
      winner: this.winner,
      boardWidth: this.boardWidth,
      boardHeight: this.boardHeight,
      shotCount: this.shotCount,
    };
  }

  /**
   * Obtiene los barcos del jugador
   */
  public getPlayerShips(): GameShip[] {
    return [...this.playerShips];
  }

  /**
   * Obtiene los barcos del enemigo
   */
  public getEnemyShips(): GameShip[] {
    return [...this.enemyShips];
  }

  /**
   * Obtiene los disparos del jugador
   */
  public getPlayerShots(): Shot[] {
    return [...this.playerShots];
  }

  /**
   * Obtiene los disparos del enemigo
   */
  public getEnemyShots(): Shot[] {
    return [...this.enemyShots];
  }

  /**
   * Obtiene el contador de disparos
   */
  public getShotCount(): number {
    return this.shotCount;
  }

  /**
   * Obtiene el ganador (si el juego terminó)
   */
  public getWinner(): Winner {
    return this.winner;
  }

  /**
   * Obtiene las dimensiones del tablero
   */
  public getBoardDimensions(): { width: number; height: number } {
    return { width: this.boardWidth, height: this.boardHeight };
  }

  /**
   * Verifica si una posición es válida en el tablero
   */
  public isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x < this.boardWidth && y >= 0 && y < this.boardHeight;
  }

  /**
   * Notifica cambios de estado a observadores
   */
  private notifyStateChange(): void {
    this.onStateChange?.(this.getState());
  }
}

/**
 * Estado del motor del juego
 */
export interface GameEngineState {
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

/**
 * Resultado de un disparo
 */
export interface ShotResult {
  success: boolean;
  error?: string;
  hit: boolean;
  shipId: number;
  shipDestroyed?: boolean;
  isGameOver?: boolean;
  winner?: Winner;
}

/**
 * Callbacks opcionales para observar cambios en el motor
 */
export interface GameEngineCallbacks {
  onStateChange?: (state: GameEngineState) => void;
  onTurnChange?: (turn: GameTurn) => void;
  onShot?: (shot: Shot, isPlayerShot: boolean) => void;
  onGameOver?: (winner: Winner) => void;
}
