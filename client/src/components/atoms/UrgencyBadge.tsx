import styles from './UrgencyBadge.module.css';

interface UrgencyBadgeProps {
  cls: string;
  label: string;
}

export function UrgencyBadge({ cls, label }: UrgencyBadgeProps) {
  return (
    <span className={`${styles.urgency} ${styles[cls]}`}>
      {label}
    </span>
  );
}
