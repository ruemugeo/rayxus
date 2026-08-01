export class Time {
  private tick = 0;

  update(): void {
    this.tick++;
  }

  getTick(): number {
    return this.tick;
  }

  reset(): void {
    this.tick = 0;
  }
}