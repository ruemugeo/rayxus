# Rayxus

Rayxus v0.1 core simulation foundation.

This repository currently implements the first roadmap slice:

- Headless simulation kernel.
- Deterministic time progression.
- Command dispatch and rejection.
- Structured events.
- Structured explanations.
- State deltas.
- JSON snapshot serialization.
- Canonical `isolated-valley-smoke` scenario.
- Replay/save-load tests.

## Commands

```text
npm start
npm test
```

No npm dependencies are required. Node 25 runs the TypeScript files directly.

On PowerShell systems that block `npm.ps1`, use:

```text
npm.cmd start
npm.cmd test
```
