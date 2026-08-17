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

export class ShoppingItem extends Model<
	InferAttributes<ShoppingItem>,
	InferCreationAttributes<ShoppingItem>
> {
	declare id: CreationOptional<string>;
	declare familyId: ForeignKey<Family["id"]>;
	declare name: string;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

ShoppingItem.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		familyId: { type: DataTypes.UUID, allowNull: false },
		name: { type: DataTypes.STRING(160), allowNull: false },
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
	},
	{
		sequelize,
		tableName: "shopping_items",
		indexes: [{ fields: ["family_id"] }],
	},
);

export function toShoppingDTO(item: ShoppingItem) {
	return { id: item.id, name: item.name };
}
