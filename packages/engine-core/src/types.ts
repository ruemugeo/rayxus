export const RAYXUS_ENGINE_VERSION = "0.1.0";
export const RAYXUS_STATE_SCHEMA_VERSION = "rayxus.state.v0.1";
export const RAYXUS_EVENT_SCHEMA_VERSION = "rayxus.event.v0.1";
export const RAYXUS_COMMAND_SCHEMA_VERSION = "rayxus.command.v0.1";

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
export type JsonObject = { [key: string]: JsonValue };

export type EntityId = string;
export type EventId = string;
export type DeltaId = string;
export type ExplanationId = string;
export type CommandId = string;
export type ModuleName = string;

export type SimulationCalendar = {
  day: number;
  season: "spring" | "summer" | "autumn" | "winter";
  year: number;
};

export type SimulationTime = {
  tick: number;
  calendar: SimulationCalendar;
};

export type EventSeverity = "trace" | "minor" | "notice" | "major" | "critical" | "diagnostic";

export type StateDeltaOperation = "set" | "increment" | "decrement" | "add" | "remove" | "replace";

export type StateDelta = {
  id: DeltaId;
  module: ModuleName;
  entityId?: EntityId;
  path: string;
  operation: StateDeltaOperation;
  previousValue?: JsonValue;
  nextValue: JsonValue;
  unit?: string;
  reason?: string;
};

export type ExplanationFactor = {
  type: string;
  sourceModule: ModuleName;
  scope?: string;
  entityId?: EntityId;
  value?: JsonValue;
  influence: "increased" | "decreased" | "enabled" | "blocked" | "neutral";
  importance?: "low" | "medium" | "high";
};

export type Explanation = {
  id: ExplanationId;
  eventId: EventId;
  directCause: string;
  affectedEntities: EntityId[];
  stateDeltaIds: DeltaId[];
  contributingFactors: ExplanationFactor[];
  summary?: string;
};

export type EventEnvelope<TPayload extends JsonObject = JsonObject> = {
  id: EventId;
  type: string;
  schemaVersion: string;
  time: SimulationTime;
  sourceModule: ModuleName;
  sourceSystem?: string;
  sequence: number;
  causationId?: string;
  correlationId?: string;
  affectedEntities: EntityId[];
  stateDeltaIds: DeltaId[];
  explanationId?: ExplanationId;
  severity: EventSeverity;
  tags: string[];
  payload: TPayload;
};

export type CommandEnvelope<TPayload extends JsonObject = JsonObject> = {
  id: CommandId;
  type: string;
  schemaVersion: string;
  source: string;
  correlationId?: string;
  payload: TPayload;
};

export type CommandHandlerResult = {
  accepted: boolean;
  reason?: string;
  eventIds: EventId[];
};

export type ModuleState = Record<string, unknown>;

export type StateSnapshot = {
  schemaVersion: string;
  scenarioId: string;
  entityIds: EntityId[];
  modules: Record<ModuleName, ModuleState>;
};

export type JournalSnapshot = {
  events: EventEnvelope[];
  deltas: StateDelta[];
  explanations: Explanation[];
  nextEventSequence: number;
  nextDeltaSequence: number;
  nextExplanationSequence: number;
};

export type RandomSnapshot = {
  seed: number;
  state: number;
};

export type EngineSnapshot = {
  engineVersion: string;
  schemaVersion: string;
  scenarioId: string;
  time: SimulationTime;
  random: RandomSnapshot;
  state: StateSnapshot;
  journal: JournalSnapshot;
};
