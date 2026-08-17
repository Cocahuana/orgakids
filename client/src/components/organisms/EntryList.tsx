import type { Entry } from "../../types";
import { EntryCard } from "../molecules/EntryCard";
import { EmptyState } from "../molecules/EmptyState";
import { nextOccurrence } from "../../utils";
import styles from "./EntryList.module.css";

interface EntryListProps {
	entries: Entry[];
	forDate?: string; // if set, passed to EntryCard as displayDate
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
}

export function EntryList({
	entries,
	forDate,
	onEdit,
	onDelete,
}: EntryListProps) {
	if (!entries.length) return <EmptyState />;

	const sorted = [...entries].sort((a, b) => {
		const da = forDate ?? nextOccurrence(a) ?? "9999-12-31";
		const db = forDate ?? nextOccurrence(b) ?? "9999-12-31";
		return da.localeCompare(db);
	});

	return (
		<div className={styles.list}>
			{sorted.map((e) => (
				<EntryCard
					key={e.id}
					entry={e}
					displayDate={forDate}
					onEdit={onEdit}
					onDelete={onDelete}
				/>
			))}
		</div>
	);
}
