import { ECS } from "../ecs/ECS";
import { Scheduler } from "../ecs/Scheduler";
import { EventBus } from "../ecs/EventBus";
import { World } from "../world/World";

export interface EngineContext {

    ecs: ECS;

    world: World;

    scheduler: Scheduler;

    eventBus: EventBus;

}