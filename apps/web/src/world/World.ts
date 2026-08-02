import type { Tile } from "./Tile";
import { Random } from "./Random";
import { TerrainGenerator } from "./generation/TerrainGenerator";
import { ResourceManager } from "../resources/ResourceManager";
import { ResourceType } from "../resources/Resource";

export class World {

  readonly width = 40;

  readonly height = 40;

  readonly seed = 987654;

  readonly resources = new ResourceManager();

  private readonly random = new Random(this.seed);

  private readonly tiles: Tile[][] = [];


  constructor() {
    this.generate();
  }

  private generate() {

    const generator = new TerrainGenerator(this.random);

    this.tiles.length = 0;

    const generated = generator.generate(this.width, this.height);

    for (let y = 0; y < this.height; y++) {

      this.tiles[y] = [];

      for (let x = 0; x < this.width; x++) {

        this.tiles[y][x] = generated[y * this.width + x];

      }

    }

    let id = 1;

for (const tile of this.getTiles()) {

  if (
    tile.type === "forest" &&
    this.random.next() < 0.35
  ) {

    this.resources.add({
      id: id++,

      x: tile.x,
      y: tile.y,

      type: ResourceType.Tree,

      amount: 100
    });

  }

}
  

  }


  getTiles() {
    return this.tiles.flat();
  }

  getTile(x: number, y: number) {

    return this.tiles[y]?.[x];

  }

  isInside(x: number, y: number) {
  return (
    x >= 0 &&
    x < this.width &&
    y >= 0 &&
    y < this.height
  );
}

getNeighbors(x: number, y: number) {
  const neighbors: Tile[] = [];

  const offsets = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ];

  for (const [dx, dy] of offsets) {
    const tile = this.getTile(x + dx, y + dy);

    if (tile) {
      neighbors.push(tile);
    }
  }

  return neighbors;
}

getTilesInRadius(x: number, y: number, radius: number) {
  const tiles: Tile[] = [];

  for (let yy = y - radius; yy <= y + radius; yy++) {

    for (let xx = x - radius; xx <= x + radius; xx++) {

      const tile = this.getTile(xx, yy);

      if (tile) {
        tiles.push(tile);
      }

    }

  }

  return tiles;
}

}

