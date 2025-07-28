import { useState } from 'react';
import { useRoom } from '@/hooks/useRoom';
import { Button } from '../Button';

interface MultiplayerMenuProps {
  onRoomCreated?: (roomId: string) => void;
  onRoomJoined?: (roomId: string) => void;
}

export const MultiplayerMenu = ({ onRoomCreated, onRoomJoined }: MultiplayerMenuProps) => {
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
  const [displayName, setDisplayName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { createRoom, joinRoom } = useRoom();

  const handleCreateRoom = async () => {
    if (!displayName.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const room = await createRoom(displayName.trim());
      onRoomCreated?.(room.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la sala');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!displayName.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    if (!roomCode.trim() || roomCode.trim().length !== 5) {
      setError('El código de sala debe tener 5 caracteres');
      return;
    }

    setIsJoining(true);
    setError(null);

    try {
      const room = await joinRoom(roomCode.trim().toUpperCase(), displayName.trim());
      onRoomJoined?.(room.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al unirse a la sala');
    } finally {
      setIsJoining(false);
    }
  };

  const resetForm = () => {
    setDisplayName('');
    setRoomCode('');
    setError(null);
  };

  if (mode === 'create') {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Crear Sala</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
              Tu Nombre
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa tu nombre"
              maxLength={20}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex space-x-3">
            <Button
              onClick={handleCreateRoom}
              disabled={isCreating}
              className="flex-1"
            >
              {isCreating ? 'Creando...' : 'Crear Sala'}
            </Button>
            
            <Button
              onClick={() => {
                setMode('menu');
                resetForm();
              }}
              variant="secondary"
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'join') {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Unirse a Sala</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="joinDisplayName" className="block text-sm font-medium text-gray-700 mb-1">
              Tu Nombre
            </label>
            <input
              id="joinDisplayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa tu nombre"
              maxLength={20}
            />
          </div>

          <div>
            <label htmlFor="roomCode" className="block text-sm font-medium text-gray-700 mb-1">
              Código de Sala
            </label>
            <input
              id="roomCode"
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-center text-lg tracking-wider"
              placeholder="ABCDE"
              maxLength={5}
              style={{ letterSpacing: '0.5em' }}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex space-x-3">
            <Button
              onClick={handleJoinRoom}
              disabled={isJoining}
              className="flex-1"
            >
              {isJoining ? 'Uniéndose...' : 'Unirse'}
            </Button>
            
            <Button
              onClick={() => {
                setMode('menu');
                resetForm();
              }}
              variant="secondary"
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Multiplayer</h2>
      
      <div className="space-y-4">
        <Button
          onClick={() => setMode('create')}
          className="w-full py-3 text-lg"
        >
          Crear Nueva Sala
        </Button>
        
        <Button
          onClick={() => setMode('join')}
          variant="secondary"
          className="w-full py-3 text-lg"
        >
          Unirse a Sala
        </Button>
      </div>
    </div>
  );
}; 