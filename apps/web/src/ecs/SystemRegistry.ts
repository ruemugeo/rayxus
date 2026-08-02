import { ECS } from "./ECS";
import { Scheduler } from "./Scheduler";

import { World } from "../world/World";

import { MovementSystem } from "./systems/MovementSystem";

export class SystemRegistry {

  readonly movement: MovementSystem;

  constructor(
    ecs: ECS,
    world: World,
    scheduler: Scheduler
  ) {

    this.movement = new MovementSystem(
      ecs,
      world
    );

    scheduler.schedule(1, () => {
      this.movement.update();
    });

  }

}