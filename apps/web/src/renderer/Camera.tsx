import { useRef, useState } from "react";
import Grid from "./Grid";

export default function Camera() {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  function wheel(e: React.WheelEvent) {
    e.preventDefault();

    setScale((s) => {
      const next = s - e.deltaY * 0.001;
      return Math.min(5, Math.max(0.3, next));
    });
  }

  function down(e: React.MouseEvent) {
    if (e.button !== 1) return;

    dragging.current = true;

    last.current = {
      x: e.clientX,
      y: e.clientY
    };
  }

  function up() {
    dragging.current = false;
  }

  function move(e: React.MouseEvent) {
    if (!dragging.current) return;

    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;

    last.current = {
      x: e.clientX,
      y: e.clientY
    };

    setOffset((o) => ({
      x: o.x + dx,
      y: o.y + dy
    }));
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        cursor: dragging.current ? "grabbing" : "grab"
      }}
      onWheel={wheel}
      onMouseDown={down}
      onMouseMove={move}
      onMouseUp={up}
      onMouseLeave={up}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: "center center"
        }}
      >
        <Grid />
      </div>
    </div>
  );
}