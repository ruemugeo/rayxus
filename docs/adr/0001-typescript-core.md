# ADR 0001: Use TypeScript For Engine Core

Status: Proposed  
Date: 2026-08-01

## Context

Rayxus must run locally, in browsers, on servers, and eventually in cloud deployments. Current preferred frontend stack is React, TypeScript, Tailwind, shadcn/ui, WebGPU, and D3. The engine must remain independent from UI and storage.

The core language needs to support shared schemas, plugin contracts, browser execution, server execution, testability, and long-term maintainability.

## Decision

Use TypeScript for the Rayxus engine core, domain modules, ports, schemas, projections, and SDKs.

Do not use browser-only or Node-only APIs inside engine core.

## Options Considered

| Option | Strengths | Weaknesses |
| --- | --- | --- |
| TypeScript core | Best portability across browser/server, shared frontend types, strong ecosystem | Performance ceiling for massive simulations |
| Rust core compiled to WASM | Excellent performance and safety, strong determinism potential | Higher complexity, slower iteration, harder plugin story for broad users |
| C# core | Mature simulation/game tooling, strong typing | Browser portability requires extra stack, less aligned with chosen frontend |
| Python core | Excellent research ergonomics | Weak browser story, weaker performance, weaker product packaging |

## Rationale

TypeScript best matches Rayxus v0.1 needs:

- One language across headless runner, browser sandbox, Studio tools, and schemas.
- Strong enough typing for module contracts.
- Easy package boundaries in a monorepo.
- Lower barrier for plugin authors and tool builders.
- Direct compatibility with React-based Studio.

Performance risk is real, but not enough to justify early Rust/WASM complexity. Rayxus should reserve WASM behind ports for future hot loops instead of making all early architecture pay that cost.

## Consequences

Positive:

- Faster architecture-to-tooling path.
- Shared schema definitions.
- Easier browser and server portability.
- Strong developer ecosystem.

Negative:

- Needs discipline to avoid runtime-specific APIs in core.
- Numeric-heavy planetary simulation may require WASM or native acceleration later.
- Determinism must be tested carefully across runtimes.

## Follow-Up

- Define runtime-safe TypeScript rules.
- Add dependency boundary checks before implementation.
- Keep WASM acceleration as optional future adapter strategy.

## Revisit When

- v0.9 profiling shows TypeScript cannot meet scale targets.
- A module needs heavy numeric computation that cannot be optimized cleanly.
- Plugin/runtime requirements change significantly.
