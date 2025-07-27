import { useUserProfile } from '@/hooks/useUserProfile';
import type { GameHistory } from '@/types/user';

const GameHistoryItem = ({ game }: { game: GameHistory }) => {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
      <div className="flex items-center space-x-3">
        <div className={`w-3 h-3 rounded-full ${game.result === 'win' ? 'bg-green-500' : 'bg-red-500'}`} />
        <div>
          <div className="text-white font-medium">
            {game.result === 'win' ? 'Victory' : 'Defeat'}
          </div>
          <div className="text-xs text-blue-200">
            vs {game.opponentType === 'ai' ? 'AI' : 'Player'}
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <div className="text-white text-sm">{formatDuration(game.duration)}</div>
        <div className="text-xs text-blue-200">
          {game.hits}/{game.shots} ({game.accuracy.toFixed(1)}%)
        </div>
        <div className="text-xs text-gray-400">{formatDate(game.timestamp)}</div>
      </div>
    </div>
  );
};

const GameHistoryComponent = () => {
  const { profile } = useUserProfile();

  if (!profile || !profile.gameHistory.length) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 shadow-lg border border-white/20">
        <h3 className="text-white font-semibold mb-4">Game History</h3>
        <div className="text-center text-blue-200 py-8">
          <div className="text-4xl mb-2">🎮</div>
          <p>No games played yet</p>
          <p className="text-sm text-blue-300">Start playing to see your history!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 shadow-lg border border-white/20">
      <h3 className="text-white font-semibold mb-4">Recent Games</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {profile.gameHistory.slice(0, 10).map((game, index) => (
          <GameHistoryItem key={`${game.gameId}-${index}`} game={game} />
        ))}
      </div>
    </div>
  );
};

export default GameHistoryComponent; 