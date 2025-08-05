import type { SHIP_VARIANTS } from "@/bundle/primitives/Ship/constants/variants";

export interface CellProps {
  position: [number, number, number];
  onClick: (position: [number, number, number]) => void;
  isShot?: boolean;
  isHit?: boolean;
  disabled?: boolean;
  shipVariant?: keyof typeof SHIP_VARIANTS;
  isShipCell?: boolean;
}
