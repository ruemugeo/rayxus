import { Random } from "../Random";
import type { Tile, TileType } from "../Tile";
import { TileType as Types } from "../Tile";

export class TerrainGenerator {

  private readonly random: Random;

  constructor(random: Random) {
    this.random = random;
  }

  generate(width: number, height: number): Tile[] {

    const heightMap: number[][] = [];

    for (let y = 0; y < height; y++) {

    heightMap[y] = [];

    for (let x = 0; x < width; x++) {
        heightMap[y][x] = this.random.next();
    }

    }

    const smoothMap: number[][] = [];

    for (let y = 0; y < height; y++) {

    smoothMap[y] = [];

    for (let x = 0; x < width; x++) {

        let total = 0;
        let count = 0;

        for (let oy = -1; oy <= 1; oy++) {

        for (let ox = -1; ox <= 1; ox++) {

            const nx = x + ox;
            const ny = y + oy;

            if (
            nx >= 0 &&
            nx < width &&
            ny >= 0 &&
            ny < height
            ) {
            total += heightMap[ny][nx];
            count++;
            }

        }

        }

        smoothMap[y][x] = total / count;

    }

    }

    const tiles: Tile[] = [];

    for (let y = 0; y < height; y++) {

      for (let x = 0; x < width; x++) {

        const elevation = smoothMap[y][x];

        let type: TileType;

        if (elevation < 0.35) {
          type = Types.Water;
        } else if (elevation < 0.72) {
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