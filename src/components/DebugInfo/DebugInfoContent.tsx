import { COLORS } from "@/config/colors";
import { useGameState } from "@/hooks/useGameState";
import { useMockSimulation } from "@/hooks/useMockSimulation";
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

  const {
    isRunning,
    lastResult,
    error,
    runSimulation,
    clearResult
  } = useMockSimulation();

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

  const renderMockSimulationResults = () => {
    if (!lastResult) return null;

    return (
      <div style={{ 
        marginTop: "15px", 
        padding: "10px", 
        border: `2px solid ${COLORS.ui.debug.border}`,
        borderRadius: "4px",
        backgroundColor: "#f5f5f5"
      }}>
        <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#333" }}>
          🎯 Resultados de Simulación Mock
        </h4>
        
        <div style={{ fontSize: "11px", marginBottom: "8px" }}>
          <strong>🏆 Ganador:</strong> {lastResult.winner === 'player' ? 'Jugador' : 'Enemigo'}
        </div>
        
        <div style={{ fontSize: "11px", marginBottom: "8px" }}>
          <strong>🔄 Turnos:</strong> {lastResult.totalTurns}
        </div>
        
        <div style={{ fontSize: "11px", marginBottom: "8px" }}>
          <strong>🎯 Jugador:</strong> {lastResult.playerHits}/{lastResult.playerShots} aciertos 
          ({((lastResult.playerHits / lastResult.playerShots) * 100).toFixed(1)}%)
        </div>
        
        <div style={{ fontSize: "11px", marginBottom: "8px" }}>
          <strong>🎯 Enemigo:</strong> {lastResult.enemyHits}/{lastResult.enemyShots} aciertos 
          ({((lastResult.enemyHits / lastResult.enemyShots) * 100).toFixed(1)}%)
        </div>

        <div style={{ fontSize: "10px", marginTop: "8px" }}>
          <strong>Historial de disparos:</strong>
          {lastResult.shotHistory.slice(-5).map((shot, index) => (
            <div key={index} style={{ marginLeft: "10px", fontSize: "9px" }}>
              {shot.turn === 'PLAYER_TURN' ? '👤' : '🤖'} ({shot.position.x}, {shot.position.y}) - {shot.hit ? '✅' : '❌'}
            </div>
          ))}
        </div>

        <button
          onClick={clearResult}
          style={{
            background: "#ff6b6b",
            color: "white",
            border: "none",
            padding: "4px 8px",
            borderRadius: "3px",
            cursor: "pointer",
            marginTop: "8px",
            fontSize: "9px",
          }}
        >
          Limpiar
        </button>
      </div>
    );
  };

  const renderMockSimulationButtons = () => (
    <div style={{ marginBottom: "15px" }}>
      <h4 style={{ margin: "0 0 8px 0", fontSize: "12px" }}>🎯 Simulaciones Mock</h4>
      
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
        <button
          onClick={() => runSimulation('quick')}
          disabled={isRunning}
          style={{
            background: COLORS.ui.debug.button,
            color: "white",
            border: "none",
            padding: "4px 8px",
            borderRadius: "3px",
            cursor: isRunning ? "not-allowed" : "pointer",
            fontSize: "9px",
            opacity: isRunning ? 0.6 : 1,
          }}
        >
          {isRunning ? '⏳' : '⚡'} Rápida
        </button>
        
        <button
          onClick={() => runSimulation('player-win')}
          disabled={isRunning}
          style={{
            background: "#4CAF50",
            color: "white",
            border: "none",
            padding: "4px 8px",
            borderRadius: "3px",
            cursor: isRunning ? "not-allowed" : "pointer",
            fontSize: "9px",
            opacity: isRunning ? 0.6 : 1,
          }}
        >
          {isRunning ? '⏳' : '👤'} Jugador Gana
        </button>
        
        <button
          onClick={() => runSimulation('enemy-win')}
          disabled={isRunning}
          style={{
            background: "#f44336",
            color: "white",
            border: "none",
            padding: "4px 8px",
            borderRadius: "3px",
            cursor: isRunning ? "not-allowed" : "pointer",
            fontSize: "9px",
            opacity: isRunning ? 0.6 : 1,
          }}
        >
          {isRunning ? '⏳' : '🤖'} Enemigo Gana
        </button>
      </div>

      {error && (
        <div style={{ 
          marginTop: "8px", 
          padding: "4px", 
          backgroundColor: "#ffebee", 
          color: "#c62828",
          fontSize: "9px",
          borderRadius: "3px"
        }}>
          ❌ Error: {error}
        </div>
      )}
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

      {renderMockSimulationButtons()}
      {renderMockSimulationResults()}

      {renderShipInfo(playerShips, "Barcos del Jugador")}
      {renderShipInfo(enemyShips, "Barcos del Enemigo")}
    </div>
  );
}; 