import { useAuth } from '@/hooks/useAuth';
import type { AuthDebugProps } from './AuthDebug.types';

export const AuthDebug: React.FC<AuthDebugProps> = ({ className = '' }) => {
  const { user, isLoading, isAuthenticated, reset } = useAuth();

  return (
    <div className={`fixed bottom-4 left-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50 ${className}`}>
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div>Loading: {isLoading ? 'true' : 'false'}</div>
      <div>Authenticated: {isAuthenticated ? 'true' : 'false'}</div>
      <div>User: {user ? user.uid : 'null'}</div>
      <button 
        onClick={reset}
        className="mt-2 bg-blue-600 px-2 py-1 rounded text-xs"
      >
        Reset Auth
      </button>
    </div>
  );
}; 