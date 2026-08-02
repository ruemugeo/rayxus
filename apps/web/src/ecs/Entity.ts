export type Entity = number;

let nextEntity = 1;

export function createEntity(): Entity {
  return nextEntity++;
}