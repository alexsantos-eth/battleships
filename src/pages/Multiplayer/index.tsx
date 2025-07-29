import { useState } from 'react';
import { MultiplayerMenu, RoomLobby } from '@/components/ui';
import { GameScreen } from '@/components/features/GameScreen';
import { useEnemyAI } from '@/hooks/useEnemyAI';
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
    return <MultiplayerGame onBackToMenu={handleBackToMenu} gameConfig={gameConfig} />;
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

interface MultiplayerGameProps {
  onBackToMenu: () => void;
  gameConfig: GameConfig;
}

const MultiplayerGame: React.FC<MultiplayerGameProps> = ({ onBackToMenu, gameConfig }) => {
  useEnemyAI();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="p-4">
        <button
          onClick={onBackToMenu}
          className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          ← Volver al Menú
        </button>
        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
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
      <GameScreen />
    </div>
  );
}; 