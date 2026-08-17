import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.js";

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Express {
		interface Request {
			auth?: { userId: string; familyId: string };
		}
	}
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
	const header = req.headers.authorization;

	if (!header?.startsWith("Bearer ")) {
		res.status(401).json({ error: "No autorizado" });
		return;
	}

	try {
		req.auth = verifyToken(header.slice("Bearer ".length));
		next();
	} catch {
		res.status(401).json({ error: "Sesión expirada o token inválido" });
	}
}

/** Narrows `req.auth` for handlers mounted behind `requireAuth`. */
export function getAuth(req: Request): { userId: string; familyId: string } {
	if (!req.auth)
		throw new Error("getAuth() usado fuera de una ruta protegida");
	return req.auth;
}
