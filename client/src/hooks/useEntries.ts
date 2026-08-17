import { useState, useEffect, useCallback } from "react";
import type { Entry, EntryType, ShoppingItem, Nota } from "../types";
import { api, getToken } from "../lib/api";
import { createSocket } from "../lib/socket";

type WithId = { id: string };

/** Idempotent merge so REST responses and socket broadcasts can't duplicate rows. */
function upsert<T extends WithId>(list: T[], item: T, prepend = false): T[] {
	const index = list.findIndex((existing) => existing.id === item.id);
	if (index === -1) return prepend ? [item, ...list] : [...list, item];
	const next = [...list];
	next[index] = item;
	return next;
}

export function useEntries(enabled: boolean) {
	const [state, setState] = useState<{
		entries: Entry[];
		shopping: ShoppingItem[];
		notas: Nota[];
		loading: boolean;
	}>({ entries: [], shopping: [], notas: [], loading: true });

	const setEntries = useCallback(
		(updater: (prev: Entry[]) => Entry[]) =>
			setState((prev) => ({ ...prev, entries: updater(prev.entries) })),
		[],
	);
	const setShopping = useCallback(
		(updater: (prev: ShoppingItem[]) => ShoppingItem[]) =>
			setState((prev) => ({ ...prev, shopping: updater(prev.shopping) })),
		[],
	);
	const setNotas = useCallback(
		(updater: (prev: Nota[]) => Nota[]) =>
			setState((prev) => ({ ...prev, notas: updater(prev.notas) })),
		[],
	);

	useEffect(() => {
		if (!enabled) return;

		let cancelled = false;

		Promise.all([
			api.get<Entry[]>("/entries"),
			api.get<ShoppingItem[]>("/shopping"),
			api.get<Nota[]>("/notas"),
		])
			.then(([entries, shopping, notas]) => {
				if (!cancelled)
					setState({ entries, shopping, notas, loading: false });
			})
			.catch((error) => {
				console.error(error);
				if (!cancelled)
					setState((prev) => ({ ...prev, loading: false }));
			});

		return () => {
			cancelled = true;
		};
	}, [enabled]);

	// Live updates pushed from other devices in the same family
	useEffect(() => {
		const token = getToken();
		if (!enabled || !token) return;

		const socket = createSocket(token);

		socket.on("entries:upsert", (entry: Entry) =>
			setEntries((prev) => upsert(prev, entry)),
		);
		socket.on("entries:deleted", ({ id }: WithId) =>
			setEntries((prev) => prev.filter((e) => e.id !== id)),
		);

		socket.on("shopping:upsert", (item: ShoppingItem) =>
			setShopping((prev) => upsert(prev, item)),
		);
		socket.on("shopping:deleted", ({ id }: WithId) =>
			setShopping((prev) => prev.filter((i) => i.id !== id)),
		);

		socket.on("notas:upsert", (nota: Nota) =>
			setNotas((prev) => upsert(prev, nota, true)),
		);
		socket.on("notas:deleted", ({ id }: WithId) =>
			setNotas((prev) => prev.filter((n) => n.id !== id)),
		);

		return () => {
			socket.disconnect();
		};
	}, [enabled, setEntries, setShopping, setNotas]);

	// ── Entries CRUD ───────────────────────────────────────────────────────────

	const addEntry = useCallback(
		async (entry: Omit<Entry, "id">) => {
			const created = await api.post<Entry>("/entries", entry);
			setEntries((prev) => upsert(prev, created));
		},
		[setEntries],
	);

	const updateEntry = useCallback(
		async (updated: Entry) => {
			const { id, ...payload } = updated;
			const saved = await api.put<Entry>(`/entries/${id}`, payload);
			setEntries((prev) => upsert(prev, saved));
		},
		[setEntries],
	);

	const deleteEntry = useCallback(
		async (id: string) => {
			await api.delete(`/entries/${id}`);
			setEntries((prev) => prev.filter((e) => e.id !== id));
		},
		[setEntries],
	);

	const getByType = useCallback(
		(type: EntryType) => state.entries.filter((e) => e.type === type),
		[state.entries],
	);

	// ── Shopping CRUD ──────────────────────────────────────────────────────────

	const addShoppingItem = useCallback(
		async (name: string) => {
			const created = await api.post<ShoppingItem>("/shopping", { name });
			setShopping((prev) => upsert(prev, created));
		},
		[setShopping],
	);

	const updateShoppingItem = useCallback(
		async (id: string, name: string) => {
			const saved = await api.put<ShoppingItem>(`/shopping/${id}`, {
				name,
			});
			setShopping((prev) => upsert(prev, saved));
		},
		[setShopping],
	);

	const deleteShoppingItem = useCallback(
		async (id: string) => {
			await api.delete(`/shopping/${id}`);
			setShopping((prev) => prev.filter((i) => i.id !== id));
		},
		[setShopping],
	);

	// ── Notas CRUD ─────────────────────────────────────────────────────────────

	const addNota = useCallback(async () => {
		const created = await api.post<Nota>("/notas", { title: "", body: "" });
		setNotas((prev) => upsert(prev, created, true));
	}, [setNotas]);

	const updateNota = useCallback(
		async (id: string, title: string, body: string) => {
			const saved = await api.put<Nota>(`/notas/${id}`, { title, body });
			setNotas((prev) => upsert(prev, saved));
		},
		[setNotas],
	);

	const deleteNota = useCallback(
		async (id: string) => {
			await api.delete(`/notas/${id}`);
			setNotas((prev) => prev.filter((n) => n.id !== id));
		},
		[setNotas],
	);

	return {
		// Masked while logged out so a previous session's data can never render.
		entries: enabled ? state.entries : [],
		shopping: enabled ? state.shopping : [],
		notas: enabled ? state.notas : [],
		loading: enabled ? state.loading : false,
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
