import type { Entry } from "../../types";
import { TYPE_INFO } from "../../constants";
import {
	nextOccurrence,
	recurrenceText,
	formatDate,
	formatTimeRange,
	urgencyBadge,
	daysUntil,
} from "../../utils";
import { Tag } from "../atoms/Tag";
import { UrgencyBadge } from "../atoms/UrgencyBadge";
import { IconButton } from "../atoms/IconButton";
import styles from "./EntryCard.module.css";

interface EntryCardProps {
	entry: Entry;
	displayDate?: string; // for calendar day view with recurring sports
	onEdit: (id: number) => void;
	onDelete: (id: number) => void;
}

export function EntryCard({
	entry,
	displayDate,
	onEdit,
	onDelete,
}: EntryCardProps) {
	const ti = TYPE_INFO[entry.type];
	const effectiveDate = displayDate ?? nextOccurrence(entry);
	const days = effectiveDate ? daysUntil(effectiveDate) : null;
	const ub = days !== null ? urgencyBadge(days) : null;

	const meta: string[] = [];
	const dateToShow = displayDate ?? (entry.repeatEnabled ? "" : entry.date);
	if (dateToShow) meta.push(`📅 ${formatDate(dateToShow)}`);
	const timeRange = formatTimeRange(entry);
	if (timeRange) meta.push(`🕐 ${timeRange}`);
	const recur = recurrenceText(entry);
	if (recur) meta.push(`🔁 ${recur}`);
	if (entry.grade) meta.push(`📊 Nota: ${entry.grade}`);

	return (
		<div className={`${styles.card} ${styles[`card--${ti.cls}`]}`}>
			{ub && <UrgencyBadge cls={ub.cls} label={ub.label} />}

			<div className={styles.icon}>{ti.icon}</div>

			<div className={styles.body}>
				<div className={styles.title}>{entry.title}</div>
				<div className={styles.meta}>
					{entry.kid && <span>👤 {entry.kid}</span>}
					{meta.map((m, i) => (
						<span key={i}>{m}</span>
					))}
				</div>
				<Tag type={entry.type} label={ti.tag} />
				{entry.notes && (
					<div className={styles.notes}>{entry.notes}</div>
				)}
			</div>

			<div className={styles.actions}>
				<IconButton variant='edit' onClick={() => onEdit(entry.id)} />
				<IconButton
					variant='delete'
					onClick={() => onDelete(entry.id)}
				/>
			</div>
		</div>
	);
}
