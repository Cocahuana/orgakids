import styles from "./ConfirmDialog.module.css";

interface ConfirmDialogProps {
	open: boolean;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
}

export function ConfirmDialog({
	open,
	message,
	onConfirm,
	onCancel,
}: ConfirmDialogProps) {
	if (!open) return null;

	function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
		if (e.target === e.currentTarget) onCancel();
	}

	return (
		<div className={styles.overlay} onClick={handleBackdrop}>
			<div className={styles.modal} role='dialog' aria-modal='true'>
				<div className={styles.message}>{message}</div>
				<div className={styles.btns}>
					<button
						type='button'
						className={styles.cancel}
						onClick={onCancel}
					>
						Cancelar
					</button>
					<button
						type='button'
						className={styles.confirm}
						onClick={onConfirm}
					>
						Borrar
					</button>
				</div>
			</div>
		</div>
	);
}
