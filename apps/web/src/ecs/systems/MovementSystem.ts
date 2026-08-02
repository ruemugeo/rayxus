import type { EngineContext } from "../../engine/EngineContext";

export class MovementSystem {

  private readonly context: EngineContext;

  constructor(context: EngineContext) {
    this.context = context;
  }

  update() {

    for (const [entity, position] of this.context.ecs.positions.entries()) {
        
        const destination = this.context.ecs.destinations.get(entity);

        if (!destination) {
            continue;
        }

        const dx = destination.x - position.x;
        const dy = destination.y - position.y;

        const distance = Math.hypot(dx, dy);

        if (distance < 0.1) {

            destination.reached = true;

        }

        if (destination.reached) {

            destination.x = Math.floor(
                Math.random() * this.context.world.width
            );

            destination.y = Math.floor(
                Math.random() * this.context.world.height
            );

            destination.reached = false;

            continue;

        }

        const speed = 0.03;

        position.x += (dx / distance) * speed;
        position.y += (dy / distance) * speed;

    }

  }

}