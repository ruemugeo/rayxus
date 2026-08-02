import { simulation } from "../../simulation/Simulation";

export class MovementSystem {

    update() {

        for (const [, position] of simulation.ecs.positions.entries()) {

            position.x += (Math.random() - 0.5) * 0.03;
            position.y += (Math.random() - 0.5) * 0.03;

            position.x = Math.max(
                0,
                Math.min(simulation.world.width - 1, position.x)
            );

            position.y = Math.max(
                0,
                Math.min(simulation.world.height - 1, position.y)
            );

        }

    }

}