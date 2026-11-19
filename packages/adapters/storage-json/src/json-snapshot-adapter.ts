import type { EngineSnapshot } from "../../../engine-core/src/index.ts";

export class JsonSnapshotAdapter {
  serialize(snapshot: EngineSnapshot): string {
    return JSON.stringify(snapshot, null, 2);
  }

  deserialize(serialized: string): EngineSnapshot {
    const parsed = JSON.parse(serialized) as EngineSnapshot;

    if (!parsed.engineVersion || !parsed.schemaVersion || !parsed.scenarioId) {
      throw new Error("Invalid Rayxus snapshot: missing required header fields.");
    }

    return parsed;
  }
}
