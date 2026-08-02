import type { EngineContext } from "../../engine/EngineContext";

export class NeedsSystem {

        private readonly context: EngineContext;

        constructor(context: EngineContext) {
            this.context = context;
        }

update() {

    for (const [, needs] of this.context.ecs.needs.entries()) {

        needs.hunger = Math.max(
            0,
            needs.hunger - 0.02
        );

        needs.thirst = Math.max(
            0,
            needs.thirst - 0.03
        );

        needs.energy = Math.max(
            0,
            needs.energy - 0.01
        );

    }

}

}