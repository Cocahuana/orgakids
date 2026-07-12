export type EntryType = "exam" | "sport" | "event" | "recover" | "work" | "medical";

export interface Entry {
	id: string;
	type: EntryType;
	kid: string;
	title: string;
	date: string;
	dateTo?: string; // For multi-day events
	timeFrom: string;
	timeTo: string;
	medicalTime?: string; // For medical appointments
	grade: string;
	notes: string;
	// Repeat (sports only)
	repeatEnabled: boolean;
	repeatFrom: string;
	repeatTo: string;
	repeatDays: number[]; // 0=Sun … 6=Sat
}

export interface Nota {
	id: string;
	title: string;
	body: string;
	created: string;
}

export interface ShoppingItem {
	id: string;
	name: string;
}

export type TabId =
	| "overview"
	| "calendar"
	| "supermarket"
	| "exams"
	| "sports"
	| "events"
	| "medical"
	| "recover"
	| "works"
	| "notas";
