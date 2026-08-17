import { Router } from "express";
import { z } from "zod";
import { Entry, ENTRY_TYPES, toEntryDTO, UserFamily } from "../models/index.js";
import { getAuth } from "../middleware/auth.js";
import { HttpError } from "../utils/HttpError.js";
import { emitToFamily } from "../realtime/io.js";

export const entriesRouter = Router();

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida");
const isoTime = z.string().regex(/^\d{2}:\d{2}$/, "Hora inválida");

const optionalDate = z
	.union([isoDate, z.literal("")])
	.optional()
	.default("");
const optionalTime = z
	.union([isoTime, z.literal("")])
	.optional()
	.default("");

const entrySchema = z.object({
	type: z.enum(ENTRY_TYPES),
	kid: z.string().trim().max(120).optional().default(""),
	title: z.string().trim().min(1, "El título es obligatorio").max(200),
	date: optionalDate,
	dateTo: optionalDate,
	timeFrom: optionalTime,
	timeTo: optionalTime,
	medicalTime: optionalTime,
	grade: z.string().trim().max(60).optional().default(""),
	notes: z.string().max(2000).optional().default(""),
	repeatEnabled: z.boolean().optional().default(false),
	repeatFrom: optionalDate,
	repeatTo: optionalDate,
	repeatDays: z
		.array(z.number().int().min(0).max(6))
		.max(7)
		.optional()
		.default([]),
});

/** DATEONLY / time columns store NULL for "not set"; the client uses "". */
const blankToNull = (value: string) => (value === "" ? null : value);

function toAttributes(input: z.infer<typeof entrySchema>) {
	return {
		type: input.type,
		kid: input.kid,
		title: input.title,
		date: blankToNull(input.date),
		dateTo: blankToNull(input.dateTo),
		timeFrom: blankToNull(input.timeFrom),
		timeTo: blankToNull(input.timeTo),
		medicalTime: blankToNull(input.medicalTime),
		grade: input.grade,
		notes: input.notes,
		repeatEnabled: input.repeatEnabled,
		repeatFrom: blankToNull(input.repeatFrom),
		repeatTo: blankToNull(input.repeatTo),
		repeatDays: [...new Set(input.repeatDays)].sort(),
	};
}

async function resolveFamilyScope(
	req: { query: Record<string, unknown> },
	userId: string,
	defaultFamilyId: string,
) {
	const requestedFamilyId =
		typeof req.query.familyId === "string"
			? req.query.familyId
			: defaultFamilyId;

	if (requestedFamilyId === defaultFamilyId) return requestedFamilyId;

	const membership = await UserFamily.findOne({
		where: { userId, familyId: requestedFamilyId },
	});
	if (!membership) {
		throw new HttpError(403, "No tenés acceso a esa familia");
	}
	return requestedFamilyId;
}

entriesRouter.get("/", async (req, res) => {
	const { userId, familyId } = getAuth(req);
	const selectedFamilyId = await resolveFamilyScope(req, userId, familyId);

	const entries = await Entry.findAll({
		where: { familyId: selectedFamilyId },
		order: [
			["date", "ASC"],
			["createdAt", "ASC"],
		],
	});
	res.json(entries.map(toEntryDTO));
});

entriesRouter.post("/", async (req, res) => {
	const { userId, familyId } = getAuth(req);
	const selectedFamilyId = await resolveFamilyScope(req, userId, familyId);
	const entry = await Entry.create({
		familyId: selectedFamilyId,
		...toAttributes(entrySchema.parse(req.body)),
	});

	const dto = toEntryDTO(entry);
	emitToFamily(selectedFamilyId, "entries:upsert", dto);
	res.status(201).json(dto);
});

entriesRouter.put("/:id", async (req, res) => {
	const { userId, familyId } = getAuth(req);
	const selectedFamilyId = await resolveFamilyScope(req, userId, familyId);
	const entry = await Entry.findOne({
		where: { id: req.params.id, familyId: selectedFamilyId },
	});
	if (!entry) throw new HttpError(404, "La actividad no existe");

	await entry.update(toAttributes(entrySchema.parse(req.body)));

	const dto = toEntryDTO(entry);
	emitToFamily(selectedFamilyId, "entries:upsert", dto);
	res.json(dto);
});

entriesRouter.delete("/:id", async (req, res) => {
	const { userId, familyId } = getAuth(req);
	const selectedFamilyId = await resolveFamilyScope(req, userId, familyId);
	const deleted = await Entry.destroy({
		where: { id: req.params.id, familyId: selectedFamilyId },
	});
	if (!deleted) throw new HttpError(404, "La actividad no existe");

	emitToFamily(selectedFamilyId, "entries:deleted", { id: req.params.id });
	res.status(204).end();
});
