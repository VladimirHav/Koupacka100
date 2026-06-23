import Dexie, { type EntityTable } from 'dexie';
import type { SwimRecord } from '../../domain/record';
import { DEFAULT_WATER_TEMPERATURE } from '../../domain/record';
import type { StorageService } from './StorageService';

// Shape of records written by schema v1, before waterTemperature/comment/
// multi-photo support existed.
interface LegacyV1Record {
  photoBlob?: Blob | null;
  waterTemperature?: number;
  comment?: string;
  photos?: Blob[];
}

class SwimLogDatabase extends Dexie {
  records!: EntityTable<SwimRecord, 'id'>;

  constructor() {
    super('swim-log');
    this.version(1).stores({
      // Only fields we actually query/sort by need to be indexed.
      records: 'id, date, createdAt',
    });

    // v2 adds waterTemperature, comment, and multi-photo support
    // (photoBlob -> photos[]). No new indexes needed, just a data migration.
    this.version(2)
      .stores({
        records: 'id, date, createdAt',
      })
      .upgrade((tx) => {
        return tx
          .table('records')
          .toCollection()
          .modify((record: SwimRecord & LegacyV1Record) => {
            if (record.photos === undefined) {
              record.photos = record.photoBlob ? [record.photoBlob] : [];
            }
            delete record.photoBlob;
            if (record.waterTemperature === undefined) {
              record.waterTemperature = DEFAULT_WATER_TEMPERATURE;
            }
            if (record.comment === undefined) {
              record.comment = '';
            }
          });
      });
  }
}

const db = new SwimLogDatabase();

export class IndexedDbStorageService implements StorageService {
  async getAll(): Promise<SwimRecord[]> {
    // Oldest swim date first, matching the "fill up to 100 places" progress view.
    return db.records.orderBy('date').toArray();
  }

  async getById(id: string): Promise<SwimRecord | undefined> {
    return db.records.get(id);
  }

  async save(record: SwimRecord): Promise<void> {
    await db.records.put(record);
  }

  async remove(id: string): Promise<void> {
    await db.records.delete(id);
  }
}
