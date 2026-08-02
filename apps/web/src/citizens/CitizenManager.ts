import type { Citizen } from "./Citizen";

export class CitizenManager {

    private citizens: Citizen[] = [];

    constructor(count = 100){

        for(let i = 0; i < count; i++){

            this.citizens.push({

                id: i,

                x: Math.floor(Math.random()*40),

                y: Math.floor(Math.random()*40),

                color: `hsl(${Math.random()*360},70%,60%)`

            });

        }

    }

    getAll(){

        return this.citizens;

    }

}