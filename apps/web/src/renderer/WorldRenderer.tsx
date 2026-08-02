import { useEffect, useRef } from "react";
import { simulation } from "../simulation/Simulation";

const WORLD_SIZE = 40;
const CELL_SIZE = 50;

export default function WorldRenderer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = WORLD_SIZE * CELL_SIZE;
    canvas.height = WORLD_SIZE * CELL_SIZE;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;

    const render = () => {
      simulation.update();

      ctx.fillStyle = "#162236";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(255,255,255,.08)";

      for (let x = 0; x <= WORLD_SIZE; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL_SIZE, 0);
        ctx.lineTo(x * CELL_SIZE, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y <= WORLD_SIZE; y++) {
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
        width: WORLD_SIZE * CELL_SIZE,
        height: WORLD_SIZE * CELL_SIZE,
      }}
    />
  );
}