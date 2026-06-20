import type { SwimRecord, SwimRecordInput } from '../../domain/record';
import type { StorageService } from '../storage/StorageService';

// Single chokepoint for record persistence. Pages/state never talk to
// StorageService directly, so a future sync layer (outbox queue, dirty flag,
// conflict resolution) can be added here without touching UI code.
export class RecordRepository {
  private readonly storage: StorageService;

  constructor(storage: StorageService) {
    this.storage = storage;
  }

  async getAll(): Promise<SwimRecord[]> {
    return this.storage.getAll();
  }

  async getById(id: string): Promise<SwimRecord | undefined> {
    return this.storage.getById(id);
  }

  async create(input: SwimRecordInput): Promise<SwimRecord> {
    const now = new Date().toISOString();
    const record: SwimRecord = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    await this.storage.save(record);
    return record;
  }

  async update(id: string, input: SwimRecordInput): Promise<SwimRecord> {
    const existing = await this.storage.getById(id);
    if (!existing) {
      throw new Error(`Record ${id} not found`);
    }
    const record: SwimRecord = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    };
    await this.storage.save(record);
    return record;
  }

  async remove(id: string): Promise<void> {
    await this.storage.remove(id);
  }

  // Used by JSON import: writes records as-is (preserving id/timestamps from
  // the export) rather than minting new ones, so re-importing the same file
  // is idempotent (upsert by id).
  async restore(records: SwimRecord[]): Promise<void> {
    for (const record of records) {
      await this.storage.save(record);
    }
  }
}
