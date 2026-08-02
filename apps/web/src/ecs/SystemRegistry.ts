import { MovementSystem } from "./systems/MovementSystem";
import type { EngineContext } from "../engine/EngineContext";

export class SystemRegistry {

  readonly movement: MovementSystem;

constructor(
    context: EngineContext
        ) {

            this.movement = new MovementSystem(
                context
            );

            context.scheduler.schedule(1, () => {
                this.movement.update();
            });

        }
}