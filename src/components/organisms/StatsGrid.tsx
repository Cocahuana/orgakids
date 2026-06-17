import type { Entry } from '../../types';
import { StatCard } from '../atoms/StatCard';
import styles from './StatsGrid.module.css';

const STAT_DEFS = [
  { key: 'exam'    as const, icon: '📝', label: 'Exámenes', color: '#FF5C5C' },
  { key: 'sport'   as const, icon: '⚽', label: 'Deportes',  color: '#2DB87C' },
  { key: 'event'   as const, icon: '🎉', label: 'Eventos',   color: '#7C5CFC' },
  { key: 'recover' as const, icon: '⚠️',  label: 'Recuperar', color: '#FF9A00' },
  { key: 'work'    as const, icon: '📋', label: 'Trabajos',  color: '#0099E6' },
];

interface StatsGridProps {
  entries: Entry[];
}

export function StatsGrid({ entries }: StatsGridProps) {
  const counts = Object.fromEntries(
    STAT_DEFS.map((d) => [d.key, entries.filter((e) => e.type === d.key).length]),
  );

  return (
    <div className={styles.grid}>
      {STAT_DEFS.map((d) => (
        <StatCard
          key={d.key}
          count={counts[d.key]}
          icon={d.icon}
          label={d.label}
          color={d.color}
        />
      ))}
    </div>
  );
}
