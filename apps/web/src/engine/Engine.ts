import { GameLoop } from "./GameLoop";
import type { EngineState } from "./EngineState";

export class Engine {
  private readonly loop = new GameLoop();

  private readonly state: EngineState = {
    running: false,
    tick: 0,
    fps: 60
  };

  private timer?: number;

  start() {
    if (this.state.running) return;

    this.state.running = true;

    this.timer = window.setInterval(() => {
      this.loop.update();
      this.state.tick = this.loop.getTick();
    }, 16);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.state.running = false;
  }

  getState() {
    return this.state;
  }
}