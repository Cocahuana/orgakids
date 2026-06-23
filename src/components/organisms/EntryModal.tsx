import { useEffect, useState } from "react";
import type { Entry, EntryType } from "../../types";
import { TITLE_LABELS } from "../../constants";
import styles from "./EntryModal.module.css";

interface EntryModalProps {
	open: boolean;
	editEntry: Entry | null;
	presetDate?: string;
	onSave: (entry: Omit<Entry, "id">) => void;
	onUpdate: (entry: Entry) => void;
	onClose: () => void;
}

const DAY_LABELS = [
	{ value: 1, short: "Lun" },
	{ value: 2, short: "Mar" },
	{ value: 3, short: "Mié" },
	{ value: 4, short: "Jue" },
	{ value: 5, short: "Vie" },
	{ value: 6, short: "Sáb" },
	{ value: 0, short: "Dom" },
];

const EMPTY_FORM = {
	type: "exam" as EntryType,
	kid: "",
	title: "",
	date: "",
	timeFrom: "",
	timeTo: "",
	grade: "",
	notes: "",
	repeatEnabled: false,
	repeatFrom: "",
	repeatTo: "",
	repeatDays: [] as number[],
};

export function EntryModal({
	open,
	editEntry,
	presetDate,
	onSave,
	onUpdate,
	onClose,
}: EntryModalProps) {
	const [form, setForm] = useState({ ...EMPTY_FORM });

	useEffect(() => {
		if (!open) return;
		if (editEntry) {
			setForm({
				type: editEntry.type,
				kid: editEntry.kid,
				title: editEntry.title,
				date: editEntry.date,
				timeFrom: editEntry.timeFrom,
				timeTo: editEntry.timeTo,
				grade: editEntry.grade,
				notes: editEntry.notes,
				repeatEnabled: editEntry.repeatEnabled,
				repeatFrom: editEntry.repeatFrom,
				repeatTo: editEntry.repeatTo,
				repeatDays: [...editEntry.repeatDays],
			});
		} else {
			setForm({ ...EMPTY_FORM, date: presetDate ?? "" });
		}
	}, [open, editEntry, presetDate]);

	if (!open) return null;

	function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
		setForm((prev) => ({ ...prev, [key]: value }));
	}

	function toggleDay(day: number) {
		setForm((prev) => ({
			...prev,
			repeatDays: prev.repeatDays.includes(day)
				? prev.repeatDays.filter((d) => d !== day)
				: [...prev.repeatDays, day],
		}));
	}

	function handleSave() {
		if (!form.title.trim()) {
			alert("Por favor ingresá una descripción.");
			return;
		}
		if (form.type === "sport" && form.repeatEnabled) {
			if (!form.repeatFrom || !form.repeatTo) {
				alert("Ingresá las fechas de inicio y fin de la repetición.");
				return;
			}
			if (!form.repeatDays.length) {
				alert("Seleccioná al menos un día de la semana.");
				return;
			}
		} else if (!form.date) {
			alert("Por favor ingresá una fecha.");
			return;
		}
		if (editEntry) {
			onUpdate({ ...form, id: editEntry.id });
		} else {
			onSave(form);
		}
		onClose();
	}

	function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
		if (e.target === e.currentTarget) onClose();
	}

	const isEdit = editEntry !== null;
	const isSport = form.type === "sport";

	return (
		<div className={styles.overlay} onClick={handleBackdrop}>
			<div className={styles.modal} role='dialog' aria-modal='true'>
				<div className={styles.title}>
					{isEdit ? "✏️ Editar entrada" : "➕ Nueva entrada"}
				</div>

				{/* Type */}
				<div className={styles.group}>
					<label htmlFor='fType'>Tipo</label>
					<select
						id='fType'
						value={form.type}
						onChange={(e) => {
							const t = e.target.value as EntryType;
							set("type", t);
							if (t !== "sport") set("repeatEnabled", false);
						}}
					>
						<option value='exam'>📝 Examen</option>
						<option value='sport'>⚽ Deporte</option>
						<option value='event'>🎉 Evento fin de semana</option>
						<option value='recover'>⚠️ Nota a recuperar</option>
						<option value='work'>📋 Entrega de trabajo</option>
					</select>
				</div>

				{/* Kid */}
				<div className={styles.group}>
					<label htmlFor='fKid'>Alumno / Hijo</label>
					<input
						id='fKid'
						type='text'
						placeholder='Ej: Martín, Lucía...'
						value={form.kid}
						onChange={(e) => set("kid", e.target.value)}
					/>
				</div>

				{/* Title */}
				<div className={styles.group}>
					<label htmlFor='fTitle'>{TITLE_LABELS[form.type]}</label>
					<input
						id='fTitle'
						type='text'
						placeholder='Ej: Matemáticas, Fútbol Club Belgrano...'
						value={form.title}
						onChange={(e) => set("title", e.target.value)}
					/>
				</div>

				{/* Sport: repeat mode toggle */}
				{isSport && (
					<div className={styles.group}>
						<label>Modalidad</label>
						<div className={styles.toggle}>
							<button
								type='button'
								className={`${styles.toggleBtn} ${!form.repeatEnabled ? styles.toggleActive : ""}`}
								onClick={() => set("repeatEnabled", false)}
							>
								Fecha única
							</button>
							<button
								type='button'
								className={`${styles.toggleBtn} ${form.repeatEnabled ? styles.toggleActive : ""}`}
								onClick={() => set("repeatEnabled", true)}
							>
								Repetición semanal
							</button>
						</div>
					</div>
				)}

				{/* Non-repeat: single date + time */}
				{!form.repeatEnabled && (
					<>
						<div className={styles.row}>
							<div
								className={styles.group}
								style={{ marginBottom: 0 }}
							>
								<label htmlFor='fDate'>Fecha</label>
								<input
									id='fDate'
									type='date'
									value={form.date}
									onChange={(e) =>
										set("date", e.target.value)
									}
								/>
							</div>
							<div
								className={styles.group}
								style={{ marginBottom: 0 }}
							>
								<label htmlFor='fTimeFrom'>Hora desde</label>
								<input
									id='fTimeFrom'
									type='time'
									value={form.timeFrom}
									onChange={(e) =>
										set("timeFrom", e.target.value)
									}
								/>
							</div>
						</div>
						<div className={styles.group} style={{ marginTop: 10 }}>
							<label htmlFor='fTimeTo'>
								Hora hasta (opcional)
							</label>
							<input
								id='fTimeTo'
								type='time'
								value={form.timeTo}
								onChange={(e) => set("timeTo", e.target.value)}
							/>
						</div>
					</>
				)}

				{/* Repeat mode: date range + weekdays + time */}
				{form.repeatEnabled && (
					<>
						<div className={styles.row}>
							<div
								className={styles.group}
								style={{ marginBottom: 0 }}
							>
								<label htmlFor='fRepeatFrom'>Desde</label>
								<input
									id='fRepeatFrom'
									type='date'
									value={form.repeatFrom}
									onChange={(e) =>
										set("repeatFrom", e.target.value)
									}
								/>
							</div>
							<div
								className={styles.group}
								style={{ marginBottom: 0 }}
							>
								<label htmlFor='fRepeatTo'>Hasta</label>
								<input
									id='fRepeatTo'
									type='date'
									value={form.repeatTo}
									onChange={(e) =>
										set("repeatTo", e.target.value)
									}
								/>
							</div>
						</div>

						<div className={styles.group} style={{ marginTop: 14 }}>
							<label>Días de la semana</label>
							<div className={styles.days}>
								{DAY_LABELS.map(({ value, short }) => (
									<button
										key={value}
										type='button'
										className={`${styles.dayBtn} ${form.repeatDays.includes(value) ? styles.dayActive : ""}`}
										onClick={() => toggleDay(value)}
									>
										{short}
									</button>
								))}
							</div>
						</div>

						<div className={styles.row} style={{ marginTop: 4 }}>
							<div
								className={styles.group}
								style={{ marginBottom: 0 }}
							>
								<label htmlFor='fTimeFrom2'>Hora desde</label>
								<input
									id='fTimeFrom2'
									type='time'
									value={form.timeFrom}
									onChange={(e) =>
										set("timeFrom", e.target.value)
									}
								/>
							</div>
							<div
								className={styles.group}
								style={{ marginBottom: 0 }}
							>
								<label htmlFor='fTimeTo2'>Hora hasta</label>
								<input
									id='fTimeTo2'
									type='time'
									value={form.timeTo}
									onChange={(e) =>
										set("timeTo", e.target.value)
									}
								/>
							</div>
						</div>
					</>
				)}

				{/* Grade (exam / recover) */}
				{(form.type === "recover" || form.type === "exam") && (
					<div className={styles.group} style={{ marginTop: 14 }}>
						<label htmlFor='fGrade'>Nota actual</label>
						<input
							id='fGrade'
							type='text'
							placeholder='Ej: 4, Desaprobado, 55%...'
							value={form.grade}
							onChange={(e) => set("grade", e.target.value)}
						/>
					</div>
				)}

				{/* Notes */}
				<div className={styles.group} style={{ marginTop: 14 }}>
					<label htmlFor='fNotes'>Notas adicionales</label>
					<textarea
						id='fNotes'
						placeholder='Tema a estudiar, observaciones, lugar...'
						value={form.notes}
						onChange={(e) => set("notes", e.target.value)}
					/>
				</div>

				<div className={styles.btns}>
					<button
						type='button'
						className={styles.cancel}
						onClick={onClose}
					>
						Cancelar
					</button>
					<button
						type='button'
						className={styles.primary}
						onClick={handleSave}
					>
						Guardar
					</button>
				</div>
			</div>
		</div>
	);
}
