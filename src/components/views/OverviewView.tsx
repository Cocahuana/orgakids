import type { Entry, EntryType } from "../../types";
import { nextOccurrence } from "../../utils";
import { StatsGrid } from "../organisms/StatsGrid";
import { WeekRow } from "../organisms/WeekRow";
import { AlertsList } from "../organisms/AlertsList";
import { EntryList } from "../organisms/EntryList";
import styles from "./SectionTitle.module.css";

interface OverviewViewProps {
	entries: Entry[];
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
	onKpiClick: (type: EntryType) => void;
}

export function OverviewView({
	entries,
	onEdit,
	onDelete,
	onKpiClick,
}: OverviewViewProps) {
	const upcoming = [...entries]
		.sort((a, b) => {
			const da = nextOccurrence(a) || "9999-12-31";
			const db = nextOccurrence(b) || "9999-12-31";
			return da.localeCompare(db);
		})
		.filter((e) => {
			const next = nextOccurrence(e);
			if (!next) return false;
			const d = new Date(`${next}T00:00:00`);
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			return Math.round((d.getTime() - today.getTime()) / 86_400_000) > 3;
		})
		.slice(0, 6);

	return (
		<div>
			<StatsGrid entries={entries} onKpiClick={onKpiClick} />

			<div className={styles.title}>
				<span
					className={styles.dot}
					style={{ background: "#FF5C5C" }}
				/>
				Próximos 7 días
			</div>
			<WeekRow entries={entries} />

			<div className={styles.title}>
				<span
					className={styles.dot}
					style={{ background: "#FF9A00" }}
				/>
				Alertas urgentes
			</div>
			<AlertsList entries={entries} />

			<div className={styles.title} style={{ marginTop: 8 }}>
				<span
					className={styles.dot}
					style={{ background: "#7C9FFF" }}
				/>
				Todo en orden
			</div>
			<EntryList entries={upcoming} onEdit={onEdit} onDelete={onDelete} />
		</div>
	);
}
