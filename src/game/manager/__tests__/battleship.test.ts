import { BattleshipGame } from "../battleship";
import type { Position, ShipVariant } from "../battleship";

describe("BattleshipGame", () => {
  let game: BattleshipGame;

  beforeEach(() => {
    game = new BattleshipGame(10, 10);
  });

  describe("Turn Management", () => {
    test("should start with player turn by default", () => {
      expect(game.getCurrentTurn()).toBe("PLAYER_TURN");
      expect(game.isPlayerTurn()).toBe(true);
      expect(game.isEnemyTurn()).toBe(false);
    });

    test("should toggle turn correctly", () => {
      game.toggleTurn();
      expect(game.getCurrentTurn()).toBe("ENEMY_TURN");
      expect(game.isPlayerTurn()).toBe(false);
      expect(game.isEnemyTurn()).toBe(true);

      game.toggleTurn();
      expect(game.getCurrentTurn()).toBe("PLAYER_TURN");
      expect(game.isPlayerTurn()).toBe(true);
      expect(game.isEnemyTurn()).toBe(false);
    });

    test("should set random turn", () => {
      game.setRandomTurn();
      const turn = game.getCurrentTurn();
      expect(turn === "PLAYER_TURN" || turn === "ENEMY_TURN").toBe(true);
    });
  });

  describe("Ship Management", () => {
    test("should add valid ship placement", () => {
      const ship = {
        position: { x: 0, y: 0 },
        variant: "small" as ShipVariant,
        orientation: "horizontal" as const,
      };

      const result = game.addShip("player", ship);
      expect(result).toBe(true);
      expect(game.getShips("player")).toHaveLength(1);
    });

    test("should reject invalid ship placement outside bounds", () => {
      const ship = {
        position: { x: 9, y: 9 },
        variant: "large" as ShipVariant,
        orientation: "horizontal" as const,
      };

      const result = game.addShip("player", ship);
      expect(result).toBe(false);
      expect(game.getShips("player")).toHaveLength(0);
    });

    test("should reject overlapping ships", () => {
      const ship1 = {
        position: { x: 0, y: 0 },
        variant: "small" as ShipVariant,
        orientation: "horizontal" as const,
      };

      const ship2 = {
        position: { x: 0, y: 0 },
        variant: "small" as ShipVariant,
        orientation: "vertical" as const,
      };

      game.addShip("player", ship1);
      const result = game.addShip("player", ship2);
      expect(result).toBe(false);
      expect(game.getShips("player")).toHaveLength(1);
    });
  });

  describe("Shot Management", () => {
    beforeEach(() => {
      const ship = {
        position: { x: 0, y: 0 },
        variant: "small" as ShipVariant,
        orientation: "horizontal" as const,
      };
      game.addShip("enemy", ship);
    });

    test("should hit ship correctly", () => {
      const shot = game.fireShot("player", { x: 0, y: 0 });
      expect(shot.hit).toBe(true);
      expect(shot.shipId).toBe(0);
      expect(game.getShots("enemy")).toHaveLength(1);
    });

    test("should miss ship correctly", () => {
      const shot = game.fireShot("player", { x: 5, y: 5 });
      expect(shot.hit).toBe(false);
      expect(shot.shipId).toBeUndefined();
      expect(game.getShots("enemy")).toHaveLength(1);
    });

    test("should reject duplicate shots", () => {
      game.fireShot("player", { x: 0, y: 0 });
      expect(() => game.fireShot("player", { x: 0, y: 0 })).toThrow("Position already shot");
    });

    test("should track shot positions correctly", () => {
      const position: Position = { x: 3, y: 4 };
      game.fireShot("player", position);
      expect(game.isPositionShot("enemy", position)).toBe(true);
      expect(game.isPositionShot("enemy", { x: 5, y: 5 })).toBe(false);
    });
  });

  describe("Ship Destruction", () => {
    beforeEach(() => {
      const ship = {
        position: { x: 0, y: 0 },
        variant: "small" as ShipVariant,
        orientation: "horizontal" as const,
      };
      game.addShip("enemy", ship);
    });

    test("should detect ship destruction", () => {
      expect(game.isShipDestroyed("enemy", 0)).toBe(false);

      game.fireShot("player", { x: 0, y: 0 });
      game.fireShot("player", { x: 1, y: 0 });

      expect(game.isShipDestroyed("enemy", 0)).toBe(true);
    });
  });

  describe("Game State", () => {
    test("should not be game over initially", () => {
      expect(game.isGameOver()).toBe(false);
      expect(game.getWinner()).toBeNull();
    });

    test("should detect game over when all enemy ships are destroyed", () => {
      const ship = {
        position: { x: 0, y: 0 },
        variant: "small" as ShipVariant,
        orientation: "horizontal" as const,
      };
      game.addShip("enemy", ship);

      game.fireShot("player", { x: 0, y: 0 });
      game.fireShot("player", { x: 1, y: 0 });

      expect(game.isGameOver()).toBe(true);
      expect(game.getWinner()).toBe("player");
    });
  });

  describe("Ship Size Calculation", () => {
    test("should return correct ship sizes", () => {
      expect(game.getShipSize("small")).toBe(2);
      expect(game.getShipSize("medium")).toBe(3);
      expect(game.getShipSize("large")).toBe(4);
      expect(game.getShipSize("xlarge")).toBe(5);
    });
  });
}); 