import type { Entry } from '../../types';
import { daysUntil } from '../../utils';
import { StatsGrid } from '../organisms/StatsGrid';
import { WeekRow } from '../organisms/WeekRow';
import { AlertsList } from '../organisms/AlertsList';
import { EntryList } from '../organisms/EntryList';
import styles from './SectionTitle.module.css';

interface OverviewViewProps {
  entries: Entry[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function OverviewView({ entries, onEdit, onDelete }: OverviewViewProps) {
  const upcoming = entries
    .filter((e) => !e.date || daysUntil(e.date) > 3)
    .sort((a, b) =>
      (a.date || '9999-12-31').localeCompare(b.date || '9999-12-31'),
    )
    .slice(0, 6);

  return (
    <div>
      <StatsGrid entries={entries} />

      <div className={styles.title}>
        <span className={styles.dot} style={{ background: '#FF5C5C' }} />
        Próximos 7 días
      </div>
      <WeekRow entries={entries} />

      <div className={styles.title}>
        <span className={styles.dot} style={{ background: '#FF9A00' }} />
        Alertas urgentes
      </div>
      <AlertsList entries={entries} />

      <div className={styles.title} style={{ marginTop: 8 }}>
        <span className={styles.dot} style={{ background: '#7C9FFF' }} />
        Todo en orden
      </div>
      <EntryList entries={upcoming} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}
