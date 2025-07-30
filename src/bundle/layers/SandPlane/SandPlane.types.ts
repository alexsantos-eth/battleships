export interface SandPlaneProps {
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
  size: number;
  height: number;
  levels: number;
  scale: number;
  offset: TerrainOffset;
} 