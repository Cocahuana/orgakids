import { useEffect, useState } from "react";
import type { Nota } from "../../types";
import styles from "./NotasView.module.css";
import parentStyles from "./SectionTitle.module.css";

interface NotasViewProps {
	notas: Nota[];
	onAdd: () => void;
	onSave: (id: string, title: string, body: string) => void;
	onDelete: (id: string) => void;
}

export function NotasView({ notas, onAdd, onSave, onDelete }: NotasViewProps) {
	return (
		<div>
			<div className={parentStyles.title}>
				<span
					className={parentStyles.dot}
					style={{ background: "#9b7fd4" }}
				/>
				Notas libres
			</div>
			<div className={styles.toolbar}>
				<button type='button' className={styles.newBtn} onClick={onAdd}>
					＋ Nueva nota
				</button>
				<span className={styles.count}>
					{notas.length} nota{notas.length === 1 ? "" : "s"}
				</span>
			</div>
			{!notas.length ? (
				<div className={styles.empty}>
					<div className={styles.emptyIcon}>📓</div>
					No hay notas todavía. ¡Creá la primera!
				</div>
			) : (
				<div className={styles.grid}>
					{notas.map((nota) => (
						<NotaCard
							key={nota.id}
							nota={nota}
							onSave={onSave}
							onDelete={onDelete}
						/>
					))}
				</div>
			)}
		</div>
	);
}

function NotaCard({
	nota,
	onSave,
	onDelete,
}: {
	nota: Nota;
	onSave: (id: string, title: string, body: string) => void;
	onDelete: (id: string) => void;
}) {
	const [title, setTitle] = useState(nota.title);
	const [body, setBody] = useState(nota.body);
	const [dirty, setDirty] = useState(false);

	// Pick up remote edits (e.g. socket updates from another device) as long as
	// this card has no unsaved local changes, so they aren't silently dropped.
	useEffect(() => {
		if (dirty) return;
		setTitle(nota.title);
		setBody(nota.body);
	}, [nota.title, nota.body, dirty]);

	function handleSave() {
		onSave(nota.id, title, body);
		setDirty(false);
	}

	return (
		<div className={styles.card}>
			<input
				className={styles.titleInput}
				type='text'
				maxLength={80}
				placeholder='Título (opcional)'
				value={title}
				onChange={(e) => {
					setTitle(e.target.value);
					setDirty(true);
				}}
			/>
			<textarea
				className={styles.bodyInput}
				placeholder='Escribí lo que quieras: lista, recordatorio...'
				value={body}
				onChange={(e) => {
					setBody(e.target.value);
					setDirty(true);
				}}
			/>
			<div className={styles.footer}>
				<span className={styles.date}>📅 {nota.created}</span>
				<div className={styles.footerActions}>
					<button
						type='button'
						className={`${styles.saveBtn} ${dirty ? styles.saveBtnDirty : ""}`}
						onClick={handleSave}
					>
						{dirty ? "💾 Guardar" : "✓ Guardado"}
					</button>
					<button
						type='button'
						className={styles.deleteBtn}
						onClick={() => onDelete(nota.id)}
					>
						🗑️ Borrar
					</button>
				</div>
			</div>
		</div>
	);
}
