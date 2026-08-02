import type { Entity } from "./Entity";
import { createEntity } from "./Entity";

export class ECS {

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