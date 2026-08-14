import type { Entry } from "../../types";
import { TYPE_INFO } from "../../constants";
import { daysUntil, nextOccurrence } from "../../utils";
import { AlertRow } from "../molecules/AlertRow";
import styles from "./AlertsList.module.css";

interface AlertsListProps {
	entries: Entry[];
}

export function AlertsList({ entries }: AlertsListProps) {
	const urgent = entries
		.filter((e) => {
			const next = nextOccurrence(e);
			return next !== "" && daysUntil(next) <= 3;
		})
		.sort((a, b) => {
			const da = daysUntil(nextOccurrence(a));
			const db = daysUntil(nextOccurrence(b));
			return da - db;
		});

	if (!urgent.length) {
		return (
			<div className={styles.ok}>
				<span>✅</span> Sin urgencias en los próximos 3 días
			</div>
		);
	}

	return (
		<div>
			{urgent.map((e) => {
				const next = nextOccurrence(e);
				const days = daysUntil(next);
				const label =
					days < 0
						? "Vencido"
						: days === 0
							? "¡HOY!"
							: `En ${days} día${days === 1 ? "" : "s"}`;

				return (
					<AlertRow
						key={e.id}
						icon={TYPE_INFO[e.type]?.icon ?? "📌"}
						kid={e.kid}
						title={e.title}
						label={label}
					/>
				);
			})}
		</div>
	);
}
