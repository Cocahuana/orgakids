import type { EntryType } from '../../types';
import styles from './Tag.module.css';

interface TagProps {
  type: EntryType;
  label: string;
}

export function Tag({ type, label }: TagProps) {
  return (
    <span className={`${styles.tag} ${styles[`tag--${type}`]}`}>
      {label}
    </span>
  );
}
