import assert from "node:assert/strict";
import test from "node:test";
import { buildFamilyOptions } from "./session.js";

test("buildFamilyOptions keeps personal dashboard plus all membership families", () => {
	const personal = { id: "self:123", name: "Ezequiel Farias" };
	const familyA = { id: "fam-1", name: "Familia Arias" };
	const familyB = { id: "fam-2", name: "Familia Caseros" };

	const options = buildFamilyOptions(personal, [familyA, familyB]);
	assert.ok(options[0]);
	assert.ok(options[1]);
	assert.deepEqual(
		options.map((item) => item.name),
		["Ezequiel Farias", "Familia Arias", "Familia Caseros"],
	);
	assert.equal(options[0]?.kind, "personal");
	assert.equal(options[1]?.id, "fam-1");
});
