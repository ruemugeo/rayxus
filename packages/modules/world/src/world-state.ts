import type { EntityId, ModuleState } from "../../../engine-core/src/index.ts";

export type Settlement = {
  entityId: EntityId;
  name?: string;
  population: number;
  regionId?: EntityId;
};

export type SettlementShortage = {
  active: boolean;
  startedTick?: number;
};

export type WorldState = ModuleState & {
  settlements: Record<EntityId, Settlement>;
  settlementShortages: Record<EntityId, SettlementShortage>;
};

export function createEmptyWorldState(): WorldState {
  return {
    settlements: {},
    settlementShortages: {}
  };
}