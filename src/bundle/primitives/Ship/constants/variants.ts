import { COLORS } from "@/config/colors/palette";
import { SHIP_VARIANTS_CONFIG } from "@/constants/game/board";

export interface SHIP_VARIANT {
  modelUrl: string;
  scale: number;
  health: number;
  size: number;
  extraOffset: number;
  projectionOffset: {
    x: number;
    y: number;
  };
  groupOffset: { x: number; y: number; z: number };
  shipOffset: {
    horizontal: { x: number; y: number; z: number };
    vertical: { x: number; y: number; z: number };
  };
  waveFrequency: number;
  waveAmplitude: number;
  color: string;
}

export const SHIP_VARIANTS = {
  small: {
    ...SHIP_VARIANTS_CONFIG.small,
    color: COLORS.ships.small,
  },
  medium: {
    ...SHIP_VARIANTS_CONFIG.medium,
    color: COLORS.ships.medium,
  },
  large: {
    ...SHIP_VARIANTS_CONFIG.large,
    color: COLORS.ships.large,
  },
  xlarge: {
    ...SHIP_VARIANTS_CONFIG.xlarge,
    color: COLORS.ships.xlarge,
  },
} as Record<string, SHIP_VARIANT>;
