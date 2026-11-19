import { JsonSnapshotAdapter } from "../../storage-json/src/index.ts";
import { promises as fs } from "node:fs";
import type { EngineSnapshot } from "../../../engine-core/src/index.ts";

export class FileSnapshotAdapter extends JsonSnapshotAdapter {
  async save(snapshot: EngineSnapshot, filePath: string): Promise<void> {
    const serialized = this.serialize(snapshot);
    await fs.writeFile(filePath, serialized, "utf-8");
  }

  async load(filePath: string): Promise<EngineSnapshot> {
    const content = await fs.readFile(filePath, "utf-8");
    return this.deserialize(content);
  }
}