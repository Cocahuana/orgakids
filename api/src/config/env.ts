import "dotenv/config";

function required(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(
			`Falta la variable de entorno obligatoria: ${name}. Revisá tu .env (ver .env.example).`,
		);
	}
	return value;
}

export const env = {
	nodeEnv: process.env.NODE_ENV ?? "development",
	port: Number(process.env.PORT ?? 4000),
	databaseUrl: required("DATABASE_URL"),
	jwtSecret: required("JWT_SECRET"),
	jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
	dbSyncAlter: process.env.DB_SYNC_ALTER === "true",
	clientOrigins: (process.env.CLIENT_ORIGIN ?? "http://localhost:5173")
		.split(",")
		.map((origin) => origin.trim())
		.filter(Boolean),
};

export const isProduction = env.nodeEnv === "production";
