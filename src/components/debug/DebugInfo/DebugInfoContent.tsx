import { COLORS } from "@/config/colors";
import { useGameState } from "@/hooks/useGameState";
import { useMockSimulation } from "@/hooks/useMockSimulation";
import { useVisualMockSimulation } from "@/hooks/useVisualMockSimulation";
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

  const {
    isRunning,
    lastResult,
    error,
    runSimulation,
    clearResult
  } = useMockSimulation();

  const {
    isSimulating,
    currentStep,
    simulationResult,
    error: visualError,
    runVisualSimulation,
    runQuickGameOverSimulation,
    resetSimulation,
  } = useVisualMockSimulation();

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

  const renderGameOverButtons = () => (
    <div style={{ marginBottom: "15px" }}>
      <h4 style={{ margin: "0 0 8px 0", fontSize: "12px" }}>🏁 Fin de Juego Visual</h4>
      
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "8px" }}>
        <button
          onClick={() => runQuickGameOverSimulation('player')}
          disabled={isSimulating}
          style={{
            background: "#4CAF50",
            color: "white",
            border: "none",
            padding: "4px 8px",
            borderRadius: "3px",
            cursor: isSimulating ? "not-allowed" : "pointer",
            fontSize: "9px",
            opacity: isSimulating ? 0.6 : 1,
          }}
        >
          {isSimulating ? '⏳' : '🎬'} Visual Jugador Gana
        </button>
        
        <button
          onClick={() => runQuickGameOverSimulation('enemy')}
          disabled={isSimulating}
          style={{
            background: "#F44336",
            color: "white",
            border: "none",
            padding: "4px 8px",
            borderRadius: "3px",
            cursor: isSimulating ? "not-allowed" : "pointer",
            fontSize: "9px",
            opacity: isSimulating ? 0.6 : 1,
          }}
        >
          {isSimulating ? '⏳' : '🎬'} Visual Enemigo Gana
        </button>
        
        <button
          onClick={() => runQuickGameOverSimulation('player')}
          disabled={isSimulating}
          style={{
            background: "#FF9800",
            color: "white",
            border: "none",
            padding: "4px 8px",
            borderRadius: "3px",
            cursor: isSimulating ? "not-allowed" : "pointer",
            fontSize: "9px",
            opacity: isSimulating ? 0.6 : 1,
          }}
        >
          {isSimulating ? '⏳' : '🎬'} Visual Empate (Player)
        </button>
      </div>
      
      <button
        onClick={resetSimulation}
        disabled={isSimulating}
        style={{
          background: "#607D8B",
          color: "white",
          border: "none",
          padding: "4px 8px",
          borderRadius: "3px",
          cursor: isSimulating ? "not-allowed" : "pointer",
          fontSize: "9px",
          opacity: isSimulating ? 0.6 : 1,
        }}
      >
        🔄 Reset Simulación
      </button>
    </div>
  );

  const renderMockSimulationResults = () => {
    if (!lastResult) return null;

    return (
      <div style={{ marginBottom: "15px" }}>
        <h4 style={{ margin: "0 0 8px 0", fontSize: "12px" }}>📊 Resultados Simulación</h4>
        <div style={{ fontSize: "10px", marginBottom: "8px" }}>
          <div>Ganador: {lastResult.winner}</div>
          <div>Turnos: {lastResult.totalTurns}</div>
          <div>Disparos Jugador: {lastResult.playerShots}</div>
          <div>Disparos Enemigo: {lastResult.enemyShots}</div>
        </div>
        <button
          onClick={clearResult}
          style={{
            background: "#607D8B",
            color: "white",
            border: "none",
            padding: "4px 8px",
            borderRadius: "3px",
            cursor: "pointer",
            fontSize: "9px",
          }}
        >
          🗑️ Limpiar
        </button>
      </div>
    );
  };

  const renderVisualSimulationStatus = () => {
    if (!isSimulating && !simulationResult) return null;

    return (
      <div style={{ marginBottom: "15px" }}>
        <h4 style={{ margin: "0 0 8px 0", fontSize: "12px" }}>🎬 Simulación Visual</h4>
        
        {isSimulating && (
          <div style={{ fontSize: "10px", marginBottom: "8px" }}>
            <div>⏳ Simulando... Paso {currentStep}</div>
          </div>
        )}
        
        {visualError && (
          <div style={{ fontSize: "10px", marginBottom: "8px", color: "#F44336" }}>
            ❌ Error: {visualError}
          </div>
        )}
        
                 {simulationResult && !isSimulating && (
           <div style={{ fontSize: "10px", marginBottom: "8px" }}>
             <div>✅ Completada</div>
             <div>Ganador: {simulationResult.winner}</div>
             <div>Turnos: {simulationResult.totalTurns}</div>
           </div>
         )}
      </div>
    );
  };

  const renderMockSimulationButtons = () => (
    <div style={{ marginBottom: "15px" }}>
      <h4 style={{ margin: "0 0 8px 0", fontSize: "12px" }}>🧪 Simulación Mock</h4>
      
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "8px" }}>
        <button
          onClick={() => runSimulation('quick')}
          disabled={isRunning}
          style={{
            background: "#2196F3",
            color: "white",
            border: "none",
            padding: "4px 8px",
            borderRadius: "3px",
            cursor: isRunning ? "not-allowed" : "pointer",
            fontSize: "9px",
            opacity: isRunning ? 0.6 : 1,
          }}
        >
          {isRunning ? '⏳' : '⚡'} Quick Game
        </button>
        
        <button
          onClick={() => runSimulation('random')}
          disabled={isRunning}
          style={{
            background: "#9C27B0",
            color: "white",
            border: "none",
            padding: "4px 8px",
            borderRadius: "3px",
            cursor: isRunning ? "not-allowed" : "pointer",
            fontSize: "9px",
            opacity: isRunning ? 0.6 : 1,
          }}
        >
          {isRunning ? '⏳' : '🎲'} Random Game
        </button>
        
        <button
          onClick={() => runVisualSimulation()}
          disabled={isSimulating || isRunning}
          style={{
            background: "#FF5722",
            color: "white",
            border: "none",
            padding: "4px 8px",
            borderRadius: "3px",
            cursor: (isSimulating || isRunning) ? "not-allowed" : "pointer",
            fontSize: "9px",
            opacity: (isSimulating || isRunning) ? 0.6 : 1,
          }}
        >
          {(isSimulating || isRunning) ? '⏳' : '🎬'} Visual Sim
        </button>
      </div>
      
      {error && (
        <div style={{ fontSize: "10px", marginBottom: "8px", color: "#F44336" }}>
          ❌ Error: {error}
        </div>
      )}
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

      {renderGameOverButtons()}
      {renderMockSimulationButtons()}
      {renderMockSimulationResults()}
      {renderVisualSimulationStatus()}

      {renderShipInfo(playerShips, "Barcos del Jugador")}
      {renderShipInfo(enemyShips, "Barcos del Enemigo")}
    </div>
  );
}; 