import type { Tile } from "../world/Tile";

export class Selection {

  private tile: Tile | null = null;

  setTile(tile: Tile | null) {
    this.tile = tile;
  }

  getTile() {
    return this.tile;
  }

  clear() {
    this.tile = null;
  }

}