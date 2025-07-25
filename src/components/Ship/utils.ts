import { COLORS } from "../../config/colors";

export interface ShipProps {
  coords: [number, number];
  variant: "small" | "medium" | "large" | "xlarge";
  orientation?: "horizontal" | "vertical";
}

export const SHIP_VARIANTS = {
  small: {
    size: 2,
    url: "/assets/models/Small_Ship.glb",
    scale: [0.2, 0.2, 0.2] as [number, number, number],
    extraOffset: 0,
    waveFrequency: 3.5,
    waveAmplitude: 0.02,
    color: COLORS.ships.small,
  },
  medium: {
    size: 3,
    url: "/assets/models/Medium_Ship.glb",
    scale: [0.2, 0.2, 0.2] as [number, number, number],
    extraOffset: 0,
    waveFrequency: 3.0,
    waveAmplitude: 0.025,
    color: COLORS.ships.medium,
  },
  large: {
    size: 4,
    url: "/assets/models/Large_Ship.glb",
    scale: [0.2, 0.2, 0.23] as [number, number, number],
    extraOffset: -0.1,
    waveFrequency: 2.5,
    waveAmplitude: 0.03,
    color: COLORS.ships.large,
  },
  xlarge: {
    size: 5,
    url: "/assets/models/XLarge_Ship.glb",
    scale: [0.2, 0.2, 0.3] as [number, number, number],
    extraOffset: -0.1,
    waveFrequency: 2.0,
    waveAmplitude: 0.035,
    color: COLORS.ships.xlarge,
  },
} as const;
