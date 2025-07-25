export const COLORS = {
  ships: {
    small: "#FFE100",
    medium: "#227DB6", 
    large: "#795cff",
    xlarge: "#00FFFF",
  },
  
  water: {
    primary: "#4aceff",
    droplet: "#bbf0ff",
    splash: "#99ddff",
  },
  
  cells: {
    hit: "#ff4444",
    miss: "#248dc5",
  },
  
  grid: {
    lines: "#ddd",
  },
  
  ui: {
    success: "#28a745",
    danger: "#dc3545", 
    primary: "#007bff",
    debug: {
      background: "rgba(0, 0, 0, 0.8)",
      border: "#ccc",
      button: "#4CAF50",
    },
  },
  
  terrain: {
    sand: "rgba(255, 242, 204, 1)",
    grass: "rgba(179, 230, 102, 1)",
  },
} as const;

export const getTerrainColor = (type: 'sand' | 'grass') => {
  const color = COLORS.terrain[type];
  const rgba = color.match(/rgba?\(([^)]+)\)/);
  if (!rgba) return [1, 1, 1];
  
  const values = rgba[1].split(',').map(v => parseFloat(v.trim()));
  return [values[0] / 255, values[1] / 255, values[2] / 255];
}; 