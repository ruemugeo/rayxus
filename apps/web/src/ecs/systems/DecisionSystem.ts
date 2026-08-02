import type { EngineContext } from "../../engine/EngineContext";

export class DecisionSystem {

  private readonly context: EngineContext;

  constructor(context: EngineContext) {
    this.context = context;
  }

  update() {

    for (const [entity, needs] of this.context.ecs.needs.entries()) {

      const task = this.context.ecs.tasks.get(entity);

      if (!task) continue;

      if (needs.thirst < 30) {

        task.current = "drink";

      } else if (needs.hunger < 30) {

        task.current = "eat";

      } else if (needs.energy < 25) {

        task.current = "sleep";

      } else {

        task.current = "idle";

      }

    }

  }

}