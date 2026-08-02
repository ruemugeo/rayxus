import { CitizenManager } from "../citizens/CitizenManager";
import { SimulationClock } from "../time/SimulationClock";
import { World } from "../world/World";
import { Selection } from "../selection/Selection";
import { ECS } from "../ecs/ECS";


export class Simulation {

    readonly citizens = new CitizenManager(100);

    readonly ecs = new ECS();

    readonly world = new World();

    readonly selection = new Selection();

    readonly clock = new SimulationClock();

    constructor() {

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

        }
        

        
    }

    update() {

        this.clock.update();

        this.citizens.update();

    }

}

export const simulation = new Simulation();

