/**
 * Página de prueba para el simulador de batallas
 * 
 * Para usar: agregar esta ruta en tu router
 */

import { useState } from "react";
import { 
  simulateSingleGame, 
  simulateMultipleGames 
} from "@/game/simulator";
import type { BattleResult } from "@/types/game/common";

const SimulatorTestPage = () => {
  const [singleResult, setSingleResult] = useState<BattleResult | null>(null);
  const [multiResults, setMultiResults] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulateSingle = () => {
    setIsSimulating(true);
    
    // Simular en el siguiente tick para no bloquear la UI
    setTimeout(() => {
      const result = simulateSingleGame({
        boardWidth: 10,
        boardHeight: 10,
        initialTurn: "random",
      });
      setSingleResult(result);
      setIsSimulating(false);
    }, 100);
  };

  const handleSimulateMultiple = (count: number) => {
    setIsSimulating(true);
    
    // Simular en el siguiente tick para no bloquear la UI
    setTimeout(() => {
      const results = simulateMultipleGames(count, {
        boardWidth: 10,
        boardHeight: 10,
        initialTurn: "random",
      });
      setMultiResults(results);
      setIsSimulating(false);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          🎮 Simulador de Batallas - Pruebas
        </h1>

        {/* Controles */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Controles</h2>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleSimulateSingle}
              disabled={isSimulating}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Simular 1 Partida
            </button>

            <button
              onClick={() => handleSimulateMultiple(100)}
              disabled={isSimulating}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Simular 100 Partidas
            </button>

            <button
              onClick={() => handleSimulateMultiple(1000)}
              disabled={isSimulating}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Simular 1,000 Partidas
            </button>

            <button
              onClick={() => handleSimulateMultiple(10000)}
              disabled={isSimulating}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Simular 10,000 Partidas
            </button>
          </div>

          {isSimulating && (
            <p className="mt-4 text-yellow-400 animate-pulse">
              ⏳ Simulando... Por favor espera
            </p>
          )}
        </div>

        {/* Resultado de partida individual */}
        {singleResult && (
          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              📊 Resultado de Partida Individual
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-blue-400">
                  🏆 Información General
                </h3>
                <div className="space-y-2">
                  <p>
                    <strong>Ganador:</strong>{" "}
                    <span className={`font-bold ${
                      singleResult.winner === "player" 
                        ? "text-green-400" 
                        : singleResult.winner === "enemy"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}>
                      {singleResult.winner === "player" 
                        ? "🎉 Jugador" 
                        : singleResult.winner === "enemy"
                        ? "💀 Enemigo"
                        : "🤝 Empate"}
                    </span>
                  </p>
                  <p><strong>Total de turnos:</strong> {singleResult.totalTurns}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-green-400">
                  🎯 Estadísticas de Disparos
                </h3>
                <div className="space-y-2">
                  <p>
                    <strong>Jugador:</strong> {singleResult.playerShots} disparos, {" "}
                    {singleResult.playerHits} impactos (
                    {((singleResult.playerHits / singleResult.playerShots) * 100).toFixed(1)}%)
                  </p>
                  <p>
                    <strong>Enemigo:</strong> {singleResult.enemyShots} disparos, {" "}
                    {singleResult.enemyHits} impactos (
                    {((singleResult.enemyHits / singleResult.enemyShots) * 100).toFixed(1)}%)
                  </p>
                </div>
              </div>
            </div>

            {/* Historial de disparos */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3 text-purple-400">
                📜 Primeros 15 Disparos
              </h3>
              <div className="bg-gray-900 p-4 rounded overflow-auto max-h-96">
                <div className="space-y-1 font-mono text-sm">
                  {singleResult.shotHistory.slice(0, 15).map((shot, index) => {
                    const isPlayer = shot.turn === "PLAYER_TURN";
                    return (
                      <div 
                        key={index}
                        className={`${isPlayer ? "text-blue-300" : "text-red-300"}`}
                      >
                        <span className="text-gray-500">{String(index + 1).padStart(2, "0")}.</span>{" "}
                        <span className="font-bold">{isPlayer ? "P" : "E"}</span> →{" "}
                        ({shot.x}, {shot.y}){" "}
                        <span className={shot.hit ? "text-green-400" : "text-gray-500"}>
                          {shot.hit ? "💥 HIT" : "💦 Miss"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resultados múltiples */}
        {multiResults && (
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">
              📈 Estadísticas de Múltiples Partidas
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-green-400">
                  Victorias Jugador
                </h3>
                <p className="text-3xl font-bold">{multiResults.stats.playerWins}</p>
                <p className="text-sm text-gray-400">
                  {((multiResults.stats.playerWins / multiResults.results.length) * 100).toFixed(2)}%
                </p>
              </div>

              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-red-400">
                  Victorias Enemigo
                </h3>
                <p className="text-3xl font-bold">{multiResults.stats.enemyWins}</p>
                <p className="text-sm text-gray-400">
                  {((multiResults.stats.enemyWins / multiResults.results.length) * 100).toFixed(2)}%
                </p>
              </div>

              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-yellow-400">
                  Empates
                </h3>
                <p className="text-3xl font-bold">{multiResults.stats.draws}</p>
                <p className="text-sm text-gray-400">
                  {((multiResults.stats.draws / multiResults.results.length) * 100).toFixed(2)}%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-blue-400">
                  Promedios
                </h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Turnos por partida:</strong> {multiResults.stats.avgTurns.toFixed(2)}</p>
                  <p><strong>Impactos del jugador:</strong> {multiResults.stats.avgPlayerHits.toFixed(2)}</p>
                  <p><strong>Impactos del enemigo:</strong> {multiResults.stats.avgEnemyHits.toFixed(2)}</p>
                </div>
              </div>

              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-purple-400">
                  Precisión
                </h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Jugador:</strong> {multiResults.stats.avgPlayerAccuracy.toFixed(2)}%</p>
                  <p><strong>Enemigo:</strong> {multiResults.stats.avgEnemyAccuracy.toFixed(2)}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Información de uso */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">💡 Cómo Usar</h2>
          <div className="space-y-3 text-gray-300">
            <p>
              Este simulador ejecuta partidas completas <strong>sin actualizar la UI</strong>, 
              lo que permite simular miles de partidas en segundos.
            </p>
            
            <div className="bg-gray-900 p-4 rounded font-mono text-sm overflow-auto">
              <p className="text-green-400">// Simular una partida</p>
              <p>import {"{ simulateSingleGame }"} from '@/game/simulator';</p>
              <p>const result = simulateSingleGame();</p>
              <p className="mt-3 text-green-400">// Simular múltiples partidas</p>
              <p>import {"{ simulateMultipleGames }"} from '@/game/simulator';</p>
              <p>const {"{ results, stats }"} = simulateMultipleGames(1000);</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulatorTestPage;
