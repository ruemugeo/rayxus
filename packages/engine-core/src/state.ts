import { RAYXUS_STATE_SCHEMA_VERSION } from "./types.ts";
import type { EntityId, ModuleName, ModuleState, StateSnapshot } from "./types.ts";

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export class SimulationState {
  private readonly scenarioIdValue: string;
  private readonly entityIdSet = new Set<EntityId>();
  private readonly moduleStates = new Map<ModuleName, ModuleState>();

  constructor(scenarioId: string) {
    this.scenarioIdValue = scenarioId;
  }

  get scenarioId(): string {
    return this.scenarioIdValue;
  }

  registerEntity(id: EntityId): void {
    this.entityIdSet.add(id);
  }

  hasEntity(id: EntityId): boolean {
    return this.entityIdSet.has(id);
  }

  getEntityIds(): EntityId[] {
    return [...this.entityIdSet].sort();
  }

  getModuleState<TState extends ModuleState>(moduleName: ModuleName, initialState: TState): TState {
    if (!this.moduleStates.has(moduleName)) {
      this.moduleStates.set(moduleName, cloneJson(initialState));
    }

    return this.moduleStates.get(moduleName) as TState;
  }

  setModuleState(moduleName: ModuleName, state: ModuleState): void {
    this.moduleStates.set(moduleName, cloneJson(state));
  }

  snapshot(): StateSnapshot {
    const modules: Record<ModuleName, ModuleState> = {};

    for (const [moduleName, moduleState] of [...this.moduleStates.entries()].sort()) {
      modules[moduleName] = cloneJson(moduleState);
    }

    return {
      schemaVersion: RAYXUS_STATE_SCHEMA_VERSION,
      scenarioId: this.scenarioIdValue,
      entityIds: this.getEntityIds(),
      modules
    };
  }

  static fromSnapshot(snapshot: StateSnapshot): SimulationState {
    const state = new SimulationState(snapshot.scenarioId);

    for (const entityId of snapshot.entityIds) {
      state.registerEntity(entityId);
    }

    for (const [moduleName, moduleState] of Object.entries(snapshot.modules)) {
      state.setModuleState(moduleName, moduleState);
    }

    return state;
  }
}
