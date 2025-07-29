export interface SandPlaneProps {
  seed?: number;
  size?: number;
  height?: number;
  levels?: number;
  scale?: number;
  offset?: TerrainOffset;
  className?: string;
}

export interface TerrainOffset {
  x: number;
  z: number;
}

export interface TerrainConfig {
  seed: number;
  size: number;
  height: number;
  levels: number;
  scale: number;
  offset: TerrainOffset;
} 