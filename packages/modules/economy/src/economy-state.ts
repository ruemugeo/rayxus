import type { EntityId, ModuleState } from "../../../engine-core/src/index.ts";

export const ECONOMY_MODULE = "economy";

export type FoodStock = {
  entityId: EntityId;
  settlementId: EntityId;
  quantity: number;
  shortageThreshold: number;
  unit: string;
};

export type FoodConsumerGroup = {
  entityId: EntityId;
  settlementId: EntityId;
  foodStockId: EntityId;
  population: number;
  foodPerPersonPerTick: number;
};

export type SettlementShortage = {
  active: boolean;
  startedTick?: number;
};

export type EconomyState = ModuleState & {
  foodStocks: Record<EntityId, FoodStock>;
  consumerGroups: Record<EntityId, FoodConsumerGroup>;
  settlementShortages: Record<EntityId, SettlementShortage>;
};

export function createEmptyEconomyState(): EconomyState {
  return {
    foodStocks: {},
    consumerGroups: {},
    settlementShortages: {}
  };
}
