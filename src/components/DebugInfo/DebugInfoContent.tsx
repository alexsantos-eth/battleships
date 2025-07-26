import { COLORS } from "@/config/colors";
import { useGameState } from "@/hooks/useGameState";
import { DEBUG_CONFIG } from "@/utils/debug";

import type { Ship } from "@/stores/gameStore";

export const DebugInfoContent = () => {
  const {
    currentTurn,
    playerShips,
    enemyShips,
    initializeGame,
    getShipSize,
    getShipCells,
  } = useGameState();

  const renderShipInfo = (ships: Ship[], title: string) => (
    <div style={{ marginBottom: "20px" }}>
      <h4 style={{ margin: "0 0 10px 0", fontSize: "13px" }}>{title}</h4>
      {ships.map((ship, index) => {
        const size = getShipSize(ship.variant);
        const cells = getShipCells(
          ship.coords[0],
          ship.coords[1],
          size,
          ship.orientation
        );
        return (
          <div
            key={index}
            style={{
              marginBottom: "8px",
              padding: "4px",
              border: `1px solid ${COLORS.ui.debug.border}`,
              fontSize: "10px",
            }}
          >
            {DEBUG_CONFIG.SHOW_SHIP_DETAILS && (
              <div>
                Barco {index + 1}: {ship.variant} (tamaño: {size})
              </div>
            )}
            <div>
              Posición: [{ship.coords[0]}, {ship.coords[1]}]
            </div>
            <div>Orientación: {ship.orientation}</div>
            {DEBUG_CONFIG.SHOW_CELL_COORDINATES && (
              <div>Celdas: {cells.map(([x, y]) => `[${x},${y}]`).join(", ")}</div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div>
      {DEBUG_CONFIG.SHOW_GAME_STATE && (
        <div style={{ marginBottom: "10px" }}>
          <strong>Turno actual:</strong> {currentTurn}
        </div>
      )}

      <button
        onClick={initializeGame}
        style={{
          background: COLORS.ui.debug.button,
          color: "white",
          border: "none",
          padding: "6px 12px",
          borderRadius: "4px",
          cursor: "pointer",
          marginBottom: "15px",
          fontSize: "10px",
        }}
      >
        Inicializar Juego
      </button>

      {renderShipInfo(playerShips, "Barcos del Jugador")}
      {renderShipInfo(enemyShips, "Barcos del Enemigo")}
    </div>
  );
}; 