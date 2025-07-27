import { COLORS } from "@/config/colors";
import { useGameState } from "@/hooks/useGameState";
import { DEBUG_CONFIG } from "@/utils/debug";

import type { Ship } from "@/stores/gameStore";
export const DebugInfo = () => {
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
      <h3>{title}</h3>
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
              marginBottom: "10px",
              padding: "5px",
              border: `1px solid ${COLORS.ui.debug.border}`,
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

  const getPositionStyles = () => {
    const baseStyles = {
      position: "fixed" as const,
      background: COLORS.ui.debug.background,
      color: "white",
      padding: "20px",
      borderRadius: "8px",
      maxWidth: `${DEBUG_CONFIG.DEBUG_INFO_MAX_WIDTH}px`,
      maxHeight: DEBUG_CONFIG.DEBUG_INFO_MAX_HEIGHT,
      overflow: "auto" as const,
      zIndex: 1000,
      fontSize: "12px",
    };

    const position = DEBUG_CONFIG.DEBUG_INFO_POSITION;
    
    const positionStyles = {
      'top-left': { top: "10px", left: "10px" },
      'top-right': { top: "10px", right: "10px" },
      'bottom-left': { bottom: "10px", left: "10px" },
      'bottom-right': { bottom: "10px", right: "10px" },
    };
    
    return { ...baseStyles, ...positionStyles[position as keyof typeof positionStyles] };
  };

  return (
    <div style={getPositionStyles()}>
      <h2>Debug Info</h2>
      
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
          padding: "8px 16px",
          borderRadius: "4px",
          cursor: "pointer",
          marginBottom: "15px",
        }}
      >
        Inicializar Juego
      </button>

      {renderShipInfo(playerShips, "Barcos del Jugador")}
      {renderShipInfo(enemyShips, "Barcos del Enemigo")}
    </div>
  );
};
