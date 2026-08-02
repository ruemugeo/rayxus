import { MovementSystem } from "./systems/MovementSystem";
import type { EngineContext } from "../engine/EngineContext";
import { NeedsSystem } from "./systems/NeedsSystem";
import { DecisionSystem } from "./systems/DecisionSystem";


export class SystemRegistry {

  readonly movement: MovementSystem;

  readonly needs: NeedsSystem;

  private readonly decision: DecisionSystem;

constructor(
    context: EngineContext
        ) {

            this.movement = new MovementSystem(
                context
            );

            this.needs = new NeedsSystem(
                context
            );

            this.decision = new DecisionSystem(context);

            context.scheduler.schedule(1, () => {
                this.movement.update();
            });

            context.scheduler.schedule(1, () => {
                this.needs.update();
            });

            context.scheduler.schedule(1, () => {
                this.decision.update();
            });

        }
}