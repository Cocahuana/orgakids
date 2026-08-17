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

export const ENTRY_TYPES = [
	"exam",
	"sport",
	"event",
	"recover",
	"work",
	"medical",
] as const;

export type EntryType = (typeof ENTRY_TYPES)[number];

export class Entry extends Model<
	InferAttributes<Entry>,
	InferCreationAttributes<Entry>
> {
	declare id: CreationOptional<string>;
	declare familyId: ForeignKey<Family["id"]>;
	declare type: EntryType;
	declare kid: string;
	declare title: string;
	declare date: string | null;
	declare dateTo: string | null;
	declare timeFrom: string | null;
	declare timeTo: string | null;
	declare medicalTime: string | null;
	declare grade: string;
	declare notes: string;
	declare repeatEnabled: boolean;
	declare repeatFrom: string | null;
	declare repeatTo: string | null;
	declare repeatDays: number[];
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

Entry.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		familyId: { type: DataTypes.UUID, allowNull: false },
		type: { type: DataTypes.ENUM(...ENTRY_TYPES), allowNull: false },
		kid: {
			type: DataTypes.STRING(120),
			allowNull: false,
			defaultValue: "",
		},
		title: { type: DataTypes.STRING(200), allowNull: false },
		date: { type: DataTypes.DATEONLY, allowNull: true },
		dateTo: { type: DataTypes.DATEONLY, allowNull: true },
		timeFrom: { type: DataTypes.STRING(5), allowNull: true },
		timeTo: { type: DataTypes.STRING(5), allowNull: true },
		medicalTime: { type: DataTypes.STRING(5), allowNull: true },
		grade: {
			type: DataTypes.STRING(60),
			allowNull: false,
			defaultValue: "",
		},
		notes: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
		repeatEnabled: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		repeatFrom: { type: DataTypes.DATEONLY, allowNull: true },
		repeatTo: { type: DataTypes.DATEONLY, allowNull: true },
		repeatDays: {
			type: DataTypes.ARRAY(DataTypes.INTEGER),
			allowNull: false,
			defaultValue: [],
		},
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
	},
	{
		sequelize,
		tableName: "entries",
		indexes: [{ fields: ["family_id"] }, { fields: ["family_id", "date"] }],
	},
);

/** Shapes an Entry row into the exact contract the client expects (nulls become ""). */
export function toEntryDTO(entry: Entry) {
	return {
		id: entry.id,
		type: entry.type,
		kid: entry.kid,
		title: entry.title,
		date: entry.date ?? "",
		dateTo: entry.dateTo ?? "",
		timeFrom: entry.timeFrom ?? "",
		timeTo: entry.timeTo ?? "",
		medicalTime: entry.medicalTime ?? "",
		grade: entry.grade,
		notes: entry.notes,
		repeatEnabled: entry.repeatEnabled,
		repeatFrom: entry.repeatFrom ?? "",
		repeatTo: entry.repeatTo ?? "",
		repeatDays: entry.repeatDays,
	};
}
