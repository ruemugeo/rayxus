import { useEffect, useState } from "react";

import "./App.css";

import { Engine, ENGINE } from "./engine";
import Grid from "./renderer/Grid";

const engine = new Engine();

export default function App() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    engine.start();

    const ui = window.setInterval(() => {
      setTick(engine.getState().tick);
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
          {ENGINE.version} • Tick {tick}
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
          <Grid />
        </main>

        <aside className="inspector">
          <h3>Inspector</h3>

          <div className="card">
            <p>Status</p>
            <strong>Running</strong>
          </div>

          <div className="card">
            <p>Tick</p>
            <strong>{tick}</strong>
          </div>
        </aside>
      </div>

      <footer className="statusbar">
        Engine Loop Active
      </footer>
    </div>
  );
}