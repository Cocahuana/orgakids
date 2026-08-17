import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

export interface TokenPayload {
	userId: string;
	familyId: string;
}

export function signToken(payload: TokenPayload): string {
	return jwt.sign(payload, env.jwtSecret, {
		expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
	});
}

export function verifyToken(token: string): TokenPayload {
	const decoded = jwt.verify(token, env.jwtSecret);
	if (
		typeof decoded !== "object" ||
		decoded === null ||
		typeof decoded.userId !== "string" ||
		typeof decoded.familyId !== "string"
	) {
		throw new Error("Token payload inválido");
	}
	return { userId: decoded.userId, familyId: decoded.familyId };
}
