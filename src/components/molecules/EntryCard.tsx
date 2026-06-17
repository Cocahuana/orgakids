import type { Entry } from '../../types';
import { TYPE_INFO } from '../../constants';
import { daysUntil, formatDate, urgencyBadge } from '../../utils';
import { Tag } from '../atoms/Tag';
import { UrgencyBadge } from '../atoms/UrgencyBadge';
import { IconButton } from '../atoms/IconButton';
import styles from './EntryCard.module.css';

interface EntryCardProps {
  entry: Entry;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function EntryCard({ entry, onEdit, onDelete }: EntryCardProps) {
  const ti = TYPE_INFO[entry.type];
  const days = entry.date ? daysUntil(entry.date) : null;
  const ub = days !== null ? urgencyBadge(days) : null;

  const meta: string[] = [];
  if (entry.date)  meta.push(`📅 ${formatDate(entry.date)}`);
  if (entry.time)  meta.push(`🕐 ${entry.time}`);
  if (entry.recur) meta.push(`🔁 ${entry.recur}`);
  if (entry.grade) meta.push(`📊 Nota: ${entry.grade}`);

  return (
    <div className={`${styles.card} ${styles[`card--${ti.cls}`]}`}>
      {ub && <UrgencyBadge cls={ub.cls} label={ub.label} />}

      <div className={styles.icon}>{ti.icon}</div>

      <div className={styles.body}>
        <div className={styles.title}>{entry.title}</div>
        <div className={styles.meta}>
          {entry.kid && <span>👤 {entry.kid}</span>}
          {meta.map((m, i) => <span key={i}>{m}</span>)}
        </div>
        <Tag type={entry.type} label={ti.tag} />
        {entry.notes && (
          <div className={styles.notes}>{entry.notes}</div>
        )}
      </div>

      <div className={styles.actions}>
        <IconButton variant="edit"   onClick={() => onEdit(entry.id)} />
        <IconButton variant="delete" onClick={() => onDelete(entry.id)} />
      </div>
    </div>
  );
}
