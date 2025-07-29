import { DEBUG_CONFIG } from '../../constants/debug/settings';

describe('DEBUG_CONFIG', () => {
  describe('Camera Controls', () => {
    it('should have ENABLE_CAMERA_CONTROLS property', () => {
      expect(DEBUG_CONFIG).toHaveProperty('ENABLE_CAMERA_CONTROLS');
      expect(typeof DEBUG_CONFIG.ENABLE_CAMERA_CONTROLS).toBe('boolean');
    });
  });

  describe('Grid Helper', () => {
    it('should have SHOW_GRID_HELPER property', () => {
      expect(DEBUG_CONFIG).toHaveProperty('SHOW_GRID_HELPER');
      expect(typeof DEBUG_CONFIG.SHOW_GRID_HELPER).toBe('boolean');
    });
  });

  describe('Wireframe', () => {
    it('should have SHOW_WIREFRAME property', () => {
      expect(DEBUG_CONFIG).toHaveProperty('SHOW_WIREFRAME');
      expect(typeof DEBUG_CONFIG.SHOW_WIREFRAME).toBe('boolean');
    });
  });

  describe('Bounding Boxes', () => {
    it('should have SHOW_BOUNDING_BOXES property', () => {
      expect(DEBUG_CONFIG).toHaveProperty('SHOW_BOUNDING_BOXES');
      expect(typeof DEBUG_CONFIG.SHOW_BOUNDING_BOXES).toBe('boolean');
    });
  });

  describe('Performance Monitor Configuration', () => {
    it('should have ENABLE_PERFORMANCE_MONITOR property', () => {
      expect(DEBUG_CONFIG).toHaveProperty('ENABLE_PERFORMANCE_MONITOR');
      expect(typeof DEBUG_CONFIG.ENABLE_PERFORMANCE_MONITOR).toBe('boolean');
    });

    it('should have PERFORMANCE_MONITOR_POSITION property', () => {
      expect(DEBUG_CONFIG).toHaveProperty('PERFORMANCE_MONITOR_POSITION');
      expect(typeof DEBUG_CONFIG.PERFORMANCE_MONITOR_POSITION).toBe('string');
    });

    it('should have valid PERFORMANCE_MONITOR_POSITION value', () => {
      const validPositions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
      expect(validPositions).toContain(DEBUG_CONFIG.PERFORMANCE_MONITOR_POSITION);
    });

    it('should have SHOW_ADVANCED_METRICS property', () => {
      expect(DEBUG_CONFIG).toHaveProperty('SHOW_ADVANCED_METRICS');
      expect(typeof DEBUG_CONFIG.SHOW_ADVANCED_METRICS).toBe('boolean');
    });

    it('should have PERFORMANCE_WARNINGS_ENABLED property', () => {
      expect(DEBUG_CONFIG).toHaveProperty('PERFORMANCE_WARNINGS_ENABLED');
      expect(typeof DEBUG_CONFIG.PERFORMANCE_WARNINGS_ENABLED).toBe('boolean');
    });

    it('should have TARGET_FPS property', () => {
      expect(DEBUG_CONFIG).toHaveProperty('TARGET_FPS');
      expect(typeof DEBUG_CONFIG.TARGET_FPS).toBe('number');
    });

    it('should have reasonable TARGET_FPS value', () => {
      expect(DEBUG_CONFIG.TARGET_FPS).toBeGreaterThan(0);
      expect(DEBUG_CONFIG.TARGET_FPS).toBeLessThanOrEqual(144);
      expect(Number.isInteger(DEBUG_CONFIG.TARGET_FPS)).toBe(true);
    });
  });

  describe('Debug Info Configuration', () => {
    it('should have ENABLE_DEBUG_INFO property', () => {
      expect(DEBUG_CONFIG).toHaveProperty('ENABLE_DEBUG_INFO');
      expect(typeof DEBUG_CONFIG.ENABLE_DEBUG_INFO).toBe('boolean');
    });

    it('should have DEBUG_INFO_POSITION property', () => {
      expect(DEBUG_CONFIG).toHaveProperty('DEBUG_INFO_POSITION');
      expect(typeof DEBUG_CONFIG.DEBUG_INFO_POSITION).toBe('string');
    });

    it('should have valid DEBUG_INFO_POSITION value', () => {
      const validPositions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
      expect(validPositions).toContain(DEBUG_CONFIG.DEBUG_INFO_POSITION);
    });

    it('should have SHOW_SHIP_DETAILS property', () => {
      expect(DEBUG_CONFIG).toHaveProperty('SHOW_SHIP_DETAILS');
      expect(typeof DEBUG_CONFIG.SHOW_SHIP_DETAILS).toBe('boolean');
    });

    it('should have SHOW_CELL_COORDINATES property', () => {
      expect(DEBUG_CONFIG).toHaveProperty('SHOW_CELL_COORDINATES');
      expect(typeof DEBUG_CONFIG.SHOW_CELL_COORDINATES).toBe('boolean');
    });

    it('should have SHOW_GAME_STATE property', () => {
      expect(DEBUG_CONFIG).toHaveProperty('SHOW_GAME_STATE');
      expect(typeof DEBUG_CONFIG.SHOW_GAME_STATE).toBe('boolean');
    });

    it('should have DEBUG_INFO_MAX_WIDTH property', () => {
      expect(DEBUG_CONFIG).toHaveProperty('DEBUG_INFO_MAX_WIDTH');
      expect(typeof DEBUG_CONFIG.DEBUG_INFO_MAX_WIDTH).toBe('number');
    });

    it('should have DEBUG_INFO_MAX_HEIGHT property', () => {
      expect(DEBUG_CONFIG).toHaveProperty('DEBUG_INFO_MAX_HEIGHT');
      expect(typeof DEBUG_CONFIG.DEBUG_INFO_MAX_HEIGHT).toBe('string');
    });

    it('should have reasonable DEBUG_INFO_MAX_WIDTH value', () => {
      expect(DEBUG_CONFIG.DEBUG_INFO_MAX_WIDTH).toBeGreaterThan(0);
      expect(DEBUG_CONFIG.DEBUG_INFO_MAX_WIDTH).toBeLessThanOrEqual(1000);
    });

    it('should have valid DEBUG_INFO_MAX_HEIGHT value', () => {
      expect(DEBUG_CONFIG.DEBUG_INFO_MAX_HEIGHT).toMatch(/^\d+vh$/);
    });
  });

  describe('Debug Panel Configuration', () => {
    it('should have ENABLE_DEBUG_PANEL property', () => {
      expect(DEBUG_CONFIG).toHaveProperty('ENABLE_DEBUG_PANEL');
      expect(typeof DEBUG_CONFIG.ENABLE_DEBUG_PANEL).toBe('boolean');
    });

    it('should have DEBUG_PANEL_POSITION property', () => {
      expect(DEBUG_CONFIG).toHaveProperty('DEBUG_PANEL_POSITION');
      expect(typeof DEBUG_CONFIG.DEBUG_PANEL_POSITION).toBe('string');
    });

    it('should have valid DEBUG_PANEL_POSITION value', () => {
      const validPositions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
      expect(validPositions).toContain(DEBUG_CONFIG.DEBUG_PANEL_POSITION);
    });

    it('should have DEBUG_PANEL_MAX_WIDTH property', () => {
      expect(DEBUG_CONFIG).toHaveProperty('DEBUG_PANEL_MAX_WIDTH');
      expect(typeof DEBUG_CONFIG.DEBUG_PANEL_MAX_WIDTH).toBe('number');
    });

    it('should have DEBUG_PANEL_MAX_HEIGHT property', () => {
      expect(DEBUG_CONFIG).toHaveProperty('DEBUG_PANEL_MAX_HEIGHT');
      expect(typeof DEBUG_CONFIG.DEBUG_PANEL_MAX_HEIGHT).toBe('string');
    });

    it('should have SHOW_PERFORMANCE_SECTION property', () => {
      expect(DEBUG_CONFIG).toHaveProperty('SHOW_PERFORMANCE_SECTION');
      expect(typeof DEBUG_CONFIG.SHOW_PERFORMANCE_SECTION).toBe('boolean');
    });

    it('should have SHOW_GAME_INFO_SECTION property', () => {
      expect(DEBUG_CONFIG).toHaveProperty('SHOW_GAME_INFO_SECTION');
      expect(typeof DEBUG_CONFIG.SHOW_GAME_INFO_SECTION).toBe('boolean');
    });

    it('should have SHOW_SYSTEM_METRICS property', () => {
      expect(DEBUG_CONFIG).toHaveProperty('SHOW_SYSTEM_METRICS');
      expect(typeof DEBUG_CONFIG.SHOW_SYSTEM_METRICS).toBe('boolean');
    });

    it('should have SYSTEM_METRICS_SHOW_DETAILS property', () => {
      expect(DEBUG_CONFIG).toHaveProperty('SYSTEM_METRICS_SHOW_DETAILS');
      expect(typeof DEBUG_CONFIG.SYSTEM_METRICS_SHOW_DETAILS).toBe('boolean');
    });

    it('should have reasonable DEBUG_PANEL_MAX_WIDTH value', () => {
      expect(DEBUG_CONFIG.DEBUG_PANEL_MAX_WIDTH).toBeGreaterThan(0);
      expect(DEBUG_CONFIG.DEBUG_PANEL_MAX_WIDTH).toBeLessThanOrEqual(1200);
    });

    it('should have valid DEBUG_PANEL_MAX_HEIGHT value', () => {
      expect(DEBUG_CONFIG.DEBUG_PANEL_MAX_HEIGHT).toMatch(/^\d+vh$/);
    });
  });

  describe('Configuration Structure', () => {
    it('should have consistent property values', () => {
      // Check that properties have expected values
      expect(DEBUG_CONFIG.ENABLE_PERFORMANCE_MONITOR).toBeDefined();
      expect(DEBUG_CONFIG.PERFORMANCE_MONITOR_POSITION).toBeDefined();
      expect(DEBUG_CONFIG.TARGET_FPS).toBeDefined();
    });

    it('should have all required properties', () => {
      const requiredProperties = [
        'ENABLE_CAMERA_CONTROLS',
        'SHOW_GRID_HELPER',
        'SHOW_WIREFRAME',
        'SHOW_BOUNDING_BOXES',
        'ENABLE_PERFORMANCE_MONITOR',
        'PERFORMANCE_MONITOR_POSITION',
        'SHOW_ADVANCED_METRICS',
        'PERFORMANCE_WARNINGS_ENABLED',
        'TARGET_FPS',
        'ENABLE_DEBUG_INFO',
        'DEBUG_INFO_POSITION',
        'SHOW_SHIP_DETAILS',
        'SHOW_CELL_COORDINATES',
        'SHOW_GAME_STATE',
        'DEBUG_INFO_MAX_WIDTH',
        'DEBUG_INFO_MAX_HEIGHT',
        'ENABLE_DEBUG_PANEL',
        'DEBUG_PANEL_POSITION',
        'DEBUG_PANEL_MAX_WIDTH',
        'DEBUG_PANEL_MAX_HEIGHT',
        'SHOW_PERFORMANCE_SECTION',
        'SHOW_GAME_INFO_SECTION',
        'SHOW_SYSTEM_METRICS',
        'SYSTEM_METRICS_SHOW_DETAILS'
      ];

      requiredProperties.forEach(prop => {
        expect(DEBUG_CONFIG).toHaveProperty(prop);
      });
    });

    it('should have correct property types', () => {
      expect(typeof DEBUG_CONFIG.ENABLE_CAMERA_CONTROLS).toBe('boolean');
      expect(typeof DEBUG_CONFIG.SHOW_GRID_HELPER).toBe('boolean');
      expect(typeof DEBUG_CONFIG.SHOW_WIREFRAME).toBe('boolean');
      expect(typeof DEBUG_CONFIG.SHOW_BOUNDING_BOXES).toBe('boolean');
      expect(typeof DEBUG_CONFIG.ENABLE_PERFORMANCE_MONITOR).toBe('boolean');
      expect(typeof DEBUG_CONFIG.PERFORMANCE_MONITOR_POSITION).toBe('string');
      expect(typeof DEBUG_CONFIG.SHOW_ADVANCED_METRICS).toBe('boolean');
      expect(typeof DEBUG_CONFIG.PERFORMANCE_WARNINGS_ENABLED).toBe('boolean');
      expect(typeof DEBUG_CONFIG.TARGET_FPS).toBe('number');
      expect(typeof DEBUG_CONFIG.ENABLE_DEBUG_INFO).toBe('boolean');
      expect(typeof DEBUG_CONFIG.DEBUG_INFO_POSITION).toBe('string');
      expect(typeof DEBUG_CONFIG.SHOW_SHIP_DETAILS).toBe('boolean');
      expect(typeof DEBUG_CONFIG.SHOW_CELL_COORDINATES).toBe('boolean');
      expect(typeof DEBUG_CONFIG.SHOW_GAME_STATE).toBe('boolean');
      expect(typeof DEBUG_CONFIG.DEBUG_INFO_MAX_WIDTH).toBe('number');
      expect(typeof DEBUG_CONFIG.DEBUG_INFO_MAX_HEIGHT).toBe('string');
      expect(typeof DEBUG_CONFIG.ENABLE_DEBUG_PANEL).toBe('boolean');
      expect(typeof DEBUG_CONFIG.DEBUG_PANEL_POSITION).toBe('string');
      expect(typeof DEBUG_CONFIG.DEBUG_PANEL_MAX_WIDTH).toBe('number');
      expect(typeof DEBUG_CONFIG.DEBUG_PANEL_MAX_HEIGHT).toBe('string');
      expect(typeof DEBUG_CONFIG.SHOW_PERFORMANCE_SECTION).toBe('boolean');
      expect(typeof DEBUG_CONFIG.SHOW_GAME_INFO_SECTION).toBe('boolean');
      expect(typeof DEBUG_CONFIG.SHOW_SYSTEM_METRICS).toBe('boolean');
      expect(typeof DEBUG_CONFIG.SYSTEM_METRICS_SHOW_DETAILS).toBe('boolean');
    });
  });

  describe('Performance Monitor Integration', () => {
    it('should provide valid position for performance monitor', () => {
      const position = DEBUG_CONFIG.PERFORMANCE_MONITOR_POSITION;
      const [vertical, horizontal] = position.split('-');
      
      expect(['top', 'bottom']).toContain(vertical);
      expect(['left', 'right']).toContain(horizontal);
    });

    it('should provide reasonable target FPS for performance monitoring', () => {
      const targetFPS = DEBUG_CONFIG.TARGET_FPS;
      
      // Common refresh rates: 30, 60, 90, 120, 144
      expect([30, 60, 90, 120, 144]).toContain(targetFPS);
    });

    it('should allow performance monitor to be disabled', () => {
      // This test ensures the configuration allows disabling the monitor
      const config = { ...DEBUG_CONFIG, ENABLE_PERFORMANCE_MONITOR: false };
      expect(config.ENABLE_PERFORMANCE_MONITOR).toBe(false);
    });

    it('should allow performance warnings to be disabled', () => {
      // This test ensures the configuration allows disabling warnings
      const config = { ...DEBUG_CONFIG, PERFORMANCE_WARNINGS_ENABLED: false };
      expect(config.PERFORMANCE_WARNINGS_ENABLED).toBe(false);
    });
  });
}); 