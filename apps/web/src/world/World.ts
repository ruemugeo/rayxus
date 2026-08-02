import type { Tile } from "./Tile";
import { TileType } from "./Tile";
import { Random } from "./Random";

export class World {

  readonly width = 40;

  readonly height = 40;

  readonly seed = 123456;

  private readonly random = new Random(this.seed);

  private readonly tiles: Tile[] = [];

  constructor() {
    this.generate();
  }

  private generate() {

    this.tiles.length = 0;

    for (let y = 0; y < this.height; y++) {

      for (let x = 0; x < this.width; x++) {

        let type: TileType = TileType.Grass;

        const r = this.random.next();

        if (r < 0.08) {
          type = TileType.Water;
        } else if (r < 0.18) {
          type = TileType.Forest;
        }

        this.tiles.push({
        x,
        y,
        type
        });

      }

    }

  }

  getTiles() {
    return this.tiles;
  }

  getTile(x: number, y: number) {

    return this.tiles[y * this.width + x];

  }

}