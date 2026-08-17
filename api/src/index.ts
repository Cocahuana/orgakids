import { createServer } from "node:http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { sequelize } from "./models/index.js";
import { initRealtime } from "./realtime/io.js";

async function main() {
	await sequelize.authenticate();
	await sequelize.sync(env.dbSyncAlter ? { alter: true } : undefined);
	console.log("✅ Base de datos conectada y sincronizada");

	const httpServer = createServer(createApp());
	initRealtime(httpServer);

	httpServer.listen(env.port, () => {
		console.log(`🚀 API escuchando en el puerto ${env.port}`);
	});

	for (const signal of ["SIGINT", "SIGTERM"] as const) {
		process.on(signal, () => {
			httpServer.close(() => {
				void sequelize.close().then(() => process.exit(0));
			});
		});
	}
}

main().catch((error) => {
	console.error("❌ No se pudo iniciar la API:", error);
	process.exit(1);
});
