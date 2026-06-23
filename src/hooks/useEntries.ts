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
