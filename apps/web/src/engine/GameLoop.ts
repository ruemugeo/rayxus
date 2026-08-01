import { Time } from "./Time";

export class GameLoop {
  private readonly time = new Time();

  update(): void {
    this.time.update();
  }

  getTick(): number {
    return this.time.getTick();
  }
}