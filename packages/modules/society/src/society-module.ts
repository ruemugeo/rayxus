import type { SimulationModule } from "../../../engine-core/src/index.ts";

export const SOCIETY_MODULE = "society";

export function createSocietyModule(): SimulationModule {
  return {
    name: SOCIETY_MODULE,
    systems: []
  };
}