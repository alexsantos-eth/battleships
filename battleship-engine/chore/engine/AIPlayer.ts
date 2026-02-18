import type { GameEngine } from "./GameEngine";

/**
 * IA del jugador enemigo - Lógica pura sin dependencias de React
 * 
 * Esta clase implementa la lógica de la IA que juega automáticamente
 * sin depender de hooks de React o timeouts de UI.
 */
export class AIPlayer {
  private engine: GameEngine;
  private availablePositions: [number, number][];

  constructor(engine: GameEngine) {
    this.engine = engine;
    this.availablePositions = [];
    this.updateAvailablePositions();
  }

  /**
   * Actualiza las posiciones disponibles para disparar
   */
  private updateAvailablePositions(): void {
    const { width, height } = this.engine.getBoardDimensions();
    this.availablePositions = [];

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (!this.engine.isCellShot(x, y, false)) {
          this.availablePositions.push([x, y]);
        }
      }
    }
  }

  /**
   * Genera un disparo aleatorio
   */
  public generateRandomShot(): [number, number] | null {
    this.updateAvailablePositions();

    if (this.availablePositions.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * this.availablePositions.length);
    return this.availablePositions[randomIndex];
  }

  /**
   * Ejecuta un turno de la IA
   * Retorna el resultado del disparo
   */
  public executeTurn(): { 
    position: [number, number] | null; 
    hit: boolean; 
    shipId: number;
    shipDestroyed: boolean;
  } | null {
    const position = this.generateRandomShot();
    
    if (!position) {
      return null;
    }

    const [x, y] = position;
    const result = this.engine.executeShot(x, y, false);

    return {
      position,
      hit: result.hit,
      shipId: result.shipId,
      shipDestroyed: result.shipDestroyed || false,
    };
  }

  /**
   * Obtiene las posiciones disponibles para disparar
   */
  public getAvailablePositions(): [number, number][] {
    this.updateAvailablePositions();
    return [...this.availablePositions];
  }

  /**
   * Verifica si hay posiciones disponibles
   */
  public hasAvailablePositions(): boolean {
    this.updateAvailablePositions();
    return this.availablePositions.length > 0;
  }
}

/**
 * IA avanzada con estrategia inteligente (para futuras mejoras)
 * 
 * Esta clase puede extenderse para implementar estrategias más
 * inteligentes como:
 * - Disparar alrededor de impactos
 * - Seguir direcciones de barcos
 * - Probabilidades basadas en tamaños de barcos
 */
export class SmartAIPlayer extends AIPlayer {
  private lastHitPosition: [number, number] | null = null;
  private huntingMode: boolean = false;
  private huntingDirection: 'horizontal' | 'vertical' | null = null;

  constructor(engine: GameEngine) {
    super(engine);
  }

  /**
   * Estrategia inteligente: disparar alrededor de impactos
   */
  public generateSmartShot(): [number, number] | null {
    // Si estamos en modo caza y tenemos un último impacto
    if (this.huntingMode && this.lastHitPosition) {
      const adjacentPositions = this.getAdjacentPositions(this.lastHitPosition);
      
      // Filtrar posiciones válidas y no disparadas
      const validPositions = adjacentPositions.filter(
        ([x, y]) => this.isValidAndAvailable(x, y)
      );

      if (validPositions.length > 0) {
        // Preferir la dirección de caza si existe
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
        // No hay posiciones adyacentes, salir del modo caza
        this.huntingMode = false;
        this.huntingDirection = null;
      }
    }

    // Estrategia normal: disparo aleatorio
    return this.generateRandomShot();
  }

  /**
   * Obtiene posiciones adyacentes a una posición dada
   */
  private getAdjacentPositions(position: [number, number]): [number, number][] {
    const [x, y] = position;
    return [
      [x + 1, y],  // derecha
      [x - 1, y],  // izquierda
      [x, y + 1],  // abajo
      [x, y - 1],  // arriba
    ] as [number, number][];
  }

  /**
   * Verifica si una posición es válida y está disponible
   */
  private isValidAndAvailable(x: number, y: number): boolean {
    const engine = (this as any).engine as GameEngine;
    return engine.isValidPosition(x, y) && !engine.isCellShot(x, y, false);
  }

  /**
   * Callback para ser llamado después de cada disparo
   */
  public onShotResult(hit: boolean, position: [number, number], shipDestroyed: boolean): void {
    if (hit && !shipDestroyed) {
      // Activar modo caza
      this.huntingMode = true;
      this.lastHitPosition = position;

      // Determinar dirección si tenemos suficiente información
      // (implementar lógica más avanzada aquí)
    } else if (shipDestroyed) {
      // Barco destruido, salir del modo caza
      this.huntingMode = false;
      this.huntingDirection = null;
      this.lastHitPosition = null;
    }
  }
}
