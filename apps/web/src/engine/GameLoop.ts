import { Time } from "./Time";

export class GameLoop {

  private readonly time = new Time();

  private animationFrame = 0;

  constructor(
    private readonly update: () => void,
    private readonly render: () => void
  ) {}

  start() {

    const loop = () => {

      this.time.update();

      this.update();

      this.render();

      this.animationFrame = requestAnimationFrame(loop);

    };

    this.animationFrame = requestAnimationFrame(loop);

  }

  stop() {
    cancelAnimationFrame(this.animationFrame);
  }

  getTime() {
    return this.time;
  }

}