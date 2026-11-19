import type { SimulationModule } from "../../../engine-core/src/index.ts";

export const WORLD_MODULE = "world";

export function createWorldModule(): SimulationModule {
  return {
    name: WORLD_MODULE,
    systems: []
  };
}