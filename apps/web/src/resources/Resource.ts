export const ResourceType = {
  Tree: "tree",
} as const;

export type ResourceType =
  (typeof ResourceType)[keyof typeof ResourceType];

export interface Resource {
  id: number;

  x: number;
  y: number;

  type: ResourceType;

  amount: number;
}