import type { EntryType, TabId } from "../types";

export const TYPE_INFO: Record<
	EntryType,
	{
		icon: string;
		label: string;
		plural: string;
		cls: EntryType;
		tag: string;
		color: string;
		view: TabId;
	}
> = {
	exam: {
		icon: "📝",
		label: "Examen",
		plural: "Exámenes",
		cls: "exam",
		tag: "Examen",
		color: "#FF5C5C",
		view: "exams",
	},
	sport: {
		icon: "⚽",
		label: "Deporte",
		plural: "Deportes",
		cls: "sport",
		tag: "Deporte",
		color: "#2DB87C",
		view: "sports",
	},
	event: {
		icon: "🎉",
		label: "Evento",
		plural: "Eventos",
		cls: "event",
		tag: "Evento",
		color: "#7C5CFC",
		view: "events",
	},
	recover: {
		icon: "⚠️",
		label: "Recuperatorio",
		plural: "Recuperar",
		cls: "recover",
		tag: "Recuperar",
		color: "#FF9A00",
		view: "recover",
	},
	work: {
		icon: "📋",
		label: "Trabajo",
		plural: "Trabajos",
		cls: "work",
		tag: "Entrega",
		color: "#0099E6",
		view: "works",
	},
};

export const CALENDAR_TYPE_ORDER: EntryType[] = [
	"exam",
	"sport",
	"event",
	"recover",
	"work",
];

export const TITLE_LABELS: Record<EntryType, string> = {
	exam: "Materia",
	sport: "Deporte / Actividad",
	event: "Descripción del evento",
	recover: "Materia a recuperar",
	work: "Nombre del trabajo",
};
