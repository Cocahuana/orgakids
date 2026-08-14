import { useState, useEffect, useCallback } from "react";
import {
	collection,
	doc,
	addDoc,
	updateDoc,
	deleteDoc,
	onSnapshot,
} from "firebase/firestore";
import type { Entry, EntryType, ShoppingItem, Nota } from "../types";
import { todayISO } from "../utils";
import { getDbInstance } from "../lib/firebase";

const ENTRIES_COL = "entries";
const SHOPPING_COL = "shopping";
const NOTAS_COL = "notas";

export function useEntries() {
	const [entries, setEntries] = useState<Entry[]>([]);
	const [shopping, setShopping] = useState<ShoppingItem[]>([]);
	const [notas, setNotas] = useState<Nota[]>([]);
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

		const unsubNotas = onSnapshot(collection(db, NOTAS_COL), (snapshot) => {
			const data = snapshot.docs.map(
				(d) => ({ id: d.id, ...d.data() }) as Nota,
			);
			setNotas(data);
		});

		return () => {
			unsubEntries();
			unsubShopping();
			unsubNotas();
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

	// ── Notas CRUD ────────────────────────────────────────────────────────────

	const addNota = useCallback(() => {
		const db = getDbInstance();
		addDoc(collection(db, NOTAS_COL), {
			title: "",
			body: "",
			created: todayISO(),
		}).catch(console.error);
	}, []);

	const updateNota = useCallback(
		(id: string, title: string, body: string) => {
			const db = getDbInstance();
			updateDoc(doc(db, NOTAS_COL, id), { title, body }).catch(
				console.error,
			);
		},
		[],
	);

	const deleteNota = useCallback((id: string) => {
		const db = getDbInstance();
		deleteDoc(doc(db, NOTAS_COL, id)).catch(console.error);
	}, []);

	return {
		entries,
		shopping,
		notas,
		loading,
		addEntry,
		updateEntry,
		deleteEntry,
		getByType,
		addShoppingItem,
		updateShoppingItem,
		deleteShoppingItem,
		addNota,
		updateNota,
		deleteNota,
	};
}
