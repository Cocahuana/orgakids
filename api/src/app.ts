import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { requireAuth } from "./middleware/auth.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { authRouter } from "./routes/auth.routes.js";
import { entriesRouter } from "./routes/entries.routes.js";
import { shoppingRouter } from "./routes/shopping.routes.js";
import { notasRouter } from "./routes/notas.routes.js";

export function createApp() {
	const app = express();

	app.set("trust proxy", 1);
	app.use(cors({ origin: env.clientOrigins, credentials: true }));
	app.use(express.json({ limit: "1mb" }));

	app.get("/health", (_req, res) => {
		res.json({ status: "ok", uptime: process.uptime() });
	});

	app.use("/api/auth", authRouter);
	app.use("/api/entries", requireAuth, entriesRouter);
	app.use("/api/shopping", requireAuth, shoppingRouter);
	app.use("/api/notas", requireAuth, notasRouter);

	app.use(notFound);
	app.use(errorHandler);

	return app;
}
