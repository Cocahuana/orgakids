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

export class Nota extends Model<
	InferAttributes<Nota>,
	InferCreationAttributes<Nota>
> {
	declare id: CreationOptional<string>;
	declare familyId: ForeignKey<Family["id"]>;
	declare title: string;
	declare body: string;
	declare created: string;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

Nota.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		familyId: { type: DataTypes.UUID, allowNull: false },
		title: {
			type: DataTypes.STRING(120),
			allowNull: false,
			defaultValue: "",
		},
		body: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
		created: { type: DataTypes.DATEONLY, allowNull: false },
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
	},
	{ sequelize, tableName: "notas", indexes: [{ fields: ["family_id"] }] },
);

export function toNotaDTO(nota: Nota) {
	return {
		id: nota.id,
		title: nota.title,
		body: nota.body,
		created: nota.created,
	};
}
