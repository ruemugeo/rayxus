import type { Citizen } from "./Citizen";

export class CitizenManager {
  private citizens: Citizen[] = [];

  constructor(count = 100) {
    for (let i = 0; i < count; i++) {
      this.citizens.push({
        id: i,
        x: Math.floor(Math.random() * 40),
        y: Math.floor(Math.random() * 40),
        color: `hsl(${Math.random() * 360},70%,60%)`,
      });
    }
  }

  update() {
    for (const citizen of this.citizens) {
      if (Math.random() < 0.02) {
        citizen.x += Math.floor(Math.random() * 3) - 1;
        citizen.y += Math.floor(Math.random() * 3) - 1;

        citizen.x = Math.max(0, Math.min(39, citizen.x));
        citizen.y = Math.max(0, Math.min(39, citizen.y));
      }
    }
  }

  getAll() {
    return this.citizens;
  }

  getPopulation() {
    return this.citizens.length;
  }
}