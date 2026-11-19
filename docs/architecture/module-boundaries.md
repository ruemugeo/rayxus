# Rayxus Module Boundaries

Status: Draft  
Scope: Dependency and ownership rules for v0.0 and v0.1

## Purpose

Rayxus should survive years of growth without becoming a tangled application. Module boundaries define what each layer may know about, what it owns, and what it must never import.

## Boundary Summary

| Layer | Owns | May Depend On | Must Not Depend On |
| --- | --- | --- | --- |
| `engine-core` | Kernel, time, scheduler, commands, events, explanation base, IDs, random streams | `schemas` | UI, storage adapters, renderers, domain policy |
| `schemas` | Durable data contracts and version tags | Nothing engine-specific where possible | Runtime services, UI, storage implementation |
| `modules/*` | Domain rules, domain state, invariants, domain events | `engine-core`, `schemas` | React, D3, WebGPU, SQLite, PostgreSQL, HTTP |
| `projections/*` | Read models and analytics derived from state/events | `engine-core`, `schemas`, selected module schemas | Owning authoritative state |
| `ports/*` | Abstract external contracts | `schemas` and basic shared types | Concrete adapters |
| `adapters/*` | Concrete storage/render/network implementations | `ports`, `schemas`, selected projections | Domain rule ownership |
| `plugin-sdk` | Public extension contracts | `engine-core`, `schemas`, stable ports | App-specific internals |
| `apps/*` | Product composition and user workflows | Any public package | Hidden simulation rules |

## Golden Rule

Domain modules produce simulation truth. Everything else either feeds commands into modules, persists module state, projects module state, or visualizes module state.

## Allowed Dependency Direction

Preferred dependency flow:

```text
apps
  -> adapters
  -> ports
  -> projections
  -> modules
  -> engine-core
  -> schemas
```

Some packages may depend sideways through stable contracts, but no package should reach upward into apps.

## Engine Core Ownership

`engine-core` owns:

- Simulation clock.
- Scheduler.
- Entity ID format and allocation rules.
- Command envelope.
- Event envelope.
- Explanation base contracts.
- Deterministic random stream coordination.
- Module registration.
- Headless execution interface.

`engine-core` does not own:

- Food rules.
- Job rules.
- Housing logic.
- Government policy.
- Diplomacy strategy.
- Rendering.
- Database queries.
- UI state.

## Domain Module Ownership

Each domain module owns:

- Its state schemas.
- Its commands.
- Its events.
- Its invariants.
- Its systems.
- Its explanation details.
- Its test scenarios.

Modules may read other modules only through declared queries or shared projections. Direct mutation across module boundaries should be forbidden.

Example:

- Economy may read household labor capacity through Life module queries.
- Economy must not directly rewrite Life-owned household membership.
- Economy may emit an event or command request that Life handles.

## Cross-Module Communication

Use these mechanisms in order:

1. Shared stable identifiers.
2. Read-only module queries.
3. Commands.
4. Events.
5. Projection data.

Avoid:

- Direct cross-module state mutation.
- Importing internal state containers from another module.
- Calling adapter code from a module.
- Encoding UI decisions into module state.

## State Ownership Rules

Every state field needs one owning module.

Examples:

| State | Owner |
| --- | --- |
| Citizen age | Life |
| Citizen current hunger | Life |
| Household food inventory | Economy or Life, decision needed |
| Settlement location | World |
| Settlement population projection | Projections/statistics |
| Tax rate | Society/government |
| Army supply stock | Conflict or Economy, decision needed |
| Treaty status | Diplomacy |

Open ownership decisions should be documented before implementation.

## Event Ownership Rules

Events should be emitted by the module that owns the rule causing the event.

Examples:

- `food.shortage_started` belongs to Economy.
- `citizen.died` belongs to Life.
- `government.tax_policy_changed` belongs to Society/Government.
- `diplomacy.treaty_signed` belongs to Diplomacy.
- `conflict.battle_resolved` belongs to Conflict.

Events may reference entities owned by multiple modules, but the event type has one owner.

## Explanation Ownership Rules

The module that emits an event owns its primary explanation.

Shared contributing factors may come from other modules through explicit query results.

Example:

Food shortage explanation may include:

- Direct cause from Economy: food stock below threshold.
- World factor: bad harvest region output.
- Life factor: population demand increase.
- Society factor: tax requisition policy.
- Conflict factor: route disruption.

## Storage Boundary

Simulation modules must not know whether state is stored in JSON, SQLite, PostgreSQL, browser storage, or cloud object storage.

Storage adapters may serialize:

- Snapshots.
- Event journals.
- Scenario files.
- Projection caches.
- Plugin metadata.

Storage adapters may not decide:

- Who eats.
- Who works.
- Who migrates.
- Whether war starts.
- Whether a government is legitimate.

## Visualization Boundary

Visualization consumes projections and debug streams.

Allowed:

- Render map overlays.
- Show timelines.
- Display entity inspector.
- Send validated commands.
- Request replay or Time Machine branches.

Forbidden:

- Directly mutate simulation state.
- Compute authoritative outcomes.
- Store hidden decision state that affects simulation.

## AI Boundary

AI is part of simulation only when it produces deterministic, inspectable decisions through engine commands and events.

Allowed:

- Utility scoring.
- Rule-based decisions.
- Goal planning.
- Policy evaluation.
- Decision traces.

Restricted:

- Opaque model output as authoritative decision.
- Non-replayable decisions.
- Decisions without explanation data.

## v0.1 Boundary Requirements

v0.1 must prove:

- Headless simulation runs without UI.
- JSON save/load works through storage port.
- Events include explanation data.
- Same seed and command sequence reproduce same event sequence.
- No module imports React, D3, WebGPU, SQLite, PostgreSQL, or HTTP server packages.

## Architecture Review Checklist

Before adding a module or package:

- What pillar owns it?
- What state does it own?
- What commands does it accept?
- What events does it emit?
- What explanations does it produce?
- What other modules can it read?
- What modules can it request changes from?
- Can it run headless?
- Can it serialize its state?
- Can it be tested without UI and database?
