# ADR 0004: Use Snapshots Plus Event Journal

Status: Proposed  
Date: 2026-08-01

## Context

Rayxus must support save/load, replay, Time Machine, history, statistics, debugging, and explanation. Snapshot-only saves are simple but weak for causality. Pure event sourcing is powerful but heavy for high-frequency simulation.

## Decision

Use periodic authoritative snapshots plus an append-only event journal between snapshots.

Snapshots store current authoritative state. Event journals store meaningful events and explanation data. High-frequency low-value changes may be summarized.

## Options Considered

| Option | Strengths | Weaknesses |
| --- | --- | --- |
| Snapshot-only | Simple, fast load | Weak history, replay, causality, debugging |
| Pure event sourcing | Strong auditability and replay | Complex, storage-heavy, costly for high-frequency state |
| Snapshots plus event journal | Balanced save/load, replay, history, and performance | Requires schema versions and compaction policy |

## Rationale

Hybrid persistence best fits Rayxus:

- Snapshots support practical load and rewind.
- Journals support explanation, replay, and Time Machine.
- Event summaries prevent history from exploding.
- Storage adapters remain replaceable.

## Consequences

Positive:

- Historical inspection becomes foundational.
- Time Machine has natural anchors.
- Replay can start from known checkpoints.
- Debugging can compare event streams.

Negative:

- Durable schemas need versioning from the start.
- Snapshot and journal compatibility must be managed.
- Event selection rules must be designed carefully.

## Follow-Up

- Define snapshot header format.
- Define event envelope format.
- Define schema version policy.
- Define journal compaction strategy.
- Define deterministic replay test expectations for v0.1.

## Revisit When

- Event volume becomes too expensive.
- Distributed simulation requires shard-local journals.
- Scientific use cases require stricter auditability.
