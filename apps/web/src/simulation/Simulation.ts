import { CitizenManager } from "../citizens/CitizenManager";
import { SimulationClock } from "../time/SimulationClock";
import { World } from "../world/World";

export class Simulation {

    readonly citizens = new CitizenManager(100);
    readonly world = new World();

    readonly clock = new SimulationClock();

    update(){

        this.clock.update();

        this.citizens.update();

    }

}

export const simulation = new Simulation();