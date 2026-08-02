import { useEffect, useRef } from "react";

const WORLD_SIZE = 40;
const CELL_SIZE = 50;

export default function CanvasRenderer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = WORLD_SIZE * CELL_SIZE;
    canvas.height = WORLD_SIZE * CELL_SIZE;

    draw(ctx);
  }, []);

  function draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#162236";
    ctx.fillRect(0, 0, WORLD_SIZE * CELL_SIZE, WORLD_SIZE * CELL_SIZE);

    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;

    for (let x = 0; x <= WORLD_SIZE; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL_SIZE, 0);
      ctx.lineTo(x * CELL_SIZE, WORLD_SIZE * CELL_SIZE);
      ctx.stroke();
    }

    for (let y = 0; y <= WORLD_SIZE; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL_SIZE);
      ctx.lineTo(WORLD_SIZE * CELL_SIZE, y * CELL_SIZE);
      ctx.stroke();
    }
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        width: `${WORLD_SIZE * CELL_SIZE}px`,
        height: `${WORLD_SIZE * CELL_SIZE}px`
      }}
    />
  );
}