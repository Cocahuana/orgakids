import { randomInt } from "node:crypto";
import { Family } from "../models/index.js";

// Excludes look-alike characters (0/O, 1/I) so codes are easy to read aloud.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomCode(length = 8): string {
	let code = "";
	for (let i = 0; i < length; i++) {
		code += ALPHABET[randomInt(ALPHABET.length)];
	}
	return code;
}

export async function generateInviteCode(): Promise<string> {
	for (let attempt = 0; attempt < 10; attempt++) {
		const code = randomCode();
		const existing = await Family.findOne({ where: { inviteCode: code } });
		if (!existing) return code;
	}
	throw new Error("No se pudo generar un código de invitación único");
}
