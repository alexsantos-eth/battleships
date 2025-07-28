import type { GameHistory as GameHistoryType } from '@/types/user';

export interface GameHistoryProps {
  className?: string;
}

export interface GameHistoryItemProps {
  game: GameHistoryType;
  className?: string;
} 