export class Random {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) >>> 0;

    return this.seed / 4294967296;
  }
}