export const TileType = {
  Grass: "grass",
  Water: "water",
  Forest: "forest",
} as const;

export type TileType = (typeof TileType)[keyof typeof TileType];

export interface Tile {
  x: number;
  y: number;
  type: TileType;
}