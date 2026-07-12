import { useState, useEffect } from "react";
import type { Entry } from "../../types";
import { localDateISO, occursOnDate } from "../../utils";
import { EntryList } from "./EntryList";
import styles from "./WeekRow.module.css";

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const TYPE_COLORS: Record<string, string> = {
	exam: "var(--exam)",
	sport: "var(--sport)",
	event: "var(--event)",
	recover: "var(--recover)",
	work: "var(--work)",
	medical: "var(--medical)",
};

function getWeekStart(): Date {
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const day = today.getDay(); // 0=Sun
	const isSunAfternoon = day === 0 && now.getHours() >= 17;
	const monday = new Date(today);
	if (day === 0) {
		monday.setDate(today.getDate() + (isSunAfternoon ? 1 : -6));
	} else {
		monday.setDate(today.getDate() - (day - 1));
	}
	return monday;
}

function getWeekTitle(): string {
	const now = new Date();
	if (now.getDay() === 0 && now.getHours() >= 17) return "Resumen próxima Semana";
	return "Resumen de la Semana";
}

interface WeekRowProps {
	entries: Entry[];
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
}

export function WeekRow({ entries, onEdit, onDelete }: WeekRowProps) {
	const todayStr = localDateISO(new Date());
	const [selected, setSelected] = useState(todayStr);
	const [weekStart, setWeekStart] = useState(getWeekStart);
	const [title, setTitle] = useState(getWeekTitle);

	useEffect(() => {
		const id = setInterval(() => {
			setWeekStart(getWeekStart());
			setTitle(getWeekTitle());
		}, 60_000);
		return () => clearInterval(id);
	}, []);

	const days = Array.from({ length: 7 }, (_, i) => {
		const d = new Date(weekStart);
		d.setDate(weekStart.getDate() + i);
		return d;
	});

	const selectedEntries = entries.filter((e) => occursOnDate(e, selected));
	const selectedDateObj = new Date(`${selected}T00:00:00`);
	const selectedLabel = selectedDateObj.toLocaleDateString("es-AR", {
		weekday: "long",
		day: "numeric",
		month: "long",
	});

	return (
		<>
			<div className={styles.sectionTitle}>
				<span className={styles.sectionDot} />
				{title}
			</div>
			<div className={styles.row}>
				{days.map((d) => {
					const iso = localDateISO(d);
					const dayEntries = entries.filter((e) =>
						occursOnDate(e, iso),
					);
					const types = [...new Set(dayEntries.map((e) => e.type))];
					const isToday = iso === todayStr;
					const isSel = iso === selected;

					return (
						<button
							key={iso}
							type='button'
							className={[
								styles.cell,
								isToday && !isSel ? styles.today : "",
								isSel ? styles.selected : "",
							]
								.filter(Boolean)
								.join(" ")}
							onClick={() => setSelected(iso)}
						>
							<div className={styles.name}>
								{DAY_NAMES[d.getDay()]}
							</div>
							<div className={styles.num}>{d.getDate()}</div>
							<div className={styles.dots}>
								{types.map((t) => (
									<span
										key={t}
										className={styles.dot}
										style={{ background: TYPE_COLORS[t] }}
									/>
								))}
							</div>
						</button>
					);
				})}
			</div>
			<div className={styles.dayLabel}>{selectedLabel}</div>
			<EntryList
				entries={selectedEntries}
				forDate={selected}
				onEdit={onEdit}
				onDelete={onDelete}
			/>
		</>
	);
}

