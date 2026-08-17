import {
	DataTypes,
	Model,
	type CreationOptional,
	type ForeignKey,
	type InferAttributes,
	type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../config/database.js";
import { Family } from "./Family.js";

export class User extends Model<
	InferAttributes<User>,
	InferCreationAttributes<User>
> {
	declare id: CreationOptional<string>;
	declare familyId: ForeignKey<Family["id"]>;
	declare name: string;
	declare email: string;
	declare passwordHash: string;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

User.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		familyId: { type: DataTypes.UUID, allowNull: false },
		name: { type: DataTypes.STRING(120), allowNull: false },
		email: {
			type: DataTypes.STRING(160),
			allowNull: false,
			unique: true,
			validate: { isEmail: true },
		},
		passwordHash: { type: DataTypes.STRING, allowNull: false },
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
	},
	{ sequelize, tableName: "users" },
);
