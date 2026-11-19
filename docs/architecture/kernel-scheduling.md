# Kernel Scheduling Contract

Status: Draft  
Date: 2026-11-19

## Purpose

Document how the simulation kernel schedules and executes systems each tick.

## Overview

The kernel advances simulation time in discrete **ticks**. Each tick, systems are executed in order based on their **cadence** (how often they run).

## Key Concepts

### Tick

A fixed unit of simulation time. Each tick represents one simulation step.

```ts
const time = clock.advance(); // tick: 1, 2, 3, ...
```

### Cadence

Systems declare how frequently they execute, in ticks:

```ts
{
  name: "food_consumption",
  cadenceTicks: 1,    // Every tick
  execute: (context) => { ... }
}
```

A system with `cadenceTicks: 1` runs every tick. A system with `cadenceTicks: 10` runs every 10 ticks.

### System Registration Order

Systems are executed in **registration order**. Modules should register systems in the order they should execute:

1. **Input/Command systems** (process commands first)
2. **Domain systems** (simulate the world)
3. **Output/Event systems** (emit observations)

## Execution Flow

```
tick() → advance clock → execute systems in registration order
  ↓
for each system:
  if tick % system.cadenceTicks === 0:
    system.execute(context)
```

## Current Systems

| Module | System | Cadence | Purpose |
| --- | --- | --- | --- |
| economy | `food_consumption` | 1 tick | Consume food, trigger shortages |

## Scheduling Contract

### System Definition

```ts
export type SystemDefinition = {
  name: string;                           // Unique system identifier
  cadenceTicks: number;                   // Run frequency (>= 1)
  execute: (context: SystemContext) => void;  // Deterministic logic
};
```

### Rules

1. **Deterministic**: `execute()` must produce same output given same state/time
2. **No hidden state**: Systems read from snapshot, not closure variables
3. **No side effects**: Systems modify only kernel state through journal
4. **Cadence divisibility**: `cadenceTicks` should be small integers (1, 10, 60, etc.)

### Multi-Rate Systems

Different systems can run at different rates:

```ts
// Food consumption: every tick
{ name: "food_consumption", cadenceTicks: 1, ... }

// Population aging: every 10 ticks (once per 10 days)
{ name: "aging", cadenceTicks: 10, ... }

// Tax collection: every 365 ticks (once per year)
{ name: "tax_collection", cadenceTicks: 365, ... }
```

## Registration and Ordering

### Kernel.registerModule()

```ts
registerModule(module: SimulationModule): void {
  modules.add(module.name);
  systems.push(...module.systems);
  // Register command handlers...
}
```

Module registration order determines system execution order. Modules must plan their internal system order.

### Example: Full Simulation Tick

```
tick 1:
  clock.tick() → tick = 1
  economy.food_consumption.execute()  // cadence 1: runs
  world.time_system.execute()         // cadence 1: runs (if present)

tick 2:
  clock.tick() → tick = 2
  economy.food_consumption.execute()  // cadence 1: runs
  // (no change in systems)

tick 10:
  clock.tick() → tick = 10
  economy.food_consumption.execute()  // cadence 1: runs
  world.population_aging.execute()     // cadence 10: runs
```

## Deterministic Execution Guarantee

For the same scenario seed and command sequence, the system produces identical event/output sequences.

### Requirements

1. **Seeded random**: `context.random` is deterministic
2. **Ordered execution**: Systems run in consistent order
3. **No timing deps**: Systems don't rely on real-time or JS execution order

## Testing

The determinism test verifies:

```ts
test("same seed and same scenario produce same event sequence", () => {
  const first = createScenario({ seed: 12345 });
  const second = createScenario({ seed: 12345 });
  first.runTicks(6);
  second.runTicks(6);
  assert.deepEqual(first.journal.events, second.journal.events);
});
```

## Future Considerations

- **Priority injection**: System might need to run at specific priority within tick
- **Parallel execution**: Independent systems could run in parallel (Worker pool)
- **Condition interrupts**: System could be conditionally skipped

## Related Documents

- [ADR 0003: Hybrid Entity Component Domain State](./adr/0003-hybrid-entity-component-domain-state.md)
- [Vocabulary: System](./../architecture/vocabulary.md)
- [Kernel Types](../engine-core/src/module.ts)