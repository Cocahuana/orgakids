import styles from './AlertRow.module.css';

interface AlertRowProps {
  icon: string;
  kid: string;
  title: string;
  label: string;
}

export function AlertRow({ icon, kid, title, label }: AlertRowProps) {
  return (
    <div className={styles.row}>
      <span className={styles.icon}>{icon}</span>
      <span>
        <strong>{kid}</strong> — {title}
      </span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
