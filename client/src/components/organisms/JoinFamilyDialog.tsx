import { useState, type FormEvent } from "react";
import styles from "./JoinFamilyDialog.module.css";

interface JoinFamilyDialogProps {
	open: boolean;
	onJoin: (inviteCode: string) => Promise<void>;
	onClose: () => void;
}

export function JoinFamilyDialog({
	open,
	onJoin,
	onClose,
}: JoinFamilyDialogProps) {
	const [inviteCode, setInviteCode] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	if (!open) return null;

	function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
		if (e.target === e.currentTarget) onClose();
	}

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!inviteCode.trim()) {
			setError("Ingresá un código de invitación.");
			return;
		}
		setIsSubmitting(true);
		setError("");
		try {
			await onJoin(inviteCode.trim());
			setInviteCode("");
			onClose();
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "No se pudo unir a la familia.",
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className={styles.overlay} onClick={handleBackdrop}>
			<form
				className={styles.modal}
				role='dialog'
				aria-modal='true'
				onSubmit={handleSubmit}
			>
				<div className={styles.title}>👨‍👩‍👧‍👦 Unirse a una familia</div>
				<label className={styles.label} htmlFor='joinInviteCode'>
					Código de invitación
				</label>
				<input
					id='joinInviteCode'
					className={styles.input}
					type='text'
					maxLength={12}
					placeholder='Ej: K7M2QP4X'
					style={{ textTransform: "uppercase" }}
					value={inviteCode}
					onChange={(e) => setInviteCode(e.target.value)}
					autoFocus
				/>
				{error && <p className={styles.error}>{error}</p>}
				<div className={styles.btns}>
					<button
						type='button'
						className={styles.cancel}
						onClick={onClose}
					>
						Cancelar
					</button>
					<button
						type='submit'
						className={styles.confirm}
						disabled={isSubmitting}
					>
						{isSubmitting ? "Uniendo..." : "Unirme"}
					</button>
				</div>
			</form>
		</div>
	);
}
