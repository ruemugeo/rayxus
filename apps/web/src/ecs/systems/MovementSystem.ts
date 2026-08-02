import { ECS } from "../ECS";
import { World } from "../../world/World";

export class MovementSystem {

  private readonly ecs: ECS;
  private readonly world: World;

  constructor(ecs: ECS, world: World) {
    this.ecs = ecs;
    this.world = world;
  }

  update() {

    for (const [entity, position] of this.ecs.positions.entries()) {

        const velocity = this.ecs.velocities.get(entity);

        if (!velocity) {
            continue;
        }

        position.x += velocity.x;
        position.y += velocity.y;

        if (
            position.x < 0 ||
            position.x > this.world.width - 1
        ) {
            velocity.x *= -1;
        }

        if (
            position.y < 0 ||
            position.y > this.world.height - 1
        ) {
            velocity.y *= -1;
        }

        position.x = Math.max(
            0,
            Math.min(this.world.width - 1, position.x)
        );

        position.y = Math.max(
            0,
            Math.min(this.world.height - 1, position.y)
        );

    }

  }

}