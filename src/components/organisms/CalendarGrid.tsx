import { useState } from "react";
import type { Entry } from "../../types";
import { CALENDAR_TYPE_ORDER, TYPE_INFO } from "../../constants";
import { localDateISO, formatLongDate, occursOnDate } from "../../utils";
import { EntryList } from "./EntryList";
import styles from "./CalendarGrid.module.css";

interface CalendarGridProps {
	entries: Entry[];
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
	onAddForDate: (dateStr: string) => void;
}

function calendarMonthLabel(date: Date): string {
	return date.toLocaleDateString("es-AR", { month: "long", year: "numeric" });
}

export function CalendarGrid({
	entries,
	onEdit,
	onDelete,
	onAddForDate,
}: CalendarGridProps) {
	const todayISO = localDateISO(new Date());

	const [cursor, setCursor] = useState(() => {
		const d = new Date();
		d.setDate(1);
		d.setHours(0, 0, 0, 0);
		return d;
	});

	const [selectedDate, setSelectedDate] = useState(todayISO);

	function changeMonth(offset: number) {
		const next = new Date(
			cursor.getFullYear(),
			cursor.getMonth() + offset,
			1,
		);
		setCursor(next);
		setSelectedDate(localDateISO(next));
	}

	function goToday() {
		const today = new Date();
		setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
		setSelectedDate(localDateISO(today));
	}

	function selectDate(iso: string) {
		const selected = new Date(`${iso}T00:00:00`);
		if (
			selected.getMonth() !== cursor.getMonth() ||
			selected.getFullYear() !== cursor.getFullYear()
		) {
			setCursor(new Date(selected.getFullYear(), selected.getMonth(), 1));
		}
		setSelectedDate(iso);
	}

	// Build 6-week grid starting on Monday
	const firstOfMonth = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
	const mondayOffset = (firstOfMonth.getDay() + 6) % 7;
	const gridStart = new Date(firstOfMonth);
	gridStart.setDate(firstOfMonth.getDate() - mondayOffset);

	const cells = Array.from({ length: 42 }, (_, i) => {
		const day = new Date(gridStart);
		day.setDate(gridStart.getDate() + i);
		return day;
	});

	const dayEntries = entries.filter((e) => occursOnDate(e, selectedDate));

	return (
		<>
			<div className={styles.shell}>
				{/* Toolbar */}
				<div className={styles.toolbar}>
					<button
						type='button'
						className={styles.navBtn}
						onClick={() => changeMonth(-1)}
						aria-label='Mes anterior'
					>
						‹
					</button>
					<div className={styles.monthTitle}>
						{calendarMonthLabel(cursor)}
					</div>
					<button
						type='button'
						className={styles.navBtn}
						onClick={() => changeMonth(1)}
						aria-label='Mes siguiente'
					>
						›
					</button>
				</div>

				<button
					type='button'
					className={styles.todayBtn}
					onClick={goToday}
				>
					Ir a hoy
				</button>

				{/* Weekday headers */}
				<div className={styles.weekdays} aria-hidden='true'>
					{["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(
						(d) => (
							<div key={d} className={styles.weekday}>
								{d}
							</div>
						),
					)}
				</div>

				{/* Day grid */}
				<div className={styles.grid}>
					{cells.map((day) => {
						const iso = localDateISO(day);
						const cellEntries = entries.filter((e) =>
							occursOnDate(e, iso),
						);
						const presentTypes = CALENDAR_TYPE_ORDER.filter((t) =>
							cellEntries.some((e) => e.type === t),
						);
						const isOutside = day.getMonth() !== cursor.getMonth();
						const isToday = iso === todayISO;
						const isSelected = iso === selectedDate;

						const cls = [
							styles.day,
							isOutside ? styles.outside : "",
							isToday ? styles.isToday : "",
							isSelected ? styles.selected : "",
						]
							.filter(Boolean)
							.join(" ");

						return (
							<button
								key={iso}
								type='button'
								className={cls}
								onClick={() => selectDate(iso)}
								aria-label={`${formatLongDate(iso)}, ${cellEntries.length} actividades`}
							>
								<span className={styles.dayNumber}>
									{day.getDate()}
								</span>
								<span className={styles.dots}>
									{presentTypes.map((t) => (
										<span
											key={t}
											className={styles.dot}
											style={{
												background: `var(--${t})`,
											}}
											title={TYPE_INFO[t].label}
										/>
									))}
								</span>
								{cellEntries.length > 0 && (
									<span className={styles.count}>
										{cellEntries.length}{" "}
										{cellEntries.length === 1
											? "actividad"
											: "actividades"}
									</span>
								)}
							</button>
						);
					})}
				</div>
			</div>

			{/* Legend */}
			<div className={styles.sectionTitle}>
				<span
					className={styles.dot2}
					style={{ background: "#7C9FFF" }}
				/>
				Referencias de colores
			</div>
			<div className={styles.legend}>
				{CALENDAR_TYPE_ORDER.map((type) => (
					<div key={type} className={styles.legendItem}>
						<span
							className={styles.legendDot}
							style={{ background: `var(--${type})` }}
						/>
						<span>
							{TYPE_INFO[type].icon} {TYPE_INFO[type].label}
						</span>
					</div>
				))}
			</div>

			{/* Day detail */}
			<div className={styles.detailHeader}>
				<div
					className={styles.sectionTitle}
					style={{ marginBottom: 0 }}
				>
					<span
						className={styles.dot2}
						style={{ background: "#7C9FFF" }}
					/>
					{formatLongDate(selectedDate)}
				</div>
				<button
					type='button'
					className={styles.addDayBtn}
					onClick={() => onAddForDate(selectedDate)}
				>
					＋ Agregar en este día
				</button>
			</div>

			<EntryList
				entries={dayEntries}
				forDate={selectedDate}
				onEdit={onEdit}
				onDelete={onDelete}
			/>
		</>
	);
}
