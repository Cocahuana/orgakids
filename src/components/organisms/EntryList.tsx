import type { Entry } from '../../types';
import { EntryCard } from '../molecules/EntryCard';
import { EmptyState } from '../molecules/EmptyState';
import styles from './EntryList.module.css';

interface EntryListProps {
  entries: Entry[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function EntryList({ entries, onEdit, onDelete }: EntryListProps) {
  if (!entries.length) return <EmptyState />;

  const sorted = [...entries].sort((a, b) =>
    (a.date || '9999-12-31').localeCompare(b.date || '9999-12-31'),
  );

  return (
    <div className={styles.list}>
      {sorted.map((e) => (
        <EntryCard
          key={e.id}
          entry={e}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
