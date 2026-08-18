export type SessionScopeKind = "personal" | "family";

export interface SessionFamilyOption {
	id: string;
	name: string;
	kind: SessionScopeKind;
}

export function buildFamilyOptions(
	personal: string | { id: string; name: string },
	families: Array<{ id: string; name: string }>,
): SessionFamilyOption[] {
	const personalName =
		typeof personal === "string" ? personal : personal.name;
	return [
		{ id: "personal", name: personalName, kind: "personal" },
		...families.map((family) => ({
			id: family.id,
			name: family.name,
			kind: "family" as const,
		})),
	];
}
