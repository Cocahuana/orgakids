import { sequelize } from "../config/database.js";
import { Family } from "./Family.js";
import { User } from "./User.js";
import { UserFamily } from "./UserFamily.js";
import { Entry } from "./Entry.js";
import { ShoppingItem } from "./ShoppingItem.js";
import { Nota } from "./Nota.js";

const cascade = { foreignKey: "familyId", onDelete: "CASCADE" } as const;

Family.hasMany(User, cascade);
User.belongsTo(Family, { foreignKey: "familyId" });

User.hasMany(UserFamily, { foreignKey: "userId", onDelete: "CASCADE" });
UserFamily.belongsTo(User, { foreignKey: "userId" });
Family.hasMany(UserFamily, { foreignKey: "familyId", onDelete: "CASCADE" });
UserFamily.belongsTo(Family, { foreignKey: "familyId" });

Family.hasMany(Entry, cascade);
Entry.belongsTo(Family, { foreignKey: "familyId" });

Family.hasMany(ShoppingItem, cascade);
ShoppingItem.belongsTo(Family, { foreignKey: "familyId" });

Family.hasMany(Nota, cascade);
Nota.belongsTo(Family, { foreignKey: "familyId" });

export { sequelize, Family, User, UserFamily, Entry, ShoppingItem, Nota };
export { toEntryDTO, ENTRY_TYPES, type EntryType } from "./Entry.js";
export { toShoppingDTO } from "./ShoppingItem.js";
export { toNotaDTO } from "./Nota.js";
