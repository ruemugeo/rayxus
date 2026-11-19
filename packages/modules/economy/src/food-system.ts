import type {
  CommandContext,
  CommandEnvelope,
  CommandHandlerResult,
  JsonObject,
  JsonValue,
  SystemContext
} from "../../../engine-core/src/index.ts";
import { ECONOMY_MODULE, createEmptyEconomyState } from "./economy-state.ts";
import type { EconomyState } from "./economy-state.ts";

function roundQuantity(value: number): number {
  return Math.round(value * 10000) / 10000;
}

function getEconomyState(context: SystemContext): EconomyState {
  return context.state.getModuleState(ECONOMY_MODULE, createEmptyEconomyState());
}

export function executeFoodConsumption(context: SystemContext): void {
  const economy = getEconomyState(context);
  const consumerGroups = Object.values(economy.consumerGroups).sort((left, right) =>
    left.entityId.localeCompare(right.entityId)
  );

  for (const group of consumerGroups) {
    const stock = economy.foodStocks[group.foodStockId];
    if (!stock) {
      continue;
    }

    const consumption = roundQuantity(group.population * group.foodPerPersonPerTick);
    const previousQuantity = stock.quantity;
    const nextQuantity = roundQuantity(Math.max(0, previousQuantity - consumption));

    stock.quantity = nextQuantity;

    const foodDelta = context.journal.recordDelta({
      module: ECONOMY_MODULE,
      entityId: stock.entityId,
      path: `economy.foodStocks.${stock.entityId}.quantity`,
      operation: "decrement",
      previousValue: previousQuantity,
      nextValue: nextQuantity,
      unit: stock.unit,
      reason: "scheduled_food_consumption"
    });

    context.journal.recordEvent({
      type: "economy.food_consumed",
      time: context.time,
      sourceModule: ECONOMY_MODULE,
      sourceSystem: "food_consumption",
      causationId: "schedule:economy.food_consumption",
      correlationId: `tick:${context.time.tick}:economy.food_consumption`,
      affectedEntities: [group.entityId, stock.entityId, group.settlementId],
      stateDeltaIds: [foodDelta.id],
      severity: "minor",
      tags: ["economy", "food", "consumption"],
      payload: {
        consumerGroupId: group.entityId,
        stockId: stock.entityId,
        consumed: consumption,
        remaining: nextQuantity,
        unit: stock.unit
      }
    });

    const shortage = economy.settlementShortages[group.settlementId] ?? { active: false };
    const shortageStarted = !shortage.active && nextQuantity < stock.shortageThreshold;

    if (shortageStarted) {
      shortage.active = true;
      shortage.startedTick = context.time.tick;
      economy.settlementShortages[group.settlementId] = shortage;

      const shortageDelta = context.journal.recordDelta({
        module: ECONOMY_MODULE,
        entityId: group.settlementId,
        path: `economy.settlementShortages.${group.settlementId}.active`,
        operation: "set",
        previousValue: false,
        nextValue: true,
        reason: "food_stock_below_shortage_threshold"
      });

      const event = context.journal.recordEvent({
        type: "economy.food_shortage_started",
        time: context.time,
        sourceModule: ECONOMY_MODULE,
        sourceSystem: "food_consumption",
        causationId: "schedule:economy.food_consumption",
        correlationId: `settlement:${group.settlementId}:food_shortage`,
        affectedEntities: [group.settlementId, group.entityId, stock.entityId],
        stateDeltaIds: [foodDelta.id, shortageDelta.id],
        severity: "major",
        tags: ["economy", "food", "shortage", "crisis"],
        payload: {
          settlementId: group.settlementId,
          consumerGroupId: group.entityId,
          stockId: stock.entityId,
          remaining: nextQuantity,
          threshold: stock.shortageThreshold,
          unit: stock.unit
        }
      });

      const explanation = context.journal.recordExplanation({
        eventId: event.id,
        directCause: "food_stock_below_shortage_threshold",
        affectedEntities: [group.settlementId, group.entityId, stock.entityId],
        stateDeltaIds: [foodDelta.id, shortageDelta.id],
        contributingFactors: [
          {
            type: "resource_stock",
            sourceModule: ECONOMY_MODULE,
            entityId: stock.entityId,
            value: nextQuantity,
            influence: "enabled",
            importance: "high"
          },
          {
            type: "shortage_threshold",
            sourceModule: ECONOMY_MODULE,
            entityId: stock.entityId,
            value: stock.shortageThreshold,
            influence: "enabled",
            importance: "high"
          },
          {
            type: "population_demand",
            sourceModule: ECONOMY_MODULE,
            entityId: group.entityId,
            value: {
              population: group.population,
              foodPerPersonPerTick: group.foodPerPersonPerTick,
              tickConsumption: consumption
            },
            influence: "increased",
            importance: "medium"
          }
        ],
        summary: "Food stock dropped below the settlement shortage threshold."
      });

      context.journal.attachExplanation(event.id, explanation.id);
    }
  }
}

type AdjustFoodStockPayload = JsonObject & {
  stockId?: JsonValue;
  amount?: JsonValue;
  reason?: JsonValue;
};

export function handleAdjustFoodStockCommand(
  command: CommandEnvelope,
  context: CommandContext
): CommandHandlerResult {
  const payload = command.payload as AdjustFoodStockPayload;
  const { stockId, amount } = payload;

  if (typeof stockId !== "string") {
    return { accepted: false, reason: "stock_id_required", eventIds: [] };
  }

  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    return { accepted: false, reason: "finite_amount_required", eventIds: [] };
  }

  const economy = getEconomyState(context);
  const stock = economy.foodStocks[stockId];

  if (!stock) {
    return { accepted: false, reason: "food_stock_not_found", eventIds: [] };
  }

  const previousQuantity = stock.quantity;
  const nextQuantity = roundQuantity(Math.max(0, previousQuantity + amount));
  stock.quantity = nextQuantity;

  const delta = context.journal.recordDelta({
    module: ECONOMY_MODULE,
    entityId: stock.entityId,
    path: `economy.foodStocks.${stock.entityId}.quantity`,
    operation: amount >= 0 ? "increment" : "decrement",
    previousValue: previousQuantity,
    nextValue: nextQuantity,
    unit: stock.unit,
    reason: typeof payload.reason === "string" ? payload.reason : "command_adjust_food_stock"
  });

  const event = context.journal.recordEvent({
    type: "economy.food_stock_adjusted",
    time: context.time,
    sourceModule: ECONOMY_MODULE,
    sourceSystem: "adjust_food_stock_command",
    causationId: command.id,
    correlationId: command.correlationId,
    affectedEntities: [stock.entityId, stock.settlementId],
    stateDeltaIds: [delta.id],
    severity: "notice",
    tags: ["economy", "food", "command"],
    payload: {
      stockId: stock.entityId,
      settlementId: stock.settlementId,
      amount,
      previousQuantity,
      nextQuantity,
      unit: stock.unit
    }
  });

  return { accepted: true, eventIds: [event.id] };
}
