import { RayxusKernel } from "../../engine-core/src/index.ts";
import type { EngineSnapshot } from "../../engine-core/src/index.ts";
import { createEconomyModule } from "../../modules/economy/src/index.ts";
import { createWorldModule, type WorldState, type Settlement, type SettlementShortage } from "../../modules/world/src/index.ts";
import type { EconomyState } from "../../modules/economy/src/index.ts";

export const ISOLATED_VALLEY_SCENARIO_ID = "isolated-valley-smoke";
export const VALLEY_SETTLEMENT_ID = "settlement:isolated-valley";
export const VALLEY_POPULATION_ID = "population:valley-settlers";
export const VALLEY_FOOD_STOCK_ID = "stock:valley-granary";

export type ScenarioOptions = {
  seed?: number;
  snapshot?: EngineSnapshot;
};

function registerScenarioEntities(kernel: RayxusKernel): void {
  kernel.state.registerEntity(VALLEY_SETTLEMENT_ID);
  kernel.state.registerEntity(VALLEY_POPULATION_ID);
  kernel.state.registerEntity(VALLEY_FOOD_STOCK_ID);
}

function installInitialState(kernel: RayxusKernel): void {
  const world: WorldState = {
    settlements: {
      [VALLEY_SETTLEMENT_ID]: {
        entityId: VALLEY_SETTLEMENT_ID,
        name: "Isolated Valley",
        population: 20
      }
    },
    settlementShortages: {
      [VALLEY_SETTLEMENT_ID]: {
        active: false
      }
    }
  };

  const economy: EconomyState = {
    foodStocks: {
      [VALLEY_FOOD_STOCK_ID]: {
        entityId: VALLEY_FOOD_STOCK_ID,
        settlementId: VALLEY_SETTLEMENT_ID,
        quantity: 120,
        shortageThreshold: 50,
        unit: "food"
      }
    },
    consumerGroups: {
      [VALLEY_POPULATION_ID]: {
        entityId: VALLEY_POPULATION_ID,
        settlementId: VALLEY_SETTLEMENT_ID,
        foodStockId: VALLEY_FOOD_STOCK_ID,
        population: 20,
        foodPerPersonPerTick: 1
      }
    }
  };

  kernel.state.setModuleState("world", world);
  kernel.state.setModuleState("economy", economy);
}

export function createIsolatedValleySmokeScenario(options: ScenarioOptions = {}): RayxusKernel {
  const kernel = options.snapshot
    ? new RayxusKernel({ snapshot: options.snapshot })
    : new RayxusKernel({
        scenarioId: ISOLATED_VALLEY_SCENARIO_ID,
        seed: options.seed ?? 12345
      });

  registerScenarioEntities(kernel);

  if (!options.snapshot) {
    installInitialState(kernel);
  }

  kernel.registerModule(createWorldModule());
  kernel.registerModule(createEconomyModule());
  return kernel;
}