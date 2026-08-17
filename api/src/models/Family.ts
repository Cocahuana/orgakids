import {
	DataTypes,
	Model,
	type CreationOptional,
	type InferAttributes,
	type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../config/database.js";

export class Family extends Model<
	InferAttributes<Family>,
	InferCreationAttributes<Family>
> {
	declare id: CreationOptional<string>;
	declare name: string;
	declare inviteCode: string;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

Family.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		name: { type: DataTypes.STRING(120), allowNull: false },
		inviteCode: {
			type: DataTypes.STRING(12),
			allowNull: false,
			unique: true,
		},
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
	},
	{ sequelize, tableName: "families" },
);
