import type { Entry } from "../../types";
import { localDateISO, occursOnDate } from "../../utils";
import styles from "./WeekRow.module.css";

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const TYPE_COLORS: Record<string, string> = {
	exam: "var(--exam)",
	sport: "var(--sport)",
	event: "var(--event)",
	recover: "var(--recover)",
	work: "var(--work)",
};

interface WeekRowProps {
	entries: Entry[];
}

export function WeekRow({ entries }: WeekRowProps) {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const days = Array.from({ length: 7 }, (_, i) => {
		const d = new Date(today);
		d.setDate(today.getDate() + i);
		return d;
	});

	return (
		<div className={styles.row}>
			{days.map((d, i) => {
				const iso = localDateISO(d);
				const dayEntries = entries.filter((e) => occursOnDate(e, iso));
				const types = [...new Set(dayEntries.map((e) => e.type))];

				return (
					<div
						key={iso}
						className={`${styles.cell} ${i === 0 ? styles.today : ""}`}
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
					</div>
				);
			})}
		</div>
	);
}
