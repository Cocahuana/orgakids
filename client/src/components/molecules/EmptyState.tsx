import styles from './EmptyState.module.css';

export function EmptyState() {
  return (
    <div className={styles.empty}>
      <div className={styles.icon}>✅</div>
      Todo despejado por acá
    </div>
  );
}
