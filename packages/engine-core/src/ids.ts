export function makeSequenceId(prefix: string, sequence: number): string {
  return `${prefix}-${sequence.toString().padStart(6, "0")}`;
}

export function isValidEntityId(id: string): boolean {
  return typeof id === "string" && id.includes(":") && !id.startsWith(":") && !id.endsWith(":");
}

export function assertEntityId(id: string): void {
  if (!isValidEntityId(id)) {
    throw new Error(`Invalid entity ID "${id}". Expected namespaced ID like "settlement:valley".`);
  }
}
