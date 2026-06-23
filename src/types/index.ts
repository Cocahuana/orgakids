export type EntryType = "exam" | "sport" | "event" | "recover" | "work";

export interface Entry {
	id: number;
	type: EntryType;
	kid: string;
	title: string;
	date: string;
	timeFrom: string;
	timeTo: string;
	grade: string;
	notes: string;
	// Repeat (sports only)
	repeatEnabled: boolean;
	repeatFrom: string;
	repeatTo: string;
	repeatDays: number[]; // 0=Sun … 6=Sat
}

export interface ShoppingItem {
	id: number;
	name: string;
}

export interface AppData {
	entries: Entry[];
	nextId: number;
	shopping: ShoppingItem[];
	nextShoppingId: number;
}

export type TabId =
	| "overview"
	| "calendar"
	| "supermarket"
	| "exams"
	| "sports"
	| "events"
	| "recover"
	| "works";
