import { Random } from "../Random";
import type { Tile, TileType } from "../Tile";
import { TileType as Types } from "../Tile";

export class TerrainGenerator {

  private readonly random: Random;

  constructor(random: Random) {
    this.random = random;
  }

  generate(width: number, height: number): Tile[] {

    const tiles: Tile[] = [];

    for (let y = 0; y < height; y++) {

      for (let x = 0; x < width; x++) {

        const elevation = this.random.next();

        let type: TileType;

        if (elevation < 0.25) {
          type = Types.Water;
        } else if (elevation < 0.75) {
          type = Types.Grass;
        } else {
          type = Types.Forest;
        }

        tiles.push({
          x,
          y,
          height: elevation,
          type,
        });
      }
    }

    return tiles;
  }
}