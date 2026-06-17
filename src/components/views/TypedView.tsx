import type { Entry, EntryType } from '../../types';
import { TYPE_INFO } from '../../constants';
import { EntryList } from '../organisms/EntryList';
import styles from './SectionTitle.module.css';

interface TypedViewProps {
  type: EntryType;
  entries: Entry[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TypedView({ type, entries, onEdit, onDelete }: TypedViewProps) {
  const ti = TYPE_INFO[type];
  return (
    <div>
      <div className={styles.title}>
        <span className={styles.dot} style={{ background: `var(--${type})` }} />
        {ti.icon} {ti.label}
      </div>
      <EntryList
        entries={entries.filter((e) => e.type === type)}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}
