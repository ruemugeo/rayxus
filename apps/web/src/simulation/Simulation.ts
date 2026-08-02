import { SimulationClock } from "../time/SimulationClock";
import { World } from "../world/World";
import { Selection } from "../selection/Selection";
import { ECS } from "../ecs/ECS";
import { TimeSystem } from "../ecs/systems/TimeSystem";
import { Scheduler } from "../ecs/Scheduler";
import { SystemRegistry } from "../ecs/SystemRegistry";
import { EventBus } from "../ecs/EventBus";
import type { EngineContext } from "../engine/EngineContext";



export class Simulation {

    readonly ecs = new ECS();

    readonly world = new World();

    readonly selection = new Selection();

    readonly scheduler = new Scheduler();

    readonly eventBus = new EventBus();

    readonly systems: SystemRegistry;

    readonly timeSystem = new TimeSystem();

    readonly clock = new SimulationClock();

constructor() {

    const context: EngineContext = {
        ecs: this.ecs,
        world: this.world,
        scheduler: this.scheduler,
        eventBus: this.eventBus
    };

    this.systems = new SystemRegistry(context);

    this.eventBus.on("hello", (message: string) => {
        console.log(message);
    });

    this.eventBus.emit("hello", "Event Bus Working");

    for (let i = 0; i < 25; i++) {

        const entity = this.ecs.create();

        this.ecs.positions.add(entity, {
            x: Math.floor(Math.random() * this.world.width),
            y: Math.floor(Math.random() * this.world.height)
        });

        this.ecs.citizens.add(entity, {
            name: `Citizen ${i + 1}`,
            age: 18 + Math.floor(Math.random() * 40)
        });

        this.ecs.needs.add(entity, {

            hunger: 100,

            thirst: 100,

            energy: 100

        });

        this.ecs.tasks.add(entity, {

            current: "idle"

        });

        this.ecs.destinations.add(entity, {

            x: Math.floor(Math.random() * this.world.width),

            y: Math.floor(Math.random() * this.world.height),

            reached: false

        });

        this.ecs.velocities.add(entity, {
            x: (Math.random() - 0.5) * 0.03,
            y: (Math.random() - 0.5) * 0.03
        });

    }

} // ← Constructor ends here

update() {

    this.clock.update();

    this.timeSystem.update();

    this.scheduler.update(
        this.timeSystem.getTick()
    );

}

} // ← Class ends here

export const simulation = new Simulation();
