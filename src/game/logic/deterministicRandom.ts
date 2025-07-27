export class DeterministicRandom {
  private seed: number;
  private currentValue: number;

  constructor(seed: number = Date.now()) {
    this.seed = seed;
    this.currentValue = seed;
  }

  getSeed(): number {
    return this.seed;
  }

  setSeed(seed: number): void {
    this.seed = seed;
    this.currentValue = seed;
  }

  next(): number {
    this.currentValue = (this.currentValue * 1103515245 + 12345) & 0x7fffffff;
    return this.currentValue / 0x7fffffff;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextBoolean(): boolean {
    return this.next() < 0.5;
  }

  nextChoice<T>(choices: T[]): T {
    if (choices.length === 0) {
      throw new Error("Cannot choose from empty array");
    }
    return choices[this.nextInt(0, choices.length - 1)];
  }

  reset(): void {
    this.currentValue = this.seed;
  }

  clone(): DeterministicRandom {
    const clone = new DeterministicRandom(this.seed);
    clone.currentValue = this.currentValue;
    return clone;
  }
}

let globalRandom: DeterministicRandom = new DeterministicRandom();

export const getGlobalRandom = (): DeterministicRandom => {
  return globalRandom;
};

export const setGlobalRandomSeed = (seed: number): void => {
  globalRandom = new DeterministicRandom(seed);
};

export const resetGlobalRandom = (): void => {
  globalRandom.reset();
};

export const getGlobalRandomSeed = (): number => {
  return globalRandom.getSeed();
}; 