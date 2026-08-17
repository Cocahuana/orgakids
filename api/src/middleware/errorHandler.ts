import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { UniqueConstraintError, ValidationError } from "sequelize";
import { HttpError } from "../utils/HttpError.js";
import { isProduction } from "../config/env.js";

export function notFound(_req: Request, res: Response) {
	res.status(404).json({ error: "Recurso no encontrado" });
}

export function errorHandler(
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
) {
	if (err instanceof ZodError) {
		res.status(400).json({
			error: "Datos inválidos",
			details: err.issues.map((issue) => ({
				field: issue.path.join("."),
				message: issue.message,
			})),
		});
		return;
	}

	if (err instanceof HttpError) {
		res.status(err.status).json({ error: err.message });
		return;
	}

	if (err instanceof UniqueConstraintError) {
		res.status(409).json({ error: "Ese registro ya existe" });
		return;
	}

	if (err instanceof ValidationError) {
		res.status(400).json({
			error: err.errors[0]?.message ?? "Datos inválidos",
		});
		return;
	}

	console.error("Unhandled error:", err);
	res.status(500).json({
		error: isProduction
			? "Error interno del servidor"
			: err instanceof Error
				? err.message
				: "Error interno del servidor",
	});
}
