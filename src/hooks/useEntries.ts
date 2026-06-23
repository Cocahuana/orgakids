import { useState, useEffect, useCallback } from "react";
import {
	collection,
	doc,
	addDoc,
	updateDoc,
	deleteDoc,
	onSnapshot,
} from "firebase/firestore";
import type { Entry, EntryType, ShoppingItem } from "../types";
import { getDbInstance } from "../lib/firebase";

const ENTRIES_COL = "entries";
const SHOPPING_COL = "shopping";

export function useEntries() {
	const [entries, setEntries] = useState<Entry[]>([]);
	const [shopping, setShopping] = useState<ShoppingItem[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const db = getDbInstance();

		const unsubEntries = onSnapshot(
			collection(db, ENTRIES_COL),
			(snapshot) => {
				const data = snapshot.docs.map(
					(d) => ({ id: d.id, ...d.data() }) as Entry,
				);
				setEntries(data);
				setLoading(false);
			},
			() => setLoading(false),
		);

		const unsubShopping = onSnapshot(
			collection(db, SHOPPING_COL),
			(snapshot) => {
				const data = snapshot.docs.map(
					(d) => ({ id: d.id, ...d.data() }) as ShoppingItem,
				);
				setShopping(data);
			},
		);

		return () => {
			unsubEntries();
			unsubShopping();
		};
	}, []);

	const addEntry = useCallback((entry: Omit<Entry, "id">) => {
		const db = getDbInstance();
		addDoc(collection(db, ENTRIES_COL), entry).catch(console.error);
	}, []);

	const updateEntry = useCallback((updated: Entry) => {
		const db = getDbInstance();
		const { id, ...data } = updated;
		updateDoc(doc(db, ENTRIES_COL, id), data).catch(console.error);
	}, []);

	const deleteEntry = useCallback((id: string) => {
		const db = getDbInstance();
		deleteDoc(doc(db, ENTRIES_COL, id)).catch(console.error);
	}, []);

	const getByType = useCallback(
		(type: EntryType) => entries.filter((e) => e.type === type),
		[entries],
	);

	// ── Shopping CRUD ──────────────────────────────────────────────────────────

	const addShoppingItem = useCallback((name: string) => {
		const db = getDbInstance();
		addDoc(collection(db, SHOPPING_COL), { name }).catch(console.error);
	}, []);

	const updateShoppingItem = useCallback((id: string, name: string) => {
		const db = getDbInstance();
		updateDoc(doc(db, SHOPPING_COL, id), { name }).catch(console.error);
	}, []);

	const deleteShoppingItem = useCallback((id: string) => {
		const db = getDbInstance();
		deleteDoc(doc(db, SHOPPING_COL, id)).catch(console.error);
	}, []);

	return {
		entries,
		shopping,
		loading,
		addEntry,
		updateEntry,
		deleteEntry,
		getByType,
		addShoppingItem,
		updateShoppingItem,
		deleteShoppingItem,
	};
}

/** Migrate an entry from the old format (time / recur) to the new format. */
function migrateEntry(raw: Record<string, unknown>): Entry {
	return {
		id: Number(raw.id ?? 0),
		type: (raw.type ?? "exam") as EntryType,
		kid: String(raw.kid ?? ""),
		title: String(raw.title ?? ""),
		date: String(raw.date ?? ""),
		timeFrom: String(raw.timeFrom ?? raw.time ?? ""),
		timeTo: String(raw.timeTo ?? ""),
		grade: String(raw.grade ?? ""),
		notes: String(raw.notes ?? ""),
		repeatEnabled: Boolean(raw.repeatEnabled ?? false),
		repeatFrom: String(raw.repeatFrom ?? ""),
		repeatTo: String(raw.repeatTo ?? ""),
		repeatDays: Array.isArray(raw.repeatDays)
			? (raw.repeatDays as number[])
			: [],
	};
}

function loadData(): AppData {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) {
			const parsed = JSON.parse(raw) as Record<string, unknown>;
			if (Array.isArray(parsed.entries)) {
				return {
					entries: (parsed.entries as Record<string, unknown>[]).map(
						migrateEntry,
					),
					nextId: Number(parsed.nextId ?? 1),
					shopping: Array.isArray(parsed.shopping)
						? (parsed.shopping as ShoppingItem[])
						: [],
					nextShoppingId: Number(parsed.nextShoppingId ?? 1),
				};
			}
		}
	} catch {
		// ignore parse errors
	}
	return structuredClone(DEFAULT_DATA);
}

function persistData(data: AppData): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	} catch {
		// storage unavailable
	}
}

export function useEntries() {
	const [data, setData] = useState<AppData>(loadData);

	const saveAndSet = useCallback((next: AppData) => {
		persistData(next);
		setData(next);
	}, []);

	const addEntry = useCallback((entry: Omit<Entry, "id">) => {
		setData((prev) => {
			const next: AppData = {
				...prev,
				entries: [...prev.entries, { ...entry, id: prev.nextId }],
				nextId: prev.nextId + 1,
			};
			persistData(next);
			return next;
		});
	}, []);

	const updateEntry = useCallback((updated: Entry) => {
		setData((prev) => {
			const next: AppData = {
				...prev,
				entries: prev.entries.map((e) =>
					e.id === updated.id ? updated : e,
				),
			};
			persistData(next);
			return next;
		});
	}, []);

	const deleteEntry = useCallback((id: number) => {
		setData((prev) => {
			const next: AppData = {
				...prev,
				entries: prev.entries.filter((e) => e.id !== id),
			};
			persistData(next);
			return next;
		});
	}, []);

	const getByType = useCallback(
		(type: EntryType) => data.entries.filter((e) => e.type === type),
		[data.entries],
	);

	// ── Shopping CRUD ──────────────────────────────────────────────────────────

	const addShoppingItem = useCallback((name: string) => {
		setData((prev) => {
			const next: AppData = {
				...prev,
				shopping: [...prev.shopping, { id: prev.nextShoppingId, name }],
				nextShoppingId: prev.nextShoppingId + 1,
			};
			persistData(next);
			return next;
		});
	}, []);

	const updateShoppingItem = useCallback((id: number, name: string) => {
		setData((prev) => {
			const next: AppData = {
				...prev,
				shopping: prev.shopping.map((s) =>
					s.id === id ? { id, name } : s,
				),
			};
			persistData(next);
			return next;
		});
	}, []);

	const deleteShoppingItem = useCallback((id: number) => {
		setData((prev) => {
			const next: AppData = {
				...prev,
				shopping: prev.shopping.filter((s) => s.id !== id),
			};
			persistData(next);
			return next;
		});
	}, []);

	return {
		entries: data.entries,
		shopping: data.shopping,
		addEntry,
		updateEntry,
		deleteEntry,
		getByType,
		saveAndSet,
		addShoppingItem,
		updateShoppingItem,
		deleteShoppingItem,
	};
}
