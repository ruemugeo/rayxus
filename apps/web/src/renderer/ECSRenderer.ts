import { simulation } from "../simulation/Simulation";

const CELL_SIZE = 32;

export function renderECS(ctx: CanvasRenderingContext2D) {

  for (const [, position] of simulation.ecs.positions.entries()) {

    ctx.fillStyle = "#FF9800";

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