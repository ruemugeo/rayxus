import "./App.css";
import { Engine, ENGINE } from "./engine";

const engine = new Engine();
engine.start();

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <div className="logo">{ENGINE.name}</div>
        <div className="version">
          {ENGINE.version} • {ENGINE.stage}
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
          <div className="viewport-placeholder">
            <h1>Simulation Viewport</h1>
            <p>Engine Status: {engine.isRunning ? "🟢 Running" : "🔴 Stopped"}</p>
          </div>
        </main>

        <aside className="inspector">
          <h3>Inspector</h3>

          <div className="card">
            <p>Engine</p>
            <strong>{engine.isRunning ? "Running" : "Stopped"}</strong>
          </div>

          <div className="card">
            <p>Version</p>
            <strong>{ENGINE.version}</strong>
          </div>

          <div className="card">
            <p>Build</p>
            <strong>{ENGINE.build}</strong>
          </div>
        </aside>
      </div>

      <footer className="statusbar">
        {ENGINE.name} • Ready
      </footer>
    </div>
  );
}