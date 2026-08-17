import { Router } from "express";
import { z } from "zod";
import { ShoppingItem, toShoppingDTO } from "../models/index.js";
import { getAuth } from "../middleware/auth.js";
import { HttpError } from "../utils/HttpError.js";
import { emitToFamily } from "../realtime/io.js";

export const shoppingRouter = Router();

const itemSchema = z.object({
	name: z.string().trim().min(1, "El producto no puede estar vacío").max(160),
});

shoppingRouter.get("/", async (req, res) => {
	const { familyId } = getAuth(req);
	const items = await ShoppingItem.findAll({
		where: { familyId },
		order: [["createdAt", "ASC"]],
	});
	res.json(items.map(toShoppingDTO));
});

shoppingRouter.post("/", async (req, res) => {
	const { familyId } = getAuth(req);
	const { name } = itemSchema.parse(req.body);

	const item = await ShoppingItem.create({ familyId, name });

	const dto = toShoppingDTO(item);
	emitToFamily(familyId, "shopping:upsert", dto);
	res.status(201).json(dto);
});

shoppingRouter.put("/:id", async (req, res) => {
	const { familyId } = getAuth(req);
	const { name } = itemSchema.parse(req.body);

	const item = await ShoppingItem.findOne({
		where: { id: req.params.id, familyId },
	});
	if (!item) throw new HttpError(404, "El producto no existe");

	await item.update({ name });

	const dto = toShoppingDTO(item);
	emitToFamily(familyId, "shopping:upsert", dto);
	res.json(dto);
});

shoppingRouter.delete("/:id", async (req, res) => {
	const { familyId } = getAuth(req);
	const deleted = await ShoppingItem.destroy({
		where: { id: req.params.id, familyId },
	});
	if (!deleted) throw new HttpError(404, "El producto no existe");

	emitToFamily(familyId, "shopping:deleted", { id: req.params.id });
	res.status(204).end();
});
