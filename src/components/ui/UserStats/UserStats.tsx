import { useUserProfile } from "@/user/hooks/profile/useUserProfile";

import type { UserStatsProps } from "./UserStats.types";

export const UserStats: React.FC<UserStatsProps> = ({ className = "" }) => {
  const { profile } = useUserProfile();

  if (!profile) return null;

  const { stats } = profile;
  const winRate =
    stats.gamesPlayed > 0
      ? ((stats.gamesWon / stats.gamesPlayed) * 100).toFixed(1)
      : "0.0";
  const accuracy =
    stats.totalShots > 0
      ? ((stats.totalHits / stats.totalShots) * 100).toFixed(1)
      : "0.0";

  return (
    <div
      className={`bg-white/10 backdrop-blur-lg rounded-lg p-4 shadow-lg border border-white/20 ${className}`}
    >
      <h3 className="text-white font-semibold mb-4">Game Statistics</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            {stats.gamesPlayed}
          </div>
          <div className="text-xs text-blue-200">Games Played</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">
            {stats.gamesWon}
          </div>
          <div className="text-xs text-green-200">Wins</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-red-400">
            {stats.gamesLost}
          </div>
          <div className="text-xs text-red-200">Losses</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">{winRate}%</div>
          <div className="text-xs text-yellow-200">Win Rate</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">{accuracy}%</div>
          <div className="text-xs text-purple-200">Accuracy</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400">
            {stats.currentStreak}
          </div>
          <div className="text-xs text-orange-200">Current Streak</div>
        </div>
      </div>

      {stats.bestTime && (
        <div className="mt-4 text-center">
          <div className="text-lg font-bold text-cyan-400">
            {Math.floor(stats.bestTime / 60)}:
            {(stats.bestTime % 60).toString().padStart(2, "0")}
          </div>
          <div className="text-xs text-cyan-200">Best Time</div>
        </div>
      )}
    </div>
  );
};
