import type { Tile } from "./Tile";
import { Random } from "./Random";
import { TerrainGenerator } from "./generation/TerrainGenerator";

export class World {

  readonly width = 40;

  readonly height = 40;

  readonly seed = 987654;

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

}

