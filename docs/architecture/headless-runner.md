# Headless Runner Contract

Status: Draft  
Date: 2026-11-19

## Purpose

Document the interface and contract for the headless simulation runner.

## Overview

The headless runner is the entry point for running simulations without a UI. It is used for:
- Testing
- Benchmarking
- Server deployment
- Research/experimental runs

## Entry Point

```ts
// apps/headless-runner/src/run-scenario.ts
import { createIsolatedValleySmokeScenario } from "../../packages/scenarios/src/index.ts";
import { FileSnapshotAdapter } from "../../packages/adapters/storage-file/src/index.ts";

const kernel = createIsolatedValleySmokeScenario();
kernel.runTicks(6);

// ... output events, explanations, stats
// ... optionally save snapshot
```

## Runner Contract

### Initialization

1. Create kernel with scenario (seed for determinism)
2. Register modules
3. Install scenario initial state

### Execution

```ts
runTicks(count: number): void {
  for (let i = 0; i < count; i++) {
    tick();
  }
}

tick(): void {
  clock.advance();
  systems.forEach(system => {
    if (tick % system.cadenceTicks === 0) {
      system.execute();
    }
  });
}
```

### Output

The runner should produce:
1. **Console output**: Human-readable summary of results
2. **Events**: All events emitted during the run
3. **Deltas**: All state mutations recorded
4. **Explanations**: Cause data for major events
5. **Snapshot**: Optional save file for load/continue/replay

### Save/Load Interface

```ts
interface SnapshotAdapter {
  serialize(snapshot: EngineSnapshot): string;
  deserialize(serialized: string): EngineSnapshot;
}

// File-based adapter
class FileSnapshotAdapter implements SnapshotAdapter {
  save(snapshot: EngineSnapshot, filePath: string): Promise<void> { ... }
  load(filePath: string): Promise<EngineSnapshot> { ... }
}
```

## Command Line Usage

```bash
npm start              # Run default scenario
npm start -- -t 100    # Run 100 ticks
npm start -- -s 12345  # Use seed 12345
```

## Return Value

The runner should produce machine-readable output for automation:

```json
{
  "ticks": 6,
  "events": 7,
  "deltas": 7,
  "explanations": 1,
  "seed": 12345,
  "scenario": "isolated-valley-smoke"
}
```

## Error Handling

- **Invalid commands**: Rejected with diagnostic event, no state corruption
- **Missing modules**: Fail fast with clear error
- **File I/O errors**: Surface error, no silent failures
- **Schema mismatches**: Reject incompatible snapshots

## Integration Points

### Storage Ports

Runners use storage adapters but don't depend on specific implementations:

```ts
// JSON adapter (in-memory serialization)
const jsonAdapter = new JsonSnapshotAdapter();

// File adapter (CLI save/load)
const fileAdapter = new FileSnapshotAdapter();
```

### Scenario Injection

Scenarios are injected, making runners generic:

```ts
const scenario = getScenarioById(scenarioId);
const kernel = createKernel({ scenario, seed });
```

## Deterministic Execution Guarantee

For the same scenario and seed, the headless runner produces identical output every time.

### Test Verification

```ts
test("same seed produces same console output", () => {
  const output1 = captureConsole(() => runScenario({ seed: 12345 }));
  const output2 = captureConsole(() => runScenario({ seed: 12345 }));
  assert.equal(output1, output2);
});
```

## Future Considerations

- **Replay mode**: `--replay save.json` to replay from snapshot
- **Batch mode**: Run multiple scenarios, produce aggregate results
- **Remote mode**: Connect to distributed simulation workers
- **Benchmark mode**: `--benchmark` for performance testing

## Related Documents

- [Snapshot/Replay Format ADR](./adr/0007-snapshot-replay-format.md)
- [Kernel Types](../engine-core/src/types.ts)
- [Storage Port](../architecture/module-boundaries.md)