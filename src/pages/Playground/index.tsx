import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import GameGrid from "@/components/GameGrid";
import { DebugPanel } from "@/components/DebugPanel";
import TestingInfo from "@/components/TestingInfo";
import EnvironmentBox from "@/env";
import UIBox from "@/ui";
import type { GameConfig } from "@/game/logic/gameInitializer";
import { useGameStore } from "@/stores/gameStore";
import { usePlaygroundStore } from "@/stores/playgroundStore";

const Playground = () => {
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPlayerBoard, setShowPlayerBoard] = useState(true);
  const [showEnemyBoard, setShowEnemyBoard] = useState(true);
  const [showShips, setShowShips] = useState(true);
  const [showShots, setShowShots] = useState(true);
  
  const { freeCameraMovement, setFreeCameraMovement } = usePlaygroundStore();
  
  const [alwaysShowEnemyShips, setAlwaysShowEnemyShips] = useState(true);
  
  const {
    initializeGame,
    playerShips,
    enemyShips,
    playerShots,
    enemyShots,
    currentTurn,
    isGameOver,
    winner,
    boardWidth,
    boardHeight,
    resetGame,
    setPlayerTurn,
    setEnemyTurn,
  } = useGameStore();

  const defaultConfig: Partial<GameConfig> = {
    boardWidth: 10,
    boardHeight: 10,
    shipCounts: {
      small: 2,
      medium: 2,
      large: 1,
      xlarge: 1,
    },
    enemyAI: "random",
    initialTurn: "player",
  };

  useEffect(() => {
    if (!isInitialized) {
      setIsLoading(true);
      setTimeout(() => {
        try {
          initializeGame(defaultConfig);
          setIsInitialized(true);
        } catch (error) {
          console.error("Error al inicializar el juego:", error);
        } finally {
          setIsLoading(false);
        }
      }, 200);
    }
  }, [isInitialized, initializeGame]);

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleResetGame = () => {
    resetGame();
    setIsInitialized(false);
  };

  if (isLoading || !isInitialized) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center z-50">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 max-w-md w-full mx-4 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">🚀 Armada.io Playground</h2>
          <p className="text-purple-200 mb-4">Inicializando entorno de experimentación...</p>
          <button
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => {
                try {
                  initializeGame(defaultConfig);
                  setIsInitialized(true);
                } catch (error) {
                  console.error("Error:", error);
                } finally {
                  setIsLoading(false);
                }
              }, 100);
            }}
            className="mt-4 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            Forzar Inicialización
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-4 left-4 z-50 space-y-2">
        <button
          onClick={handleBackToHome}
          className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200"
        >
          ← Volver al inicio
        </button>
        <button
          onClick={handleResetGame}
          className="bg-red-500/80 backdrop-blur-md text-white px-4 py-2 rounded-lg border border-red-300/20 hover:bg-red-600/80 transition-all duration-200"
        >
          🔄 Reset Game
        </button>
      </div>

      <div className="fixed top-4 right-4 z-50 bg-black/70 backdrop-blur-md rounded-lg p-4 border border-white/20 max-w-sm">
        <h3 className="text-white font-bold mb-3 text-sm flex items-center">
          🎮 Playground Controls
        </h3>
        
        <div className="space-y-3">
          <div>
            <h4 className="text-purple-300 font-semibold mb-2 text-xs">Visual Controls</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showPlayerBoard"
                  checked={showPlayerBoard}
                  onChange={(e) => setShowPlayerBoard(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="showPlayerBoard" className="text-white">Player Board</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showEnemyBoard"
                  checked={showEnemyBoard}
                  onChange={(e) => setShowEnemyBoard(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="showEnemyBoard" className="text-white">Enemy Board</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showShips"
                  checked={showShips}
                  onChange={(e) => setShowShips(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="showShips" className="text-white">Show Ships</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showShots"
                  checked={showShots}
                  onChange={(e) => setShowShots(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="showShots" className="text-white">Show Shots</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="alwaysShowEnemyShips"
                  checked={alwaysShowEnemyShips}
                  onChange={(e) => setAlwaysShowEnemyShips(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="alwaysShowEnemyShips" className="text-white">Always Show Enemy Ships</label>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-purple-300 font-semibold mb-2 text-xs">Camera Controls</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="freeCameraMovement"
                  checked={freeCameraMovement}
                  onChange={(e) => setFreeCameraMovement(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="freeCameraMovement" className="text-white">Free Camera Movement</label>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-purple-300 font-semibold mb-2 text-xs">Game State</h4>
            <div className="space-y-1 text-xs text-white">
              <div>Turn: <span className="text-blue-300">{currentTurn}</span></div>
              <div>Game Over: <span className={isGameOver ? "text-red-400" : "text-green-400"}>{isGameOver ? "Yes" : "No"}</span></div>
              <div>Winner: <span className="text-yellow-300">{winner || "None"}</span></div>
              <div>Board: <span className="text-cyan-300">{boardWidth}x{boardHeight}</span></div>
              <div>Player Ships: <span className="text-green-300">{playerShips.length}</span></div>
              <div>Enemy Ships: <span className="text-red-300">{enemyShips.length}</span></div>
              <div>Player Shots: <span className="text-blue-300">{playerShots.length}</span></div>
              <div>Enemy Shots: <span className="text-orange-300">{enemyShots.length}</span></div>
            </div>
          </div>

          <div>
            <h4 className="text-purple-300 font-semibold mb-2 text-xs">Turn Controls</h4>
            <div className="space-y-1">
              <button
                onClick={setPlayerTurn}
                className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs w-full"
              >
                Set Player Turn
              </button>
              <button
                onClick={setEnemyTurn}
                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs w-full"
              >
                Set Enemy Turn
              </button>
            </div>
          </div>
        </div>
      </div>

      <EnvironmentBox>
        {showPlayerBoard && (
          <GameGrid 
            isPlayerBoard={true} 
            showShips={showShips}
            showShots={showShots}
            alwaysShowEnemyShips={alwaysShowEnemyShips}
          />
        )}
        {showEnemyBoard && (
          <GameGrid
            isPlayerBoard={false}
            enablePressGrid={false}
            rotation={[0, 0, Math.PI]}
            position={[0, 9, 0]}
            showShips={showShips}
            showShots={showShots}
            alwaysShowEnemyShips={alwaysShowEnemyShips}
          />
        )}
      </EnvironmentBox>
      <UIBox />

      <DebugPanel />
      <TestingInfo />
    </>
  );
};

export default Playground; 