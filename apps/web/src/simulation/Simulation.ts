import { CitizenManager } from "../citizens/CitizenManager";

export class Simulation {
  public readonly citizens = new CitizenManager(100);

  private tick = 0;

  update() {
    this.tick++;
    this.citizens.update();
  }

  getTick() {
    return this.tick;
  }
}

export const simulation = new Simulation();