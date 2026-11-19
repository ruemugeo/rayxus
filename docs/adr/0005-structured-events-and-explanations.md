# ADR 0005: Use Structured Events And Explanations

Status: Proposed  
Date: 2026-08-01

## Context

Rayxus promises to explain why events happen. If events are only log messages or UI text, history, replay, Time Machine, AI Inspector, and scientific use cases will be weak.

Events must serve several engine needs:

- Replay comparison.
- Historical timelines.
- Causal inspection.
- Statistics.
- Save/load.
- Debugging.
- UI projections.
- AI decision review.

## Decision

Use structured event envelopes and structured explanation objects for major events.

Events record meaningful happened facts. State deltas record mutation. Explanations record cause. Human-readable text is generated later from structured data.

## Options Considered

| Option | Strengths | Weaknesses |
| --- | --- | --- |
| Plain text logs | Easy to create | Poor replay, weak causality, hard queries |
| Snapshot diffs only | Precise mutation data | Weak meaning and weak historical storytelling |
| Domain-specific events without shared envelope | Flexible per module | Hard to build generic tools |
| Shared event envelope plus module payloads | Generic tools plus domain flexibility | Requires schema discipline |

## Rationale

The shared envelope gives Rayxus stable infrastructure for replay, journals, projections, and Time Machine. Module-owned payloads preserve domain flexibility.

Structured explanations protect the core product promise. They allow Rayxus to answer why something happened through cause, factors, deltas, and affected entities instead of generated prose.

## Consequences

Positive:

- History can query cause chains.
- Replay can compare events deterministically.
- AI Inspector has reliable decision data.
- UI can generate readable explanations without owning simulation logic.
- Storage adapters can persist generic journals.

Negative:

- Systems must produce more metadata.
- Event schemas require versioning.
- Poorly designed explanation fields can become noisy.

## Follow-Up

- Define event ID format.
- Define state delta schema.
- Define explanation base schema.
- Define v0.1 food shortage event payload.
- Add validation rules for major events.

## Revisit When

- Event volume becomes too high.
- Distributed simulation requires shard-local event streams.
- Explanation data becomes too large or too vague.
- Scientific auditing requires stricter provenance.
