import { createContext } from 'react';
import type { SwimRecord, SwimRecordInput } from '../domain/record';

export interface RecordsContextValue {
  records: SwimRecord[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getById: (id: string) => Promise<SwimRecord | undefined>;
  createRecord: (input: SwimRecordInput) => Promise<SwimRecord>;
  updateRecord: (id: string, input: SwimRecordInput) => Promise<SwimRecord>;
  deleteRecord: (id: string) => Promise<void>;
  exportToJson: () => Promise<string>;
  importFromJson: (json: string) => Promise<number>;
}

export const RecordsContext = createContext<RecordsContextValue | null>(null);
