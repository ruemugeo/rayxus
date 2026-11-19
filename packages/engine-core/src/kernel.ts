import { SimulationClock } from "./clock.ts";
import { CommandBus } from "./commands.ts";
import { EventJournal } from "./journal.ts";
import { SeededRandom } from "./random.ts";
import { SimulationState } from "./state.ts";
import {
  RAYXUS_ENGINE_VERSION,
  RAYXUS_STATE_SCHEMA_VERSION
} from "./types.ts";
import type {
  CommandEnvelope,
  CommandHandlerResult,
  EngineSnapshot,
  RandomSnapshot,
  SimulationTime
} from "./types.ts";
import type { SimulationModule, SystemDefinition } from "./module.ts";

type KernelOptions = {
  scenarioId: string;
  seed: number;
  initialTick?: number;
};

type KernelHydrateOptions = {
  snapshot: EngineSnapshot;
};

export class RayxusKernel {
  readonly scenarioId: string;
  readonly clock: SimulationClock;
  readonly state: SimulationState;
  readonly journal: EventJournal;
  readonly random: SeededRandom;
  private readonly commandBus = new CommandBus();
  private readonly systems: SystemDefinition[] = [];
  private readonly modules = new Set<string>();

  constructor(options: KernelOptions | KernelHydrateOptions) {
    if ("snapshot" in options) {
      this.scenarioId = options.snapshot.scenarioId;
      this.clock = new SimulationClock(options.snapshot.time.tick);
      this.state = SimulationState.fromSnapshot(options.snapshot.state);
      this.journal = EventJournal.fromSnapshot(options.snapshot.journal);
      this.random = SeededRandom.fromSnapshot(options.snapshot.random);
      return;
    }

    this.scenarioId = options.scenarioId;
    this.clock = new SimulationClock(options.initialTick ?? 0);
    this.state = new SimulationState(options.scenarioId);
    this.journal = new EventJournal();
    this.random = new SeededRandom(options.seed);
  }

  get time(): SimulationTime {
    return this.clock.time;
  }

  registerModule(module: SimulationModule): void {
    if (this.modules.has(module.name)) {
      throw new Error(`Module "${module.name}" already registered.`);
    }

    this.modules.add(module.name);
    this.systems.push(...module.systems);

    for (const [commandType, handler] of Object.entries(module.commandHandlers ?? {})) {
      this.commandBus.register(commandType, handler);
    }
  }

  executeCommand(command: CommandEnvelope): CommandHandlerResult {
    return this.commandBus.dispatch(command, {
      time: this.clock.time,
      state: this.state,
      journal: this.journal,
      random: this.random
    });
  }

  tick(): void {
    const time = this.clock.advance();

    for (const system of this.systems) {
      if (time.tick % system.cadenceTicks === 0) {
        system.execute({
          time,
          state: this.state,
          journal: this.journal,
          random: this.random
        });
      }
    }
  }

  runTicks(count: number): void {
    if (!Number.isInteger(count) || count < 0) {
      throw new Error(`Tick count must be a non-negative integer. Received ${count}.`);
    }

    for (let index = 0; index < count; index += 1) {
      this.tick();
    }
  }

  snapshot(): EngineSnapshot {
    return {
      engineVersion: RAYXUS_ENGINE_VERSION,
      schemaVersion: RAYXUS_STATE_SCHEMA_VERSION,
      scenarioId: this.scenarioId,
      time: this.clock.time,
      random: this.random.snapshot() as RandomSnapshot,
      state: this.state.snapshot(),
      journal: this.journal.snapshot()
    };
  }
}
