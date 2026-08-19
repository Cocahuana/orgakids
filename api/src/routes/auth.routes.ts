import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Family, User, UserFamily } from "../models/index.js";
import { signToken } from "../utils/jwt.js";
import { generateInviteCode } from "../utils/inviteCode.js";
import { HttpError } from "../utils/HttpError.js";
import { getAuth, requireAuth } from "../middleware/auth.js";

export const authRouter = Router();

const registerSchema = z.object({
	name: z.string().trim().min(1, "El nombre es obligatorio").max(120),
	email: z.string().trim().toLowerCase().email("Email inválido").max(160),
	password: z
		.string()
		.min(8, "La contraseña debe tener al menos 8 caracteres"),
	familyName: z.string().trim().max(120).optional(),
	inviteCode: z.string().trim().toUpperCase().max(12).optional(),
});

const loginSchema = z.object({
	email: z.string().trim().toLowerCase().email("Email inválido"),
	password: z.string().min(1, "Ingresá tu contraseña"),
});

const joinFamilySchema = z.object({
	inviteCode: z
		.string()
		.trim()
		.toUpperCase()
		.min(1, "Ingresá el código de invitación")
		.max(12),
});

const publicUser = (user: User) => ({
	id: user.id,
	name: user.name,
	email: user.email,
});

const publicFamily = (family: Family) => ({
	id: family.id,
	name: family.name,
	inviteCode: family.inviteCode,
});

async function listUserFamilies(userId: string) {
	const memberships = await UserFamily.findAll({
		where: { userId },
		attributes: ["familyId", "createdAt"],
		order: [["createdAt", "ASC"]],
	});

	if (!memberships.length) return [];

	const families = await Family.findAll({
		where: { id: memberships.map((membership) => membership.familyId) },
	});

	const byId = new Map(families.map((family) => [family.id, family]));
	return memberships
		.map((membership) => byId.get(membership.familyId))
		.filter((family): family is Family => Boolean(family));
}

async function ensureFamilyMembership(userId: string, familyId: string) {
	const exists = await UserFamily.findOne({ where: { userId, familyId } });
	if (!exists) {
		await UserFamily.create({ userId, familyId, role: "member" });
	}
}

authRouter.post("/register", async (req, res) => {
	const { name, email, password, familyName, inviteCode } =
		registerSchema.parse(req.body);

	if (await User.findOne({ where: { email } })) {
		throw new HttpError(409, "Ya existe una cuenta con ese email");
	}

	let family: Family;
	if (inviteCode) {
		const found = await Family.findOne({ where: { inviteCode } });
		if (!found)
			throw new HttpError(404, "El código de invitación no existe");
		family = found;
	} else {
		family = await Family.create({
			name: familyName || `Familia de ${name}`,
			inviteCode: await generateInviteCode(),
		});
	}

	const user = await User.create({
		familyId: family.id,
		name,
		email,
		passwordHash: await bcrypt.hash(password, 12),
	});

	await ensureFamilyMembership(user.id, family.id);
	await UserFamily.update(
		{ role: "owner" },
		{ where: { userId: user.id, familyId: family.id } },
	);

	const userFamilies = await listUserFamilies(user.id);

	res.status(201).json({
		token: signToken({ userId: user.id, familyId: family.id }),
		user: publicUser(user),
		family: publicFamily(family),
		families: userFamilies.map(publicFamily),
	});
});

authRouter.post("/login", async (req, res) => {
	const { email, password } = loginSchema.parse(req.body);

	const user = await User.findOne({ where: { email } });
	// Compare against a dummy hash when the user is missing so the response time
	// does not reveal whether the email is registered.
	const passwordOk = await bcrypt.compare(
		password,
		user?.passwordHash ??
			"$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinv",
	);

	if (!user || !passwordOk) {
		throw new HttpError(401, "Email o contraseña incorrectos");
	}

	const family = await Family.findByPk(user.familyId);
	if (!family) throw new HttpError(500, "La familia del usuario no existe");

	const userFamilies = await listUserFamilies(user.id);

	res.json({
		token: signToken({ userId: user.id, familyId: family.id }),
		user: publicUser(user),
		family: publicFamily(family),
		families: userFamilies.map(publicFamily),
	});
});

authRouter.get("/me", requireAuth, async (req, res) => {
	const { userId } = getAuth(req);

	const user = await User.findByPk(userId);
	if (!user) throw new HttpError(401, "La cuenta ya no existe");

	const family = await Family.findByPk(user.familyId);
	if (!family) throw new HttpError(500, "La familia del usuario no existe");

	await ensureFamilyMembership(user.id, family.id);
	const userFamilies = await listUserFamilies(user.id);

	res.json({
		user: publicUser(user),
		family: publicFamily(family),
		families: userFamilies.map(publicFamily),
	});
});

authRouter.post("/join-family", requireAuth, async (req, res) => {
	const { userId } = getAuth(req);
	const { inviteCode } = joinFamilySchema.parse(req.body);

	const family = await Family.findOne({ where: { inviteCode } });
	if (!family) throw new HttpError(404, "El código de invitación no existe");

	const alreadyMember = await UserFamily.findOne({
		where: { userId, familyId: family.id },
	});
	if (alreadyMember)
		throw new HttpError(409, "Ya formás parte de esta familia");

	await ensureFamilyMembership(userId, family.id);
	const userFamilies = await listUserFamilies(userId);

	res.status(201).json({
		family: publicFamily(family),
		families: userFamilies.map(publicFamily),
	});
});
