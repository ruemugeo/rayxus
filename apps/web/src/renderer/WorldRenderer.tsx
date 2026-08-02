import { useEffect, useRef } from "react";
import { simulation } from "../simulation/Simulation";

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

          case "grass":
            ctx.fillStyle = "#4CAF50";
            break;

          case "water":
            ctx.fillStyle = "#2196F3";
            break;

          case "forest":
            ctx.fillStyle = "#2E7D32";
            break;

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

      for (const citizen of simulation.citizens.getAll()) {
        ctx.beginPath();
        ctx.fillStyle = citizen.color;
        ctx.arc(
          citizen.x * CELL_SIZE + CELL_SIZE / 2,
          citizen.y * CELL_SIZE + CELL_SIZE / 2,
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