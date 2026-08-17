import { Sequelize } from "sequelize";
import { env, isProduction } from "./env.js";

export const sequelize = new Sequelize(env.databaseUrl, {
	dialect: "postgres",
	logging: false,
	// Railway's public Postgres endpoint requires SSL but serves a self-signed cert.
	dialectOptions: isProduction
		? { ssl: { require: true, rejectUnauthorized: false } }
		: {},
	pool: { max: 10, min: 0, idle: 10_000, acquire: 30_000 },
	define: { underscored: true },
});
