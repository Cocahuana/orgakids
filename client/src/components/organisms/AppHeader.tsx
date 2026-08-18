import type { ScopeOption, TabId } from "../../types";
import styles from "./AppHeader.module.css";

const TABS: { id: TabId; label: string }[] = [
	{ id: "overview", label: "🏠 Resumen" },
	{ id: "calendar", label: "🗓️ Calendario" },
	{ id: "supermarket", label: "🛒 Supermercado" },
	{ id: "exams", label: "📝 Exámenes" },
	{ id: "sports", label: "⚽ Deportes" },
	{ id: "events", label: "🎉 Eventos" },
	{ id: "medical", label: "🚑 Turnos" },
	{ id: "recover", label: "⚠️ Recuperar" },
	{ id: "works", label: "📋 Trabajos" },
	{ id: "notas", label: "📓 Notas" },
];

interface AppHeaderProps {
	activeTab: TabId;
	onTabChange: (tab: TabId) => void;
	onAdd: () => void;
	onLogout: () => void;
	inviteCode?: string;
	scopes?: ScopeOption[];
	selectedScopeId?: string;
	onScopeChange?: (scopeId: string) => void;
}

export function AppHeader({
	activeTab,
	onTabChange,
	onAdd,
	onLogout,
	inviteCode,
	scopes = [],
	selectedScopeId,
	onScopeChange,
}: AppHeaderProps) {
	return (
		<header className={styles.header}>
			<div className={styles.top}>
				<div className={styles.logo}>
					🏠 Org<span>Famy</span>
				</div>
				<div className={styles.actions}>
					{scopes.length > 0 && (
						<label className={styles.scopeSelectWrap}>
							<span className={styles.scopeLabel}>Vista</span>
							<select
								className={styles.scopeSelect}
								value={
									selectedScopeId ??
									scopes[0]?.id ??
									"personal"
								}
								onChange={(event) =>
									onScopeChange?.(event.target.value)
								}
							>
								{scopes.map((scope) => (
									<option key={scope.id} value={scope.id}>
										{scope.kind === "personal"
											? "👤 "
											: "👨‍👩‍👧‍👦 "}
										{scope.name}
									</option>
								))}
							</select>
						</label>
					)}
					{inviteCode && (
						<button
							type='button'
							className={styles.inviteChip}
							title='Código para invitar a tu familia (click para copiar)'
							onClick={() =>
								void navigator.clipboard?.writeText(inviteCode)
							}
						>
							👥 {inviteCode}
						</button>
					)}
					<button
						type='button'
						className={styles.logoutBtn}
						onClick={onLogout}
					>
						Cerrar sesión
					</button>
					<button
						type='button'
						className={styles.addBtn}
						onClick={onAdd}
					>
						＋ Agregar
					</button>
				</div>
			</div>
			<div className={styles.tabs}>
				{TABS.map((t) => (
					<button
						key={t.id}
						type='button'
						className={`${styles.tab} ${activeTab === t.id ? styles.active : ""}`}
						onClick={() => onTabChange(t.id)}
					>
						{t.label}
					</button>
				))}
			</div>
		</header>
	);
}
