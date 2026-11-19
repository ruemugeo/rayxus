import type { EntityId, ModuleState } from "../../../engine-core/src/index.ts";

export const ECONOMY_MODULE = "economy";

export type Good = {
  entityId: EntityId;
  name: string;
  category: "food" | "raw_material" | "manufactured" | "luxury";
  basePrice: number;
};

export type ResourceNodeLink = {
  resourceNodeId: EntityId;
  qualityMultiplier: number;
  availability: number;  // 0-1 scale
};

export type FoodStock = {
  entityId: EntityId;
  settlementId: EntityId;
  quantity: number;
  shortageThreshold: number;
  unit: string;
  sources: ResourceNodeLink[];
  storageCapacity: number;
  spoilageRate: number;  // units lost per tick
  spoils: boolean;
};

export type FoodConsumerGroup = {
  entityId: EntityId;
  settlementId: EntityId;
  foodStockId: EntityId;
  population: number;
  foodPerPersonPerTick: number;
};

export type Job = {
  entityId: EntityId;
  type: "farmer" | "hunter" | "builder" | "trader" | "administrator";
  requiredSkill: number;  // 0-1
  productivity: number;     // units per tick
  wage: number;
};

export type JobLocation = {
  jobId: EntityId;
  entityId: EntityId;     // who works it
  productivityModifier: number;  // from conditions
  shift: "morning" | "afternoon" | "night";
  active: boolean;
};

export type Market = {
  entityId: EntityId;
  settlementId: EntityId;
  goods: Record<string, { supplied: number; demanded: number; price: number }>;
  lastUpdateTick: number;
};

export type EconomyState = ModuleState & {
  goods: Record<EntityId, Good>;
  resourceLinkages: Record<EntityId, ResourceNodeLink>;
  foodStocks: Record<EntityId, FoodStock>;
  consumerGroups: Record<EntityId, FoodConsumerGroup>;
  jobs: Record<EntityId, Job>;
  jobLocations: Record<EntityId, JobLocation>;
  markets: Record<EntityId, Market>;
};

export function createEmptyEconomyState(): EconomyState {
  return {
    goods: {},
    resourceLinkages: {},
    foodStocks: {},
    consumerGroups: {},
    jobs: {},
    jobLocations: {},
    markets: {}
  };
}