import type { Server as HttpServer } from "node:http";
import { Server as SocketServer } from "socket.io";
import { env } from "../config/env.js";
import { verifyToken } from "../utils/jwt.js";

let io: SocketServer | null = null;

const familyRoom = (familyId: string) => `family:${familyId}`;

export function initRealtime(httpServer: HttpServer): SocketServer {
	io = new SocketServer(httpServer, {
		cors: { origin: env.clientOrigins, credentials: true },
	});

	io.use((socket, next) => {
		const token = socket.handshake.auth?.token;
		if (typeof token !== "string") {
			next(new Error("No autorizado"));
			return;
		}
		try {
			socket.data.auth = verifyToken(token);
			next();
		} catch {
			next(new Error("Token inválido"));
		}
	});

	io.on("connection", (socket) => {
		const { familyId } = socket.data.auth as { familyId: string };
		socket.join(familyRoom(familyId));
	});

	return io;
}

/**
 * Broadcasts a change to every device of a family, including the one that made
 * the request — clients apply events idempotently by id.
 */
export function emitToFamily(
	familyId: string,
	event: string,
	payload: unknown,
): void {
	io?.to(familyRoom(familyId)).emit(event, payload);
}
