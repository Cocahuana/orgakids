import styles from './StatCard.module.css';

interface StatCardProps {
  count: number;
  icon: string;
  label: string;
  color: string;
}

export function StatCard({ count, icon, label, color }: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.number} style={{ color }}>
        {count}
      </div>
      <div className={styles.label}>
        {icon} {label}
      </div>
    </div>
  );
}
