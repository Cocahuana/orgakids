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

const nodeEnv = process.env.NODE_ENV ?? "development";
export const isProduction = nodeEnv === "production";

const localDbUser =
	process.env.LOCAL_POSTGRES_USER ?? process.env.POSTGRES_USER ?? "postgres";
const localDbPassword =
	process.env.LOCAL_POSTGRES_PASSWORD ??
	process.env.POSTGRES_PASSWORD ??
	"postgres";
const localDbHost =
	process.env.LOCAL_POSTGRES_HOST ?? process.env.POSTGRES_HOST ?? "localhost";
const localDbPort =
	process.env.LOCAL_POSTGRES_PORT ?? process.env.POSTGRES_PORT ?? "5432";
const localDbName =
	process.env.LOCAL_POSTGRES_DB ?? process.env.POSTGRES_DB ?? "orgafamy";

const localDatabaseUrl =
	process.env.LOCAL_DATABASE_URL ??
	`postgresql://${localDbUser}:${localDbPassword}@${localDbHost}:${localDbPort}/${localDbName}`;

export const env = {
	nodeEnv,
	port: Number(process.env.PORT ?? 4000),
	databaseUrl: isProduction ? required("DATABASE_URL") : localDatabaseUrl,
	jwtSecret: required("JWT_SECRET"),
	jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
	dbSyncAlter: process.env.DB_SYNC_ALTER === "true",
	// El navegador envía el Origin sin barra final; la recortamos para que matchee.
	clientOrigins: (process.env.CLIENT_ORIGIN ?? "http://localhost:5173")
		.split(",")
		.map((origin) => origin.trim().replace(/\/+$/, ""))
		.filter(Boolean),
};
