import { useContext } from 'react';
import { RecordsContext, type RecordsContextValue } from './recordsContextDef';

export function useRecords(): RecordsContextValue {
  const ctx = useContext(RecordsContext);
  if (!ctx) {
    throw new Error('useRecords must be used within a RecordsProvider');
  }
  return ctx;
}
