import type { Tile } from "./Tile";
import { Random } from "./Random";
import { TerrainGenerator } from "./generation/TerrainGenerator";

export class World {

  readonly width = 40;

  readonly height = 40;

  readonly seed = 987654;

  private readonly random = new Random(this.seed);

  private readonly tiles: Tile[] = [];

  constructor() {
    this.generate();
  }

  private generate() {

    const generator = new TerrainGenerator(this.random);

    this.tiles.length = 0;

    this.tiles.push(
      ...generator.generate(this.width, this.height)
    );

  }

  getTiles() {
    return this.tiles;
  }

  getTile(x: number, y: number) {

    return this.tiles[y * this.width + x];

  }

}