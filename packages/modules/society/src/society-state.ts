import type { EntityId, ModuleState } from "../../../engine-core/src/index.ts";

export const SOCIETY_MODULE = "society";

export type Citizen = {
  entityId: EntityId;
  age: number;  // in ticks (or years if scaled)
  gender: "male" | "female";
  health: number;  // 0-1 scale
  wealth: number;
  skills: Record<string, number>;  // skill name -> level 0-1
  traits: string[];  // personality traits
};

export type Household = {
  entityId: EntityId;
  headId: EntityId;  // reference to citizen
  members: EntityId[];
  housingQuality: number;  // 0-1 scale
  satisfaction: number;   // 0-1 scale
};

export type Family = {
  entityId: EntityId;
  members: EntityId[];  // all family members
  kinshipStrength: number;  // 0-1 scale
};

export type Needs = {
  entityId: EntityId;
  hunger: number;  // 0 (starving) to 1 (full)
  thirst: number;  // 0 (dehydrated) to 1 (quenched)
  energy: number;  // 0 (exhausted) to 1 (rested)
  social: number;  // 0 (lonely) to 1 (fulfilled)
  safety: number;  // 0 (in danger) to 1 (secure)
  status: number;  // 0 (disrespected) to 1 (respected)
};

export type SocietyState = ModuleState & {
  citizens: Record<EntityId, Citizen>;
  households: Record<EntityId, Household>;
  families: Record<EntityId, Family>;
  needs: Record<EntityId, Needs>;
  socialClass: Record<EntityId, string>;  // class label per entity
};

export function createEmptySocietyState(): SocietyState {
  return {
    citizens: {},
    households: {},
    families: {},
    needs: {},
    socialClass: {}
  };
}