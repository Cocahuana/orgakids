import styles from "./Toast.module.css";

interface ToastProps {
	message: string;
	visible: boolean;
}

export function Toast({ message, visible }: ToastProps) {
	if (!visible) return null;
	return (
		<div className={styles.toast} role='status' aria-live='polite'>
			{message}
		</div>
	);
}
