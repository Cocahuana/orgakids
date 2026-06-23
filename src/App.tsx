import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { Entry, EntryType, TabId } from "./types";
import { useEntries } from "./hooks/useEntries";
import { useToast } from "./hooks/useToast";
import { TYPE_INFO } from "./constants";
import { getAuthInstance } from "./lib/firebase";
import { AppHeader } from "./components/organisms/AppHeader";
import { EntryModal } from "./components/organisms/EntryModal";
import { OverviewView } from "./components/views/OverviewView";
import { CalendarView } from "./components/views/CalendarView";
import { TypedView } from "./components/views/TypedView";
import { SupermarketView } from "./components/views/SupermarketView";
import { AuthView } from "./components/views/AuthView";
import { Toast } from "./components/atoms/Toast";
import styles from "./App.module.css";

export default function App() {
	const {
		entries,
		shopping,
		addEntry,
		updateEntry,
		deleteEntry,
		addShoppingItem,
		updateShoppingItem,
		deleteShoppingItem,
	} = useEntries();
	const { message: toastMsg, visible: toastVisible, showToast } = useToast();
	const [activeTab, setActiveTab] = useState<TabId>("overview");
	const [modalOpen, setModalOpen] = useState(false);
	const [editEntry, setEditEntry] = useState<Entry | null>(null);
	const [presetDate, setPresetDate] = useState("");
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [isAuthLoading, setIsAuthLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(getAuthInstance(), (user) => {
			setCurrentUser(user);
			setIsAuthLoading(false);
		});

		return unsubscribe;
	}, []);

	function openAdd(date = "") {
		setEditEntry(null);
		setPresetDate(date);
		setModalOpen(true);
	}

	function openEdit(id: number) {
		const entry = entries.find((e) => e.id === id) ?? null;
		setEditEntry(entry);
		setPresetDate("");
		setModalOpen(true);
	}

	function handleSave(entry: Omit<Entry, "id">) {
		addEntry(entry);
		showToast("Entrada guardada ✓");
	}

	function handleUpdate(entry: Entry) {
		updateEntry(entry);
		showToast("Entrada actualizada ✓");
	}

	function handleDelete(id: number) {
		const entry = entries.find((e) => e.id === id);
		const label = entry?.title ? ` "${entry.title}"` : "";
		if (!window.confirm(`¿Eliminar${label}?`)) return;
		deleteEntry(id);
		showToast("Entrada eliminada");
	}

	function handleKpiClick(type: EntryType) {
		setActiveTab(TYPE_INFO[type].view);
	}

	async function handleLogout() {
		try {
			await signOut(getAuthInstance());
		} catch {
			window.alert("No se pudo cerrar sesión, Intentá de nuevo.");
		}
	}

	if (isAuthLoading) {
		return null;
	}

	if (!currentUser) {
		return <AuthView />;
	}

	return (
		<>
			<AppHeader
				activeTab={activeTab}
				onTabChange={setActiveTab}
				onAdd={() => openAdd()}
				onLogout={handleLogout}
			/>

			<main className={styles.main}>
				{activeTab === "overview" && (
					<OverviewView
						entries={entries}
						onEdit={openEdit}
						onDelete={handleDelete}
						onKpiClick={handleKpiClick}
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
						onAdd={addShoppingItem}
						onUpdate={updateShoppingItem}
						onDelete={deleteShoppingItem}
						onShowToast={showToast}
					/>
				)}
				{activeTab === "exams" && (
					<TypedView
						type='exam'
						entries={entries}
						onEdit={openEdit}
						onDelete={handleDelete}
					/>
				)}
				{activeTab === "sports" && (
					<TypedView
						type='sport'
						entries={entries}
						onEdit={openEdit}
						onDelete={handleDelete}
					/>
				)}
				{activeTab === "events" && (
					<TypedView
						type='event'
						entries={entries}
						onEdit={openEdit}
						onDelete={handleDelete}
					/>
				)}
				{activeTab === "recover" && (
					<TypedView
						type='recover'
						entries={entries}
						onEdit={openEdit}
						onDelete={handleDelete}
					/>
				)}
				{activeTab === "works" && (
					<TypedView
						type='work'
						entries={entries}
						onEdit={openEdit}
						onDelete={handleDelete}
					/>
				)}
			</main>

			{modalOpen && (
				<EntryModal
					open={modalOpen}
					editEntry={editEntry}
					presetDate={presetDate}
					onSave={handleSave}
					onUpdate={handleUpdate}
					onClose={() => setModalOpen(false)}
				/>
			)}
			<Toast message={toastMsg} visible={toastVisible} />
		</>
	);
}
