import type { HOUSE_VARIANTS } from "./constants/variants";

export type HouseProps = {
  variant: keyof typeof HOUSE_VARIANTS;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
};