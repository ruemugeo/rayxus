import type { SimulationModule } from "../../../engine-core/src/index.ts";
import { executeFoodConsumption, handleAdjustFoodStockCommand } from "./food-system.ts";
import { ECONOMY_MODULE } from "./economy-state.ts";

export function createEconomyModule(): SimulationModule {
  return {
    name: ECONOMY_MODULE,
    systems: [
      {
        name: "food_consumption",
        cadenceTicks: 1,
        execute: executeFoodConsumption
      }
    ],
    commandHandlers: {
      "economy.adjust_food_stock": handleAdjustFoodStockCommand
    }
  };
}
