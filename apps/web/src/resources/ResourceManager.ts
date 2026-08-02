import type { Resource } from "./Resource";

export class ResourceManager {

  private readonly resources: Resource[] = [];

  add(resource: Resource) {
    this.resources.push(resource);
  }

  getAll() {
    return this.resources;
  }

}