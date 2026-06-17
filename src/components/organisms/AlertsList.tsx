import type { Entry } from '../../types';
import { TYPE_INFO } from '../../constants';
import { daysUntil } from '../../utils';
import { AlertRow } from '../molecules/AlertRow';
import styles from './AlertsList.module.css';

interface AlertsListProps {
  entries: Entry[];
}

export function AlertsList({ entries }: AlertsListProps) {
  const urgent = entries
    .filter((e) => e.date && daysUntil(e.date) <= 3)
    .sort((a, b) => daysUntil(a.date) - daysUntil(b.date));

  if (!urgent.length) {
    return (
      <div className={styles.ok}>
        <span>✅</span> Sin urgencias en los próximos 3 días
      </div>
    );
  }

  return (
    <div>
      {urgent.map((e) => {
        const days = daysUntil(e.date);
        const label =
          days < 0 ? 'Vencido'
          : days === 0 ? '¡HOY!'
          : `En ${days} día${days === 1 ? '' : 's'}`;

        return (
          <AlertRow
            key={e.id}
            icon={TYPE_INFO[e.type]?.icon ?? '📌'}
            kid={e.kid}
            title={e.title}
            label={label}
          />
        );
      })}
    </div>
  );
}
