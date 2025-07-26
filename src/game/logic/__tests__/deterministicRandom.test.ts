import { DeterministicRandom } from '../deterministicRandom';

describe('DeterministicRandom', () => {
  it('should generate the same sequence with the same seed', () => {
    const random1 = new DeterministicRandom(12345);
    const random2 = new DeterministicRandom(12345);
    
    const sequence1 = Array.from({ length: 10 }, () => random1.next());
    const sequence2 = Array.from({ length: 10 }, () => random2.next());
    
    expect(sequence1).toEqual(sequence2);
  });

  it('should generate different sequences with different seeds', () => {
    const random1 = new DeterministicRandom(12345);
    const random2 = new DeterministicRandom(67890);
    
    const sequence1 = Array.from({ length: 10 }, () => random1.next());
    const sequence2 = Array.from({ length: 10 }, () => random2.next());
    
    expect(sequence1).not.toEqual(sequence2);
  });

  it('should generate numbers between 0 and 1', () => {
    const random = new DeterministicRandom(12345);
    
    for (let i = 0; i < 100; i++) {
      const value = random.next();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('should generate integers within range', () => {
    const random = new DeterministicRandom(12345);
    
    for (let i = 0; i < 100; i++) {
      const value = random.nextInt(1, 10);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(10);
      expect(Number.isInteger(value)).toBe(true);
    }
  });

  it('should generate booleans with roughly 50/50 distribution', () => {
    const random = new DeterministicRandom(12345);
    const results = Array.from({ length: 1000 }, () => random.nextBoolean());
    
    const trueCount = results.filter(Boolean).length;
    const falseCount = results.filter(r => !r).length;
    
    // Debería estar cerca del 50/50 (con un margen de error)
    expect(trueCount).toBeGreaterThan(400);
    expect(trueCount).toBeLessThan(600);
    expect(falseCount).toBeGreaterThan(400);
    expect(falseCount).toBeLessThan(600);
  });

  it('should choose from array correctly', () => {
    const random = new DeterministicRandom(12345);
    const choices = ['a', 'b', 'c', 'd'];
    
    for (let i = 0; i < 100; i++) {
      const choice = random.nextChoice(choices);
      expect(choices).toContain(choice);
    }
  });

  it('should reset to initial state', () => {
    const random = new DeterministicRandom(12345);
    
    const firstSequence = Array.from({ length: 5 }, () => random.next());
    random.reset();
    const secondSequence = Array.from({ length: 5 }, () => random.next());
    
    expect(firstSequence).toEqual(secondSequence);
  });

  it('should clone correctly', () => {
    const random1 = new DeterministicRandom(12345);
    
    // Generar algunos números
    random1.next();
    random1.next();
    
    const random2 = random1.clone();
    
    // Ambos deberían generar la misma secuencia desde este punto
    const sequence1 = Array.from({ length: 5 }, () => random1.next());
    const sequence2 = Array.from({ length: 5 }, () => random2.next());
    
    expect(sequence1).toEqual(sequence2);
  });

  it('should handle edge cases', () => {
    const random = new DeterministicRandom(0);
    
    // Test con seed 0
    expect(random.getSeed()).toBe(0);
    
    // Test con range de un solo número
    expect(random.nextInt(5, 5)).toBe(5);
    
    // Test con array vacío (debería fallar)
    expect(() => random.nextChoice([])).toThrow();
  });
}); 