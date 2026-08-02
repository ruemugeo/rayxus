import type { Entity } from "./Entity";
import { createEntity } from "./Entity";
import { ComponentStore } from "./ComponentStore";
import type { Position } from "./components/Position";
import type { Citizen } from "./components/Citizen";
import type { Velocity } from "./components/Velocity";
import type { Needs } from "./components/Needs";
import type { Task } from "./components/Task";
import type { Destination } from "./components/Destination";


export class ECS {

    readonly positions = new ComponentStore<Position>();

    readonly velocities = new ComponentStore<Velocity>();

    readonly citizens = new ComponentStore<Citizen>();

    readonly needs = new ComponentStore<Needs>();

    readonly tasks = new ComponentStore<Task>();

    readonly destinations = new ComponentStore<Destination>();

    private readonly entities = new Set<Entity>();

  create(): Entity {

    const entity = createEntity();

    this.entities.add(entity);

    return entity;

  }

  destroy(entity: Entity) {

    this.entities.delete(entity);

  }

  getAll() {

    return this.entities;

  }

}