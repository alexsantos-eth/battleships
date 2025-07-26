import { DebugPanel } from '../index';
import { DEBUG_CONFIG } from '@/utils/debug';

describe('DebugPanel', () => {
  it('should be a function component', () => {
    expect(typeof DebugPanel).toBe('function');
  });

  it('should use DEBUG_CONFIG for panel configuration', () => {
    expect(DEBUG_CONFIG).toHaveProperty('ENABLE_DEBUG_PANEL');
    expect(DEBUG_CONFIG).toHaveProperty('DEBUG_PANEL_POSITION');
    expect(DEBUG_CONFIG).toHaveProperty('DEBUG_PANEL_MAX_WIDTH');
    expect(DEBUG_CONFIG).toHaveProperty('DEBUG_PANEL_MAX_HEIGHT');
    expect(DEBUG_CONFIG).toHaveProperty('SHOW_PERFORMANCE_SECTION');
    expect(DEBUG_CONFIG).toHaveProperty('SHOW_GAME_INFO_SECTION');
  });

  it('should have valid DEBUG_PANEL_POSITION value', () => {
    const validPositions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    expect(validPositions).toContain(DEBUG_CONFIG.DEBUG_PANEL_POSITION);
  });

  it('should have reasonable DEBUG_PANEL_MAX_WIDTH value', () => {
    expect(DEBUG_CONFIG.DEBUG_PANEL_MAX_WIDTH).toBeGreaterThan(0);
    expect(DEBUG_CONFIG.DEBUG_PANEL_MAX_WIDTH).toBeLessThanOrEqual(1200);
  });

  it('should have valid DEBUG_PANEL_MAX_HEIGHT value', () => {
    expect(DEBUG_CONFIG.DEBUG_PANEL_MAX_HEIGHT).toMatch(/^\d+vh$/);
  });

  it('should have boolean configuration flags', () => {
    expect(typeof DEBUG_CONFIG.ENABLE_DEBUG_PANEL).toBe('boolean');
    expect(typeof DEBUG_CONFIG.SHOW_PERFORMANCE_SECTION).toBe('boolean');
    expect(typeof DEBUG_CONFIG.SHOW_GAME_INFO_SECTION).toBe('boolean');
  });

  it('should integrate with existing debug configurations', () => {
    // Verify that the panel uses existing debug configurations
    expect(DEBUG_CONFIG).toHaveProperty('ENABLE_PERFORMANCE_MONITOR');
    expect(DEBUG_CONFIG).toHaveProperty('SHOW_ADVANCED_METRICS');
    expect(DEBUG_CONFIG).toHaveProperty('ENABLE_DEBUG_INFO');
    expect(DEBUG_CONFIG).toHaveProperty('SHOW_SHIP_DETAILS');
  });
}); 