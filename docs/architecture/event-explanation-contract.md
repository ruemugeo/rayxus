# Event And Explanation Contract

Status: Draft  
Scope: v0.1 architecture contract  
Related: ADR 0004, ADR 0005, v0.1 Core Simulation Charter

## Purpose

Rayxus must explain why events happen, not only record that they happened. This document defines the first durable contract for events, explanations, and state deltas.

This is an architecture contract, not implementation code.

## Design Goals

- Make every important simulation outcome inspectable.
- Keep events stable enough for replay, history, statistics, and Time Machine.
- Separate requested actions from happened facts.
- Separate state changes from human-facing narrative.
- Support deterministic comparison in tests.
- Avoid coupling events to storage, UI, or renderer choices.

## Core Rule

Commands request change. Systems decide outcomes. State deltas record mutation. Events record meaning. Explanations record cause.

## Conceptual Flow

1. A command or scheduled system runs.
2. A domain system reads authoritative state.
3. The system computes state deltas.
4. The system emits one or more events.
5. Each major event includes or references explanation data.
6. Projections consume events and state for UI, statistics, history, and debug tools.
7. Storage adapters persist snapshots and event journals.

## Event Envelope

Every event should use a consistent envelope.

| Field | Required | Purpose |
| --- | --- | --- |
| Event ID | Yes | Stable identity for journal, replay, references, and debugging |
| Event type | Yes | Names what happened |
| Schema version | Yes | Supports durable compatibility |
| Simulation time | Yes | Tick and optional calendar time |
| Source module | Yes | Module that emitted the event |
| Source system | Recommended | System that produced the event |
| Sequence number | Yes | Deterministic order inside a run |
| Causation ID | Recommended | Command, event, or schedule item that caused this event |
| Correlation ID | Recommended | Groups related events into one chain |
| Affected entities | Yes for major events | Entity IDs touched or meaningfully impacted |
| State delta references | Recommended | Links meaning to actual mutation |
| Explanation reference | Required for major events | Why this event happened |
| Severity | Recommended | Debug/history importance |
| Tags | Optional | Search and projection hints |
| Payload | Yes | Event-specific data |

## Event Type Naming

Use namespaced event types:

```text
module.subject_past_tense
```

Examples:

- `economy.food_shortage_started`
- `life.citizen_died`
- `society.tax_policy_changed`
- `world.settlement_created`
- `conflict.unit_mobilized`
- `diplomacy.treaty_signed`
- `engine.command_rejected`

Rules:

- Use past tense because events describe facts that happened.
- Do not use UI names.
- Do not include database table names.
- Do not include implementation class names.
- Do not create generic event names like `updated` when the domain meaning is known.

## Event Classes

| Class | Meaning | Journal Policy |
| --- | --- | --- |
| State | Meaningful state changed | Store if useful for replay/history |
| Decision | Agent, institution, or system chose an action | Store for AI Inspector and causality |
| Crisis | Shortage, death spike, unrest, battle, disaster | Always store |
| Relationship | Link changed between citizens, households, polities, factions | Store or summarize by importance |
| Summary | Aggregated low-level events | Store for scale |
| Diagnostic | Debug or validation information | Store in debug runs, optional in release saves |

## Event Severity

Severity is not visual style. It is historical importance.

| Severity | Meaning | Examples |
| --- | --- | --- |
| Trace | Low-level diagnostic | Scheduler ran system |
| Minor | Normal event with small scope | Worker assigned |
| Notice | Meaningful local change | Household moved |
| Major | High impact or user-interesting event | Food shortage started |
| Critical | Severe irreversible or system-wide outcome | Famine, war, settlement collapse |

v0.1 only needs `minor`, `major`, and `diagnostic` equivalents, but the vocabulary should be ready for growth.

## State Delta Contract

State deltas describe what changed. They should be precise enough for debugging and explanation, but not become the only source of durable history.

| Field | Required | Purpose |
| --- | --- | --- |
| Delta ID | Yes | Stable reference from events and tests |
| Module | Yes | State owner |
| Entity ID | Recommended | Entity whose state changed |
| State path | Yes | Logical path to changed field |
| Operation | Yes | Set, increment, decrement, add, remove, replace |
| Previous value | Debug/replay policy | Helps Time Machine and explainability |
| Next value | Yes | Resulting value |
| Unit | Optional | Food units, people, currency, days |
| Reason | Recommended | Short rule-level reason |

### Previous Value Policy

Options:

| Option | Strength | Weakness |
| --- | --- | --- |
| Always store previous values | Best debugging and rewind | Larger journals |
| Store next values only | Smaller journals | Harder Time Machine and explanation |
| Store previous values in debug/replay modes | Balanced | Mode-dependent data complexity |

Recommendation:

For v0.1, store previous and next values in golden replay/debug runs. For later production saves, allow compaction policy to summarize low-value deltas.

## Explanation Contract

Every major event needs structured explanation data.

Minimum v0.1 explanation fields:

