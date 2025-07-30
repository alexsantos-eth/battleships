import GameScene from "@/bundle/scene/Scene";
import { Button } from "@/components/ui/Button";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { GameInitializer, type GameSetup } from "@/game/manager/initializer";
import { useMatchConnection } from "@/network/multiplayer/hooks/useMatchConnection";
import { useMatchGameStateConnection } from "@/network/multiplayer/hooks/useMatchGameStateConnection";
import { useMatchTurnHandler } from "@/network/multiplayer/hooks/useMatchTurnHandler";

const Match = () => {
  const {
    room,
    isLoading,
    error,
    currentPlayer,

    setPlayerReady,
  } = useMatchConnection();

  useMatchGameStateConnection();
  useMatchTurnHandler();

  const bothPlayersReady = room?.host.isReady && room?.guest?.isReady;
  const gameStarted = room?.status === "playing" && bothPlayersReady;

  const initializer = new GameInitializer(room?.gameConfig);
  const playerStarts =
    room?.initialTurn === "host" && currentPlayer?.role === "host";

  const enemyShips =
    currentPlayer?.role === "host"
      ? room?.initialState?.enemyShips ?? []
      : room?.initialState?.playerShips ?? [];

  const gameSetup: GameSetup = {
    config: {
      ...initializer.getDefaultConfig(),
      ...room?.gameConfig,
      initialTurn: playerStarts ? "player" : "enemy",
    },
    initialTurn: playerStarts ? "PLAYER_TURN" : "ENEMY_TURN",
    playerShips:
      currentPlayer?.role === "host"
        ? room?.initialState?.playerShips ?? []
        : room?.initialState?.enemyShips ?? [],
    enemyShips,
  };

  if (isLoading) {
    return <LoadingScreen message="Conectando a la sala..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Error de Conexión
          </h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <Button onClick={() => window.history.back()}>Volver</Button>
        </div>
      </div>
    );
  }

  if (!room || !currentPlayer) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Sala No Encontrada
          </h2>
          <p className="text-gray-300 mb-6">
            No se pudo encontrar la sala o no tienes acceso.
          </p>
          <Button onClick={() => window.history.back()}>Volver</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => setPlayerReady(!currentPlayer.isReady)}
        className={
          !currentPlayer.isReady ? "bg-green-600 hover:bg-green-700" : ""
        }
      >
        {!currentPlayer.isReady ? "Listo ✓" : "No Listo"}
      </Button>

      {gameStarted && <GameScene gameSetup={gameSetup} />}
    </>
  );
};

export default Match;
