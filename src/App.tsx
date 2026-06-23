import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { Entry, TabId } from "./types";
import { useEntries } from "./hooks/useEntries";
import { getAuthInstance } from "./lib/firebase";
import { AppHeader } from "./components/organisms/AppHeader";
import { EntryModal } from "./components/organisms/EntryModal";
import { OverviewView } from "./components/views/OverviewView";
import { CalendarView } from "./components/views/CalendarView";
import { TypedView } from "./components/views/TypedView";
import { AuthView } from "./components/views/AuthView";
import styles from "./App.module.css";

export default function App() {
	const { entries, addEntry, updateEntry, deleteEntry } = useEntries();
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

	function handleDelete(id: number) {
		const entry = entries.find((e) => e.id === id);
		const label = entry?.title ? ` "${entry.title}"` : "";
		if (!window.confirm(`¿Eliminar${label}?`)) return;
		deleteEntry(id);
	}

	async function handleLogout() {
		try {
			await signOut(getAuthInstance());
		} catch {
			window.alert("No se pudo cerrar sesión. Intentá de nuevo.");
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
					onSave={addEntry}
					onUpdate={updateEntry}
					onClose={() => setModalOpen(false)}
				/>
			)}
		</>
	);
}
