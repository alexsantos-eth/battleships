import { COLORS } from "@/config/colors/palette";
import { SHIP_VARIANTS_CONFIG } from "@/constants/game/board";

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
} as const;
