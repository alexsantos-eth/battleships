export const DEBUG_CONFIG = {
  ENABLE_CAMERA_CONTROLS: false,

  SHOW_GRID_HELPER: true,
  SHOW_WIREFRAME: false,
  SHOW_BOUNDING_BOXES: false,

  // Performance Monitor Configuration
  ENABLE_PERFORMANCE_MONITOR: true,
  PERFORMANCE_MONITOR_POSITION: 'top-left' as const,
  SHOW_ADVANCED_METRICS: false,
  PERFORMANCE_WARNINGS_ENABLED: true,
  TARGET_FPS: 60,

  // Debug Info Configuration
  ENABLE_DEBUG_INFO: true,
  DEBUG_INFO_POSITION: 'top-right' as const,
  SHOW_SHIP_DETAILS: true,
  SHOW_CELL_COORDINATES: true,
  SHOW_GAME_STATE: true,
  DEBUG_INFO_MAX_WIDTH: 400,
  DEBUG_INFO_MAX_HEIGHT: '80vh',

  // Debug Panel Configuration
  ENABLE_DEBUG_PANEL: true,
  DEBUG_PANEL_POSITION: 'top-right' as const,
  DEBUG_PANEL_MAX_WIDTH: 500,
  DEBUG_PANEL_MAX_HEIGHT: '90vh',
  SHOW_PERFORMANCE_SECTION: true,
  SHOW_GAME_INFO_SECTION: true,
} as const;
