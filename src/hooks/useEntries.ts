import { useState, useCallback } from 'react';
import type { AppData, Entry, EntryType } from '../types';
import { DEFAULT_DATA } from '../constants';

const STORAGE_KEY = 'orgakids';

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppData;
      if (Array.isArray(parsed.entries)) return parsed;
    }
  } catch {
    // ignore parse errors
  }
  return structuredClone(DEFAULT_DATA);
}

function persistData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage unavailable
  }
}

export function useEntries() {
  const [data, setData] = useState<AppData>(loadData);

  const saveAndSet = useCallback((next: AppData) => {
    persistData(next);
    setData(next);
  }, []);

  const addEntry = useCallback(
    (entry: Omit<Entry, 'id'>) => {
      setData((prev) => {
        const next: AppData = {
          entries: [...prev.entries, { ...entry, id: prev.nextId }],
          nextId: prev.nextId + 1,
        };
        persistData(next);
        return next;
      });
    },
    [],
  );

  const updateEntry = useCallback(
    (updated: Entry) => {
      setData((prev) => {
        const next: AppData = {
          ...prev,
          entries: prev.entries.map((e) => (e.id === updated.id ? updated : e)),
        };
        persistData(next);
        return next;
      });
    },
    [],
  );

  const deleteEntry = useCallback(
    (id: number) => {
      setData((prev) => {
        const next: AppData = {
          ...prev,
          entries: prev.entries.filter((e) => e.id !== id),
        };
        persistData(next);
        return next;
      });
    },
    [],
  );

  const getByType = useCallback(
    (type: EntryType) => data.entries.filter((e) => e.type === type),
    [data.entries],
  );

  return {
    entries: data.entries,
    addEntry,
    updateEntry,
    deleteEntry,
    getByType,
    saveAndSet,
  };
}
