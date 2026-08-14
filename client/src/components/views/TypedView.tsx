import type { Entry, EntryType } from "../../types";
import { TYPE_INFO } from "../../constants";
import { EntryList } from "../organisms/EntryList";
import styles from "./SectionTitle.module.css";
import headerStyles from "./TypedView.module.css";

interface TypedViewProps {
	type: EntryType;
	entries: Entry[];
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
	onAdd: (type: EntryType) => void;
}

export function TypedView({
	type,
	entries,
	onEdit,
	onDelete,
	onAdd,
}: TypedViewProps) {
	const ti = TYPE_INFO[type];
	return (
		<div>
			<div className={`${styles.title} ${headerStyles.header}`}>
				<span
					style={{
						display: "flex",
						alignItems: "center",
						gap: "8px",
					}}
				>
					<span
						className={styles.dot}
						style={{ background: `var(--${type})` }}
					/>
					{ti.icon} {ti.plural}
				</span>
				<button
					type='button'
					className={headerStyles.addBtn}
					onClick={() => onAdd(type)}
				>
					＋ Agregar
				</button>
			</div>
			<EntryList
				entries={entries.filter((e) => e.type === type)}
				onEdit={onEdit}
				onDelete={onDelete}
			/>
		</div>
	);
}
