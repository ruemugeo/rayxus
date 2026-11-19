export function makeSequenceId(prefix: string, sequence: number): string {
  return `${prefix}-${sequence.toString().padStart(6, "0")}`;
}

export function assertEntityId(id: string): void {
  if (!id.includes(":")) {
    throw new Error(`Invalid entity ID "${id}". Expected namespaced ID like "settlement:valley".`);
  }
}
