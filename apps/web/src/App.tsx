import { useEffect, useState } from "react";

import "./App.css";

import { Engine, ENGINE } from "./engine";
import Camera from "./renderer/Camera";
import { simulation } from "./simulation/Simulation";

const engine = new Engine();

export default function App() {
  const [, refresh] = useState(0);

  useEffect(() => {
    engine.start();

    const ui = window.setInterval(() => {
      refresh((v) => v + 1);
    }, 100);

    return () => {
      clearInterval(ui);
      engine.stop();
    };
  }, []);

  return (
    <div className="app">
      <header className="topbar">
        <div className="logo">{ENGINE.name}</div>

        <div className="version">
          {ENGINE.version} • Day {simulation.clock.day}
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
        </aside>
      </div>

      <footer className="statusbar">
        Engine Loop Active
      </footer>
    </div>
  );
}