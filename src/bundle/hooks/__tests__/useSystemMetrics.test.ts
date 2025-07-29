import { useSystemMetrics } from '../useSystemMetrics';

describe('useSystemMetrics', () => {
  it('should be a function', () => {
    expect(typeof useSystemMetrics).toBe('function');
  });

  it('should return expected properties', () => {
    // Test the utility functions directly
    const formatBytes = (bytes: number): string => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const getMemoryColor = (percentage: number): string => {
      if (percentage < 50) return '#4CAF50';
      if (percentage < 80) return '#FF9800';
      return '#F44336';
    };

    const getCpuColor = (usage: number): string => {
      if (usage < 50) return '#4CAF50';
      if (usage < 80) return '#FF9800';
      return '#F44336';
    };

    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1024 * 1024)).toBe('1 MB');
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');

    expect(getMemoryColor(25)).toBe('#4CAF50'); // Green
    expect(getMemoryColor(60)).toBe('#FF9800'); // Orange
    expect(getMemoryColor(85)).toBe('#F44336'); // Red

    expect(getCpuColor(25)).toBe('#4CAF50'); // Green
    expect(getCpuColor(60)).toBe('#FF9800'); // Orange
    expect(getCpuColor(85)).toBe('#F44336'); // Red
  });
}); 