import { BattleshipGame } from './battleship';
import { ShipGenerator } from './shipGenerator';
import { DeterministicRandom } from './deterministicRandom';
import type { Position, ShipVariant, ShipOrientation, GameTurn, Ship } from './battleship';

export interface BattleConfig {
  seed: number;
  boardWidth: number;
  boardHeight: number;
  playerShips?: Array<{
    position: Position;
    variant: ShipVariant;
    orientation: ShipOrientation;
  }>;
  enemyShips?: Array<{
    position: Position;
    variant: ShipVariant;
    orientation: ShipOrientation;
  }>;
}

export interface BattleResult {
  winner: 'player' | 'enemy' | null;
  totalTurns: number;
  playerShots: number;
  enemyShots: number;
  playerHits: number;
  enemyHits: number;
  shipPlacements: {
    player: Array<{
      position: Position;
      variant: ShipVariant;
      orientation: ShipOrientation;
    }>;
    enemy: Array<{
      position: Position;
      variant: ShipVariant;
      orientation: ShipOrientation;
    }>;
  };
  shotHistory: Array<{
    turn: GameTurn;
    position: Position;
    hit: boolean;
    shipId?: number;
    shipDestroyed: boolean;
  }>;
}

export interface BattleInstruction {
  type: 'place_ship' | 'fire_shot';
  data: {
    player?: 'player' | 'enemy';
    position?: Position;
    variant?: ShipVariant;
    orientation?: ShipOrientation;
  };
}

export class BattleSimulator {
  private game: BattleshipGame;
  private random: DeterministicRandom;
  private shipGenerator: ShipGenerator;
  private config: BattleConfig;
  private shotHistory: BattleResult['shotHistory'] = [];

  constructor(config: BattleConfig) {
    this.config = config;
    this.random = new DeterministicRandom(config.seed);
    this.shipGenerator = new ShipGenerator(config.boardWidth, config.boardHeight);
    this.game = new BattleshipGame(config.boardWidth, config.boardHeight);
    
    this.initializeGame();
  }

  private initializeGame(): void {
    // Configurar el generador de barcos con el random determinista
    this.setupShipGenerator();
    
    // Colocar barcos del jugador
    if (this.config.playerShips) {
      this.config.playerShips.forEach(ship => {
        this.game.addShip('player', ship);
      });
    } else {
      this.placeRandomShips('player');
    }

    // Colocar barcos del enemigo
    if (this.config.enemyShips) {
      this.config.enemyShips.forEach(ship => {
        this.game.addShip('enemy', ship);
      });
    } else {
      this.placeRandomShips('enemy');
    }

    // Establecer turno inicial aleatorio
    this.setRandomTurn();
  }

  private setupShipGenerator(): void {
    // Sobrescribir Math.random temporalmente para el generador de barcos
    const originalRandom = Math.random;
    Math.random = () => this.random.next();
    
    try {
      // El ShipGenerator usará nuestro random determinista
    } finally {
      Math.random = originalRandom;
    }
  }

  private placeRandomShips(board: 'player' | 'enemy'): void {
    const originalRandom = Math.random;
    Math.random = () => this.random.next();
    
    try {
      const ships = this.shipGenerator.generateRandomShips();
      ships.forEach(ship => {
        this.game.addShip(board, {
          position: ship.position,
          variant: ship.variant,
          orientation: ship.orientation
        });
      });
    } finally {
      Math.random = originalRandom;
    }
  }

  private setRandomTurn(): void {
    const originalRandom = Math.random;
    Math.random = () => this.random.next();
    
    try {
      this.game.setRandomTurn();
    } finally {
      Math.random = originalRandom;
    }
  }

  executeInstructions(instructions: BattleInstruction[]): BattleResult {
    this.shotHistory = [];
    
    for (const instruction of instructions) {
      this.executeInstruction(instruction);
    }

    return this.getBattleResult();
  }

