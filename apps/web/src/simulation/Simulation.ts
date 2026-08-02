import { CitizenManager } from "../citizens/CitizenManager";
import { SimulationClock } from "../time/SimulationClock";
import { World } from "../world/World";
import { Selection } from "../selection/Selection";
import { ECS } from "../ecs/ECS";
import { TimeSystem } from "../ecs/systems/TimeSystem";
import { Scheduler } from "../ecs/Scheduler";
import { SystemRegistry } from "../ecs/SystemRegistry";
import { EventBus } from "../ecs/EventBus";



export class Simulation {

    readonly citizens = new CitizenManager(100);

    readonly ecs = new ECS();

    readonly world = new World();

    readonly selection = new Selection();

    readonly scheduler = new Scheduler();

    readonly eventBus = new EventBus();

    readonly systems: SystemRegistry;

    readonly timeSystem = new TimeSystem();

    readonly clock = new SimulationClock();

    constructor() {

        this.systems = new SystemRegistry(
            this.ecs,
            this.world,
            this.scheduler,
            this.eventBus
        );

        this.eventBus.on("hello", (message: string) => {

            console.log(message);

        });

        this.eventBus.emit("hello", "Event Bus Working");

        for (let i = 0; i < 25; i++) {

            const entity = this.ecs.create();

            this.ecs.positions.add(entity,{
                x: Math.floor(Math.random() * this.world.width),
                y: Math.floor(Math.random() * this.world.height)
            });

            this.ecs.citizens.add(entity,{
                name: `Citizen ${i + 1}`,
                age: 18 + Math.floor(Math.random() * 40)
            });

           

            this.ecs.velocities.add(entity, {

                x: (Math.random() - 0.5) * 0.03,

                y: (Math.random() - 0.5) * 0.03

            });

        }
        

        
    }

    update() {

        this.clock.update();

        this.timeSystem.update();

        this.scheduler.update(
            this.timeSystem.getTick()
        );

        this.citizens.update();

    }

}

export const simulation = new Simulation();

