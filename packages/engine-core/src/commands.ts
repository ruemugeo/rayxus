import type { EventJournal } from "./journal.ts";
import type { CommandContext, CommandHandler } from "./module.ts";
import type { CommandEnvelope, CommandHandlerResult, EventId, SimulationTime } from "./types.ts";

function recordCommandRejected(
  journal: EventJournal,
  time: SimulationTime,
  command: CommandEnvelope,
  reason: string
): EventId {
  const event = journal.recordEvent({
    type: "engine.command_rejected",
    time,
    sourceModule: "engine",
    sourceSystem: "command_bus",
    causationId: command.id,
    correlationId: command.correlationId,
    affectedEntities: [],
    severity: "diagnostic",
    tags: ["command", "validation"],
    payload: {
      commandId: command.id,
      commandType: command.type,
      reason
    }
  });

  return event.id;
}

export class CommandBus {
  private readonly handlers = new Map<string, CommandHandler>();

  register(commandType: string, handler: CommandHandler): void {
    this.handlers.set(commandType, handler);
  }

  dispatch(command: CommandEnvelope, context: Omit<CommandContext, "command">): CommandHandlerResult {
    const handler = this.handlers.get(command.type);

    if (!handler) {
      const eventId = recordCommandRejected(context.journal, context.time, command, "no_handler_registered");
      return {
        accepted: false,
        reason: "no_handler_registered",
        eventIds: [eventId]
      };
    }

    const beforeEventCount = context.journal.events.length;
    const result = handler(command, { ...context, command });

    if (!result.accepted) {
      const eventId = recordCommandRejected(
        context.journal,
        context.time,
        command,
        result.reason ?? "command_rejected"
      );
      return {
        accepted: false,
        reason: result.reason ?? "command_rejected",
        eventIds: [...result.eventIds, eventId]
      };
    }

    const newEventIds = context.journal.events.slice(beforeEventCount).map((event) => event.id);
    return {
      accepted: true,
      eventIds: [...new Set([...result.eventIds, ...newEventIds])]
    };
  }
}
