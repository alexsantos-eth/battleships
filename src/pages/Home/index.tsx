import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [gameConfig, setGameConfig] = useState({
    gridSize: 10,
    ships: {
      small: 1,
      medium: 1,
      large: 1,
      xlarge: 1,
    },
    difficulty: "medium",
  });

  const handleCreateGame = () => {
    const totalShips = Object.values(gameConfig.ships).reduce((sum, count) => sum + count, 0);
    
    if (totalShips === 0) {
      alert("Debes seleccionar al menos un barco para crear la partida.");
      return;
    }
    
    const params = new URLSearchParams({
      gridSize: gameConfig.gridSize.toString(),
      ships: JSON.stringify(gameConfig.ships),
      difficulty: gameConfig.difficulty,
    });
    
    navigate(`/match?${params.toString()}`);
  };

  const handleGoToTesting = () => {
    navigate("/testing");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Armada.io</h1>
          <p className="text-blue-200">Prepara tu flota para la batalla</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Tamaño del tablero
            </label>
            <select
              value={gameConfig.gridSize}
              onChange={(e) => setGameConfig(prev => ({ ...prev, gridSize: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value={8}>8x8</option>
              <option value={10}>10x10</option>
              <option value={12}>12x12</option>
            </select>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Dificultad
            </label>
            <select
              value={gameConfig.difficulty}
              onChange={(e) => setGameConfig(prev => ({ ...prev, difficulty: e.target.value }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="easy">Fácil</option>
              <option value="medium">Medio</option>
              <option value="hard">Difícil</option>
            </select>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Configuración de barcos
            </label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-blue-200 text-sm">Extra Grande (5 celdas):</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setGameConfig(prev => ({
                      ...prev,
                      ships: {
                        ...prev.ships,
                        xlarge: Math.max(0, prev.ships.xlarge - 1)
                      }
                    }))}
                    className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-lg font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="text-white font-bold min-w-[2rem] text-center">
                    {gameConfig.ships.xlarge}
                  </span>
                  <button
                    onClick={() => setGameConfig(prev => ({
                      ...prev,
                      ships: {
                        ...prev.ships,
                        xlarge: Math.min(5, prev.ships.xlarge + 1)
                      }
                    }))}
                    className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center text-lg font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-blue-200 text-sm">Grande (4 celdas):</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setGameConfig(prev => ({
                      ...prev,
                      ships: {
                        ...prev.ships,
                        large: Math.max(0, prev.ships.large - 1)
                      }
                    }))}
                    className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-lg font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="text-white font-bold min-w-[2rem] text-center">
                    {gameConfig.ships.large}
                  </span>
                  <button
                    onClick={() => setGameConfig(prev => ({
                      ...prev,
                      ships: {
                        ...prev.ships,
                        large: Math.min(5, prev.ships.large + 1)
                      }
                    }))}
                    className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center text-lg font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-blue-200 text-sm">Mediano (3 celdas):</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setGameConfig(prev => ({
                      ...prev,
                      ships: {
                        ...prev.ships,
                        medium: Math.max(0, prev.ships.medium - 1)
                      }
                    }))}
                    className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-lg font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="text-white font-bold min-w-[2rem] text-center">
                    {gameConfig.ships.medium}
                  </span>
                  <button
                    onClick={() => setGameConfig(prev => ({
                      ...prev,
                      ships: {
                        ...prev.ships,
                        medium: Math.min(5, prev.ships.medium + 1)
                      }
                    }))}
                    className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center text-lg font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-blue-200 text-sm">Pequeño (2 celdas):</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setGameConfig(prev => ({
                      ...prev,
                      ships: {
                        ...prev.ships,
                        small: Math.max(0, prev.ships.small - 1)
                      }
                    }))}
                    className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-lg font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="text-white font-bold min-w-[2rem] text-center">
                    {gameConfig.ships.small}
                  </span>
                  <button
                    onClick={() => setGameConfig(prev => ({
                      ...prev,
                      ships: {
                        ...prev.ships,
                        small: Math.min(5, prev.ships.small + 1)
                      }
                    }))}
                    className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center text-lg font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-3 p-3 bg-blue-900/30 rounded-lg">
              <div className="text-center text-blue-200 text-sm mb-3">
                <span className="font-semibold">Total de barcos: </span>
                <span className="text-white font-bold">
                  {Object.values(gameConfig.ships).reduce((sum, count) => sum + count, 0)}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setGameConfig(prev => ({
                    ...prev,
                    ships: { small: 1, medium: 1, large: 1, xlarge: 1 }
                  }))}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                >
                  Clásico
                </button>
                <button
                  onClick={() => setGameConfig(prev => ({
                    ...prev,
                    ships: { small: 2, medium: 2, large: 2, xlarge: 2 }
                  }))}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
                >
                  Doble
                </button>
                <button
                  onClick={() => setGameConfig(prev => ({
                    ...prev,
                    ships: { small: 0, medium: 0, large: 0, xlarge: 0 }
                  }))}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                >
                  Limpiar
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleCreateGame}
            disabled={Object.values(gameConfig.ships).reduce((sum, count) => sum + count, 0) === 0}
            className={`w-full font-bold py-3 px-4 rounded-lg transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              Object.values(gameConfig.ships).reduce((sum, count) => sum + count, 0) === 0
                ? "bg-gray-500 cursor-not-allowed opacity-50"
                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:scale-105"
            }`}
          >
            {Object.values(gameConfig.ships).reduce((sum, count) => sum + count, 0) === 0
              ? "Selecciona al menos un barco"
              : "Crear Partida"
            }
          </button>

          <div className="border-t border-white/20 pt-4">
            <button
              onClick={handleGoToTesting}
              className="w-full font-bold py-2 px-4 rounded-lg transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 hover:scale-105 text-sm"
            >
              🧪 Modo Testing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 