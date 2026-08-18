import { Router } from "express";
import { z } from "zod";
import { ShoppingItem, toShoppingDTO, UserFamily } from "../models/index.js";
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

export const shoppingRouter = Router();

const itemSchema = z.object({
	name: z.string().trim().min(1, "El producto no puede estar vacío").max(160),
});

shoppingRouter.get("/", async (req, res) => {
	const { userId, familyId } = getAuth(req);
	const selectedFamilyId = await resolveFamilyScope(req, userId, familyId);
	const items = await ShoppingItem.findAll({
		where: { familyId: selectedFamilyId },
		order: [["createdAt", "ASC"]],
	});
	res.json(items.map(toShoppingDTO));
});

shoppingRouter.post("/", async (req, res) => {
	const { userId, familyId } = getAuth(req);
	const selectedFamilyId = await resolveFamilyScope(req, userId, familyId);
	const { name } = itemSchema.parse(req.body);

	const item = await ShoppingItem.create({
		familyId: selectedFamilyId,
		name,
	});

	const dto = toShoppingDTO(item);
	emitToFamily(selectedFamilyId, "shopping:upsert", dto);
	res.status(201).json(dto);
});

shoppingRouter.put("/:id", async (req, res) => {
	const { userId, familyId } = getAuth(req);
	const selectedFamilyId = await resolveFamilyScope(req, userId, familyId);
	const { name } = itemSchema.parse(req.body);

	const item = await ShoppingItem.findOne({
		where: { id: req.params.id, familyId: selectedFamilyId },
	});
	if (!item) throw new HttpError(404, "El producto no existe");

	await item.update({ name });

	const dto = toShoppingDTO(item);
	emitToFamily(selectedFamilyId, "shopping:upsert", dto);
	res.json(dto);
});

shoppingRouter.delete("/:id", async (req, res) => {
	const { userId, familyId } = getAuth(req);
	const selectedFamilyId = await resolveFamilyScope(req, userId, familyId);
	const deleted = await ShoppingItem.destroy({
		where: { id: req.params.id, familyId: selectedFamilyId },
	});
	if (!deleted) throw new HttpError(404, "El producto no existe");

	emitToFamily(selectedFamilyId, "shopping:deleted", { id: req.params.id });
	res.status(204).end();
});
