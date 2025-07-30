import type { GameHistory as GameHistoryType } from '@/types/user/profile';

export interface GameHistoryProps {
  className?: string;
}

export interface GameHistoryItemProps {
  game: GameHistoryType;
  className?: string;
} 