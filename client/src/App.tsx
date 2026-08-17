import { useState } from "react";
import type { Entry, EntryType, TabId } from "./types";
import { useEntries } from "./hooks/useEntries";
import { useAuth } from "./hooks/useAuth";
import { useToast } from "./hooks/useToast";
import { TYPE_INFO } from "./constants";
import { AppHeader } from "./components/organisms/AppHeader";
import { EntryModal } from "./components/organisms/EntryModal";
import { ConfirmDialog } from "./components/organisms/ConfirmDialog";
import { OverviewView } from "./components/views/OverviewView";
import { CalendarView } from "./components/views/CalendarView";
import { TypedView } from "./components/views/TypedView";
import { SupermarketView } from "./components/views/SupermarketView";
import { NotasView } from "./components/views/NotasView";
import { AuthView } from "./components/views/AuthView";
import { Toast } from "./components/atoms/Toast";
import styles from "./App.module.css";

export default function App() {
	const {
		user,
		family,
		loading: isAuthLoading,
		login,
		register,
		logout,
	} = useAuth();
	const {
		entries,
		shopping,
		notas,
		addEntry,
		updateEntry,
		deleteEntry,
		addShoppingItem,
		updateShoppingItem,
		deleteShoppingItem,
		addNota,
		updateNota,
		deleteNota,
	} = useEntries(user !== null);
	const { message: toastMsg, visible: toastVisible, showToast } = useToast();
	const [activeTab, setActiveTab] = useState<TabId>("overview");
	const [modalOpen, setModalOpen] = useState(false);
	const [editEntry, setEditEntry] = useState<Entry | null>(null);
	const [presetDate, setPresetDate] = useState("");
	const [presetType, setPresetType] = useState<EntryType | null>(null);
	const [confirmState, setConfirmState] = useState<{
		message: string;
		onConfirm: () => void;
	} | null>(null);

	function reportError(error: unknown, fallback: string) {
		console.error(error);
		showToast(error instanceof Error ? error.message : fallback);
	}

	function openAdd(date = "", type?: EntryType) {
		setEditEntry(null);
		setPresetDate(date);
		setPresetType(type ?? null);
		setModalOpen(true);
	}

	function openEdit(id: string) {
		const entry = entries.find((e) => e.id === id) ?? null;
		setEditEntry(entry);
		setPresetDate("");
		setModalOpen(true);
	}

	async function handleSave(entry: Omit<Entry, "id">) {
		try {
			await addEntry(entry);
			showToast("Entrada guardada ✓");
		} catch (error) {
			reportError(error, "No se pudo guardar la entrada");
		}
	}

	async function handleUpdate(entry: Entry) {
		try {
			await updateEntry(entry);
			showToast("Entrada actualizada ✓");
		} catch (error) {
			reportError(error, "No se pudo actualizar la entrada");
		}
	}

	function handleDelete(id: string) {
		const entry = entries.find((e) => e.id === id);
		const label = entry?.title ? ` "${entry.title}"` : "";
		setConfirmState({
			message: `¿Eliminar${label}?`,
			onConfirm: () => {
				setConfirmState(null);
				deleteEntry(id)
					.then(() => showToast("Entrada eliminada"))
					.catch((error) =>
						reportError(error, "No se pudo eliminar la entrada"),
					);
			},
		});
	}

	function handleKpiClick(type: EntryType) {
		setActiveTab(TYPE_INFO[type].view);
	}

	/** Wraps a fire-and-forget async action so failures surface as a toast. */
	function guard<A extends unknown[]>(
		action: (...args: A) => Promise<unknown>,
		fallback: string,
	) {
		return (...args: A) => {
			action(...args).catch((error) => reportError(error, fallback));
		};
	}

	if (isAuthLoading) {
		return null;
	}

	if (!user) {
		return <AuthView onLogin={login} onRegister={register} />;
	}

	return (
		<>
			<AppHeader
				activeTab={activeTab}
				onTabChange={setActiveTab}
				onAdd={() => openAdd()}
				onLogout={logout}
				inviteCode={family?.inviteCode}
			/>

			<main className={styles.main}>
				{activeTab === "overview" && (
					<OverviewView
						entries={entries}
						shoppingCount={shopping.length}
						notasCount={notas.length}
						onEdit={openEdit}
						onDelete={handleDelete}
						onKpiClick={handleKpiClick}
						onNavigate={setActiveTab}
					/>
				)}
				{activeTab === "calendar" && (
					<CalendarView
						entries={entries}
						onEdit={openEdit}
						onDelete={handleDelete}
						onAddForDate={openAdd}
					/>
				)}
				{activeTab === "supermarket" && (
					<SupermarketView
						shopping={shopping}
						onAdd={guard(
							addShoppingItem,
							"No se pudo agregar el producto",
						)}
						onUpdate={guard(
							updateShoppingItem,
							"No se pudo actualizar el producto",
						)}
						onDelete={guard(
							deleteShoppingItem,
							"No se pudo eliminar el producto",
						)}
						onShowToast={showToast}
					/>
				)}
				{activeTab === "exams" && (
					<TypedView
						type='exam'
						entries={entries}
						onEdit={openEdit}
						onDelete={handleDelete}
						onAdd={openAdd}
					/>
				)}
				{activeTab === "sports" && (
					<TypedView
						type='sport'
						entries={entries}
						onEdit={openEdit}
						onDelete={handleDelete}
						onAdd={openAdd}
					/>
				)}
				{activeTab === "events" && (
					<TypedView
						type='event'
						entries={entries}
						onEdit={openEdit}
						onDelete={handleDelete}
						onAdd={openAdd}
					/>
				)}
				{activeTab === "medical" && (
					<TypedView
						type='medical'
						entries={entries}
						onEdit={openEdit}
						onDelete={handleDelete}
						onAdd={openAdd}
					/>
				)}
				{activeTab === "recover" && (
					<TypedView
						type='recover'
						entries={entries}
						onEdit={openEdit}
						onDelete={handleDelete}
						onAdd={openAdd}
					/>
				)}
				{activeTab === "works" && (
					<TypedView
						type='work'
						entries={entries}
						onEdit={openEdit}
						onDelete={handleDelete}
						onAdd={openAdd}
					/>
				)}
				{activeTab === "notas" && (
					<NotasView
						notas={notas}
						onAdd={guard(addNota, "No se pudo crear la nota")}
						onSave={guard(updateNota, "No se pudo guardar la nota")}
						onDelete={guard(
							deleteNota,
							"No se pudo eliminar la nota",
						)}
					/>
				)}
			</main>

			{modalOpen && (
				<EntryModal
					open={modalOpen}
					editEntry={editEntry}
					presetDate={presetDate}
					presetType={presetType}
					onSave={handleSave}
					onUpdate={handleUpdate}
					onClose={() => setModalOpen(false)}
				/>
			)}
			<ConfirmDialog
				open={confirmState !== null}
				message={confirmState?.message ?? ""}
				onConfirm={confirmState?.onConfirm ?? (() => {})}
				onCancel={() => setConfirmState(null)}
			/>
			<Toast message={toastMsg} visible={toastVisible} />
		</>
	);
}
