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

    const needs = Array.from(simulation.ecs.needs.values());

    const count = needs.length || 1;

    const averageHunger =
      needs.reduce((sum: number, n) => sum + n.hunger, 0) / count;

    const averageThirst =
      needs.reduce((sum: number, n) => sum + n.thirst, 0) / count;

    const averageEnergy =
      needs.reduce((sum: number, n) => sum + n.energy, 0) / count;
      
    const firstTask =
    simulation.ecs.tasks.get(1)?.current ?? "none";

    const population = Array.from(
      simulation.ecs.positions.values()
    ).length;

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
      <p>Population: {population}</p>
      <p>Day: {simulation.clock.day}</p>
      <p>Time: {simulation.clock.timeString}</p>
      <p>Seed: {simulation.world.seed}</p>
      <p>Tiles: {simulation.world.getTiles().length}</p>

      <div>Average Hunger: {averageHunger.toFixed(1)}</div>

      <div>Average Thirst: {averageThirst.toFixed(1)}</div>

      <div>Average Energy: {averageEnergy.toFixed(1)}</div>

      <div>Citizen 1 Task: {firstTask}</div>

      <p>Center Tile:</p>

      <pre>
          X: 20
          Y: 20
          Height: 0.45
          Terrain: Grass
      </pre>
      <p>
      World: {simulation.world.width} × {simulation.world.height}
      </p>
      <p>
      Resources: {simulation.world.resources.getAll().length}
      </p>
    </div>
  );
}