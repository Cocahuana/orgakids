import type { Entry, EntryType, TabId } from "../../types";
import { TYPE_INFO } from "../../constants";
import { StatCard } from "../atoms/StatCard";
import styles from "./StatsGrid.module.css";

const ENTRY_STAT_DEFS: EntryType[] = [
	"exam",
	"sport",
	"event",
	"recover",
	"work",
	"medical",
];

interface StatsGridProps {
	entries: Entry[];
	shoppingCount: number;
	notasCount: number;
	onKpiClick?: (type: EntryType) => void;
	onNavigate?: (tab: TabId) => void;
}

export function StatsGrid({
	entries,
	shoppingCount,
	notasCount,
	onKpiClick,
	onNavigate,
}: StatsGridProps) {
	return (
		<div className={styles.grid}>
			{ENTRY_STAT_DEFS.map((key) => {
				const ti = TYPE_INFO[key];
				const count = entries.filter((e) => e.type === key).length;
				return (
					<StatCard
						key={key}
						count={count}
						icon={ti.icon}
						label={ti.plural}
						color={ti.color}
						onClick={onKpiClick ? () => onKpiClick(key) : undefined}
					/>
				);
			})}
			<StatCard
				count={shoppingCount}
				icon='🛒'
				label='Supermercado'
				color='var(--shop)'
				onClick={
					onNavigate ? () => onNavigate("supermarket") : undefined
				}
			/>
			<StatCard
				count={notasCount}
				icon='📓'
				label='Notas'
				color='#9b7fd4'
				onClick={onNavigate ? () => onNavigate("notas") : undefined}
			/>
		</div>
	);
}
