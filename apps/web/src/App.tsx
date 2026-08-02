import { useEffect, useState } from "react";

import "./App.css";

import { engine } from "./engine";
import Camera from "./renderer/Camera";
import { simulation } from "./simulation/Simulation";
import DeveloperHUD from "./ui/DeveloperHUD";


export default function App() {
  const [, refresh] = useState(0);
  const selected = simulation.selection.getTile();

  useEffect(() => {
     engine.start();

      const unsubscribe = engine.subscribe(() => {
        refresh(v => v + 1);
      });

    return () => {
      unsubscribe();
      engine.stop();
    };
  }, []);

  return (
    <div className="app">
      <header className="topbar">
        <div className="logo">Rayxus</div>

        <div className="version">
          v0.1.0-alpha • Day {simulation.clock.day}
        </div>
      </header>

      <div className="workspace">
        <aside className="sidebar">
          <h3>Navigation</h3>

          <button>Dashboard</button>
          <button>World</button>
          <button>Citizens</button>
          <button>Economy</button>
          <button>History</button>
          <button>Settings</button>
        </aside>

        <main className="viewport">
          <Camera />
        </main>

        <aside className="inspector">
          
          <h3>Inspector</h3>

          <div className="card">
            <p>Status</p>
            <strong>Running</strong>
          </div>

          <div className="card">
            <p>Time</p>
            <strong>{simulation.clock.timeString}</strong>
          </div>

          <div className="card">
            <p>Day</p>
            <strong>{simulation.clock.day}</strong>
          </div>

          <div className="card">
            <p>Population</p>
            <strong>100</strong>
          </div>

          <div className="card">
            <p>Simulation</p>
            <strong>Running</strong>
          </div>

          <div className="card">
            <p>Selected Tile</p>

            {selected ? (
              <>
                <p>X: {selected.x}</p>
                <p>Y: {selected.y}</p>
                <p>Terrain: {selected.type}</p>
                <p>Height: {selected.height.toFixed(2)}</p>
              </>
            ) : (
              <strong>No tile selected</strong>
            )}
          </div>
        </aside>
      </div>

      <footer className="statusbar">
        Engine Loop Active
      </footer>
      <DeveloperHUD />
    </div>
  );
}