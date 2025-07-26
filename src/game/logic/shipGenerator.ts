import type { ShipVariant, ShipOrientation, Position } from "./battleship";

export interface ShipPlacement {
  position: Position;
  variant: ShipVariant;
  orientation: ShipOrientation;
}

export class ShipGenerator {
  private readonly boardWidth: number;
  private readonly boardHeight: number;
  private readonly shipVariants: ShipVariant[] = ["small", "medium", "large", "xlarge"];
  private readonly shipCounts: Record<ShipVariant, number> = {
    small: 4,
    medium: 3,
    large: 2,
    xlarge: 1,
  };

  constructor(boardWidth: number = 10, boardHeight: number = 10) {
    this.boardWidth = boardWidth;
    this.boardHeight = boardHeight;
  }

  generateRandomShips(): ShipPlacement[] {
    const ships: ShipPlacement[] = [];
    const maxAttempts = 1000;

    for (const variant of this.shipVariants) {
      const count = this.shipCounts[variant];
      
      for (let i = 0; i < count; i++) {
        let attempts = 0;
        let placed = false;
        
        while (attempts < maxAttempts && !placed) {
          const placement = this.generateRandomShipPlacement(variant);
          
          if (this.isValidPlacement(placement, ships)) {
            ships.push(placement);
            placed = true;
          }
          
          attempts++;
        }
        
        if (!placed) {
          throw new Error(`Could not place ship of variant ${variant} after ${maxAttempts} attempts`);
        }
      }
    }

    return ships;
  }

  private generateRandomShipPlacement(variant: ShipVariant): ShipPlacement {
    const orientation: ShipOrientation = Math.random() < 0.5 ? "horizontal" : "vertical";
    const shipSize = this.getShipSize(variant);
    
    let position: Position;
    
    if (orientation === "horizontal") {
      position = {
        x: Math.floor(Math.random() * (this.boardWidth - shipSize + 1)),
        y: Math.floor(Math.random() * this.boardHeight),
      };
    } else {
      position = {
        x: Math.floor(Math.random() * this.boardWidth),
        y: Math.floor(Math.random() * (this.boardHeight - shipSize + 1)),
      };
    }

    return { position, variant, orientation };
  }

  private isValidPlacement(placement: ShipPlacement, existingShips: ShipPlacement[]): boolean {
    const shipSize = this.getShipSize(placement.variant);
    const shipCells = this.getShipCells(placement.position, shipSize, placement.orientation);
    
    // Check if ship is within board boundaries
    for (const cell of shipCells) {
      if (cell.x < 0 || cell.x >= this.boardWidth || cell.y < 0 || cell.y >= this.boardHeight) {
        return false;
      }
    }
    
    // Check if ship overlaps with existing ships
    for (const existingShip of existingShips) {
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

  private getShipSize(variant: ShipVariant): number {
    const sizeMap = {
      small: 2,
      medium: 3,
      large: 4,
      xlarge: 5,
    };
    return sizeMap[variant];
  }

  validateShipPlacement(placement: ShipPlacement, existingShips: ShipPlacement[]): boolean {
    return this.isValidPlacement(placement, existingShips);
  }

  getShipCounts(): Record<ShipVariant, number> {
    return { ...this.shipCounts };
  }

  getTotalShipCount(): number {
    return Object.values(this.shipCounts).reduce((sum, count) => sum + count, 0);
  }
} 