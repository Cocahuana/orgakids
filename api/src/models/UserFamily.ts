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
import { User } from "./User.js";

export class UserFamily extends Model<
	InferAttributes<UserFamily>,
	InferCreationAttributes<UserFamily>
> {
	declare id: CreationOptional<string>;
	declare userId: ForeignKey<User["id"]>;
	declare familyId: ForeignKey<Family["id"]>;
	declare role: string;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

UserFamily.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		userId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: { model: User, key: "id" },
		},
		familyId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: { model: Family, key: "id" },
		},
		role: {
			type: DataTypes.STRING(40),
			allowNull: false,
			defaultValue: "member",
		},
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
	},
	{
		sequelize,
		tableName: "user_families",
		indexes: [{ fields: ["user_id"] }, { fields: ["family_id"] }],
	},
);
