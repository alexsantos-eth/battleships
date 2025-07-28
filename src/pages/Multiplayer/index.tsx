import { useState } from 'react';
import { MultiplayerMenu, RoomLobby } from '@/components/ui';
import type { GameConfig } from '@/types/game';

type MultiplayerState = 'menu' | 'lobby' | 'game';

export const MultiplayerPage = () => {
  const [state, setState] = useState<MultiplayerState>('menu');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);

  const handleRoomCreated = (newRoomId: string) => {
    setRoomId(newRoomId);
    setState('lobby');
  };

  const handleRoomJoined = (newRoomId: string) => {
    setRoomId(newRoomId);
    setState('lobby');
  };

  const handleGameStart = (config: GameConfig) => {
    setGameConfig(config);
    setState('game');
  };

  const handleLeaveRoom = () => {
    setRoomId(null);
    setGameConfig(null);
    setState('menu');
  };

  const handleBackToMenu = () => {
    setState('menu');
  };

  if (state === 'lobby' && roomId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <RoomLobby
          roomId={roomId}
          onGameStart={handleGameStart}
          onLeaveRoom={handleLeaveRoom}
        />
      </div>
    );
  }

  if (state === 'game' && gameConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="p-4">
          <button
            onClick={handleBackToMenu}
            className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            ← Volver al Menú
          </button>
        </div>
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Juego Multiplayer
          </h1>
          <p className="text-gray-600">
            Funcionalidad de juego multiplayer en desarrollo...
          </p>
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-700">
              Configuración del juego:
            </p>
            <p className="text-sm text-gray-600">
              Tablero: {gameConfig.boardWidth}x{gameConfig.boardHeight}
            </p>
            <p className="text-sm text-gray-600">
              Barcos: {Object.entries(gameConfig.shipCounts)
                .map(([type, count]) => `${count} ${type}`)
                .join(', ')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <MultiplayerMenu
        onRoomCreated={handleRoomCreated}
        onRoomJoined={handleRoomJoined}
      />
    </div>
  );
}; 