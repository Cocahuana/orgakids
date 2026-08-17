import { Router } from "express";
import { z } from "zod";
import { Nota, toNotaDTO, UserFamily } from "../models/index.js";
import { getAuth } from "../middleware/auth.js";
import { HttpError } from "../utils/HttpError.js";
import { emitToFamily } from "../realtime/io.js";

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

export const notasRouter = Router();

const notaSchema = z.object({
	title: z.string().max(120).optional().default(""),
	body: z.string().max(10_000).optional().default(""),
});

notasRouter.get("/", async (req, res) => {
	const { userId, familyId } = getAuth(req);
	const selectedFamilyId = await resolveFamilyScope(req, userId, familyId);
	const notas = await Nota.findAll({
		where: { familyId: selectedFamilyId },
		order: [["createdAt", "DESC"]],
	});
	res.json(notas.map(toNotaDTO));
});

notasRouter.post("/", async (req, res) => {
	const { userId, familyId } = getAuth(req);
	const selectedFamilyId = await resolveFamilyScope(req, userId, familyId);
	const { title, body } = notaSchema.parse(req.body ?? {});

	const nota = await Nota.create({
		familyId: selectedFamilyId,
		title,
		body,
		created: new Date().toISOString().slice(0, 10),
	});

	const dto = toNotaDTO(nota);
	emitToFamily(selectedFamilyId, "notas:upsert", dto);
	res.status(201).json(dto);
});

notasRouter.put("/:id", async (req, res) => {
	const { userId, familyId } = getAuth(req);
	const selectedFamilyId = await resolveFamilyScope(req, userId, familyId);
	const { title, body } = notaSchema.parse(req.body);

	const nota = await Nota.findOne({
		where: { id: req.params.id, familyId: selectedFamilyId },
	});
	if (!nota) throw new HttpError(404, "La nota no existe");

	await nota.update({ title, body });

	const dto = toNotaDTO(nota);
	emitToFamily(selectedFamilyId, "notas:upsert", dto);
	res.json(dto);
});

notasRouter.delete("/:id", async (req, res) => {
	const { userId, familyId } = getAuth(req);
	const selectedFamilyId = await resolveFamilyScope(req, userId, familyId);
	const deleted = await Nota.destroy({
		where: { id: req.params.id, familyId: selectedFamilyId },
	});
	if (!deleted) throw new HttpError(404, "La nota no existe");

	emitToFamily(selectedFamilyId, "notas:deleted", { id: req.params.id });
	res.status(204).end();
});
