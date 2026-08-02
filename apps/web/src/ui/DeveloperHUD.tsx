import { useEffect, useState } from "react";
import { simulation } from "../simulation/Simulation";
import { engine } from "../engine";

export default function DeveloperHUD() {
  const [visible, setVisible] = useState(false);
  const [, refresh] = useState(0);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F3") {
        e.preventDefault();
        setVisible(v => !v);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    const unsubscribe = engine.subscribe(() => {
      refresh(v => v + 1);
    });

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      unsubscribe();
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="developer-hud">
      <h3>Rayxus Debug</h3>

      <p><strong>Engine</strong></p>
      <p>Running: {engine.getState().running ? "Yes" : "No"}</p>
      <p>Paused: {engine.getState().paused ? "Yes" : "No"}</p>
      <p>FPS: {engine.getState().fps}</p>
      <p>Speed: {engine.getState().speed}×</p>

      <hr />

      <p><strong>Simulation</strong></p>
      <p>Population: {simulation.citizens.getPopulation()}</p>
      <p>Day: {simulation.clock.day}</p>
      <p>Time: {simulation.clock.timeString}</p>
      <p>Seed: {simulation.world.seed}</p>
      <p>Tiles: {simulation.world.getTiles().length}</p>
      <p>Center Tile:</p>

      <pre>
      {JSON.stringify(
        simulation.world.getTile(20, 20),
        null,
        2
      )}
      </pre>
      <p>
      Resources: {simulation.world.resources.getAll().length}
      </p>
    </div>
  );
}