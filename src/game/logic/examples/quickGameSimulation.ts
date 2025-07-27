import { BattleshipGame } from "../battleship";

export function runQuickGameSimulation() {
  const game = new BattleshipGame(10, 10);

  const playerShips = [
    {
      position: { x: 0, y: 0 },
      variant: "small" as const,
      orientation: "horizontal" as const,
    },
    {
      position: { x: 5, y: 5 },
      variant: "small" as const,
      orientation: "vertical" as const,
    },
  ];

  const enemyShips = [
    {
      position: { x: 1, y: 1 },
      variant: "small" as const,
      orientation: "horizontal" as const,
    },
    {
      position: { x: 6, y: 6 },
      variant: "small" as const,
      orientation: "vertical" as const,
    },
  ];

  playerShips.forEach((ship) => {
    game.addShip("player", ship);
  });

  enemyShips.forEach((ship) => {
    game.addShip("enemy", ship);
  });

  console.log("=== Simulación de Juego Rápido ===");
  console.log("Barcos del jugador:", game.getShips("player").length);
  console.log("Barcos del enemigo:", game.getShips("enemy").length);

  let turn = 1;

  while (!game.isGameOver()) {
    console.log(`\n--- Turno ${turn} ---`);
    console.log("Turno actual:", game.getCurrentTurn());

    if (game.isPlayerTurn()) {
      const enemyShips = game.getShips("enemy");
      for (const ship of enemyShips) {
        const shipSize = game.getShipSize(ship.variant);
        const positions = [];

        if (ship.orientation === "horizontal") {
          for (let i = 0; i < shipSize; i++) {
            positions.push({ x: ship.position.x + i, y: ship.position.y });
          }
        } else {
          for (let i = 0; i < shipSize; i++) {
            positions.push({ x: ship.position.x, y: ship.position.y + i });
          }
        }

        for (const pos of positions) {
          if (!game.isPositionShot("enemy", pos)) {
            const shot = game.fireShot("player", pos);
            console.log(
              `Jugador dispara en (${pos.x}, ${pos.y}) - ${
                shot.hit ? "¡HIT!" : "Miss"
              }`
            );
            if (shot.hit && game.isShipDestroyed("enemy", ship.id)) {
              console.log(`¡Barco enemigo ${ship.variant} destruido!`);
            }
            break;
          }
        }
      }
    } else {
      const playerShips = game.getShips("player");
      for (const ship of playerShips) {
        const shipSize = game.getShipSize(ship.variant);
        const positions = [];

        if (ship.orientation === "horizontal") {
          for (let i = 0; i < shipSize; i++) {
            positions.push({ x: ship.position.x + i, y: ship.position.y });
          }
        } else {
          for (let i = 0; i < shipSize; i++) {
            positions.push({ x: ship.position.x, y: ship.position.y + i });
          }
        }

        for (const pos of positions) {
          if (!game.isPositionShot("player", pos)) {
            const shot = game.fireShot("enemy", pos);
            console.log(
              `Enemigo dispara en (${pos.x}, ${pos.y}) - ${
                shot.hit ? "¡HIT!" : "Miss"
              }`
            );
            if (shot.hit && game.isShipDestroyed("player", ship.id)) {
              console.log(`¡Barco del jugador ${ship.variant} destruido!`);
            }
            break;
          }
        }
      }
    }

    game.toggleTurn();
    turn++;

    if (turn > 20) {
      console.log("Demasiados turnos, terminando simulación...");
      break;
    }
  }

  console.log("\n=== Resultado Final ===");
  console.log("¿Juego terminado?", game.isGameOver());
  console.log("Ganador:", game.getWinner());
  console.log("Turnos totales:", turn - 1);

  return {
    game,
    totalTurns: turn - 1,
    winner: game.getWinner(),
    isGameOver: game.isGameOver(),
  };
}

export default runQuickGameSimulation;
