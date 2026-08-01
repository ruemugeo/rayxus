import "./App.css";

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <div className="logo">RAYXUS</div>

        <div className="version">v0.1 Early Access</div>
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

            <p>WebGPU renderer coming soon.</p>
          </div>
        </main>

        <aside className="inspector">
          <h3>Inspector</h3>

          <div className="card">
            <p>Status</p>
            <strong>Ready</strong>
          </div>

          <div className="card">
            <p>Population</p>
            <strong>0</strong>
          </div>

          <div className="card">
            <p>FPS</p>
            <strong>--</strong>
          </div>
        </aside>
      </div>

      <footer className="statusbar">
        Rayxus Engine • Idle
      </footer>
    </div>
  );
}