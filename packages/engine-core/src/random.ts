import type { RandomSnapshot } from "./types.ts";

export class SeededRandom {
  private readonly seedValue: number;
  private stateValue: number;

  constructor(seed: number, state = seed) {
    this.seedValue = seed >>> 0;
    this.stateValue = state >>> 0;
  }

  nextUint32(): number {
    this.stateValue = (1664525 * this.stateValue + 1013904223) >>> 0;
    return this.stateValue;
  }

  nextFloat(): number {
    return this.nextUint32() / 0x100000000;
  }

  snapshot(): RandomSnapshot {
    return {
      seed: this.seedValue,
      state: this.stateValue
    };
  }

  static fromSnapshot(snapshot: RandomSnapshot): SeededRandom {
    return new SeededRandom(snapshot.seed, snapshot.state);
  }
}
