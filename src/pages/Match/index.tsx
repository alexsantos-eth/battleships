import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMatchConnection } from '@/hooks/useMatchConnection';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Button } from '@/components/ui/Button';
import { ConnectionDebug } from '@/components/ui/ConnectionDebug';

const Match = () => {
  const {
    room,
    isConnected,
    isLoading,
    error,
    messages,
    currentPlayer,
    sendMessage,
    leaveRoom,
    setPlayerReady
  } = useMatchConnection();

  const { roomId } = useParams<{ roomId: string }>();

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Conectando a la sala..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error de Conexión</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <Button onClick={() => window.history.back()}>
            Volver
          </Button>
        </div>
      </div>
    );
  }

  if (!room || !currentPlayer) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Sala No Encontrada</h2>
          <p className="text-gray-300 mb-6">No se pudo encontrar la sala o no tienes acceso.</p>
          <Button onClick={() => window.history.back()}>
            Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Sala: {room.roomCode}</h1>
            <p className="text-gray-400 text-sm flex items-center gap-2">
              <span>Estado:</span>
              <span className={`flex items-center gap-1 ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                {isConnected ? 'Conectado' : 'Desconectado'}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="secondary" 
              onClick={() => setPlayerReady(!currentPlayer.isReady)}
              className={currentPlayer.isReady ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {currentPlayer.isReady ? 'Listo ✓' : 'No Listo'}
            </Button>
            <Button variant="danger" onClick={leaveRoom}>
              Salir
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de Jugadores */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Jugadores</h2>
                <div className={`flex items-center gap-1 text-xs ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                  {isConnected ? 'En línea' : 'Desconectado'}
                </div>
              </div>
              
              {/* Host */}
              <div className="mb-4">
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium">{room.host.displayName}</p>
                    <p className="text-sm text-gray-400">Host</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${room.host.isReady ? 'bg-green-500' : 'bg-gray-500'}`} />
                    <span className="text-sm">{room.host.isReady ? 'Listo' : 'No listo'}</span>
                  </div>
                </div>
              </div>

              {/* Guest */}
              {room.guest ? (
                <div className="mb-4">
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium">{room.guest.displayName}</p>
                      <p className="text-sm text-gray-400">Invitado</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${room.guest.isReady ? 'bg-green-500' : 'bg-gray-500'}`} />
                      <span className="text-sm">{room.guest.isReady ? 'Listo' : 'No listo'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <p className="text-gray-400 text-center">Esperando jugador...</p>
                  </div>
                </div>
              )}

              {/* Estado de la Sala */}
              <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                <h3 className="font-medium mb-2">Estado de la Sala</h3>
                <p className="text-sm text-gray-300">
                  {room.status === 'waiting' && 'Esperando jugadores...'}
                  {room.status === 'playing' && 'Jugando'}
                  {room.status === 'finished' && 'Finalizada'}
                </p>
              </div>
            </div>
          </div>

          {/* Chat y Mensajes */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg h-[600px] flex flex-col">
              {/* Header del Chat */}
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold">Chat de la Sala</h2>
                <p className="text-sm text-gray-400">Prueba la conexión en tiempo real</p>
              </div>

              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <p>No hay mensajes aún</p>
                    <p className="text-sm">Envía un mensaje para probar la conexión</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === currentPlayer.uid ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === currentPlayer.uid
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium">
                            {message.senderName}
                          </span>
                          <span className="text-xs opacity-75">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm">{message.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input de Mensaje */}
              <div className="p-4 border-t border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    Enviar
                  </Button>
                </div>
              </div>
            </div>

            {/* Botones de Prueba */}
            <div className="mt-4 bg-gray-800 rounded-lg p-4">
              <h3 className="font-medium mb-3">Pruebas de Conexión</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  onClick={() => sendMessage('¡Hola! ¿Cómo estás?')}
                >
                  Mensaje de Saludo
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => sendMessage('Probando conexión en tiempo real...')}
                >
                  Test Conexión
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => sendMessage(`Soy ${currentPlayer.displayName} y estoy conectado!`)}
                >
                  Identificarse
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setPlayerReady(!currentPlayer.isReady)}
                >
                  Cambiar Estado
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    console.log('🔍 Estado actual de mensajes:', messages);
                    console.log('🔍 Estado actual de la sala:', room);
                  }}
                >
                  Debug Estado
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Component (solo en desarrollo) */}
      {roomId && (
        <ConnectionDebug
          roomId={roomId}
          isConnected={isConnected}
          isLoading={isLoading}
          error={error}
          room={room}
          currentPlayer={currentPlayer}
        />
      )}
    </div>
  );
};

export default Match;
