import styles from './IconButton.module.css';

interface IconButtonProps {
  variant: 'edit' | 'delete';
  onClick: () => void;
}

const LABELS = {
  edit:   '✏️ Editar',
  delete: '🗑️ Borrar',
};

export function IconButton({ variant, onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${styles[`btn--${variant}`]}`}
      onClick={onClick}
    >
      {LABELS[variant]}
    </button>
  );
}
