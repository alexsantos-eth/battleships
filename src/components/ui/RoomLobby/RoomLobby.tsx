import { useState } from 'react';
import { useRoom } from '@/hooks/useRoom';
import { Button } from '../Button';
import type { GameConfig } from '@/types/game';

interface RoomLobbyProps {
  roomId: string;
  onGameStart?: (gameConfig: GameConfig) => void;
  onLeaveRoom?: () => void;
}

export const RoomLobby = ({ roomId, onGameStart, onLeaveRoom }: RoomLobbyProps) => {
  const [isStarting, setIsStarting] = useState(false);
  const [gameConfig] = useState<GameConfig>({
    boardWidth: 10,
    boardHeight: 10,
    shipCounts: {
      small: 2,
      medium: 2,
      large: 1,
      xlarge: 1
    }
  });

  const {
    room,
    loading,
    error,
    setPlayerReady,
    startGame,
    leaveRoom,
    isHost,
    currentPlayer
  } = useRoom(roomId);

  const handleReadyToggle = async () => {
    if (!currentPlayer) return;
    
    try {
      await setPlayerReady(!currentPlayer.isReady);
    } catch (err) {
      console.error('Error al cambiar estado de listo:', err);
    }
  };

  const handleStartGame = async () => {
    if (!isHost) return;

    setIsStarting(true);
    try {
      await startGame(gameConfig);
      onGameStart?.(gameConfig);
    } catch (err) {
      console.error('Error al iniciar el juego:', err);
    } finally {
      setIsStarting(false);
    }
  };

  const handleGoToMatch = () => {
    window.location.href = `/match/${roomId}`;
  };

  const handleLeaveRoom = async () => {
    try {
      await leaveRoom();
      onLeaveRoom?.();
    } catch (err) {
      console.error('Error al salir de la sala:', err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando sala...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
        <div className="text-center">
          <p className="text-red-600 mb-4">Sala no encontrada</p>
          <Button onClick={onLeaveRoom}>Volver</Button>
        </div>
      </div>
    );
  }

  const bothPlayersReady = room.host.isReady && room.guest?.isReady;
  const canStartGame = isHost && bothPlayersReady;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Sala de Espera</h2>
        <div className="bg-gray-100 rounded-lg p-3">
          <p className="text-sm text-gray-600 mb-1">Código de Sala</p>
          <p className="text-2xl font-mono font-bold text-blue-600 tracking-wider">
            {room.roomCode}
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-800">{room.host.displayName}</p>
            <p className="text-sm text-gray-600">Host</p>
          </div>
          <div className="flex items-center space-x-2">
            {room.host.isReady ? (
              <span className="text-green-600 text-sm">✓ Listo</span>
            ) : (
              <span className="text-gray-500 text-sm">Esperando...</span>
            )}
          </div>
        </div>

        {room.guest ? (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">{room.guest.displayName}</p>
              <p className="text-sm text-gray-600">Invitado</p>
            </div>
            <div className="flex items-center space-x-2">
              {room.guest.isReady ? (
                <span className="text-green-600 text-sm">✓ Listo</span>
              ) : (
                <span className="text-gray-500 text-sm">Esperando...</span>
              )}
            </div>
          </div>
        ) : (
          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-500">Esperando que se una otro jugador...</p>
          </div>
        )}
      </div>

      {error && (
        <div className="text-red-600 text-sm mb-4 text-center">{error}</div>
      )}

      <div className="space-y-3">
        {currentPlayer && (
          <Button
            onClick={handleReadyToggle}
            variant={currentPlayer.isReady ? "secondary" : "primary"}
            className="w-full"
          >
            {currentPlayer.isReady ? 'No Estoy Listo' : 'Estoy Listo'}
          </Button>
        )}

        {bothPlayersReady && (
          <Button
            onClick={handleGoToMatch}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Ir al Match (Prueba Conexión)
          </Button>
        )}

        {canStartGame && (
          <Button
            onClick={handleStartGame}
            disabled={isStarting}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isStarting ? 'Iniciando...' : 'Iniciar Juego'}
          </Button>
        )}

        <Button
          onClick={handleLeaveRoom}
          variant="secondary"
          className="w-full"
        >
          Salir de la Sala
        </Button>
      </div>
    </div>
  );
}; 