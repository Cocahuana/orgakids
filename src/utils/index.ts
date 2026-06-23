import type { Entry } from "../types";

const DAY_NAMES = [
	"Domingo",
	"Lunes",
	"Martes",
	"Miércoles",
	"Jueves",
	"Viernes",
	"Sábado",
];

export function localDateISO(date: Date): string {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
}

export function todayISO(): string {
	const d = new Date();
	d.setHours(0, 0, 0, 0);
	return localDateISO(d);
}

export function daysUntil(dateStr: string): number {
	if (!dateStr) return 999;
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const d = new Date(`${dateStr}T00:00:00`);
	return Math.round((d.getTime() - today.getTime()) / 86_400_000);
}

export function daysBetween(fromISO: string, toISO: string): number {
	const from = new Date(`${fromISO}T00:00:00`);
	const to = new Date(`${toISO}T00:00:00`);
	return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}

export function formatDate(dateStr: string, withWeekday = true): string {
	if (!dateStr) return "";
	const d = new Date(`${dateStr}T00:00:00`);
	return d.toLocaleDateString(
		"es-AR",
		withWeekday
			? { weekday: "short", day: "numeric", month: "short" }
			: { day: "numeric", month: "short", year: "numeric" },
	);
}

export function formatLongDate(dateStr: string): string {
	if (!dateStr) return "Actividades del día";
	const d = new Date(`${dateStr}T00:00:00`);
	const label = d.toLocaleDateString("es-AR", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	});
	return label.charAt(0).toUpperCase() + label.slice(1);
}

export function urgencyBadge(days: number): { cls: string; label: string } {
	if (days < 0) return { cls: "urgency--red", label: "Vencido" };
	if (days === 0) return { cls: "urgency--red", label: "¡Hoy!" };
	if (days <= 2) return { cls: "urgency--red", label: `${days}d` };
	if (days <= 5) return { cls: "urgency--yellow", label: `${days}d` };
	return { cls: "urgency--green", label: `${days}d` };
}

/** Returns true if `entry` occurs on the given ISO date string. */
export function occursOnDate(entry: Entry, dateStr: string): boolean {
	if (entry.type === "sport" && entry.repeatEnabled) {
		if (!entry.repeatFrom || !entry.repeatTo) return false;
		if (dateStr < entry.repeatFrom || dateStr > entry.repeatTo)
			return false;
		const d = new Date(`${dateStr}T00:00:00`);
		return entry.repeatDays.includes(d.getDay());
	}
	return entry.date === dateStr;
}

/** Returns the next ISO date the entry occurs on, starting from `from` (inclusive). */
export function nextOccurrence(entry: Entry, from?: string): string {
	const start = from ?? todayISO();
	if (entry.type === "sport" && entry.repeatEnabled) {
		const lo = entry.repeatFrom > start ? entry.repeatFrom : start;
		const d = new Date(`${lo}T00:00:00`);
		const end = new Date(`${entry.repeatTo}T00:00:00`);
		for (let i = 0; i < 3700 && d <= end; i++, d.setDate(d.getDate() + 1)) {
			const iso = localDateISO(d);
			if (occursOnDate(entry, iso)) return iso;
		}
		return "";
	}
	return entry.date || "";
}

/** Human-readable recurrence string for a sport entry. */
export function recurrenceText(entry: Entry): string {
	if (entry.type !== "sport" || !entry.repeatEnabled) return "";
	const days = [...entry.repeatDays]
		.sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7)) // Mon-first order
		.map((n) => DAY_NAMES[n])
		.join(", ");
	return `${formatDate(entry.repeatFrom, false)} al ${formatDate(entry.repeatTo, false)} · ${days}`;
}

/** Formatted time range string, e.g. "16:00 a 17:30" or "Desde 16:00". */
export function formatTimeRange(
	entry: Pick<Entry, "timeFrom" | "timeTo">,
): string {
	const { timeFrom, timeTo } = entry;
	if (timeFrom && timeTo) return `${timeFrom} a ${timeTo}`;
	if (timeFrom) return `Desde ${timeFrom}`;
	if (timeTo) return `Hasta ${timeTo}`;
	return "";
}
