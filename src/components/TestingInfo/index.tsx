import { useGameStore, type Ship, type Shot } from "@/stores/gameStore";

const TestingInfo = () => {
  const {
    playerShips,
    enemyShips,
    playerShots,
    enemyShots,
    currentTurn,
    isGameOver,
    winner,
    boardWidth,
    boardHeight,
  } = useGameStore();

  const getShipInfo = (ships: Ship[]) => {
    const shipCounts = ships.reduce((acc, ship) => {
      acc[ship.variant] = (acc[ship.variant] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(shipCounts).map(([variant, count]) => (
      <div key={variant} className="text-xs">
        {variant}: {count}
      </div>
    ));
  };

  const getShotInfo = (shots: Shot[]) => {
    const hits = shots.filter(shot => shot.hit).length;
    const misses = shots.filter(shot => !shot.hit).length;
    return { hits, misses, total: shots.length };
  };

  const playerShotInfo = getShotInfo(playerShots);
  const enemyShotInfo = getShotInfo(enemyShots);

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black/70 backdrop-blur-md rounded-lg p-4 border border-white/20 max-w-sm">
      <h3 className="text-white font-bold mb-3 text-sm">Game State Info</h3>
      
      <div className="space-y-3 text-xs">
        <div>
          <div className="text-purple-300 font-semibold mb-1">Game Status</div>
          <div className="text-white space-y-1">
            <div>Turn: <span className="text-blue-300">{currentTurn}</span></div>
            <div>Game Over: <span className={isGameOver ? "text-red-400" : "text-green-400"}>{isGameOver ? "Yes" : "No"}</span></div>
            <div>Winner: <span className="text-yellow-300">{winner || "None"}</span></div>
            <div>Board: <span className="text-cyan-300">{boardWidth}x{boardHeight}</span></div>
          </div>
        </div>

        <div>
          <div className="text-purple-300 font-semibold mb-1">Player Ships ({playerShips.length})</div>
          <div className="text-white space-y-1">
            {getShipInfo(playerShips)}
            {playerShips.length === 0 && <div className="text-gray-400">No ships</div>}
          </div>
        </div>

        <div>
          <div className="text-purple-300 font-semibold mb-1">Enemy Ships ({enemyShips.length})</div>
          <div className="text-white space-y-1">
            {getShipInfo(enemyShips)}
            {enemyShips.length === 0 && <div className="text-gray-400">No ships</div>}
          </div>
        </div>

        <div>
          <div className="text-purple-300 font-semibold mb-1">Player Shots ({playerShotInfo.total})</div>
          <div className="text-white space-y-1">
            <div>Hits: <span className="text-green-400">{playerShotInfo.hits}</span></div>
            <div>Misses: <span className="text-red-400">{playerShotInfo.misses}</span></div>
            <div>Accuracy: <span className="text-yellow-300">{playerShotInfo.total > 0 ? Math.round((playerShotInfo.hits / playerShotInfo.total) * 100) : 0}%</span></div>
          </div>
        </div>

        <div>
          <div className="text-purple-300 font-semibold mb-1">Enemy Shots ({enemyShotInfo.total})</div>
          <div className="text-white space-y-1">
            <div>Hits: <span className="text-green-400">{enemyShotInfo.hits}</span></div>
            <div>Misses: <span className="text-red-400">{enemyShotInfo.misses}</span></div>
            <div>Accuracy: <span className="text-yellow-300">{enemyShotInfo.total > 0 ? Math.round((enemyShotInfo.hits / enemyShotInfo.total) * 100) : 0}%</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestingInfo; 