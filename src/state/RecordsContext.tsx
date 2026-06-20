import { useCallback, useEffect, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { SwimRecord, SwimRecordInput } from '../domain/record';
import { RecordRepository } from '../services/repository/RecordRepository';
import { storageService } from '../services/platform';
import { exportRecordsToJson, parseRecordsFromJson } from '../services/exportImport/recordExportImport';
import { RecordsContext, type RecordsContextValue } from './recordsContextDef';

interface RecordsState {
  records: SwimRecord[];
  loading: boolean;
  error: string | null;
}

type RecordsAction =
  | { type: 'LOADING' }
  | { type: 'LOADED'; records: SwimRecord[] }
  | { type: 'ERROR'; message: string };

function recordsReducer(state: RecordsState, action: RecordsAction): RecordsState {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true, error: null };
    case 'LOADED':
      return { records: action.records, loading: false, error: null };
    case 'ERROR':
      return { ...state, loading: false, error: action.message };
  }
}

// One repository instance for the app lifetime; swapping storageService here
// (e.g. for a Capacitor implementation) requires no change to this context.
const repository = new RecordRepository(storageService);

export function RecordsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(recordsReducer, {
    records: [],
    loading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    dispatch({ type: 'LOADING' });
    try {
      const records = await repository.getAll();
      dispatch({ type: 'LOADED', records });
    } catch {
      dispatch({ type: 'ERROR', message: 'Nepodařilo se načíst záznamy.' });
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getById = useCallback((id: string) => repository.getById(id), []);

  const createRecord = useCallback(
    async (input: SwimRecordInput) => {
      const record = await repository.create(input);
      await refresh();
      return record;
    },
    [refresh],
  );

  const updateRecord = useCallback(
    async (id: string, input: SwimRecordInput) => {
      const record = await repository.update(id, input);
      await refresh();
      return record;
    },
    [refresh],
  );

  const deleteRecord = useCallback(
    async (id: string) => {
      await repository.remove(id);
      await refresh();
    },
    [refresh],
  );

  const exportToJson = useCallback(async () => {
    const records = await repository.getAll();
    return exportRecordsToJson(records);
  }, []);

  const importFromJson = useCallback(
    async (json: string) => {
      const records = parseRecordsFromJson(json);
      await repository.restore(records);
      await refresh();
      return records.length;
    },
    [refresh],
  );

  const value = useMemo<RecordsContextValue>(
    () => ({
      records: state.records,
      loading: state.loading,
      error: state.error,
      refresh,
      getById,
      createRecord,
      updateRecord,
      deleteRecord,
      exportToJson,
      importFromJson,
    }),
    [state, refresh, getById, createRecord, updateRecord, deleteRecord, exportToJson, importFromJson],
  );

  return <RecordsContext.Provider value={value}>{children}</RecordsContext.Provider>;
}
