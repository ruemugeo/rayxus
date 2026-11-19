import type { CommandEnvelope, CommandHandlerResult, JsonObject, SimulationTime } from "./types.ts";
import type { EventJournal } from "./journal.ts";
import type { SeededRandom } from "./random.ts";
import type { SimulationState } from "./state.ts";

export type SystemContext = {
  time: SimulationTime;
  state: SimulationState;
  journal: EventJournal;
  random: SeededRandom;
};

export type CommandContext = SystemContext & {
  command: CommandEnvelope;
};

export type SystemDefinition = {
  name: string;
  cadenceTicks: number;
  execute: (context: SystemContext) => void;
};

export type CommandHandler<TPayload extends JsonObject = JsonObject> = (
  command: CommandEnvelope<TPayload>,
  context: CommandContext
) => CommandHandlerResult;

export type SimulationModule = {
  name: string;
  systems: SystemDefinition[];
  commandHandlers?: Record<string, CommandHandler>;
};
