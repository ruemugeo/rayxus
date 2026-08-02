import { CitizenManager } from "../citizens/CitizenManager";
import { SimulationClock } from "../time/SimulationClock";

export class Simulation {

    readonly citizens = new CitizenManager(100);

    readonly clock = new SimulationClock();

    update(){

        this.clock.update();

        this.citizens.update();

    }

}

export const simulation = new Simulation();