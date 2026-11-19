import test from "node:test";
import assert from "node:assert/strict";
import {
  createIsolatedValleySmokeScenario,
  VALLEY_FOOD_STOCK_ID
} from "../packages/scenarios/src/index.ts";
import { JsonSnapshotAdapter } from "../packages/adapters/storage-json/src/index.ts";
import { RAYXUS_COMMAND_SCHEMA_VERSION } from "../packages/engine-core/src/index.ts";
import type { EventEnvelope } from "../packages/engine-core/src/index.ts";

function eventDigest(events: readonly EventEnvelope[]): unknown[] {
  return events.map((event) => ({
    id: event.id,
    type: event.type,
    tick: event.time.tick,
    sequence: event.sequence,
    sourceModule: event.sourceModule,
    affectedEntities: event.affectedEntities,
    stateDeltaIds: event.stateDeltaIds,
    explanationId: event.explanationId,
    severity: event.severity,
    payload: event.payload
  }));
}

test("same seed and same scenario produce same event sequence", () => {
  const first = createIsolatedValleySmokeScenario({ seed: 12345 });
  const second = createIsolatedValleySmokeScenario({ seed: 12345 });

  first.runTicks(6);
  second.runTicks(6);

  assert.deepEqual(eventDigest(first.journal.events), eventDigest(second.journal.events));
});

test("save/load continuation matches uninterrupted run", () => {
  const adapter = new JsonSnapshotAdapter();

  const uninterrupted = createIsolatedValleySmokeScenario({ seed: 12345 });
  uninterrupted.runTicks(6);

  const split = createIsolatedValleySmokeScenario({ seed: 12345 });
  split.runTicks(3);

  const serialized = adapter.serialize(split.snapshot());
  const loaded = createIsolatedValleySmokeScenario({
    snapshot: adapter.deserialize(serialized)
  });
  loaded.runTicks(3);

  assert.deepEqual(eventDigest(loaded.journal.events), eventDigest(uninterrupted.journal.events));
});

test("food shortage event has required explanation fields", () => {
  const kernel = createIsolatedValleySmokeScenario();
  kernel.runTicks(6);

  const event = kernel.journal.events.find((candidate) => candidate.type === "economy.food_shortage_started");
  assert.ok(event);
  assert.equal(event.severity, "major");
  assert.ok(event.explanationId);

  const explanation = kernel.journal.getExplanation(event.explanationId);
  assert.ok(explanation);
  assert.equal(explanation.directCause, "food_stock_below_shortage_threshold");
  assert.ok(explanation.affectedEntities.length >= 3);
  assert.ok(explanation.stateDeltaIds.length >= 2);
  assert.ok(explanation.contributingFactors.length >= 3);

  assert.deepEqual(kernel.journal.validateMajorEvents(), []);
});

test("invalid command is rejected without corrupting food stock", () => {
  const kernel = createIsolatedValleySmokeScenario();
  const beforeSnapshot = kernel.snapshot();
  const beforeEconomy = beforeSnapshot.state.modules.economy;

  const result = kernel.executeCommand({
    id: "command-000001",
    type: "economy.adjust_food_stock",
    schemaVersion: RAYXUS_COMMAND_SCHEMA_VERSION,
    source: "test",
    payload: {
      stockId: VALLEY_FOOD_STOCK_ID,
      amount: "bad"
    }
  });

  const afterSnapshot = kernel.snapshot();

  assert.equal(result.accepted, false);
  assert.equal(result.reason, "finite_amount_required");
  assert.deepEqual(afterSnapshot.state.modules.economy, beforeEconomy);
  assert.equal(kernel.journal.events.at(-1)?.type, "engine.command_rejected");
});

test("valid food adjustment command mutates state through event and delta", () => {
  const kernel = createIsolatedValleySmokeScenario();

  const result = kernel.executeCommand({
    id: "command-000002",
    type: "economy.adjust_food_stock",
    schemaVersion: RAYXUS_COMMAND_SCHEMA_VERSION,
    source: "test",
    payload: {
      stockId: VALLEY_FOOD_STOCK_ID,
      amount: 30,
      reason: "test_restock"
    }
  });

  assert.equal(result.accepted, true);
  assert.equal(kernel.journal.events.at(-1)?.type, "economy.food_stock_adjusted");
  assert.equal(kernel.journal.deltas.at(-1)?.reason, "test_restock");
});
