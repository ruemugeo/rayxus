import type { Entity } from "./Entity";

export class ComponentStore<T> {

  private readonly components = new Map<Entity, T>();

  add(entity: Entity, component: T) {
    this.components.set(entity, component);
  }

  get(entity: Entity) {
    return this.components.get(entity);
  }

  remove(entity: Entity) {
    this.components.delete(entity);
  }

  has(entity: Entity) {
    return this.components.has(entity);
  }

  values() {
    return this.components.values();
  }

  entries() {
    return this.components.entries();
  }

}