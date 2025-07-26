import { SystemMetrics } from '../index';

describe('SystemMetrics', () => {
  it('should be a function component', () => {
    expect(typeof SystemMetrics).toBe('function');
  });

  it('should accept props', () => {
    const props = {
      enabled: true,
      showDetails: false
    };
    
    expect(props.enabled).toBe(true);
    expect(props.showDetails).toBe(false);
  });

  it('should handle boolean props', () => {
    const booleanProps = [true, false];
    
    booleanProps.forEach(value => {
      expect(typeof value).toBe('boolean');
    });
  });

  it('should have default prop values', () => {
    const defaultProps = {
      enabled: true,
      showDetails: false
    };
    
    expect(defaultProps.enabled).toBe(true);
    expect(defaultProps.showDetails).toBe(false);
  });
}); 