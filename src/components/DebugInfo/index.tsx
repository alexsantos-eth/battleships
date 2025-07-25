import { useGameState } from "@/hooks/useGameState";
import type { Ship } from "@/stores/gameStore";
import { COLORS } from "@/config/colors";

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
        const cells = getShipCells(ship.coords[0], ship.coords[1], size, ship.orientation);
        return (
          <div key={index} style={{ marginBottom: "10px", padding: "5px", border: `1px solid ${COLORS.ui.debug.border}` }}>
            <div>Barco {index + 1}: {ship.variant} (tamaño: {size})</div>
            <div>Posición: [{ship.coords[0]}, {ship.coords[1]}]</div>
            <div>Orientación: {ship.orientation}</div>
            <div>Celdas: {cells.map(([x, y]) => `[${x},${y}]`).join(", ")}</div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: COLORS.ui.debug.background,
        color: "white",
        padding: "20px",
        borderRadius: "8px",
        maxWidth: "400px",
        maxHeight: "80vh",
        overflow: "auto",
        zIndex: 1000,
        fontSize: "12px",
      }}
    >
      <h2>Debug Info</h2>
      <div style={{ marginBottom: "10px" }}>
        <strong>Turno actual:</strong> {currentTurn}
      </div>
      
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