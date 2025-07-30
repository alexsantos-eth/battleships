import { useGameStore } from "@/bundle/stores/game/gameStore";

import type { ShotCounterProps } from "./ShotCounter.types";

export const ShotCounter: React.FC<ShotCounterProps> = ({ className = "" }) => {
  const { shotCount } = useGameStore();

  return (
    <div
      className={`bg-white/10 backdrop-blur-lg rounded-lg p-3 shadow-lg border border-white/20 ${className}`}
    >
      <div className="flex items-center justify-center space-x-2">
        <div className="text-lg">🎯</div>
        <div className="text-center">
          <div className="text-xl font-bold text-blue-400">{shotCount}</div>
          <div className="text-xs text-blue-200">Shots</div>
        </div>
      </div>
    </div>
  );
}; 