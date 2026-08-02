import { useEffect, useRef } from "react";
import { simulation } from "../simulation/Simulation";
import { renderECS } from "./ECSRenderer";


const world = simulation.world;
const CELL_SIZE = 50;

export default function WorldRenderer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = world.width * CELL_SIZE;
    canvas.height = world.height * CELL_SIZE;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;

    const render = () => {
      //simulation.update();

      ctx.fillStyle = "#162236";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (const tile of world.getTiles()) {

        switch (tile.type) {

          case "water":
            ctx.fillStyle = "#3B82F6";
            break;

          case "grass": {

            const g = Math.floor(120 + tile.height * 60);

            ctx.fillStyle = `rgb(40,${g},40)`;

            break;
          }

          case "forest": {

            const g = Math.floor(70 + tile.height * 40);

            ctx.fillStyle = `rgb(20,${g},20)`;

            break;
          }

}

  ctx.fillRect(
    tile.x * CELL_SIZE,
    tile.y * CELL_SIZE,
    CELL_SIZE,
    CELL_SIZE
  );

        }

      ctx.strokeStyle = "rgba(255,255,255,.15)";

      for (let x = 0; x <= world.width; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL_SIZE, 0);
        ctx.lineTo(x * CELL_SIZE, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y <= world.height; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * CELL_SIZE);
        ctx.lineTo(canvas.width, y * CELL_SIZE);
        ctx.stroke();
      }

      for (const resource of simulation.world.resources.getAll()) {

        const x = resource.x * CELL_SIZE + CELL_SIZE / 2;
        const y = resource.y * CELL_SIZE + CELL_SIZE / 2;

        switch (resource.type) {

          case "tree":

            // trunk
            ctx.fillStyle = "#6D4C41";
            ctx.fillRect(
                x - 1,
                y + 2,
                2,
                4
            );

            // leaves
            ctx.fillStyle = "#2ECC71";
            ctx.beginPath();
            ctx.arc(x, y, CELL_SIZE * 0.28, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();

            ctx.arc(
              resource.x * CELL_SIZE + CELL_SIZE / 2,
              resource.y * CELL_SIZE + CELL_SIZE / 2,
              CELL_SIZE * 0.28,
              0,
              Math.PI * 2
            );

            ctx.fill();

            break;

        }

      }

      const selected = simulation.selection.getTile();

      if (selected) {

        ctx.strokeStyle = "#FFD54F";
        ctx.lineWidth = 2;

        ctx.strokeRect(
          selected.x * CELL_SIZE,
          selected.y * CELL_SIZE,
          CELL_SIZE,
          CELL_SIZE
        );

      }

      renderECS(ctx);

      for (const [, position] of simulation.ecs.positions.entries()) {

        ctx.beginPath();

        ctx.fillStyle = "#FFD54F";

        ctx.arc(
          position.x * CELL_SIZE + CELL_SIZE / 2,
          position.y * CELL_SIZE + CELL_SIZE / 2,
          6,
          0,
          Math.PI * 2
        );

        ctx.fill();

      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationId);
  }, []);



  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        width: world.width * CELL_SIZE,
        height: world.height * CELL_SIZE,
      }}
    />
  );
}