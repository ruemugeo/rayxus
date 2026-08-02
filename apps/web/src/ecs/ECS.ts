import type { Entity } from "./Entity";
import { createEntity } from "./Entity";
import { ComponentStore } from "./ComponentStore";
import type { Position } from "./components/Position";

export class ECS {

    readonly positions = new ComponentStore<Position>();

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