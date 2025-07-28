import { COLORS } from "@/config/colors";
import { useGameState } from "@/hooks/useGameState";
import { useGameStore } from "@/stores/game";
import { DEBUG_CONFIG } from "@/utils/debug";

import type { Ship } from "@/stores/game";
import type { DebugInfoContentProps } from './DebugInfo.types';

export const DebugInfoContent: React.FC<DebugInfoContentProps> = ({ className = '' }) => {
  const {
    currentTurn,
    playerShips,
    enemyShips,
    initializeGame,
    getShipSize,
    getShipCells,
  } = useGameState();

  const { isGameOver, winner, resetGame } = useGameStore();

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

  if (!DEBUG_CONFIG.ENABLE_DEBUG_INFO) {
    return null;
  }

  return (
    <div className={className} style={{
      background: COLORS.ui.debug.background,
      color: "white",
      padding: "15px",
      borderRadius: "8px",
      maxWidth: `${DEBUG_CONFIG.DEBUG_INFO_MAX_WIDTH}px`,
      maxHeight: DEBUG_CONFIG.DEBUG_INFO_MAX_HEIGHT,
      overflow: "auto",
      fontSize: "12px",
    }}>
      <h3 style={{ margin: "0 0 15px 0", fontSize: "14px" }}>Debug Info</h3>
      
      {DEBUG_CONFIG.SHOW_GAME_STATE && (
        <div style={{ marginBottom: "10px" }}>
          <strong>Turno actual:</strong> {currentTurn}
        </div>
      )}

      <button
        onClick={() => initializeGame()}
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
        🎮 Inicializar Juego
      </button>

      {isGameOver && (
        <div style={{ marginBottom: "15px" }}>
          <h4 style={{ margin: "0 0 8px 0", fontSize: "12px" }}>🏁 Estado del Juego</h4>
          <div style={{ fontSize: "10px", marginBottom: "8px" }}>
            <div>Estado: {isGameOver ? 'Terminado' : 'En curso'}</div>
            {winner && <div>Ganador: {winner}</div>}
          </div>
          <button
            onClick={resetGame}
            style={{
              background: "#4CAF50",
              color: "white",
              border: "none",
              padding: "4px 8px",
              borderRadius: "3px",
              cursor: "pointer",
              fontSize: "9px",
            }}
          >
            🔄 Reset Juego
          </button>
        </div>
      )}

      {renderShipInfo(playerShips, "Barcos del Jugador")}
      {renderShipInfo(enemyShips, "Barcos del Enemigo")}
    </div>
  );
}; 