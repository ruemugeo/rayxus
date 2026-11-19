# Rayxus Architecture Vocabulary

Status: Draft  
Scope: Architecture language for v0.0 and v0.1 planning

## Purpose

Rayxus needs shared words before code. This vocabulary defines core engine terms so future modules, docs, tests, and tools describe the same ideas consistently.

## Core Terms

### Engine

The reusable Rayxus platform. Includes simulation kernel, domain modules, schemas, ports, adapters, tools, tests, and SDKs.

The engine is not the Studio UI, not one scenario, and not one storage backend.

### Simulation Kernel

The central runtime layer responsible for time progression, scheduling, command routing, event publication, random stream coordination, state access rules, and module execution.

The kernel should not contain food, citizen, trade, law, war, or diplomacy rules.

### Domain Module

A replaceable simulation package that owns one area of civilization behavior, such as world, life, economy, society, conflict, history, or intelligence.

A domain module may own state schemas, systems, invariants, commands, events, and explanation logic for its area.

### System

A deterministic simulation process that reads state, applies rules, and emits state changes and events.

Examples:

- Food consumption system.
- Household formation system.
- Tax collection system.
- Trade route flow system.
- Military supply system.

### Entity

A stable identity in simulation state.

Examples:

- Citizen.
- Household.
- Settlement.
- Region.
- Government office.
- Army.
- Trade route.

Entity identity should be stable across save/load, replay, history, and inspection.

### Component

A structured state record attached to an entity or keyed by entity ID.

Examples:

- Location.
- Needs.
- Household membership.
- Food inventory.
- Job assignment.
- Military morale.

Components should contain data, not hidden behavior.

### Command

An intentional input to the simulation.

Commands may come from a scenario, user tool, AI system, plugin, server client, or scheduled internal process.

Examples:

- Advance time by one day.
- Assign worker to farm.
- Set tax policy.
- Create trade route.
- Mobilize unit.

Commands are validated before execution.

### Event

A structured record of something meaningful that happened.

Events are outputs. They are not commands. Events may be stored, replayed, projected, inspected, summarized, or used as causes for later events.

Examples:

- Food shortage began.
- Household moved.
- Tax collected.
- Settlement unrest increased.
- Treaty accepted.

### State Delta

A precise state change produced by a system.

Events explain what happened. Deltas record what changed.

Example:

- Household food stock changed from 12 to 8.
- Citizen hunger changed from 0.25 to 0.42.
- Settlement unrest changed from 31 to 36.

### Explanation

Structured cause data attached to events and AI decisions.

Minimum explanation fields for v0.1:

- Direct cause.
- Affected entities.
- State deltas.
- Contributing factors.

Later explanation fields:

- Actor intent.
- Constraints.
- Alternatives considered.
- Confidence.
- Downstream effects.

### Projection

A read-optimized view derived from authoritative simulation state and events.

Examples:

- Population chart.
- Food supply dashboard.
- Settlement map overlay.
- Event timeline.
- AI decision trace view.

Projections are not authoritative simulation state.

### Port

An abstract contract that lets the engine talk to external capability without depending on a concrete implementation.

Examples:

- Storage port.
- Renderer port.
- Network transport port.
- Worker execution port.
- Telemetry port.

### Adapter

A concrete implementation of a port.

Examples:

- JSON storage adapter.
- SQLite storage adapter.
- PostgreSQL storage adapter.
- WebGPU renderer adapter.
- Local network adapter.

Adapters must not own domain rules.

### Scenario

A versioned package of initial state, configuration, seed data, and scripted starting commands.

Scenarios are used for testing, demonstrations, research, education, and repeatable design experiments.

### Save

A durable serialized representation of simulation state and metadata.

Recommended structure:

- Header metadata.
- Engine version.
- Schema version.
- Module versions.
- Snapshot.
- Event journal reference.
- Random stream state.

### Snapshot

An authoritative serialized state image at a specific simulation time.

Snapshots enable fast load, rewind anchors, Time Machine, and replay checkpoints.

### Event Journal

An append-only log of meaningful events between snapshots.

The journal supports replay, history, causality, debugging, statistics, and Time Machine.

### Replay

Reconstruction of simulation behavior from seed, commands, snapshots, event journal, and engine version.

v0.1 target:

- Deterministic replay within same engine version and runtime class.

### Time Machine

A history inspection and branching system that uses snapshots, journals, and branch metadata.

Time Machine is not simply undo. It is historical analysis plus controlled alternate history.

### Plugin

A packaged extension that adds data, rules, projections, visualizations, adapters, or tools through declared contracts.

Early Rayxus should support data plugins before executable rule plugins.

### Mod

A user-authored package that changes simulation content or behavior.

Recommended early scope:

- Declarative content mods.
- Scenario mods.
- Balance/config mods.

Executable mods require stronger sandboxing and compatibility rules.

### Headless Mode

Engine execution without UI, renderer, or browser.

Headless mode is required for tests, servers, benchmarks, scientific runs, replay verification, and automation.

### Visual Debug Mode

A tool mode that visualizes internal simulation state, events, projections, and explanation data.

Visual Debug Mode reads from the engine. It does not become engine logic.

### AI Inspector

A specialized inspection tool for decision systems.

It should show goals, candidate actions, scores, constraints, memories, selected action, and resulting event.

## Naming Rules

- Use `citizen` for individual simulated people.
- Use `household` for shared economic living units.
- Use `family` for kinship/social relation structures.
- Use `settlement` for villages, towns, cities, and other inhabited places.
- Use `polity` for organized political entities such as tribes, city-states, kingdoms, empires, or states.
- Use `faction` for interest groups inside or across polities.
- Use `region` for spatial world partitions.
- Use `goods` for tradable/consumable item categories.
- Use `resources` for world-origin supply sources.
- Use `events` for happened facts.
- Use `commands` for requested actions.
- Use `projections` for read models.

## Forbidden Vocabulary Drift

Avoid these patterns:

- Calling UI state "simulation state".
- Calling a database table "the model" when it is only persistence.
- Calling a visualization "the world".
- Calling narrative text an explanation when no structured cause data exists.
- Calling random behavior "AI" when it has no goal, rule, or decision trace.
- Calling a one-off script a plugin when it does not use plugin contracts.

## Open Vocabulary Questions

- Should Rayxus use `kingdom`, `nation`, or `polity` as the generic political unit? Recommendation: `polity`.
- Should populations below full citizen detail be called `cohorts`, `groups`, or `aggregates`? Recommendation: `cohorts`.
- Should time use `tick`, `turn`, or `step`? Recommendation: `tick` for engine time, `day/season/year` for calendar time.
