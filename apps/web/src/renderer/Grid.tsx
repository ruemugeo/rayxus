import "./Grid.css";

const SIZE = 40;

export default function Grid() {
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
        gridTemplateRows: `repeat(${SIZE}, 1fr)`
      }}
    >
      {Array.from({ length: SIZE * SIZE }).map((_, i) => (
        <div className="cell" key={i} />
      ))}
    </div>
  );
}