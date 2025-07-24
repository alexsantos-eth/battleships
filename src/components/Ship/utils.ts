import { useGLTF } from "@react-three/drei";

useGLTF.preload("/assets/models/Ship_Small.gltf");
useGLTF.preload("/assets/models/Ship_Large.gltf");
useGLTF.preload("/assets/models/Environment_House1.gltf");
useGLTF.preload("/assets/models/Environment_House3.gltf");

export interface ShipProps {
  coords: [number, number];
  variant: "small" | "large" | "large2" | "house" | "house2";
  orientation?: "horizontal" | "vertical";
}

export const SHIP_VARIANTS = {
  small: {
    size: 2,
    url: "/assets/models/Ship_Small.gltf",
    scale: [0.15, 0.15, 0.15] as [number, number, number],
    extraOffset: 0,
    pointLightOffset: [0, 0, 0.5] as [number, number, number],
    pointLightIntensity: 0.3,
    waveFrequency: 3.5,
    waveAmplitude: 0.02,
    color: "#FFE100",
  },
  large: {
    size: 3,
    url: "/assets/models/Ship_Large.gltf",
    scale: [0.08, 0.08, 0.08] as [number, number, number],
    extraOffset: 0,
    pointLightOffset: [0, 0, 0.5] as [number, number, number],
    pointLightIntensity: 0.3,
    waveFrequency: 2.5,
    waveAmplitude: 0.03,
    color: "#227DB6",
  },
  large2: {
    size: 3,
    url: "/assets/models/Ship_Large.gltf",
    scale: [0.08, 0.08, 0.08] as [number, number, number],
    extraOffset: 0,
    pointLightOffset: [0, 0, 0.5] as [number, number, number],
    pointLightIntensity: 0.3,
    waveFrequency: 2.5,
    waveAmplitude: 0.03,
    color: "#795cff",
  },
  house: {
    size: 5,
    url: "/assets/models/Environment_House1.gltf",
    scale: [0.17, 0.15, 0.1] as [number, number, number],
    extraOffset: 0,
    pointLightOffset: [0, 0, 0.9] as [number, number, number],
    pointLightIntensity: 0.5,
    waveFrequency: 2.0,
    waveAmplitude: 0.04,
    color: "#EB505E",
  },
  house2: {
    size: 4,
    url: "/assets/models/Environment_House3.gltf",
    scale: [0.2, 0.15, 0.12] as [number, number, number],
    extraOffset: 0.2,
    pointLightOffset: [0, 0, 0.9] as [number, number, number],
    pointLightIntensity: 0.5,
    waveFrequency: 2.0,
    waveAmplitude: 0.04,
    color: "#98FB98",
  },
} as const;
