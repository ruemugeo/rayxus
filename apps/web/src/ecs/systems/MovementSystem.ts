import type { EngineContext } from "../../engine/EngineContext";

export class MovementSystem {

  private readonly context: EngineContext;

  constructor(context: EngineContext) {
    this.context = context;
  }

  update() {

    for (const [entity, position] of this.context.ecs.positions.entries()) {

        const velocity = this.context.ecs.velocities.get(entity);

        if (!velocity) {
            continue;
        }

        position.x += velocity.x;
        position.y += velocity.y;

        if (
            position.x < 0 ||
            position.x > this.context.world.width - 1
        ) {
            velocity.x *= -1;
        }

        if (
            position.y < 0 ||
            position.y > this.context.world.height - 1
        ) {
            velocity.y *= -1;
        }

        position.x = Math.max(
            0,
            Math.min(this.context.world.width - 1, position.x)
        );

        position.y = Math.max(
            0,
            Math.min(this.context.world.height - 1, position.y)
        );

    }

  }

}