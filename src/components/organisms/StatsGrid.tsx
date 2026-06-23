import type { Entry, EntryType } from "../../types";
import { TYPE_INFO } from "../../constants";
import { StatCard } from "../atoms/StatCard";
import styles from "./StatsGrid.module.css";

const STAT_DEFS = [
	{ key: "exam" as const },
	{ key: "sport" as const },
	{ key: "event" as const },
	{ key: "recover" as const },
	{ key: "work" as const },
];

interface StatsGridProps {
	entries: Entry[];
	onKpiClick?: (type: EntryType) => void;
}

export function StatsGrid({ entries, onKpiClick }: StatsGridProps) {
	const counts = Object.fromEntries(
		STAT_DEFS.map((d) => [
			d.key,
			entries.filter((e) => e.type === d.key).length,
		]),
	);

	return (
		<div className={styles.grid}>
			{STAT_DEFS.map(({ key }) => {
				const ti = TYPE_INFO[key];
				return (
					<StatCard
						key={key}
						count={counts[key]}
						icon={ti.icon}
						label={ti.plural}
						color={ti.color}
						onClick={onKpiClick ? () => onKpiClick(key) : undefined}
					/>
				);
			})}
		</div>
	);
}
