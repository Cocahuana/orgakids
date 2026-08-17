import { Router } from "express";
import { z } from "zod";
import { Nota, toNotaDTO } from "../models/index.js";
import { getAuth } from "../middleware/auth.js";
import { HttpError } from "../utils/HttpError.js";
import { emitToFamily } from "../realtime/io.js";

export const notasRouter = Router();

const notaSchema = z.object({
	title: z.string().max(120).optional().default(""),
	body: z.string().max(10_000).optional().default(""),
});

notasRouter.get("/", async (req, res) => {
	const { familyId } = getAuth(req);
	const notas = await Nota.findAll({
		where: { familyId },
		order: [["createdAt", "DESC"]],
	});
	res.json(notas.map(toNotaDTO));
});

notasRouter.post("/", async (req, res) => {
	const { familyId } = getAuth(req);
	const { title, body } = notaSchema.parse(req.body ?? {});

	const nota = await Nota.create({
		familyId,
		title,
		body,
		created: new Date().toISOString().slice(0, 10),
	});

	const dto = toNotaDTO(nota);
	emitToFamily(familyId, "notas:upsert", dto);
	res.status(201).json(dto);
});

notasRouter.put("/:id", async (req, res) => {
	const { familyId } = getAuth(req);
	const { title, body } = notaSchema.parse(req.body);

	const nota = await Nota.findOne({ where: { id: req.params.id, familyId } });
	if (!nota) throw new HttpError(404, "La nota no existe");

	await nota.update({ title, body });

	const dto = toNotaDTO(nota);
	emitToFamily(familyId, "notas:upsert", dto);
	res.json(dto);
});

notasRouter.delete("/:id", async (req, res) => {
	const { familyId } = getAuth(req);
	const deleted = await Nota.destroy({
		where: { id: req.params.id, familyId },
	});
	if (!deleted) throw new HttpError(404, "La nota no existe");

	emitToFamily(familyId, "notas:deleted", { id: req.params.id });
	res.status(204).end();
});
