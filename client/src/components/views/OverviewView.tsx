import type { Entry, EntryType, TabId } from "../../types";
import { isExpired } from "../../utils";
import { StatsGrid } from "../organisms/StatsGrid";
import { WeekRow } from "../organisms/WeekRow";
import { EntryList } from "../organisms/EntryList";
import styles from "./SectionTitle.module.css";

interface OverviewViewProps {
	entries: Entry[];
	shoppingCount: number;
	notasCount: number;
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
	onKpiClick: (type: EntryType) => void;
	onNavigate: (tab: TabId) => void;
}

export function OverviewView({
	entries,
	shoppingCount,
	notasCount,
	onEdit,
	onDelete,
	onKpiClick,
	onNavigate,
}: OverviewViewProps) {
	const expired = [...entries.filter(isExpired)].sort((a, b) =>
		(b.date || "").localeCompare(a.date || ""),
	);

	return (
		<div>
			<StatsGrid
				entries={entries}
				shoppingCount={shoppingCount}
				notasCount={notasCount}
				onKpiClick={onKpiClick}
				onNavigate={onNavigate}
			/>

			<WeekRow entries={entries} onEdit={onEdit} onDelete={onDelete} />

			<div className={styles.title} style={{ marginTop: 24 }}>
				<span
					className={styles.dot}
					style={{ background: "#e63939" }}
				/>
				⚠️ Vencidos
			</div>
			<EntryList entries={expired} onEdit={onEdit} onDelete={onDelete} />
		</div>
	);
}