  private executeInstruction(instruction: BattleInstruction): void {
    switch (instruction.type) {
      case 'place_ship':
        if (instruction.data.player && instruction.data.position && 
            instruction.data.variant && instruction.data.orientation) {
          this.game.addShip(instruction.data.player, {
            position: instruction.data.position,
            variant: instruction.data.variant,
            orientation: instruction.data.orientation
          });
        }
        break;
        
      case 'fire_shot':
        if (instruction.data.position) {
          const board = this.game.isPlayerTurn() ? 'enemy' : 'player';
          const shot = this.game.fireShot(board, instruction.data.position);
          
          this.shotHistory.push({
            turn: this.game.getCurrentTurn(),
            position: instruction.data.position,
            hit: shot.hit,
            shipId: shot.shipId,
            shipDestroyed: shot.hit && shot.shipId !== undefined ? 
              this.game.isShipDestroyed(board, shot.shipId) : false
          });
          
          this.game.toggleTurn();
        }
        break;
    }
  }

  simulateRandomBattle(maxTurns: number = 200): BattleResult {
    this.shotHistory = [];
    let turnCount = 0;

    while (!this.game.isGameOver() && turnCount < maxTurns) {
      const availablePositions = this.getAvailablePositions();
      
      if (availablePositions.length === 0) {
        break;
      }

      // Elegir posición aleatoria determinista
      const randomIndex = this.random.nextInt(0, availablePositions.length - 1);
      const position = availablePositions[randomIndex];
      
      const board = this.game.isPlayerTurn() ? 'enemy' : 'player';
      
      try {
        const shot = this.game.fireShot(board, position);
        
        this.shotHistory.push({
          turn: this.game.getCurrentTurn(),
          position,
          hit: shot.hit,
          shipId: shot.shipId,
          shipDestroyed: shot.hit && shot.shipId !== undefined ? 
            this.game.isShipDestroyed(board, shot.shipId) : false
        });
        
        this.game.toggleTurn();
        turnCount++;
      } catch {
        // Si ya se disparó a esta posición, continuar con la siguiente
        console.warn(`Position already shot: ${position.x}, ${position.y}`);
        continue;
      }
    }

    return this.getBattleResult();
  }

  private getAvailablePositions(): Position[] {
    const positions: Position[] = [];
    const board = this.game.isPlayerTurn() ? 'enemy' : 'player';
    
    for (let x = 0; x < this.config.boardWidth; x++) {
      for (let y = 0; y < this.config.boardHeight; y++) {
        const position = { x, y };
        if (!this.game.isPositionShot(board, position)) {
          positions.push(position);
        }
      }
    }
    
    return positions;
  }

  private getBattleResult(): BattleResult {
    const playerShots = this.shotHistory.filter(shot => shot.turn === 'PLAYER_TURN');
    const enemyShots = this.shotHistory.filter(shot => shot.turn === 'ENEMY_TURN');
    
    return {
      winner: this.game.getWinner(),
      totalTurns: this.shotHistory.length,
      playerShots: playerShots.length,
      enemyShots: enemyShots.length,
      playerHits: playerShots.filter(shot => shot.hit).length,
      enemyHits: enemyShots.filter(shot => shot.hit).length,
      shipPlacements: {
        player: this.game.getShips('player').map((ship: Ship) => ({
          position: ship.position,
          variant: ship.variant,
          orientation: ship.orientation
        })),
        enemy: this.game.getShips('enemy').map((ship: Ship) => ({
          position: ship.position,
          variant: ship.variant,
          orientation: ship.orientation
        }))
      },
      shotHistory: [...this.shotHistory]
    };
  }

  getCurrentGameState(): {
    currentTurn: GameTurn;
    isGameOver: boolean;
    winner: 'player' | 'enemy' | null;
    playerShipsRemaining: number;
    enemyShipsRemaining: number;
  } {
    return {
      currentTurn: this.game.getCurrentTurn(),
      isGameOver: this.game.isGameOver(),
      winner: this.game.getWinner(),
      playerShipsRemaining: this.game.getShips('player').filter((ship: Ship) => !this.game.isShipDestroyed('player', ship.id)).length,
      enemyShipsRemaining: this.game.getShips('enemy').filter((ship: Ship) => !this.game.isShipDestroyed('enemy', ship.id)).length
    };
  }
} 