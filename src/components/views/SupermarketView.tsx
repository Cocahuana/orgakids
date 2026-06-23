import { useState } from "react";
import type { ShoppingItem } from "../../types";
import { IconButton } from "../atoms/IconButton";
import styles from "./SupermarketView.module.css";

interface SupermarketViewProps {
	shopping: ShoppingItem[];
	onAdd: (name: string) => void;
	onUpdate: (id: number, name: string) => void;
	onDelete: (id: number) => void;
	onShowToast: (msg: string) => void;
}

export function SupermarketView({
	shopping,
	onAdd,
	onUpdate,
	onDelete,
	onShowToast,
}: SupermarketViewProps) {
	const [inputValue, setInputValue] = useState("");
	const [editId, setEditId] = useState<number | null>(null);
	const [editValue, setEditValue] = useState("");

	function handleAdd(e: React.FormEvent) {
		e.preventDefault();
		const name = inputValue.trim();
		if (!name) return;
		onAdd(name);
		setInputValue("");
		onShowToast("Producto agregado ✓");
	}

	function startEdit(item: ShoppingItem) {
		setEditId(item.id);
		setEditValue(item.name);
	}

	function commitEdit(id: number) {
		const name = editValue.trim();
		if (name) {
			onUpdate(id, name);
			onShowToast("Producto actualizado ✓");
		}
		setEditId(null);
	}

	function handleEditKey(e: React.KeyboardEvent, id: number) {
		if (e.key === "Enter") commitEdit(id);
		if (e.key === "Escape") setEditId(null);
	}

	function handleDelete(id: number, name: string) {
		if (!window.confirm(`¿Eliminar "${name}"?`)) return;
		onDelete(id);
		onShowToast("Producto eliminado");
	}

	return (
		<div className={styles.view}>
			<h2 className={styles.heading}>🛒 Lista del Supermercado</h2>

			<form className={styles.addForm} onSubmit={handleAdd}>
				<input
					type='text'
					placeholder='Agregar producto...'
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					className={styles.addInput}
				/>
				<button type='submit' className={styles.addBtn}>
					Agregar
				</button>
			</form>

			{!shopping.length && (
				<div className={styles.empty}>
					🛒 La lista está vacía. ¡Agregá productos!
				</div>
			)}

			<ul className={styles.list}>
				{shopping.map((item) => (
					<li key={item.id} className={styles.item}>
						{editId === item.id ? (
							<input
								type='text'
								value={editValue}
								onChange={(e) => setEditValue(e.target.value)}
								onKeyDown={(e) => handleEditKey(e, item.id)}
								onBlur={() => commitEdit(item.id)}
								autoFocus
								className={styles.editInput}
							/>
						) : (
							<span className={styles.name}>{item.name}</span>
						)}
						<div className={styles.actions}>
							<IconButton
								variant='edit'
								onClick={() => startEdit(item)}
							/>
							<IconButton
								variant='delete'
								onClick={() => handleDelete(item.id, item.name)}
							/>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
