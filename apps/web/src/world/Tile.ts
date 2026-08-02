export const TileType = {
  Water: "water",
  Grass: "grass",
  Forest: "forest",
} as const;

export type TileType = (typeof TileType)[keyof typeof TileType];

export interface Tile {
  x: number;
  y: number;

  height: number;

  type: TileType;
}