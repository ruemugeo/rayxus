# ADR 0007: Use JSON Snapshots With Event Journals for Replay

Status: Proposed  
Date: 2026-11-19

## Context

Rayxus needs save/load and deterministic replay capabilities. These features require:
- A way to capture complete simulation state
- A way to store events between snapshots
- A way to reconstruct and replay from that state

The current code uses `EngineSnapshot` type but hasn't been formally documented.

## Decision

Use **JSON snapshots with append-only event journals** for persistence and replay.

### Snapshot Format

```json
{
  "engineVersion": "0.1.0",
  "schemaVersion": "rayxus.state.v0.1",
  "scenarioId": "isolated-valley-smoke",
  "time": { "tick": 6, "calendar": { "day": 6, "season": "spring", "year": 1 } },
  "random": { "seed": 12345, "state": 12345 },
  "state": {
    "schemaVersion": "rayxus.state.v0.1",
    "scenarioId": "isolated-valley-smoke",
    "entityIds": ["settlement:isolated-valley", "population:valley-settlers", "stock:valley-granary"],
    "modules": {
      "economy": { /* module state */ },
      "world": { /* module state */ }
    }
  },
  "journal": {
    "events": [/* event envelopes */],
    "deltas": [/* state deltas */],
    "explanations": [/* explanation objects */],
    "nextEventSequence": 7,
    "nextDeltaSequence": 7,
    "nextExplanationSequence": 1
  }
}
```

### Snapshot Structure

| Field | Type | Description |
| --- | --- | --- |
| `engineVersion` | string | Rayxus version that produced this snapshot |
| `schemaVersion` | string | State schema version for future migrations |
| `scenarioId` | string | Which scenario this snapshot represents |
| `time` | object | Simulation time (tick + calendar) |
| `random` | object | Seeded random state for determinism |
| `state` | object | Module state snapshot |
| `journal` | object | Event/delta/explanation journal |

### Replay Process

1. Load snapshot JSON
2. Validate `engineVersion` and `schemaVersion`
3. Reconstruct `RayxusKernel` from snapshot
4. Apply events from journal in order
5. Continue simulation from that point

## Options Considered

| Option | Strengths | Weaknesses |
| --- | --- | --- |
| JSON snapshot only | Simple, human-readable | No history, no event tracing |
| Pure event sourcing | Complete audit trail | High volume, complex queries |
| JSON + event journal | Balanced replay/debug + history | Requires schema versioning |
| SQLite | Structured queries | Binary format, harder to debug |

## Rationale

JSON + event journal provides:
- Fast load from snapshot
- Complete replay history
- Human-readable storage
- Easy debugging
- Schema evolution via versioning

## Consequences

### Positive
- Snapshots enable fast load/reload
- Event journals enable Time Machine and stats
- JSON is human-readable for debugging
- Deterministic replay possible within same version

### Negative
- Snapshots + journal duplicate some data
- Large event volume needs summarization
- Schema changes require migration strategy
- File-based storage needs naming conventions

## Implementation

See `packages/engine-core/src/types.ts` for:
- `EngineSnapshot` type
- `JournalSnapshot` type
- `StateSnapshot` type

See `packages/adapters/storage-json/src/json-snapshot-adapter.ts` for:
- Serialization
- Deserialization
- Basic validation

## Follow-Up

- Add schema version migration strategy
- Add event summarization for high-frequency events
- Define replay file naming (timestamp + scenario + seed)
- Add SQLite adapter implementation

## Revisit When

- Event volume becomes a storage/performance concern
- Schema version migration becomes complex
- Distributed simulation requires partitioned snapshots