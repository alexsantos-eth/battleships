import type { Ship, Shot } from "@/stores/game";

export interface TestingInfoProps {
  className?: string;
}

export interface ShotInfo {
  hits: number;
  misses: number;
  total: number;
}

export interface ShipCounts {
  [key: string]: number;
} 