| Field | Required | Purpose |
| --- | --- | --- |
| Explanation ID | Yes | Stable reference |
| Event ID | Yes | Event being explained |
| Direct cause | Yes | Immediate rule or condition |
| Affected entities | Yes | Main entities involved |
| State deltas | Yes | Mutations that prove outcome |
| Contributing factors | Yes | Pressures that made event likely or possible |

Expanded future fields:

| Field | Required Later | Purpose |
| --- | --- | --- |
| Actor intent | For decision events | Goal, need, order, policy, or plan |
| Constraints | For decisions and failures | Resources, law, distance, risk, capacity |
| Alternatives considered | For AI/government/diplomacy | Why other choices lost |
| Confidence | For heuristic/probabilistic explanations | How reliable explanation is |
| Upstream causes | For history/Time Machine | Prior events in causal chain |
| Downstream effects | For history summaries | Later events caused by this event |

## Direct Cause

Direct cause is the immediate reason the event happened.

Good:

- `settlement_food_stock_below_shortage_threshold`
- `tax_policy_command_validated`
- `army_supply_below_operational_minimum`

Bad:

- `simulation_decided`
- `random`
- `system_update`
- `because_food`

Direct cause should map to a named rule, threshold, command, or condition.

## Contributing Factors

Contributing factors explain pressure. They are not always sufficient by themselves.

Each factor should include:

- Factor type.
- Source module.
- Entity or scope.
- Measured value where possible.
- Direction of influence.
- Weight or importance where useful.

Example factor categories:

- Resource shortage.
- Population demand.
- Distance or transport cost.
- Policy effect.
- Seasonal effect.
- Conflict disruption.
- Social unrest.
- Labor shortage.
- Storage capacity.

## Causation And Correlation

Use causation ID for direct parent relationship.

Use correlation ID for broader chain.

Example:

- User command changes food stock.
- Economy system consumes food.
- Food shortage starts.
- Unrest increases.

All events may share one correlation ID. Each event has its own causation parent.

## Determinism Requirements

For deterministic replay, events must avoid unstable values.

Avoid in event payloads:

- Wall-clock timestamps as ordering truth.
- Random IDs not derived from engine sequence.
- Object memory addresses.
- Locale-dependent formatted text.
- Floating-point values without stable rounding policy where comparisons matter.

Allowed:

- Simulation tick.
- Calendar projection derived from tick.
- Sequence number.
- Seeded random draw references.
- Stable entity IDs.
- Versioned payloads.

## Human Text Policy

Human-readable text may be generated from structured event and explanation data.

Do not store narrative text as the only explanation.

Reason:

- Text is hard to query.
- Text is hard to migrate.
- Text is hard to compare in replay.
- Text hides cause structure.

Recommendation:

Store structured explanation first. Generate UI text later through projection or localization.

## v0.1 Food Shortage Example

Scenario:

- Settlement has food stock.
- Population consumes food each day.
- Shortage starts when stock falls below threshold.

Event:

- Type: `economy.food_shortage_started`
- Source module: Economy.
- Severity: Major.
- Affected entities: settlement, food stock, population group.

State deltas:

- Settlement shortage status: false -> true.
- Food stock: previous amount -> next amount.

Direct cause:

- Food stock below shortage threshold.

Contributing factors:

- Starting food stock.
- Daily consumption.
- Population demand.
- No incoming food production during current tick.

This example is intentionally small. It proves the contract without building full economy.

## Event Storage Policy

Store:

- Major and critical events.
- Decision events.
- Crisis events.
- Command rejection events.
- Summary events.
- Events required for replay and Time Machine.

Summarize:

- Repeated minor consumption events.
- Routine work assignment events.
- High-frequency diagnostics.

Discard after run unless debug mode:

- Trace-level scheduler events.
- Internal profiling events.

## Validation Rules

An event is invalid when:

- It has no event type.
- It has no simulation time.
- It has no source module.
- It is major severity without explanation.
- It references non-existent affected entities.
- It references deltas owned by a different module without permission.
- It uses an unversioned payload.

An explanation is invalid when:

- It has no direct cause.
- It has no affected entities for major events.
- It has no linked event.
- It contains only human prose.
- It cannot identify contributing factors for a crisis event.

## Open Decisions

1. Event ID format.
2. Delta ID format.
3. Correlation ID generation.
4. Whether previous values are always stored in production journals.
5. How to represent state paths across schema migrations.
6. Whether event payload schemas live beside modules or in central schema package.

## Recommendations

- Put shared event envelope schema in `schemas/events`.
- Let modules own event-specific payload schemas.
- Put explanation base schema in `engine-core/explanation` or `schemas/events`.
- Store previous and next values during v0.1.
- Use event severity to decide journal retention.
- Treat direct cause names as stable rule identifiers.

## v0.1 Acceptance Checklist

- `economy.food_shortage_started` event can be emitted.
- Event includes simulation time, source module, affected entities, sequence number, and schema version.
- Event has explanation with direct cause, affected entities, state deltas, and contributing factors.
- Replay test can compare event sequence deterministically.
- Save/load preserves enough event data to explain the shortage after reload.
