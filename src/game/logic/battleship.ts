export type ShipVariant = "small" | "medium" | "large" | "xlarge";
export type ShipOrientation = "horizontal" | "vertical";
export type GameTurn = "PLAYER_TURN" | "ENEMY_TURN";

export interface Position {
  x: number;
  y: number;
}

export interface Ship {
  id: number;
  position: Position;
  variant: ShipVariant;
  orientation: ShipOrientation;
  hits: Position[];
}

export interface Shot {
  position: Position;
  hit: boolean;
  shipId?: number;
}

export interface GameBoard {
  width: number;
  height: number;
  ships: Ship[];
  shots: Shot[];
}

export class BattleshipGame {
  private playerBoard: GameBoard;
  private enemyBoard: GameBoard;
  private currentTurn: GameTurn;

  constructor(boardWidth: number = 10, boardHeight: number = 10) {
    this.playerBoard = { width: boardWidth, height: boardHeight, ships: [], shots: [] };
    this.enemyBoard = { width: boardWidth, height: boardHeight, ships: [], shots: [] };
    this.currentTurn = "PLAYER_TURN";
  }

  getCurrentTurn(): GameTurn {
    return this.currentTurn;
  }

  isPlayerTurn(): boolean {
    return this.currentTurn === "PLAYER_TURN";
  }

  isEnemyTurn(): boolean {
    return this.currentTurn === "ENEMY_TURN";
  }

  toggleTurn(): void {
    this.currentTurn = this.currentTurn === "PLAYER_TURN" ? "ENEMY_TURN" : "PLAYER_TURN";
  }

  setRandomTurn(): void {
    this.currentTurn = Math.random() < 0.5 ? "PLAYER_TURN" : "ENEMY_TURN";
  }

  addShip(board: "player" | "enemy", ship: Omit<Ship, "id" | "hits">): boolean {
    const targetBoard = board === "player" ? this.playerBoard : this.enemyBoard;
    const shipWithId: Ship = { ...ship, id: targetBoard.ships.length, hits: [] };
    
    if (this.isValidShipPlacement(targetBoard, shipWithId)) {
      targetBoard.ships.push(shipWithId);
      return true;
    }
    return false;
  }

  private isValidShipPlacement(board: GameBoard, ship: Ship): boolean {
    const shipSize = this.getShipSize(ship.variant);
    const shipCells = this.getShipCells(ship.position, shipSize, ship.orientation);
    
    for (const cell of shipCells) {
      if (cell.x < 0 || cell.x >= board.width || cell.y < 0 || cell.y >= board.height) {
        return false;
      }
    }
    
    for (const existingShip of board.ships) {
      const existingShipSize = this.getShipSize(existingShip.variant);
      const existingShipCells = this.getShipCells(existingShip.position, existingShipSize, existingShip.orientation);
      
      for (const cell of shipCells) {
        for (const existingCell of existingShipCells) {
          if (cell.x === existingCell.x && cell.y === existingCell.y) {
            return false;
          }
        }
      }
    }
    
    return true;
  }

  private getShipCells(position: Position, size: number, orientation: ShipOrientation): Position[] {
    const cells: Position[] = [];
    
    if (orientation === "horizontal") {
      for (let i = 0; i < size; i++) {
        cells.push({ x: position.x + i, y: position.y });
      }
    } else {
      for (let i = 0; i < size; i++) {
        cells.push({ x: position.x, y: position.y + i });
      }
    }
    
    return cells;
  }

  getShipSize(variant: ShipVariant): number {
    const sizeMap = {
      small: 2,
      medium: 3,
      large: 4,
      xlarge: 5,
    };
    return sizeMap[variant];
  }

  fireShot(board: "player" | "enemy", position: Position): Shot {
    const targetBoard = board === "player" ? this.enemyBoard : this.playerBoard;
    
    const existingShot = targetBoard.shots.find(shot => 
      shot.position.x === position.x && shot.position.y === position.y
    );
    
    if (existingShot) {
      throw new Error("Position already shot");
    }
    
    let hitShip: Ship | undefined;
    for (const ship of targetBoard.ships) {
      const shipSize = this.getShipSize(ship.variant);
      const shipCells = this.getShipCells(ship.position, shipSize, ship.orientation);
      
      for (const cell of shipCells) {
        if (cell.x === position.x && cell.y === position.y) {
          hitShip = ship;
          ship.hits.push(position);
          break;
        }
      }
      if (hitShip) break;
    }
    
    const shot: Shot = {
      position,
      hit: !!hitShip,
      shipId: hitShip?.id,
    };
    
    targetBoard.shots.push(shot);
    return shot;
  }

  isShipDestroyed(board: "player" | "enemy", shipId: number): boolean {
    const targetBoard = board === "player" ? this.playerBoard : this.enemyBoard;
    const ship = targetBoard.ships.find(s => s.id === shipId);
    
    if (!ship) return false;
    
    const shipSize = this.getShipSize(ship.variant);
    const shipCells = this.getShipCells(ship.position, shipSize, ship.orientation);
    
    return ship.hits.length === shipCells.length;
  }

  isGameOver(): boolean {
    return this.isAllShipsDestroyed("player") || this.isAllShipsDestroyed("enemy");
  }

  getWinner(): "player" | "enemy" | null {
    if (!this.isGameOver()) return null;
    
    if (this.isAllShipsDestroyed("player")) return "enemy";
    if (this.isAllShipsDestroyed("enemy")) return "player";
    
    return null;
  }

  private isAllShipsDestroyed(board: "player" | "enemy"): boolean {
    const targetBoard = board === "player" ? this.playerBoard : this.enemyBoard;
    
    if (targetBoard.ships.length === 0) return false;
    
    return targetBoard.ships.every(ship => this.isShipDestroyed(board, ship.id));
  }

  getBoard(board: "player" | "enemy"): GameBoard {
    return board === "player" ? { ...this.playerBoard } : { ...this.enemyBoard };
  }

  getShips(board: "player" | "enemy"): Ship[] {
    return board === "player" ? [...this.playerBoard.ships] : [...this.enemyBoard.ships];
  }

  getShots(board: "player" | "enemy"): Shot[] {
    return board === "player" ? [...this.playerBoard.shots] : [...this.enemyBoard.shots];
  }

  isPositionShot(board: "player" | "enemy", position: Position): boolean {
    const targetBoard = board === "player" ? this.playerBoard : this.enemyBoard;
    return targetBoard.shots.some(shot => 
      shot.position.x === position.x && shot.position.y === position.y
    );
  }

  getShipAtPosition(board: "player" | "enemy", position: Position): Ship | null {
    const targetBoard = board === "player" ? this.playerBoard : this.enemyBoard;
    
    for (const ship of targetBoard.ships) {
      const shipSize = this.getShipSize(ship.variant);
      const shipCells = this.getShipCells(ship.position, shipSize, ship.orientation);
      
      for (const cell of shipCells) {
        if (cell.x === position.x && cell.y === position.y) {
          return ship;
        }
      }
    }
    
    return null;
  }
} 