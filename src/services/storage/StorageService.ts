import type { SwimRecord } from '../../domain/record';

// Platform-agnostic persistence contract.
// Browser (v1) implements this with IndexedDB/Dexie; a future Capacitor build
// can implement it with SQLite/Filesystem without touching any caller.
export interface StorageService {
  getAll(): Promise<SwimRecord[]>;
  getById(id: string): Promise<SwimRecord | undefined>;
  save(record: SwimRecord): Promise<void>;
  remove(id: string): Promise<void>;
}
