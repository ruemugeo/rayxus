import type { EntityId, ModuleState } from "../../../engine-core/src/index.ts";

export type Region = {
  entityId: EntityId;
  name?: string;
  type: "valley" | "plateau" | "coast" | "mountain" | "forest" | "desert";
  area: number;
  x: number;
  y: number;
};

export type ResourceNode = {
  entityId: EntityId;
  regionId: EntityId;
  resourceType: "food" | "stone" | "wood" | "metal" | "water";
  quality: number;  // 0-1 scale
  quantity: number; // total units available
  replenishRate: number; // units per tick
  depleted: boolean;
};

export type Settlement = {
  entityId: EntityId;
  name?: string;
  population: number;
  regionId: EntityId;
};

export type SettlementShortage = {
  active: boolean;
  startedTick?: number;
};

export type WorldState = ModuleState & {
  regions: Record<EntityId, Region>;
  resourceNodes: Record<EntityId, ResourceNode>;
  settlements: Record<EntityId, Settlement>;
  settlementShortages: Record<EntityId, SettlementShortage>;
};

export function createEmptyWorldState(): WorldState {
  return {
    regions: {},
    resourceNodes: {},
    settlements: {},
    settlementShortages: {}
  };
}