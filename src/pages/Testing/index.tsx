import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import GameGrid from "@/components/GameGrid";
import { DebugPanel } from "@/components/DebugPanel";
import TestingInfo from "@/components/TestingInfo";
import EnvironmentBox from "@/env";
import UIBox from "@/ui";
import type { GameConfig } from "@/game/logic/gameInitializer";
import { useGameStore } from "@/stores/gameStore";

const Testing = () => {
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPlayerBoard, setShowPlayerBoard] = useState(true);
  const [showEnemyBoard, setShowEnemyBoard] = useState(true);
  const [showShips, setShowShips] = useState(true);
  const [showShots, setShowShots] = useState(true);
  const [alwaysShowEnemyShips, setAlwaysShowEnemyShips] = useState(false);
  
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
          <h2 className="text-2xl font-bold text-white mb-2">Testing Mode</h2>
          <p className="text-purple-200 mb-4">Inicializando entorno de testing...</p>
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
          Reset Game
        </button>
      </div>

      <div className="fixed top-4 right-4 z-50 bg-black/50 backdrop-blur-md rounded-lg p-4 border border-white/20">
        <h3 className="text-white font-bold mb-2">Testing Controls</h3>
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
        
        <div className="mt-4 space-y-1 text-xs text-white">
          <div>Turn: {currentTurn}</div>
          <div>Game Over: {isGameOver ? "Yes" : "No"}</div>
          <div>Winner: {winner || "None"}</div>
          <div>Board: {boardWidth}x{boardHeight}</div>
          <div>Player Ships: {playerShips.length}</div>
          <div>Enemy Ships: {enemyShips.length}</div>
          <div>Player Shots: {playerShots.length}</div>
          <div>Enemy Shots: {enemyShots.length}</div>
        </div>

        <div className="mt-4 space-y-1">
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

export default Testing; 