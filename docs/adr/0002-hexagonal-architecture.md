# ADR 0002: Use Hexagonal Architecture With Ports And Adapters

Status: Proposed  
Date: 2026-08-01

## Context

Rayxus must be independent from UI, rendering, storage, networking, and deployment environment. It must support JSON, SQLite, PostgreSQL, local execution, browser execution, VPS, cloud, and dedicated server targets.

If simulation modules directly depend on React, WebGPU, SQLite, PostgreSQL, filesystem APIs, or server APIs, Rayxus becomes an application instead of an engine.

## Decision

Use a hexagonal architecture.

Simulation core and domain modules talk to abstract ports. Concrete adapters implement storage, rendering, networking, workers, and telemetry.

Domain modules must not import adapters.

## Options Considered

| Option | Strengths | Weaknesses |
| --- | --- | --- |
| Hexagonal ports/adapters | Strong independence, portable, testable, replacement-friendly | More upfront contracts |
| Layered app architecture | Familiar and simple | Often leaks UI/storage concerns downward |
| Direct database-backed domain | Queryable and durable | Couples simulation to persistence |
| Frontend-first architecture | Fast visual feedback | Violates simulation-first principle |

## Rationale

Ports and adapters directly protect Rayxus core principles:

- Simulation first.
- Engine independent from UI.
- Engine independent from database.
- Everything modular.
- Everything replaceable.

This also supports headless mode and deterministic tests from v0.1.

## Consequences

Positive:

- JSON, SQLite, and PostgreSQL can coexist.
- Browser, local, server, and cloud runtimes can share core packages.
- UI can be replaced without simulation rewrite.
- Domain modules become easier to test.

Negative:

- Requires careful API design.
- Early progress may feel slower.
- Badly designed ports can become rigid.

## Follow-Up

- Define first storage port for v0.1 JSON save/load.
- Define renderer/projection boundary before visual debugger.
- Add module import restrictions before implementation.

## Revisit When

- Ports become too generic to express real engine needs.
- Adapters need domain behavior to perform acceptably.
- Distributed simulation requires new partitioning contracts.
