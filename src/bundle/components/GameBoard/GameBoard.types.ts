import type { Ship, Shot } from '@/types/game/common';

export interface GameBoardProps {
  ships: Ship[];
  shots: Shot[];
  onCellClick?: (x: number, y: number) => void;
  isPlayerBoard?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface CellData {
  x: number;
  y: number;
  hasShip: boolean;
  hasShot: boolean;
  isHit: boolean;
  shipId?: string;
} 