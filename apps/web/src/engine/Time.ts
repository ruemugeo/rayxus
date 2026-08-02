export class Time {
  private last = performance.now();

  deltaTime = 0;

  fps = 0;

  update() {
    const now = performance.now();

    this.deltaTime = (now - this.last) / 1000;

    this.last = now;

    if (this.deltaTime > 0) {
      this.fps = Math.round(1 / this.deltaTime);
    }
  }
}