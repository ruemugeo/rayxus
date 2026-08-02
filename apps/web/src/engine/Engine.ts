import { simulation } from "../simulation/Simulation";
import { GameLoop } from "./GameLoop";
import type { EngineState } from "./EngineState";

type Listener = () => void;

export class Engine {

  private readonly listeners = new Set<Listener>();

  readonly state: EngineState = {
    running: false,
    paused: false,
    speed: 1,
    fps: 0,
    ups: 60
  };

  private readonly loop = new GameLoop(
    () => this.update(),
    () => this.render()
  );

  start() {

    if (this.state.running) return;

    this.state.running = true;

    this.loop.start();

  }

  stop() {

    this.loop.stop();

    this.state.running = false;

  }

  update() {

    if (this.state.paused) return;

    simulation.update();

    this.state.fps = this.loop.getTime().fps;

  }

  render() {

    for (const listener of this.listeners) {
      listener();
    }

  }

  subscribe(listener: Listener) {

    this.listeners.add(listener);

    return () => this.listeners.delete(listener);

  }

  pause() {
    this.state.paused = true;
  }

  play() {
    this.state.paused = false;
  }

  getState() {
    return this.state;
}

}

export const engine = new Engine();