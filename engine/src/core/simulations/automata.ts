import type { GameEngine } from "../engine/logic";

/**
 * AI Player - Pure logic without React dependencies
 * 
 * This class implements AI logic that plays automatically
 * without depending on React hooks or UI timeouts.
 */
export class AIPlayer {
  private engine: GameEngine;
  private availablePositions: [number, number][];
  protected isPlayer: boolean;

  /**
   * Create an AI player
   * @param engine - The game engine instance
   * @param isPlayer - True if this AI controls the player, false if it controls the enemy
   */
  constructor(engine: GameEngine, isPlayer: boolean = false) {
    this.engine = engine;
    this.isPlayer = isPlayer;
    this.availablePositions = [];
    this.updateAvailablePositions();
  }

  /**
   * Update available positions to shoot
   * @private
   */
  private updateAvailablePositions(): void {
    const { width, height } = this.engine.getBoardDimensions();
    this.availablePositions = [];

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (!this.engine.isCellShot(x, y, this.isPlayer)) {
          this.availablePositions.push([x, y]);
        }
      }
    }
  }

  /**
   * Generate a random shot at an unshot position
   * @returns Coordinates [x, y] or null if no positions available
   */
  public generateRandomShot(): [number, number] | null {
    this.updateAvailablePositions();

    if (this.availablePositions.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * this.availablePositions.length);
    return this.availablePositions[randomIndex];
  }
}

/**
 * Advanced AI with intelligent strategy (for future improvements)
 * 
 * This class can be extended to implement smarter strategies such as:
 * - Shooting around hits
 * - Following ship directions
 * - Probability-based targeting by ship sizes
 */
export class SmartAIPlayer extends AIPlayer {
  private lastHitPosition: [number, number] | null = null;
  private huntingMode: boolean = false;
  private huntingDirection: 'horizontal' | 'vertical' | null = null;

  /**
   * Create a smart AI player
   * @param engine - The game engine instance
   * @param isPlayer - True if this AI controls the player, false if it controls the enemy
   */
  constructor(engine: GameEngine, isPlayer: boolean = false) {
    super(engine, isPlayer);
  }

  /**
   * Smart strategy: shoot around hits
   * @returns Coordinates [x, y] or null if no positions available
   */
  public generateSmartShot(): [number, number] | null {
    // If in hunting mode and we have a last hit
    if (this.huntingMode && this.lastHitPosition) {
      const adjacentPositions = this.getAdjacentPositions(this.lastHitPosition);
      
      // Filter valid and unshot positions
      const validPositions = adjacentPositions.filter(
        ([x, y]) => this.isValidAndAvailable(x, y)
      );

      if (validPositions.length > 0) {
        // Prefer hunting direction if it exists
        if (this.huntingDirection) {
          const directionPositions = validPositions.filter(([x, y]) => {
            if (this.huntingDirection === 'horizontal') {
              return y === this.lastHitPosition![1];
            } else {
              return x === this.lastHitPosition![0];
            }
          });

          if (directionPositions.length > 0) {
            return directionPositions[0];
          }
        }

        return validPositions[0];
      } else {
        // No adjacent positions, exit hunting mode
        this.huntingMode = false;
        this.huntingDirection = null;
      }
    }

    // Normal strategy: random shot
    return this.generateRandomShot();
  }

  /**
   * Get adjacent positions to a given position
   * @param position - [x, y] coordinates
   * @returns Array of adjacent [x, y] positions
   * @private
   */
  private getAdjacentPositions(position: [number, number]): [number, number][] {
    const [x, y] = position;
    return [
      [x + 1, y],  // right
      [x - 1, y],  // left
      [x, y + 1],  // down
      [x, y - 1],  // up
    ] as [number, number][];
  }

  /**
   * Check if a position is valid and available
   * @param x - X coordinate
   * @param y - Y coordinate
   * @returns True if position is valid and unshot
   * @private
   */
  private isValidAndAvailable(x: number, y: number): boolean {
    const engine = (this as any).engine as GameEngine;
    return engine.isValidPosition(x, y) && !engine.isCellShot(x, y, false);
  }

}
