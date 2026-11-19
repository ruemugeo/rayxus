import { makeSequenceId } from "./ids.ts";
import { RAYXUS_EVENT_SCHEMA_VERSION } from "./types.ts";
import type {
  DeltaId,
  EventEnvelope,
  EventId,
  EventSeverity,
  Explanation,
  ExplanationFactor,
  ExplanationId,
  JournalSnapshot,
  JsonObject,
  JsonValue,
  ModuleName,
  SimulationTime,
  StateDelta,
  StateDeltaOperation
} from "./types.ts";

type DeltaInput = {
  module: ModuleName;
  entityId?: string;
  path: string;
  operation: StateDeltaOperation;
  previousValue?: JsonValue;
  nextValue: JsonValue;
  unit?: string;
  reason?: string;
};

type EventInput<TPayload extends JsonObject> = {
  type: string;
  time: SimulationTime;
  sourceModule: ModuleName;
  sourceSystem?: string;
  causationId?: string;
  correlationId?: string;
  affectedEntities: string[];
  stateDeltaIds?: DeltaId[];
  severity: EventSeverity;
  tags?: string[];
  payload: TPayload;
};

type ExplanationInput = {
  eventId: EventId;
  directCause: string;
  affectedEntities: string[];
  stateDeltaIds: DeltaId[];
  contributingFactors: ExplanationFactor[];
  summary?: string;
};

export class EventJournal {
  private eventsValue: EventEnvelope[] = [];
  private deltasValue: StateDelta[] = [];
  private explanationsValue: Explanation[] = [];
  private nextEventSequenceValue = 1;
  private nextDeltaSequenceValue = 1;
  private nextExplanationSequenceValue = 1;

  get events(): readonly EventEnvelope[] {
    return this.eventsValue;
  }

  get deltas(): readonly StateDelta[] {
    return this.deltasValue;
  }

  get explanations(): readonly Explanation[] {
    return this.explanationsValue;
  }

  recordDelta(input: DeltaInput): StateDelta {
    const delta: StateDelta = {
      id: makeSequenceId("delta", this.nextDeltaSequenceValue),
      module: input.module,
      path: input.path,
      operation: input.operation,
      nextValue: input.nextValue
    };

    this.nextDeltaSequenceValue += 1;

    if (input.entityId !== undefined) {
      delta.entityId = input.entityId;
    }
    if (Object.hasOwn(input, "previousValue")) {
      delta.previousValue = input.previousValue;
    }
    if (input.unit !== undefined) {
      delta.unit = input.unit;
    }
    if (input.reason !== undefined) {
      delta.reason = input.reason;
    }

    this.deltasValue.push(delta);
    return delta;
  }

  recordEvent<TPayload extends JsonObject>(input: EventInput<TPayload>): EventEnvelope<TPayload> {
    const event: EventEnvelope<TPayload> = {
      id: makeSequenceId("event", this.nextEventSequenceValue),
      type: input.type,
      schemaVersion: RAYXUS_EVENT_SCHEMA_VERSION,
      time: input.time,
      sourceModule: input.sourceModule,
      sequence: this.nextEventSequenceValue,
      affectedEntities: [...input.affectedEntities],
      stateDeltaIds: [...(input.stateDeltaIds ?? [])],
      severity: input.severity,
      tags: [...(input.tags ?? [])],
      payload: input.payload
    };

    this.nextEventSequenceValue += 1;

    if (input.sourceSystem !== undefined) {
      event.sourceSystem = input.sourceSystem;
    }
    if (input.causationId !== undefined) {
      event.causationId = input.causationId;
    }
    if (input.correlationId !== undefined) {
      event.correlationId = input.correlationId;
    }

    this.eventsValue.push(event);
    return event;
  }

  recordExplanation(input: ExplanationInput): Explanation {
    const explanation: Explanation = {
      id: makeSequenceId("explanation", this.nextExplanationSequenceValue),
      eventId: input.eventId,
      directCause: input.directCause,
      affectedEntities: [...input.affectedEntities],
      stateDeltaIds: [...input.stateDeltaIds],
      contributingFactors: [...input.contributingFactors]
    };

    this.nextExplanationSequenceValue += 1;

    if (input.summary !== undefined) {
      explanation.summary = input.summary;
    }

    this.explanationsValue.push(explanation);
    return explanation;
  }

  attachExplanation(eventId: EventId, explanationId: ExplanationId): void {
    const event = this.eventsValue.find((candidate) => candidate.id === eventId);
    if (!event) {
      throw new Error(`Cannot attach explanation ${explanationId}; event ${eventId} not found.`);
    }
    event.explanationId = explanationId;
  }

  getExplanation(id: ExplanationId): Explanation | undefined {
    return this.explanationsValue.find((explanation) => explanation.id === id);
  }

  validateMajorEvents(): string[] {
    const errors: string[] = [];

    for (const event of this.eventsValue) {
      if ((event.severity === "major" || event.severity === "critical") && !event.explanationId) {
        errors.push(`${event.id} ${event.type} is ${event.severity} but has no explanation.`);
      }
    }

    return errors;
  }

  snapshot(): JournalSnapshot {
    return JSON.parse(
      JSON.stringify({
        events: this.eventsValue,
        deltas: this.deltasValue,
        explanations: this.explanationsValue,
        nextEventSequence: this.nextEventSequenceValue,
        nextDeltaSequence: this.nextDeltaSequenceValue,
        nextExplanationSequence: this.nextExplanationSequenceValue
      })
    ) as JournalSnapshot;
  }

  static fromSnapshot(snapshot: JournalSnapshot): EventJournal {
    const journal = new EventJournal();
    journal.eventsValue = JSON.parse(JSON.stringify(snapshot.events)) as EventEnvelope[];
    journal.deltasValue = JSON.parse(JSON.stringify(snapshot.deltas)) as StateDelta[];
    journal.explanationsValue = JSON.parse(JSON.stringify(snapshot.explanations)) as Explanation[];
    journal.nextEventSequenceValue = snapshot.nextEventSequence;
    journal.nextDeltaSequenceValue = snapshot.nextDeltaSequence;
    journal.nextExplanationSequenceValue = snapshot.nextExplanationSequence;
    return journal;
  }
}
