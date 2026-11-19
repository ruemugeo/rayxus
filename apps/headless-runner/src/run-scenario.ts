import {
  createIsolatedValleySmokeScenario,
  ISOLATED_VALLEY_SCENARIO_ID
} from "../../../packages/scenarios/src/index.ts";
import { JsonSnapshotAdapter } from "../../../packages/adapters/storage-json/src/index.ts";

const kernel = createIsolatedValleySmokeScenario();
kernel.runTicks(6);

const shortageEvent = kernel.journal.events.find((event) => event.type === "economy.food_shortage_started");
const shortageExplanation = shortageEvent?.explanationId
  ? kernel.journal.getExplanation(shortageEvent.explanationId)
  : undefined;

const adapter = new JsonSnapshotAdapter();
const snapshotJson = adapter.serialize(kernel.snapshot());

console.log("Rayxus v0.1 headless run");
console.log(`Scenario: ${ISOLATED_VALLEY_SCENARIO_ID}`);
console.log(`Ticks: ${kernel.time.tick}`);
console.log(`Events: ${kernel.journal.events.length}`);
console.log(`Deltas: ${kernel.journal.deltas.length}`);
console.log(`Explanations: ${kernel.journal.explanations.length}`);
console.log(`Snapshot bytes: ${snapshotJson.length}`);

if (shortageEvent && shortageExplanation) {
  console.log(`Food shortage tick: ${shortageEvent.time.tick}`);
  console.log(`Direct cause: ${shortageExplanation.directCause}`);
  console.log(`Factors: ${shortageExplanation.contributingFactors.map((factor) => factor.type).join(", ")}`);
}
