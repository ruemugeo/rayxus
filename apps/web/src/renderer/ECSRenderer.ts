import { simulation } from "../simulation/Simulation";

const CELL_SIZE = 32;

export function renderECS(ctx: CanvasRenderingContext2D) {

  for (const [entity, position] of simulation.ecs.positions.entries()) {

    if (!simulation.ecs.citizens.has(entity)) {
        continue;
    }

    ctx.fillStyle = "#FFD54F";

    ctx.beginPath();

    ctx.arc(
      position.x * CELL_SIZE + CELL_SIZE / 2,
      position.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE * 0.25,
      0,
      Math.PI * 2
    );

    ctx.fill();

  }

}