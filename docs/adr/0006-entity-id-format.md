# ADR 0006: Use Namespaced Entity IDs

Status: Accepted  
Date: 2026-11-19

## Context

Rayxus needs stable, serializable entity IDs that:
- Survive save/load cycles
- Support replay determinism
- Enable cross-module references
- Are human-readable for debugging
- Work within JSON serialization

The current codebase uses a namespaced format (`settlement:isolated-valley`), but this convention was never formally documented.

## Decision

Use **namespaced entity IDs** in the format:

```
namespace:identifier
```

Where:
- `namespace` is a single word identifying the entity type (e.g., `settlement`, `stock`, `citizen`)
- `identifier` is a unique, descriptive name within that namespace (e.g., `isolated-valley`)
- The separator is a colon `:`

### Examples

| Entity | ID |
|--------|-----|
| Settlement | `settlement:isolated-valley` |
| Food stock | `stock:valley-granary` |
| Population group | `population:valley-settlers` |
| Citizen | `citizen:alice` |
| Household | `household:family-smith` |

## Options Considered

| Option | Strengths | Weaknesses |
| --- | --- | --- |
| Integer IDs | Compact, fast lookup | Not human-readable, breaks on schema changes |
| UUIDs | Globally unique | Unreadable, verbose in JSON, hard to debug |
| Namespaced strings | Human-readable, stable, descriptive | Long strings, requires validation |
| Hybrid (int + string) | Best of both worlds | Complexity, dual systems needed |

## Rationale

Namespaced strings provide the best balance for Rayxus:
- **Debuggable**: You can see entity type from the ID
- **Stable**: Same ID across save/load/replay
- **Queryable**: Tools can filter by namespace
- **Serializable**: Simple JSON strings

## Consequences

### Positive
- Entity IDs are stable across save/load/replay
- Cross-module references use consistent format
- Debugging sessions are easier (IDs are readable)
- History inspection can filter by entity type

### Negative
- IDs are longer than integers (10-30+ chars typically)
- String comparison is slower than integer lookup
- Names must follow discipline (no special chars, lowercase preferred)

## Implementation

Entity IDs are validated in `packages/engine-core/src/ids.ts`:

```ts
const ENTITY_ID_PATTERN = /^[a-z][a-z0-9_-]*:[a-z][a-z0-9_-]*$/;

export function isValidEntityId(id: string): boolean {
  return typeof id === "string" && ENTITY_ID_PATTERN.test(id);
}
```

## Follow-Up

- Add eslint rule for entity ID literals
- Consider ID format for distributed/simulated entities
- Document namespace ownership per module

## Status

## Revisit When

- Performance testing shows string IDs are a bottleneck
- Distributed simulation requires deterministic IDs across shards