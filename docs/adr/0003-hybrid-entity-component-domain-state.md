# ADR 0003: Use Hybrid Entity Component Domain State

Status: Proposed  
Date: 2026-08-01

## Context

Rayxus must simulate individuals, households, settlements, economies, governments, armies, and histories. It needs state that is serializable, inspectable, diffable, replayable, and scalable.

Pure object-oriented models are easy early but often hide behavior and state. Pure ECS can be fast but may become too abstract for explainable civilization logic.

## Decision

Use stable entity IDs, component-like data records, and domain-owned systems.

Behavior lives in systems. Components hold structured state. Domain language remains explicit.

## Options Considered

| Option | Strengths | Weaknesses |
| --- | --- | --- |
| Object-oriented entities | Intuitive early modeling | Harder serialization, replay, diffing, parallel execution |
| Pure ECS | Modular and performant | Can become opaque for high-level society/economy logic |
| Relational database as source of truth | Queryable and persistent | Couples simulation to storage, hurts portability |
| Hybrid entity/component plus domain systems | Balanced inspectability, portability, and performance | Requires strict ownership rules |

## Rationale

Rayxus needs the mechanical benefits of ECS-style data without losing domain clarity.

Stable IDs support:

- Save/load.
- Replay.
- History.
- Time Machine.
- Debug inspection.
- Cross-module references.

Domain systems support:

- Explainable rules.
- Clear module ownership.
- Testable invariants.

## Consequences

Positive:

- State can be serialized and diffed.
- Systems can emit structured events and explanations.
- Modules can be tested without UI/storage.
- Future optimization can target data containers.

Negative:

- Requires rules for component ownership and cross-module access.
- Poorly managed components can become global mutable state.
- Developers must avoid hiding behavior inside records.

## Follow-Up

- Define entity ID format.
- Define component ownership rules.
- Define cross-module read/query contracts.
- Define state delta format.

## Revisit When

- Performance requires more data-oriented storage.
- Domain complexity demands richer relation modeling.
- Cohort/LOD simulation needs separate aggregate state patterns.
