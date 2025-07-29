import { useState, useEffect } from 'react';
import { Button } from './Button/Button';
import type { GameRoom, RoomPlayer } from '@/types/game';

interface ConnectionDebugProps {
  roomId: string;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  room: GameRoom | null;
  currentPlayer: RoomPlayer | null;
}

interface FirebaseConfig {
  apiKey: string | undefined;
  authDomain: string | undefined;
  projectId: string | undefined;
  storageBucket: string | undefined;
  messagingSenderId: string | undefined;
  appId: string | undefined;
  databaseURL: string | undefined;
}

export const ConnectionDebug = ({ 
  roomId, 
  isConnected, 
  isLoading, 
  error, 
  room, 
  currentPlayer 
}: ConnectionDebugProps) => {
  const [showDebug, setShowDebug] = useState(false);
  const [firebaseConfig, setFirebaseConfig] = useState<FirebaseConfig | null>(null);

  useEffect(() => {
    const config: FirebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    };
    setFirebaseConfig(config);
  }, []);

  const testFirebaseConnection = async () => {
    try {
      console.log('🧪 Testing Firebase connection...');
      const { dbUtils } = await import('@/utils/realtimeDatabase');
      
      const testData = { test: true, timestamp: Date.now() };
      const testPath = `temp/test-${Date.now()}`;
      
      console.log('🧪 Writing test data...');
      await dbUtils.createDocument(testPath, testData);
      console.log('✅ Test write successful');
      
      console.log('🧪 Reading test data...');
      const readData = await dbUtils.getDocument(testPath);
      console.log('✅ Test read successful:', readData);
      
      console.log('🧪 Cleaning up test data...');
      await dbUtils.deleteDocument(testPath);
      console.log('✅ Test cleanup successful');
      
      alert('✅ Firebase connection test successful!');
    } catch (error) {
      console.error('❌ Firebase connection test failed:', error);
      alert(`❌ Firebase connection test failed: ${error}`);
    }
  };

  if (!showDebug) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setShowDebug(true)}
          className="bg-gray-800 text-white px-3 py-1 text-xs rounded"
        >
          Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold">Debug Info</h3>
        <Button
          onClick={() => setShowDebug(false)}
          className="bg-gray-700 text-white px-2 py-1 text-xs rounded"
        >
          ×
        </Button>
      </div>

      <div className="space-y-2 text-xs">
        <div>
          <strong>Room ID:</strong> {roomId}
        </div>
        <div>
          <strong>Connected:</strong> 
          <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
            {isConnected ? 'Yes' : 'No'}
          </span>
        </div>
        <div>
          <strong>Loading:</strong> 
          <span className={isLoading ? 'text-yellow-400' : 'text-gray-400'}>
            {isLoading ? 'Yes' : 'No'}
          </span>
        </div>
        {error && (
          <div>
            <strong>Error:</strong> 
            <span className="text-red-400">{error}</span>
          </div>
        )}
        <div>
          <strong>Room Code:</strong> {room?.roomCode || 'N/A'}
        </div>
        <div>
          <strong>Player:</strong> {currentPlayer?.displayName || 'N/A'}
        </div>
        <div>
          <strong>Messages:</strong> {room?.messages?.length || 0}
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <Button
          onClick={testFirebaseConnection}
          className="bg-blue-600 text-white px-2 py-1 text-xs rounded w-full"
        >
          Test Firebase Connection
        </Button>
        
        <details className="text-xs">
          <summary className="cursor-pointer text-gray-300">Firebase Config</summary>
          <pre className="mt-1 text-xs bg-gray-800 p-2 rounded overflow-auto">
            {JSON.stringify(firebaseConfig, null, 2)}
          </pre>
        </details>

        <details className="text-xs">
          <summary className="cursor-pointer text-gray-300">Room Data</summary>
          <pre className="mt-1 text-xs bg-gray-800 p-2 rounded overflow-auto">
            {JSON.stringify(room, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}; 