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

        const citizen = this.ecs.create();

        this.ecs.positions.add(citizen, {
            x: 25,
            y: 16
        });
        

        
    }

    update() {

        this.clock.update();

        this.citizens.update();

    }

}

export const simulation = new Simulation();

